/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderObservationRepository } from '../../../../domain/contracts/work-order-observation.interface.repository';
import { WorkOrderObservationResponse } from '../../../../domain/schemas/dto/response/work-order-observation.response';
import { WorkOrderObservationModel } from '../../../../domain/schemas/models/work-order-observation.model';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkOrderObservationAdapter } from '../adapters/work-order-observation.adapter';
import { WorkOrderObservationSQLResponse } from '../../../interfaces/sql/work-order-observation.sql.response';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PostgreSqlWorkOrderObservationPersistence implements InterfaceWorkOrderObservationRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async create(
    workOrderObservation: WorkOrderObservationModel,
  ): Promise<WorkOrderObservationResponse | null> {
    try {
      await this.ensureWorkOrderExists(workOrderObservation.getWorkOrderId());
      await this.ensureWorkerExists(workOrderObservation.getWorkerId());

      const insertObservationQuery: string = `
        INSERT INTO work_orders.observaciones_orden_trabajo (id_orden_trabajo, texto, created_by)
        VALUES ($1, $2, $3)
        RETURNING
          id_observacion AS observation_id,
          id_orden_trabajo AS work_order_id,
          texto AS description,
          created_by AS worker_id,
          created_at;
      `;
      const insertObservationParams = [
        workOrderObservation.getWorkOrderId(),
        workOrderObservation.getDescription(),
        workOrderObservation.getWorkerId(),
      ];
      const result =
        await this.databaseService.query<WorkOrderObservationSQLResponse>(
          insertObservationQuery,
          insertObservationParams,
        );

      if (result.length > 0) {
        const createdWorkOrderObservation: WorkOrderObservationResponse =
          WorkOrderObservationAdapter.toResponse(result[0]);

        return createdWorkOrderObservation;
      } else {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create work order observation.',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async update(
    workOrderObservationId: string,
    workOrderObservation: Partial<WorkOrderObservationModel>,
  ): Promise<WorkOrderObservationResponse | null> {
    try {
      const nextWorkOrderId = workOrderObservation.getWorkOrderId?.();
      const nextWorkerId = workOrderObservation.getWorkerId?.();

      if (nextWorkOrderId !== undefined) {
        await this.ensureWorkOrderExists(nextWorkOrderId);
      }

      if (nextWorkerId !== undefined) {
        await this.ensureWorkerExists(nextWorkerId);
      }

      const query: string = `
      UPDATE work_orders.observaciones_orden_trabajo
      SET created_by = COALESCE($1, created_by),
          id_orden_trabajo = COALESCE($2, id_orden_trabajo),
          texto = COALESCE($3, texto),
          updated_at = NOW()
      WHERE id_observacion = $4
        AND is_deleted = FALSE
      RETURNING
        id_observacion AS observation_id,
        id_orden_trabajo AS work_order_id,
        texto AS description,
        created_by AS worker_id,
        created_at;
      `;

      const params = [
        workOrderObservation.getWorkerId?.() ?? null,
        workOrderObservation.getWorkOrderId?.() ?? null,
        workOrderObservation.getDescription?.() ?? null,
        workOrderObservationId,
      ];

      const result =
        await this.databaseService.query<WorkOrderObservationSQLResponse>(
          query,
          params,
        );

      if (result.length > 0) {
        const updatedWorkOrderObservation: WorkOrderObservationResponse =
          WorkOrderObservationAdapter.toResponse(result[0]);

        return updatedWorkOrderObservation;
      } else {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Work order observation with ID ${workOrderObservationId} not found.`,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderObservationResponse[]> {
    try {
      const query: string = `
      SELECT
        id_observacion AS observation_id,
        id_orden_trabajo AS work_order_id,
        texto AS description,
        created_by AS worker_id,
        created_at
      FROM work_orders.observaciones_orden_trabajo
      WHERE id_orden_trabajo = $1
        AND is_deleted = FALSE
      ORDER BY created_at DESC;
      `;

      const params = [workOrderId];

      const result =
        await this.databaseService.query<WorkOrderObservationSQLResponse>(
          query,
          params,
        );

      return result.map((record) =>
        WorkOrderObservationAdapter.toResponse(record),
      );
    } catch (error) {
      throw error;
    }
  }

  async getById(
    workOrderObservationId: string,
  ): Promise<WorkOrderObservationResponse | null> {
    try {
      const query: string = `
      SELECT
        id_observacion AS observation_id,
        id_orden_trabajo AS work_order_id,
        texto AS description,
        created_by AS worker_id,
        created_at
      FROM work_orders.observaciones_orden_trabajo
      WHERE id_observacion = $1
        AND is_deleted = FALSE;
      `;

      const params = [workOrderObservationId];

      const result =
        await this.databaseService.query<WorkOrderObservationSQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        return null;
      }

      const workOrderObservation: WorkOrderObservationResponse =
        WorkOrderObservationAdapter.toResponse(result[0]);

      return workOrderObservation;
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<WorkOrderObservationResponse[]> {
    try {
      const query: string = `
      SELECT
        id_observacion AS observation_id,
        id_orden_trabajo AS work_order_id,
        texto AS description,
        created_by AS worker_id,
        created_at
      FROM work_orders.observaciones_orden_trabajo
      WHERE is_deleted = FALSE
      ORDER BY created_at DESC;
      `;

      const result =
        await this.databaseService.query<WorkOrderObservationSQLResponse>(
          query,
          [],
        );

      return result.map((record) =>
        WorkOrderObservationAdapter.toResponse(record),
      );
    } catch (error) {
      throw error;
    }
  }

  private async ensureWorkOrderExists(workOrderId: string): Promise<void> {
    const verifyWorkOrderQuery = `
      SELECT 1
      FROM work_orders.orden_trabajo
      WHERE id_orden_trabajo = $1
        AND is_deleted = FALSE;
    `;

    const workOrderExists = await this.databaseService.query<{
      exists: number;
    }>(verifyWorkOrderQuery, [workOrderId]);

    if (workOrderExists.length === 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: `Work order with ID ${workOrderId} does not exist.`,
      });
    }
  }

  private async ensureWorkerExists(workerId: string): Promise<void> {
    const verifyWorkerQuery = `
      SELECT 1
      FROM public.usuarios
      WHERE usuario_id = $1;
    `;

    const workerExists = await this.databaseService.query<{ exists: number }>(
      verifyWorkerQuery,
      [workerId],
    );

    if (workerExists.length === 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: `Worker with ID ${workerId} does not exist.`,
      });
    }
  }
}
