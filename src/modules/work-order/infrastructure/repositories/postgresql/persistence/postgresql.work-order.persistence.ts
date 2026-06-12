/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderRepository } from '../../../../domain/contracts/work-order.interface.repository';
import { WorkOrderResponse } from '../../../../domain/schemas/dto/response/work-order.response';
import { WorkOrderModel } from '../../../../domain/schemas/models/work-order.model';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkOrderAdapter } from '../adapters/postgresql.work-order.adapter';
import { WorkOrderSQLResponse } from '../../../interfaces/sql/work-order.sql.response';
import { toNull } from '../../../../../../shared/validators/to-null';
import {
  ViewAllWorkOrdersFullDetailsResponse,
  ViewWorkOrderAssignmentsResponse,
  ViewWorkOrderAttachmentsResponse,
  ViewWorkOrderMaterialsResponse,
  ViewWorkOrderObservationsResponse,
  ViewWorkOrdersByClientResponse,
  ViewWorkOrderStatisticsResponse,
} from '../../../../domain/schemas/dto/response/views.work-orders.response';
import {
  ViewAllWorkOrdersFullDetailsSqlResponse,
  ViewWorkOrderAssignmentsSqlResponse,
  ViewWorkOrderAttachmentsSqlResponse,
  ViewWorkOrderMaterialsSqlResponse,
  ViewWorkOrderObservationsSqlResponse,
  ViewWorkOrdersByClientSqlResponse,
  ViewWorkOrderStatisticsSqlResponse,
} from '../../../interfaces/sql/views.work-orders.sql.response';
import { GetWorkOrderPriorityStatisticsResponse } from '../../../../domain/schemas/dto/response/get_work_order_priority_statistics.response';
import { GetWorkOrderPriorityStatisticsSqlResponse } from '../../../interfaces/sql/get_work_order_priority_statistics.sql.response';
import { GetWorkOrderTypeStatisticsResponse } from '../../../../domain/schemas/dto/response/get_work_order_type_statistics.response';
import { GetWorkOrderStatusStatisticsSqlResponse } from '../../../interfaces/sql/get_work_order_status_statistics.sql.response';
import { GetWorkOrderTypeStatisticsSqlResponse } from '../../../interfaces/sql/get_work_order_type_statistics.sql.response';
import { GetWorkOrderStatusStatisticsResponse } from '../../../../domain/schemas/dto/response/get_work_order_status_statistics.response';
import { WorkOrdersStatisticsKeyResponse } from '../../../../domain/schemas/dto/response/work_orders_statistics_key.response';
import { WorkOrdersStatisticsKeySqlResponse } from '../../../interfaces/sql/work_orders_statistics_key.sql.response';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PostgreSQLWorkOrderPersistence implements InterfaceWorkOrderRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async createWorkOrder(
    workOrder: WorkOrderModel,
  ): Promise<WorkOrderResponse | null> {
    try {
      const [longitude, latitude] = this.parsePointCoordinates(
        workOrder.getCoordinates(),
      );

      const query = `
        INSERT INTO work_orders.orden_trabajo (
            origen,
            id_tipo_trabajo,
            id_prioridad,
            estado,
            id_cliente,
            descripcion,
            direccion,
            created_by,
            geom_punto,
            metadata,
            clave_catastral
        ) VALUES (
            'SOLICITUD',
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            CASE
              WHEN $8::double precision IS NULL OR $9::double precision IS NULL
              THEN NULL
              ELSE public.ST_SetSRID(public.ST_MakePoint($8, $9), 4326)
            END,
            $10,
            $11
        )
        RETURNING 
            id_orden_trabajo::TEXT AS work_order_id,
            codigo_orden AS order_code,
            id_tipo_trabajo AS work_type_id,
            id_prioridad AS priority_id,
            id_cliente::TEXT AS client_id,
            fecha_creacion AS creation_date,
            fecha_asignacion AS assignation_date,
            fecha_completada AS completion_date,
            estado AS status,
            descripcion AS description,
            direccion AS location,
            created_by::TEXT AS created_user_id,
            usuario_asignacion::TEXT AS assigned_user_id,
            usuario_completacion::TEXT AS completed_user_id,
            public.ST_AsText(geom_punto) AS coordinates,
            metadata::TEXT AS metadata,
            clave_catastral AS cadastral_key,
            is_deleted;
      `;
      const values = [
        toNull(workOrder.getWorkTypeId()),
        toNull(workOrder.getPriorityId()),
        toNull(this.normalizeStatusCode(workOrder.getStatus())),
        toNull(workOrder.getClientId()),
        toNull(workOrder.getDescription()),
        toNull(workOrder.getLocation()),
        toNull(workOrder.getCreatedUserId()),
        toNull(longitude),
        toNull(latitude),
        toNull(workOrder.getMetadata()),
        toNull(workOrder.getCadastralKey()),
      ];

      const result = await this.databaseService.query<WorkOrderSQLResponse>(
        query,
        values,
      );
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create work order',
        });
      }

      const createdWorkOrder: WorkOrderResponse =
        WorkOrderAdapter.fromWorkOrderSQLResponseToWorkOrderResponse(result[0]);
      return createdWorkOrder;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrder(
    orderCode: string,
    workOrder: WorkOrderModel,
  ): Promise<WorkOrderResponse | null> {
    try {
      const [longitude, latitude] = this.parsePointCoordinates(
        workOrder.getCoordinates(),
      );

      const query = `
        UPDATE work_orders.orden_trabajo
        SET
            descripcion = COALESCE($1, descripcion),
            id_tipo_trabajo = COALESCE($2, id_tipo_trabajo),
            id_prioridad = COALESCE($3, id_prioridad),
            estado = COALESCE($4, estado),
            id_cliente = COALESCE($5, id_cliente),
            direccion = COALESCE($6, direccion),
            usuario_asignacion = COALESCE($7, usuario_asignacion),
            usuario_completacion = COALESCE($8, usuario_completacion),
            metadata = COALESCE($9, metadata),
            clave_catastral = COALESCE($10, clave_catastral),
            geom_punto = COALESCE(
              CASE
                WHEN $11::double precision IS NULL OR $12::double precision IS NULL
                THEN NULL
                ELSE public.ST_SetSRID(public.ST_MakePoint($11, $12), 4326)
              END,
              geom_punto
            ),
            updated_at = NOW()
        WHERE codigo_orden = $13
          AND is_deleted = FALSE
        RETURNING 
            id_orden_trabajo::TEXT AS work_order_id,
            codigo_orden AS order_code,
            id_tipo_trabajo AS work_type_id,
            id_prioridad AS priority_id,
            id_cliente::TEXT AS client_id,
            fecha_creacion AS creation_date,
            fecha_asignacion AS assignation_date,
            fecha_completada AS completion_date,
            estado AS status,
            descripcion AS description,
            direccion AS location,
            created_by::TEXT AS created_user_id,
            usuario_asignacion::TEXT AS assigned_user_id,
            usuario_completacion::TEXT AS completed_user_id,
            public.ST_AsText(geom_punto) AS coordinates,
            metadata::TEXT AS metadata,
            clave_catastral AS cadastral_key,
            is_deleted;
      `;
      const values = [
        toNull(workOrder.getDescription()),
        toNull(workOrder.getWorkTypeId()),
        toNull(workOrder.getPriorityId()),
        toNull(this.normalizeStatusCode(workOrder.getStatus())),
        toNull(workOrder.getClientId()),
        toNull(workOrder.getLocation()),
        toNull(workOrder.getAssignedUserId()),
        toNull(workOrder.getCompletedUserId()),
        toNull(workOrder.getMetadata()),
        toNull(workOrder.getCadastralKey()),
        toNull(longitude),
        toNull(latitude),
        orderCode,
      ];

      const result = await this.databaseService.query<WorkOrderSQLResponse>(
        query,
        values,
      );
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Work order with code ${orderCode} not found`,
        });
      }

      const updatedWorkOrder: WorkOrderResponse =
        WorkOrderAdapter.fromWorkOrderSQLResponseToWorkOrderResponse(result[0]);
      return updatedWorkOrder;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrdersByClientId(
    clientId: string,
  ): Promise<WorkOrderResponse[]> {
    try {
      const query = `
        SELECT 
          id_orden_trabajo::TEXT AS work_order_id,
          codigo_orden AS order_code,
          id_tipo_trabajo AS work_type_id,
          id_prioridad AS priority_id,
          id_cliente::TEXT AS client_id,
          fecha_creacion AS creation_date,
          fecha_asignacion AS assignation_date,
          fecha_completada AS completion_date,
          estado AS status,
          descripcion AS description,
          direccion AS location,
          created_by::TEXT AS created_user_id,
          usuario_asignacion::TEXT AS assigned_user_id,
          usuario_completacion::TEXT AS completed_user_id,
          public.ST_AsText(geom_punto) AS coordinates,
          metadata::TEXT AS metadata,
          clave_catastral AS cadastral_key,
          is_deleted
        FROM work_orders.orden_trabajo
        WHERE id_cliente = $1
          AND is_deleted = FALSE;
      `;
      const values = [clientId];

      const result = await this.databaseService.query<WorkOrderSQLResponse>(
        query,
        values,
      );

      return result.map((item) =>
        WorkOrderAdapter.fromWorkOrderSQLResponseToWorkOrderResponse(item),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderById(orderCode: string): Promise<WorkOrderResponse | null> {
    try {
      const query = `
        SELECT
          id_orden_trabajo::TEXT AS work_order_id,
          codigo_orden AS order_code,
          id_tipo_trabajo AS work_type_id,
          id_prioridad AS priority_id,
          id_cliente::TEXT AS client_id,
          fecha_creacion AS creation_date,
          fecha_asignacion AS assignation_date,
          fecha_completada AS completion_date,
          estado AS status,
          descripcion AS description,
          direccion AS location,
          created_by::TEXT AS created_user_id,
          usuario_asignacion::TEXT AS assigned_user_id,
          usuario_completacion::TEXT AS completed_user_id,
          public.ST_AsText(geom_punto) AS coordinates,
          metadata::TEXT AS metadata,
          clave_catastral AS cadastral_key,
          is_deleted
        FROM work_orders.orden_trabajo
        WHERE codigo_orden = $1
          AND is_deleted = FALSE;
      `;
      const values = [orderCode];

      const result = await this.databaseService.query<WorkOrderSQLResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        return null;
      }

      const workOrder: WorkOrderResponse =
        WorkOrderAdapter.fromWorkOrderSQLResponseToWorkOrderResponse(result[0]);
      return workOrder;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrders(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderResponse[]> {
    try {
      const paramsQuery: any[] = [toNull(limit), toNull(offset)];

      const query = `
        SELECT 
          id_orden_trabajo::TEXT AS work_order_id,
          codigo_orden AS order_code,
          id_tipo_trabajo AS work_type_id,
          id_prioridad AS priority_id,
          id_cliente::TEXT AS client_id,
          fecha_creacion AS creation_date,
          fecha_asignacion AS assignation_date,
          fecha_completada AS completion_date,
          estado AS status,
          descripcion AS description,
          direccion AS location,
          created_by::TEXT AS created_user_id,
          usuario_asignacion::TEXT AS assigned_user_id,
          usuario_completacion::TEXT AS completed_user_id,
          public.ST_AsText(geom_punto) AS coordinates,
          metadata::TEXT AS metadata,
          clave_catastral AS cadastral_key,
          is_deleted
        FROM work_orders.orden_trabajo
        WHERE is_deleted = FALSE
        ORDER BY fecha_creacion DESC
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;

      const result = await this.databaseService.query<WorkOrderSQLResponse>(
        query,
        paramsQuery,
      );

      return result.map((item) =>
        WorkOrderAdapter.fromWorkOrderSQLResponseToWorkOrderResponse(item),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderStatistics(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderStatisticsResponse[]> {
    try {
      const query = `
        SELECT * FROM work_orders.view_work_order_statistics
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;
      const values = [toNull(limit), toNull(offset)];

      const result =
        await this.databaseService.query<ViewWorkOrderStatisticsSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order statistics found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromWorkOrderStattisticsSQLResponseToWorkOrderStatisticsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderAssignments(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderAssignmentsResponse[]> {
    try {
      const query = `
        SELECT * FROM work_orders.view_work_order_assignments
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;
      const values = [toNull(limit), toNull(offset)];

      const result =
        await this.databaseService.query<ViewWorkOrderAssignmentsSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order assignments found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromViewWorkOrderAssignmentsSqlResponseToViewWorkOrderAssignmentsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderMaterials(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderMaterialsResponse[]> {
    try {
      const query = `
        SELECT * FROM work_orders.view_work_order_materials
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;
      const values = [toNull(limit), toNull(offset)];

      const result =
        await this.databaseService.query<ViewWorkOrderMaterialsSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order materials found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromViewWorkOrderMaterialsSqlResponseToViewWorkOrderMaterialsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderAttachments(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderAttachmentsResponse[]> {
    try {
      const query = `
        SELECT * FROM work_orders.view_work_order_attachments
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;
      const values = [toNull(limit), toNull(offset)];

      const result =
        await this.databaseService.query<ViewWorkOrderAttachmentsSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order attachments found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromViewWorkOrderAttachmentsSqlResponseToViewWorkOrderAttachmentsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderObservations(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderObservationsResponse[]> {
    try {
      const query = `
        SELECT * FROM work_orders.view_work_order_observations
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;
      const values = [toNull(limit), toNull(offset)];

      const result =
        await this.databaseService.query<ViewWorkOrderObservationsSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order observations found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromViewWorkOrderObservationsSqlResponseToViewWorkOrderObservationsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrdersByClient(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrdersByClientResponse[]> {
    try {
      const query = `
        SELECT * FROM work_orders.view_work_orders_by_client
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;
      const values = [toNull(limit), toNull(offset)];

      const result =
        await this.databaseService.query<ViewWorkOrdersByClientSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work orders by client found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromViewWorkOrdersByClientSqlResponseToViewWorkOrdersByClientResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrdersFullDetails(
    limit?: number,
    offset?: number,
  ): Promise<ViewAllWorkOrdersFullDetailsResponse[]> {
    try {
      const query = `
        SELECT * FROM work_orders.view_all_work_orders_full_details
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;
      const values = [toNull(limit), toNull(offset)];

      const result =
        await this.databaseService.query<ViewAllWorkOrdersFullDetailsSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work orders full details found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromViewAllWorkOrdersFullDetailsSqlResponseToViewAllWorkOrdersFullDetailsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findWorkOrdersFullDetailsByOrderCode(
    orderCode: string,
  ): Promise<ViewAllWorkOrdersFullDetailsResponse | null> {
    try {
      const query: string = `
        SELECT * FROM work_orders.view_all_work_orders_full_details
        WHERE work_order_code = $1;
      `;
      const values = [orderCode];

      const result =
        await this.databaseService.query<ViewAllWorkOrdersFullDetailsSqlResponse>(
          query,
          values,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work orders full details found for the given order code',
        });
      }

      return WorkOrderAdapter.fromViewAllWorkOrdersFullDetailsSqlResponseToViewAllWorkOrdersFullDetailsResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderPriorityStatistics(): Promise<
    GetWorkOrderPriorityStatisticsResponse[]
  > {
    try {
      const query = `
        SELECT
            pot.nivel AS priority_level,
            pot.id_prioridad AS priority_id,
            pot.descripcion AS description,
            COUNT(*) AS quantity,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS percentage_of_total
        FROM work_orders.orden_trabajo ot
        JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
        WHERE ot.is_deleted = FALSE
        GROUP BY pot.nivel,pot.id_prioridad, pot.descripcion
        ORDER BY
            CASE pot.nivel
                WHEN 'Emergencia' THEN 1
                WHEN 'Urgente' THEN 2
                WHEN 'Alta' THEN 3
                ELSE 4
            END;
      `;

      const result =
        await this.databaseService.query<GetWorkOrderPriorityStatisticsSqlResponse>(
          query,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order priority statistics found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromWorkOrderPriorityStatisticsSQLResponseToWorkOrderPriorityStatisticsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderTypeStatistics(): Promise<
    GetWorkOrderTypeStatisticsResponse[]
  > {
    try {
      const query = `
        SELECT
            tt.nombre AS work_type,
            tt.id_tipo_trabajo AS work_type_id,
            COUNT(*) AS quantity,
            COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') AS completed,
            ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') / NULLIF(COUNT(*), 0), 2) AS completion_rate_percentage
        FROM work_orders.orden_trabajo ot
        JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
        WHERE ot.is_deleted = FALSE
        GROUP BY tt.nombre, tt.id_tipo_trabajo
        ORDER BY quantity DESC;
      `;

      const result =
        await this.databaseService.query<GetWorkOrderTypeStatisticsSqlResponse>(
          query,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order type statistics found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromWorkOrderTypeStatisticsSQLResponseToWorkOrderTypeStatisticsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderStatusStatistics(): Promise<
    GetWorkOrderStatusStatisticsResponse[]
  > {
    try {
      const query = `
        SELECT
            ceo.nombre AS status_name,
            ot.estado AS status_id,
            ceo.descripcion AS status_description,
            COUNT(*)  AS quantity,
            ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS percentage_of_total
        FROM work_orders.orden_trabajo ot
        JOIN work_orders.cat_estado_orden ceo ON ot.estado = ceo.codigo
        WHERE ot.is_deleted = FALSE
        GROUP BY ceo.codigo, ceo.nombre, ot.estado, ceo.descripcion
        ORDER BY quantity DESC;
      `;

      const result =
        await this.databaseService.query<GetWorkOrderStatusStatisticsSqlResponse>(
          query,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order status statistics found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromWorkOrderStatusStatisticsSQLResponseToWorkOrderStatusStatisticsResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrdersStatisticsKey(): Promise<
    WorkOrdersStatisticsKeyResponse[]
  > {
    try {
      const query = `
        select * from work_orders.view_work_order_key_statistics;
      `;

      const result =
        await this.databaseService.query<WorkOrdersStatisticsKeySqlResponse>(
          query,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work orders statistics key found',
        });
      }

      return result.map((item) =>
        WorkOrderAdapter.fromWorkOrdersStatisticsKeySqlResponseToWorkOrdersStatisticsKeyResponse(
          item,
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  private parsePointCoordinates(
    coordinates?: string,
  ): [number | null, number | null] {
    if (!coordinates) {
      return [null, null];
    }

    const match = coordinates
      .trim()
      .match(/^POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)$/i);

    if (!match) {
      return [null, null];
    }

    return [Number(match[1]), Number(match[2])];
  }

  private normalizeStatusCode(status?: string | number): string | undefined {
    if (status === undefined || status === null) {
      return undefined;
    }

    if (typeof status === 'number') {
      return this.mapNumericStatus(status);
    }

    const trimmedStatus = status.trim();
    if (trimmedStatus === '') {
      return undefined;
    }

    const parsedStatus = Number(trimmedStatus);
    if (!Number.isNaN(parsedStatus)) {
      return this.mapNumericStatus(parsedStatus);
    }

    return trimmedStatus.toUpperCase();
  }

  private mapNumericStatus(status: number): string {
    switch (status) {
      case 1:
        return 'NOTIFICADA';
      case 2:
        return 'PENDIENTE';
      case 3:
        return 'ASIGNADA';
      case 4:
        return 'PREPARACION';
      case 5:
        return 'REVISION_RECHAZADA';
      case 6:
        return 'EN_PROCESO';
      case 7:
        return 'EJECUTADA';
      case 8:
        return 'RECHAZADA_TECNICA';
      case 9:
        return 'COMPLETADA';
      case 10:
        return 'CANCELADA';
      default:
        return String(status);
    }
  }
}
