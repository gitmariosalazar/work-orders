/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderRepository } from '../../../../domain/contracts/work-order.interface.repository';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderResponse } from '../../../../domain/schemas/dto/response/work-order.response';
import { WorkOrderModel } from '../../../../domain/schemas/models/work-order.model';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkOrderAdapter } from '../adapters/postgresql.work-order.adapter';
import { WorkOrderSQLResponse } from '../../../interfaces/sql/work-order.sql.response';
import { toNull } from '../../../../../../shared/validators/to-null';

@Injectable()
export class PostgreSQLWorkOrderPersistence
  implements InterfaceWorkOrderRepository
{
  constructor(private readonly postgreSqlService: DatabaseServicePostgreSQL) {}

  async createWorkOrder(
    workOrder: WorkOrderModel,
  ): Promise<WorkOrderResponse | null> {
    try {
      const query = `
        INSERT INTO work_orders.orden_trabajo (
            id_tipo_trabajo,
            id_prioridad,
            estado,
            id_cliente,
            descripcion,
            ubicacion,
            usuario_creacion,
            coordenadas,
            metadata,
            clave_catastral
        ) VALUES (
            $1,  -- id_tipo_trabajo (BIGINT)
            $2,  -- id_prioridad (BIGINT)
            $3,   -- estado (INT, por defecto 0 - pendiente)
            $4,  -- id_cliente (BIGINT)
            $5,  -- descripcion (TEXT, opcional)
            $6,  -- ubicacion (VARCHAR, opcional)
            $7,  -- usuario_creacion (BIGINT, opcional)
            work_orders.ST_SetSRID(work_orders.ST_MakePoint($8, $9), 4326),  -- lng, lat → coordenadas
            $10,  -- metadata (JSONB, opcional)
            $11  -- clave_catastral (VARCHAR, opcional)
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
            ubicacion AS location,
            usuario_creacion::TEXT AS created_user_id,
            usuario_asignacion::TEXT AS assigned_user_id,
            usuario_completacion::TEXT AS completed_user_id,
            coordenadas AS coordinates,   -- devuelve 'POINT(lng lat)'
            metadata::TEXT AS metadata,              -- JSON como string
            clave_catastral AS cadastral_key,
            is_deleted;
      `;
      const values = [
        toNull(workOrder.getWorkTypeId()),
        toNull(workOrder.getPriorityId()),
        toNull(workOrder.getStatus()),
        toNull(workOrder.getClientId()),
        toNull(workOrder.getDescription()),
        toNull(workOrder.getLocation()),
        toNull(workOrder.getCreatedUserId()),
        // coordenadas
        toNull(
          parseFloat(
            workOrder.getCoordinates()?.split('(')[1]?.split(' ')?.[0] ?? '',
          ) || null,
        ),
        toNull(
          parseFloat(
            workOrder.getCoordinates()?.split(' ')[1]?.split(')')?.[0] ?? '',
          ) || null,
        ),
        toNull(workOrder.getMetadata()),
        toNull(workOrder.getCadastralKey()),
      ];

      const result = await this.postgreSqlService.query<WorkOrderSQLResponse>(
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
      const query = `
        UPDATE work_orders.orden_trabajo
        SET
            descripcion = COALESCE($1, descripcion),
            id_tipo_trabajo = COALESCE($2, id_tipo_trabajo),
            id_prioridad = COALESCE($3, id_prioridad),
            estado = COALESCE($4, estado),
            id_cliente = COALESCE($5, id_cliente),
            ubicacion = COALESCE($6, ubicacion),
            usuario_asignacion = COALESCE($7, usuario_asignacion),
            usuario_completacion = COALESCE($8, usuario_completacion),
            metadata = COALESCE($9, metadata),
            clave_catastral = COALESCE($10, clave_catastral)
        WHERE codigo_orden = $11
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
            ubicacion AS location,
            usuario_creacion::TEXT AS created_user_id,
            usuario_asignacion::TEXT AS assigned_user_id,
            usuario_completacion::TEXT AS completed_user_id,
            coordenadas AS coordinates,   -- devuelve 'POINT(lng lat)'
            metadata::TEXT AS metadata,              -- JSON como string
            clave_catastral AS cadastral_key,
            is_deleted;
      `;
      const values = [
        toNull(workOrder.getDescription()),
        toNull(workOrder.getWorkTypeId()),
        toNull(workOrder.getPriorityId()),
        toNull(workOrder.getStatus()),
        toNull(workOrder.getClientId()),
        toNull(workOrder.getLocation()),
        toNull(workOrder.getAssignedUserId()),
        toNull(workOrder.getCompletedUserId()),
        toNull(workOrder.getMetadata()),
        toNull(workOrder.getCadastralKey()),
        orderCode,
      ];

      const result = await this.postgreSqlService.query<WorkOrderSQLResponse>(
        query,
        values,
      );
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update work order',
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
          ubicacion AS location,
          usuario_creacion::TEXT AS created_user_id,
          usuario_asignacion::TEXT AS assigned_user_id,
          usuario_completacion::TEXT AS completed_user_id,
          coordenadas AS coordinates,   -- devuelve 'POINT(lng lat)'
          metadata::TEXT AS metadata,              -- JSON como string
          clave_catastral AS cadastral_key,
          is_deleted
        FROM work_orders.orden_trabajo
        WHERE id_cliente = $1;
      `;
      const values = [clientId];

      const result = await this.postgreSqlService.query<WorkOrderSQLResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        return [];
      }

      const workOrders: WorkOrderResponse[] = result.map(
        WorkOrderAdapter.fromWorkOrderSQLResponseToWorkOrderResponse,
      );
      return workOrders;
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
          ubicacion AS location,
          usuario_creacion::TEXT AS created_user_id,
          usuario_asignacion::TEXT AS assigned_user_id,
          usuario_completacion::TEXT AS completed_user_id,
          coordenadas AS coordinates,   -- devuelve 'POINT(lng lat)'
          metadata::TEXT AS metadata,              -- JSON como string
          clave_catastral AS cadastral_key,
          is_deleted
        FROM work_orders.orden_trabajo
        WHERE codigo_orden = $1;
      `;
      const values = [orderCode];

      const result = await this.postgreSqlService.query<WorkOrderSQLResponse>(
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

  async getAllWorkOrders(): Promise<WorkOrderResponse[]> {
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
          ubicacion AS location,
          usuario_creacion::TEXT AS created_user_id,
          usuario_asignacion::TEXT AS assigned_user_id,
          usuario_completacion::TEXT AS completed_user_id,
          coordenadas AS coordinates,   -- devuelve 'POINT(lng lat)'
          metadata::TEXT AS metadata,              -- JSON como string
          clave_catastral AS cadastral_key,
          is_deleted
        FROM work_orders.orden_trabajo;
      `;

      const result =
        await this.postgreSqlService.query<WorkOrderSQLResponse>(query);

      if (result.length === 0) {
        return [];
      }

      const workOrders: WorkOrderResponse[] = result.map(
        WorkOrderAdapter.fromWorkOrderSQLResponseToWorkOrderResponse,
      );
      return workOrders;
    } catch (error) {
      throw error;
    }
  }
}
