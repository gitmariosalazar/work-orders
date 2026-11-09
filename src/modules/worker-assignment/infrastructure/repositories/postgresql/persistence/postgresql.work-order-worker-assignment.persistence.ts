import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderWorkerAssignmentRepository } from '../../../../domain/contracts/work_order_worker_assignment.interface.repository';
import { WorkOrderWorkerAssignmentResponse } from '../../../../domain/schemas/dto/response/work-order-worker-assignment.response';
import { WorkOrderWorkerAssignmentModel } from '../../../../domain/schemas/models/work-order-worker-assignment.model';
import { WorkOrderWorkerAssignmentSqlResponse } from '../../../interfaces/sql/work-order-worker-assignment.sql.response';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkOrderWorkerAssignmentAdapter } from '../adapters/postgresql.work-order-worker-assignment.adapters';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  WorkOrderUserPolicy,
  UserParams,
} from '../../../../../../shared/policies/work-order-user.policy';

@Injectable()
export class PostgresqlWorkOrderWorkerAssignmentPersistence implements InterfaceWorkOrderWorkerAssignmentRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async addWorkerAssignmentToWorkOrderList(
    workerAssignmentList: WorkOrderWorkerAssignmentModel[],
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null> {
    try {
      const query = `
        INSERT INTO work_orders.asignacion_orden_trabajo_trabajador (
          id_orden_trabajo,
          id_trabajador,
          id_rol
        )
        VALUES ($1, $2, $3)
        RETURNING
          id_asignacion AS assignment_id,
          id_orden_trabajo AS work_order_id,
          id_trabajador AS worker_id,
          id_rol AS rol_id,
          fecha_asignacion AS assigned_date;
      `;

      const results = await this.databaseService.transaction<
        WorkOrderWorkerAssignmentSqlResponse[]
      >(async (client) => {
        const insertedRows: WorkOrderWorkerAssignmentSqlResponse[] = [];

        for (const assignment of workerAssignmentList) {
          const values = [
            assignment.getWorkOrderId(),
            assignment.getWorkerId(),
            assignment.getRolId(),
          ];

          const res = await client.query<WorkOrderWorkerAssignmentSqlResponse>(
            query,
            values,
          );

          if (res.length === 0) {
            throw new RpcException({
              statusCode: statusCode.INTERNAL_SERVER_ERROR,
              message: `Worker assignment could not be created for work order ${assignment.getWorkOrderId()} and worker ${assignment.getWorkerId()}.`,
            });
          }

          insertedRows.push(res[0]);
        }

        return insertedRows;
      });

      if (results.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'No worker assignments were added',
        });
      }

      return WorkOrderWorkerAssignmentAdapter.fromWorkOrderWorkerAssignmentSqlResponseListToWorkOrderWorkerAssignmentResponseList(
        results,
      );
    } catch (error) {
      throw error;
    }
  }

  async findWorkerAssignmentByWorkerId(
    workerId: number | string,
    user?: UserParams,
  ): Promise<WorkOrderWorkerAssignmentResponse | null> {
    try {
      const filterUserId = WorkOrderUserPolicy.resolveScopeUserId(user);
      const query = `
        SELECT
          ato.id_asignacion AS assignment_id,
          ato.id_orden_trabajo AS work_order_id,
          ato.id_trabajador AS worker_id,
          COALESCE(ato.id_rol, 0) AS rol_id,
          ato.fecha_asignacion AS assigned_date
        FROM work_orders.asignacion_trabajador_orden ato
        WHERE ato.id_trabajador::text = $1::text
          AND ato.is_deleted = FALSE
          AND (
            $2::text IS NULL
            OR ato.id_trabajador::text = $2::text
          )
        ORDER BY ato.fecha_asignacion DESC, ato.id_asignacion DESC
        LIMIT 1;
      `;
      const values = [String(workerId).trim(), filterUserId];

      const result: WorkOrderWorkerAssignmentSqlResponse[] =
        await this.databaseService.query<WorkOrderWorkerAssignmentSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        return null;
      }

      return WorkOrderWorkerAssignmentAdapter.fromWorkOrderWorkerAssignmentSqlResponseToWorkOrderWorkerAssignmentResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async findWorkerAssignmentsByWorkOrderId(
    workOrderId: string,
    user?: UserParams,
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null> {
    try {
      const filterUserId = WorkOrderUserPolicy.resolveScopeUserId(user);
      const query = `
        SELECT
          ato.id_asignacion AS assignment_id,
          ato.id_orden_trabajo AS work_order_id,
          ato.id_trabajador AS worker_id,
          COALESCE(ato.id_rol, 0) AS rol_id,
          ato.fecha_asignacion AS assigned_date
        FROM work_orders.asignacion_trabajador_orden ato
        JOIN work_orders.orden_trabajo ot ON ot.id_orden_trabajo = ato.id_orden_trabajo
        WHERE ato.id_orden_trabajo::text = $1::text
          AND ato.is_deleted = FALSE
          AND ot.is_deleted = FALSE
          AND (
            $2::text IS NULL
            OR ot.usuario_asignado::text = $2::text
            OR EXISTS (
              SELECT 1 FROM work_orders.asignacion_trabajador_orden sub_ato
              WHERE sub_ato.id_orden_trabajo = ot.id_orden_trabajo
                AND sub_ato.id_trabajador::text = $2::text
                AND sub_ato.is_deleted = FALSE
            )
          )
        ORDER BY ato.fecha_asignacion DESC, ato.id_asignacion DESC;
      `;
      const values = [workOrderId.trim(), filterUserId];

      const results: WorkOrderWorkerAssignmentSqlResponse[] =
        await this.databaseService.query<WorkOrderWorkerAssignmentSqlResponse>(
          query,
          values,
        );

      if (results.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No worker assignments found for the given work order ID',
        });
      }

      return WorkOrderWorkerAssignmentAdapter.fromWorkOrderWorkerAssignmentSqlResponseListToWorkOrderWorkerAssignmentResponseList(
        results,
      );
    } catch (error) {
      throw error;
    }
  }
}
