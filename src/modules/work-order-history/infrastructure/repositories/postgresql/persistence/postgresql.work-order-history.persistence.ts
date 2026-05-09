/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderHistoryRepository } from '../../../../domain/contracts/work-order-history.interface.repository';
import { WorkOrderHistoryResponse } from '../../../../domain/schemas/dto/response/work-order-history.response';
import { WorkOrderHistoryModel } from '../../../../domain/schemas/models/work-order-history.model';
import {
  ViewWorkOrderHistorySqlResponse,
  WorkOrderHistorySQLResponse,
} from '../../../interfaces/sql/work-order-history.sql.response';
import { WorkOrderHistoryAdapter } from '../adapters/postgresql.work-order-history.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { ViewWorkOrderHistoryResponse } from '../../../../domain/schemas/dto/response/view-work-order-history.response';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PostgresqlWorkOrderHistoryPersistence
  implements InterfaceWorkOrderHistoryRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async create(
    workOrderHistory: WorkOrderHistoryModel,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      const query: string = `
        INSERT INTO work_orders.historial_estado_orden_trabajo
          (id_orden_trabajo, id_estado, id_usuario, descripcion_cambio, clave_catastral, codigo_orden)
          VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_historial AS work_order_history_id, id_orden_trabajo AS work_order_id, id_estado AS status_id,
          fecha_cambio AS change_date, id_usuario AS user_id,
          descripcion_cambio AS change_description, clave_catastral AS cadastral_key,
          codigo_orden AS order_code;
      `;

      const params = [
        workOrderHistory.workOrderId,
        workOrderHistory.statusId,
        workOrderHistory.userId,
        workOrderHistory.changeDescription,
        workOrderHistory.cadastralKey,
        workOrderHistory.orderCode,
      ];

      const result =
        await this.databaseService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order history not created.',
        });
      }

      return WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
        result[0],
      );
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
      UPDATE work_orders.historial_estado_orden_trabajo
      SET
        id_estado = COALESCE($1, id_estado),
        id_usuario = COALESCE($2, id_usuario),
        descripcion_cambio = COALESCE($3, descripcion_cambio),
        clave_catastral = COALESCE($4, clave_catastral),
        codigo_orden = COALESCE($5, codigo_orden)
      WHERE id_historial = $6
      RETURNING id_historial AS work_order_history_id, id_orden_trabajo AS work_order_id, id_estado AS status_id,
        fecha_cambio AS change_date, id_usuario AS user_id,
        descripcion_cambio AS change_description, clave_catastral AS cadastral_key,
        codigo_orden AS order_code;
      `;

      const params = [
        workOrderHistory.statusId,
        workOrderHistory.userId,
        workOrderHistory.changeDescription,
        workOrderHistory.cadastralKey,
        workOrderHistory.orderCode,
        workOrderHistoryId,
      ];

      const result =
        await this.databaseService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order history not updated.',
        });
      }

      return WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
        result[0],
      );
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
        id_historial AS work_order_history_id,
        id_orden_trabajo AS work_order_id,
        id_estado AS status_id,
        fecha_cambio AS change_date,
        id_usuario AS user_id,
        descripcion_cambio AS change_description,
        clave_catastral AS cadastral_key,
        codigo_orden AS order_code
      FROM work_orders.historial_estado_orden_trabajo
      WHERE id_historial = $1;
      `;

      const params = [workOrderHistoryId];

      const result =
        await this.databaseService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        return null;
      }

      return WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async findByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderHistoryResponse[] | null> {
    try {
      const query: string = `
      SELECT
        id_historial AS work_order_history_id,
        id_orden_trabajo AS work_order_id,
        id_estado AS status_id,
        fecha_cambio AS change_date,
        id_usuario AS user_id,
        descripcion_cambio AS change_description,
        clave_catastral AS cadastral_key,
        codigo_orden AS order_code
      FROM work_orders.historial_estado_orden_trabajo
      WHERE id_orden_trabajo = $1;
      `;

      const params = [workOrderId];

      const result =
        await this.databaseService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      return result.map((sqlResponse) =>
        WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
          sqlResponse,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<WorkOrderHistoryResponse[] | null> {
    try {
      const query: string = `
      SELECT
        id_historial AS work_order_history_id,
        id_orden_trabajo AS work_order_id,
        id_estado AS status_id,
        fecha_cambio AS change_date,
        id_usuario AS user_id,
        descripcion_cambio AS change_description,
        clave_catastral AS cadastral_key,
        codigo_orden AS order_code
      FROM work_orders.historial_estado_orden_trabajo;
      `;

      const result =
        await this.databaseService.query<WorkOrderHistorySQLResponse>(query);

      return result.map((sqlResponse) =>
        WorkOrderHistoryAdapter.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
          sqlResponse,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findAllViewHistoriesWorkOrders(pagination?: {
    limit?: number;
    offset?: number;
  }): Promise<ViewWorkOrderHistoryResponse[]> {
    try {
      let query = `
      SELECT
        *
      FROM work_orders.view_historical_work_orders
      ORDER BY state_change_date DESC, work_order_id DESC
    `;

      const params: number[] = [];

      if (pagination?.limit !== undefined) {
        if (pagination.limit < 0) throw new Error('Limit must be positive');
        params.push(pagination.limit);
        query += ` LIMIT $${params.length}`;
      }

      if (pagination?.offset !== undefined) {
        if (pagination.offset < 0) throw new Error('Offset must be positive');
        params.push(pagination.offset);
        query += ` OFFSET $${params.length}`;
      }

      const result =
        await this.databaseService.query<ViewWorkOrderHistorySqlResponse>(
          query,
          params,
        );

      return WorkOrderHistoryAdapter.fromViewWorkOrderHistoriesSQLResponseToViewWorkOrderHistoriesResponse(
        result,
      );
    } catch (error) {
      console.error('Error fetching work order histories:', error);
      throw error;
    }
  }

  async findAllViewHistoriesWorkOrdersByOrderCode(
    orderCode: string,
    pagination?: { limit?: number; offset?: number },
  ): Promise<ViewWorkOrderHistoryResponse[]> {
    try {
      let query = `
      SELECT
        *
      FROM work_orders.view_historical_work_orders
      WHERE work_order_code = $1
      ORDER BY state_change_date DESC, work_order_id DESC
    `;

      const params: (string | number)[] = [orderCode];

      if (pagination?.limit !== undefined) {
        if (pagination.limit < 0) throw new Error('Limit must be positive');
        params.push(pagination.limit);
        query += ` LIMIT $${params.length}`;
      }

      if (pagination?.offset !== undefined) {
        if (pagination.offset < 0) throw new Error('Offset must be positive');
        params.push(pagination.offset);
        query += ` OFFSET $${params.length}`;
      }

      const result =
        await this.databaseService.query<ViewWorkOrderHistorySqlResponse>(
          query,
          params,
        );

      return WorkOrderHistoryAdapter.fromViewWorkOrderHistoriesSQLResponseToViewWorkOrderHistoriesResponse(
        result,
      );
    } catch (error) {
      console.error(
        'Error fetching work order histories by order code:',
        error,
      );
      throw error;
    }
  }
}
