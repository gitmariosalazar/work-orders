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
export class PostgresqlWorkOrderHistoryPersistence implements InterfaceWorkOrderHistoryRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async create(
    workOrderHistory: WorkOrderHistoryModel,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      const query: string = `
        WITH current_order AS (
          SELECT estado, codigo_orden, clave_catastral
          FROM work_orders.orden_trabajo
          WHERE id_orden_trabajo = $1
            AND is_deleted = FALSE
        ),
        inserted_history AS (
        INSERT INTO work_orders.historial_estado_orden_trabajo
          (id_orden_trabajo, estado_anterior, estado_nuevo, id_usuario, descripcion_cambio)
        SELECT
          $1,
          current_order.estado,
          $2,
          $3,
          $4
        FROM current_order
          RETURNING
          id_historial AS work_order_history_id,
          id_orden_trabajo AS work_order_id,
          estado_nuevo AS status_id,
          fecha_cambio AS change_date,
          id_usuario AS user_id,
          descripcion_cambio AS change_description
        )
        SELECT
          inserted_history.work_order_history_id,
          inserted_history.work_order_id,
          inserted_history.status_id,
          inserted_history.change_date,
          inserted_history.user_id,
          inserted_history.change_description,
          current_order.clave_catastral AS cadastral_key,
          current_order.codigo_orden AS order_code
        FROM inserted_history
        JOIN current_order ON TRUE;
      `;

      const params = [
        workOrderHistory.workOrderId,
        workOrderHistory.statusId ?? null,
        workOrderHistory.userId,
        workOrderHistory.changeDescription ?? null,
      ];

      const result =
        await this.databaseService.query<WorkOrderHistorySQLResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Work order history not created for work order ${workOrderHistory.workOrderId}.`,
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
        WITH updated_history AS (
        UPDATE work_orders.historial_estado_orden_trabajo
        SET
          estado_nuevo = COALESCE($1, estado_nuevo),
          id_usuario = COALESCE($2, id_usuario),
          descripcion_cambio = COALESCE($3, descripcion_cambio)
        WHERE id_historial = $4
          RETURNING
          id_historial AS work_order_history_id,
          id_orden_trabajo AS work_order_id,
          estado_nuevo AS status_id,
          fecha_cambio AS change_date,
          id_usuario AS user_id,
          descripcion_cambio AS change_description
        )
        SELECT
          updated_history.work_order_history_id,
          updated_history.work_order_id,
          updated_history.status_id,
          updated_history.change_date,
          updated_history.user_id,
          updated_history.change_description,
          ot.clave_catastral AS cadastral_key,
          ot.codigo_orden AS order_code
        FROM updated_history
        LEFT JOIN work_orders.orden_trabajo ot ON ot.id_orden_trabajo = updated_history.work_order_id;
      `;

      const params = [
        workOrderHistory.statusId ?? null,
        workOrderHistory.userId ?? null,
        workOrderHistory.changeDescription ?? null,
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
          message: `Work order history with ID ${workOrderHistoryId} not updated.`,
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
          hist.id_historial AS work_order_history_id,
          hist.id_orden_trabajo AS work_order_id,
          hist.estado_nuevo AS status_id,
          hist.fecha_cambio AS change_date,
          hist.id_usuario AS user_id,
          hist.descripcion_cambio AS change_description,
          ot.clave_catastral AS cadastral_key,
          ot.codigo_orden AS order_code
        FROM work_orders.historial_estado_orden_trabajo hist
        LEFT JOIN work_orders.orden_trabajo ot ON ot.id_orden_trabajo = hist.id_orden_trabajo
        WHERE hist.id_historial = $1;
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
          hist.id_historial AS work_order_history_id,
          hist.id_orden_trabajo AS work_order_id,
          hist.estado_nuevo AS status_id,
          hist.fecha_cambio AS change_date,
          hist.id_usuario AS user_id,
          hist.descripcion_cambio AS change_description,
          ot.clave_catastral AS cadastral_key,
          ot.codigo_orden AS order_code
        FROM work_orders.historial_estado_orden_trabajo hist
        LEFT JOIN work_orders.orden_trabajo ot ON ot.id_orden_trabajo = hist.id_orden_trabajo
        WHERE hist.id_orden_trabajo = $1
        ORDER BY hist.fecha_cambio DESC, hist.id_historial DESC;
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
          hist.id_historial AS work_order_history_id,
          hist.id_orden_trabajo AS work_order_id,
          hist.estado_nuevo AS status_id,
          hist.fecha_cambio AS change_date,
          hist.id_usuario AS user_id,
          hist.descripcion_cambio AS change_description,
          ot.clave_catastral AS cadastral_key,
          ot.codigo_orden AS order_code
        FROM work_orders.historial_estado_orden_trabajo hist
        LEFT JOIN work_orders.orden_trabajo ot ON ot.id_orden_trabajo = hist.id_orden_trabajo
        ORDER BY hist.fecha_cambio DESC, hist.id_historial DESC;
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
      const query = `
        SELECT
          dash.id_orden_trabajo AS work_order_id,
          dash.codigo_orden AS work_order_code,
          dash.clave_catastral AS cadastral_key,
          dash.direccion AS work_order_description,
          NULL::TEXT AS work_order_location,
          NULL::TEXT AS coordinates_wkt,
          dash.longitud AS longitude,
          dash.latitud AS latitude,
          dash.tipo_trabajo AS work_type,
          dash.departamento AS department,
          dash.prioridad AS priority,
          dash.nombre_estado AS current_state,
          dash.id_cliente AS client_id,
          dash.created_by AS created_by_user_id,
          dash.usuario_asignado AS assigned_to_user_id,
          dash.usuario_completacion AS completed_by_user_id,
          dash.fecha_creacion AS creation_date,
          dash.fecha_asignacion AS assignment_date,
          dash.fecha_completada AS completion_date,
          hist.id_historial AS historical_id,
          hist.estado_nuevo AS historical_state_id,
          ceo.nombre AS historical_state_name,
          hist.fecha_cambio AS state_change_date,
          hist.id_usuario AS state_change_user_id,
          hist.descripcion_cambio AS change_description,
          ROW_NUMBER() OVER (
            PARTITION BY dash.id_orden_trabajo
            ORDER BY hist.fecha_cambio DESC, hist.id_historial DESC
          ) AS change_number
        FROM work_orders.historial_estado_orden_trabajo hist
        JOIN work_orders.orden_trabajo dash ON dash.id_orden_trabajo = hist.id_orden_trabajo
        LEFT JOIN work_orders.cat_estado_orden ceo ON ceo.codigo = hist.estado_nuevo
        ORDER BY hist.fecha_cambio DESC, dash.id_orden_trabajo DESC
        LIMIT COALESCE($1::int, 100)
        OFFSET COALESCE($2::int, 0);
      `;

      const params = [pagination?.limit ?? null, pagination?.offset ?? null];

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
      const query = `
        SELECT
          dash.id_orden_trabajo AS work_order_id,
          dash.codigo_orden AS work_order_code,
          dash.clave_catastral AS cadastral_key,
          dash.direccion AS work_order_description,
          NULL::TEXT AS work_order_location,
          NULL::TEXT AS coordinates_wkt,
          dash.longitud AS longitude,
          dash.latitud AS latitude,
          dash.tipo_trabajo AS work_type,
          dash.departamento AS department,
          dash.prioridad AS priority,
          dash.nombre_estado AS current_state,
          dash.id_cliente AS client_id,
          dash.created_by AS created_by_user_id,
          dash.usuario_asignado AS assigned_to_user_id,
          dash.usuario_completacion AS completed_by_user_id,
          dash.fecha_creacion AS creation_date,
          dash.fecha_asignacion AS assignment_date,
          dash.fecha_completada AS completion_date,
          hist.id_historial AS historical_id,
          hist.estado_nuevo AS historical_state_id,
          ceo.nombre AS historical_state_name,
          hist.fecha_cambio AS state_change_date,
          hist.id_usuario AS state_change_user_id,
          hist.descripcion_cambio AS change_description,
          ROW_NUMBER() OVER (
            PARTITION BY dash.id_orden_trabajo
            ORDER BY hist.fecha_cambio DESC, hist.id_historial DESC
          ) AS change_number
        FROM work_orders.historial_estado_orden_trabajo hist
        JOIN work_orders.orden_trabajo dash ON dash.id_orden_trabajo = hist.id_orden_trabajo
        LEFT JOIN work_orders.cat_estado_orden ceo ON ceo.codigo = hist.estado_nuevo
        WHERE dash.codigo_orden = $1
        ORDER BY hist.fecha_cambio DESC, dash.id_orden_trabajo DESC
        LIMIT COALESCE($2::int, 100)
        OFFSET COALESCE($3::int, 0);
      `;

      const params: (string | number | null)[] = [
        orderCode,
        pagination?.limit ?? null,
        pagination?.offset ?? null,
      ];

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
