import { Injectable } from '@nestjs/common';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { InterfaceWorkOrderHistoryRepository } from '../../../../domain/contracts/work-order-history.interface.repository';
import { WorkOrderHistoryResponse } from '../../../../domain/schemas/dto/response/work-order-history.response';
import { WorkOrderHistoryModel } from '../../../../domain/schemas/models/work-order-history.model';
import { WorkOrderHistorySQLResponse } from '../../../interfaces/sql/work-order-history.sql.response';
import { WorkOrderHistoryAdapter } from '../adapters/postgresql.work-order-history.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';

@Injectable()
export class PostgresqlWorkOrderHistoryPersistence
  implements InterfaceWorkOrderHistoryRepository {
  constructor(private readonly postgreSqlService: DatabaseServicePostgreSQL) { }

  async create(
    workOrderHistory: WorkOrderHistoryModel,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      const query: string = `
      INSERT INTO historialordentrabajo
      (
        ordenTrabajoId,
        fechaCambio,
        estadoAnteriorId,
        estadoNuevoId,
        usuarioId,
        descripcionCambio
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING historialId AS "workOrderHistoryId",
                ordenTrabajoId AS "workOrderId",
                fechaCambio AS "changeDate",
                estadoAnteriorId AS "previousStatusId",
                estadoNuevoId AS "newStatusId",
                usuarioId AS "userId",
                descripcionCambio AS "changeDescription";
      `;

      const params = [
        workOrderHistory.workOrderId,
        workOrderHistory.changeDate,
        workOrderHistory.previousStatusId,
        workOrderHistory.newStatusId,
        workOrderHistory.userId,
        workOrderHistory.changeDescription,
      ];

      const result =
        await this.postgreSqlService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order history not created.',
        });
      }

      const response =
        WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
          result[0],
        );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async update(
    workOrderHistoryId: number,
    workOrderHistory: Partial<WorkOrderHistoryModel>,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      const query: string = `
      UPDATE historialordentrabajo
      SET
        ordenTrabajoId = COALESCE($1, ordenTrabajoId),
        fechaCambio = COALESCE($2, fechaCambio),
        estadoAnteriorId = COALESCE($3, estadoAnteriorId),
        estadoNuevoId = COALESCE($4, estadoNuevoId),
        usuarioId = COALESCE($5, usuarioId),
        descripcionCambio = COALESCE($6, descripcionCambio)
      WHERE historialId = $7
      RETURNING historialId AS "workOrderHistoryId",
                ordenTrabajoId AS "workOrderId",
                fechaCambio AS "changeDate",
                estadoAnteriorId AS "previousStatusId",
                estadoNuevoId AS "newStatusId",
                usuarioId AS "userId",
                descripcionCambio AS "changeDescription";
      `;

      const params = [
        workOrderHistory.workOrderId,
        workOrderHistory.changeDate,
        workOrderHistory.previousStatusId,
        workOrderHistory.newStatusId,
        workOrderHistory.userId,
        workOrderHistory.changeDescription,
        workOrderHistoryId,
      ];

      const result =
        await this.postgreSqlService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order history not updated.',
        });
      }

      const response =
        WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
          result[0],
        );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async findById(
    workOrderHistoryId: number,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      const query: string = `
      SELECT
        historialId AS "workOrderHistoryId",
        ordenTrabajoId AS "workOrderId",
        fechaCambio AS "changeDate",
        estadoAnteriorId AS "previousStatusId",
        estadoNuevoId AS "newStatusId",
        usuarioId AS "userId",
        descripcionCambio AS "changeDescription"
      FROM historialordentrabajo
      WHERE historialId = $1;
      `;

      const params = [workOrderHistoryId];

      const result =
        await this.postgreSqlService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        return null;
      }

      const response =
        WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
          result[0],
        );

      return response;
    } catch (error) {
      throw error;
    }
  }

  async findByWorkOrderId(
    workOrderId: number,
  ): Promise<WorkOrderHistoryResponse[] | null> {
    try {
      const query: string = `
      SELECT
        historialId AS "workOrderHistoryId",
        ordenTrabajoId AS "workOrderId",
        fechaCambio AS "changeDate",
        estadoAnteriorId AS "previousStatusId",
        estadoNuevoId AS "newStatusId",
        usuarioId AS "userId",
        descripcionCambio AS "changeDescription"
      FROM historialordentrabajo
      WHERE ordenTrabajoId = $1;
      `;

      const params = [workOrderId];

      const result =
        await this.postgreSqlService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        return null;
      }

      const responses = result.map(
        WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse,
      );

      return responses;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<WorkOrderHistoryResponse[] | null> {
    try {
      const query: string = `
      SELECT
        historialId AS "workOrderHistoryId",
        ordenTrabajoId AS "workOrderId",
        fechaCambio AS "changeDate",
        estadoAnteriorId AS "previousStatusId",
        estadoNuevoId AS "newStatusId",
        usuarioId AS "userId",
        descripcionCambio AS "changeDescription"
      FROM historialordentrabajo;
      `;

      const result =
        await this.postgreSqlService.query<WorkOrderHistorySQLResponse>(query);

      if (result.length === 0) {
        return null;
      }

      const responses = result.map(
        WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse,
      );

      return responses;
    } catch (error) {
      throw error;
    }
  }
}
