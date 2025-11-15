import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderRepository } from '../../../../domain/contracts/work-order.interface.repository';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderResponse } from '../../../../domain/schemas/dto/response/work-order.response';
import { WorkOrderModel } from '../../../../domain/schemas/models/work-order.model';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkOrderAdapter } from '../adapters/postgresql.work-order.adapter';
import { WorkOrderSQLResponse } from '../../../interfaces/sql/work-order.sql.response';

@Injectable()
export class PostgreSQLWorkOrderPersistence
  implements InterfaceWorkOrderRepository {
  constructor(private readonly postgreSqlService: DatabaseServicePostgreSQL) { }

  async createWorkOrder(
    workOrder: WorkOrderModel,
  ): Promise<WorkOrderResponse | null> {
    try {
      const query = `
        insert into ordentrabajo(descripcion,tipoordentrabajoid, prioridadid, estadoordentrabajoid, acometidaid,usuariocreadorid, clienteid) values ($1, $2, $3, $4, $5, $6, $7)
        RETURNING ordenTrabajoId as "workOrderId",
        descripcion AS "description",
        fechaCreacion AS "creationDate",
        fechaAsignacion AS "assignmentDate",
        fechaInicio AS "startDate",
        fechaCompletacion AS "completionDate",
        fechaCancelacion AS "cancellationDate",
        tipoOrdenTrabajoId AS "workOrderTypeId",
        prioridadId AS "priorityId",
        estadoOrdenTrabajoId AS "workOrderStatusId",
        acometidaId AS "serviceConnectionId",
        clienteId AS "clientId",
        usuarioCreadorId AS "creatorUserId",
        usuarioAsignadoId AS "assignedUserId",
        costoEstimado AS "estimatedCost",
        costoReal AS "actualCost",
        observaciones AS "observations" ;
      `;
      const values = [
        workOrder.getDescription(),
        workOrder.getWorkOrderTypeId(),
        workOrder.getPriorityId(),
        workOrder.getWorkOrderStatusId(),
        workOrder.getConnectionId(),
        workOrder.getCreatedUserId(),
        workOrder.getClientId(),
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
    workOrderId: number,
    workOrder: WorkOrderModel,
  ): Promise<WorkOrderResponse | null> {
    try {
      const query = `
        UPDATE ordentrabajo
        SET descripcion = $1,
            tipoordentrabajoid = $2,
            prioridadid = $3,
            estadoordentrabajoid = $4,
            acometidaid = $5,
            usuariocreadorid = $6,
            clienteid = $7
        WHERE ordenTrabajoId = $8
        RETURNING ordenTrabajoId as "workOrderId",
        descripcion AS "description",
        fechaCreacion AS "creationDate",
        fechaAsignacion AS "assignmentDate",
        fechaInicio AS "startDate",
        fechaCompletacion AS "completionDate",
        fechaCancelacion AS "cancellationDate",
        tipoOrdenTrabajoId AS "workOrderTypeId",
        prioridadId AS "priorityId",
        estadoOrdenTrabajoId AS "workOrderStatusId",
        acometidaId AS "serviceConnectionId",
        clienteId AS "clientId",
        usuarioCreadorId AS "creatorUserId",
        usuarioAsignadoId AS "assignedUserId",
        costoEstimado AS "estimatedCost",
        costoReal AS "actualCost",
        observaciones AS "observations" ;
      `;
      const values = [
        workOrder.getDescription(),
        workOrder.getWorkOrderTypeId(),
        workOrder.getPriorityId(),
        workOrder.getWorkOrderStatusId(),
        workOrder.getConnectionId(),
        workOrder.getCreatedUserId(),
        workOrder.getClientId(),
        workOrderId,
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
          ordenTrabajoId as "workOrderId",
          descripcion AS "description",
          fechaCreacion AS "creationDate",
          fechaAsignacion AS "assignmentDate",
          fechaInicio AS "startDate",
          fechaCompletacion AS "completionDate",
          fechaCancelacion AS "cancellationDate",
          tipoOrdenTrabajoId AS "workOrderTypeId",
          prioridadId AS "priorityId",
          estadoOrdenTrabajoId AS "workOrderStatusId",
          acometidaId AS "serviceConnectionId",
          clienteId AS "clientId",
          usuarioCreadorId AS "creatorUserId",
          usuarioAsignadoId AS "assignedUserId",
          costoEstimado AS "estimatedCost",
          costoReal AS "actualCost",
          observaciones AS "observations"
        FROM ordentrabajo
        WHERE clienteId = $1;
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

  async getWorkOrderById(
    workOrderId: number,
  ): Promise<WorkOrderResponse | null> {
    try {
      const query = `
        SELECT 
          ordenTrabajoId as "workOrderId",
          descripcion AS "description",
          fechaCreacion AS "creationDate",
          fechaAsignacion AS "assignmentDate",
          fechaInicio AS "startDate",
          fechaCompletacion AS "completionDate",
          fechaCancelacion AS "cancellationDate",
          tipoOrdenTrabajoId AS "workOrderTypeId",
          prioridadId AS "priorityId",
          estadoOrdenTrabajoId AS "workOrderStatusId",
          acometidaId AS "serviceConnectionId",
          clienteId AS "clientId",
          usuarioCreadorId AS "creatorUserId",
          usuarioAsignadoId AS "assignedUserId",
          costoEstimado AS "estimatedCost",
          costoReal AS "actualCost",
          observaciones AS "observations"
        FROM ordentrabajo
        WHERE ordenTrabajoId = $1;
      `;
      const values = [workOrderId];

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
          ordenTrabajoId as "workOrderId",
          descripcion AS "description",
          fechaCreacion AS "creationDate",
          fechaAsignacion AS "assignmentDate",
          fechaInicio AS "startDate",
          fechaCompletacion AS "completionDate",
          fechaCancelacion AS "cancellationDate",
          tipoOrdenTrabajoId AS "workOrderTypeId",
          prioridadId AS "priorityId",
          estadoOrdenTrabajoId AS "workOrderStatusId",
          acometidaId AS "serviceConnectionId",
          clienteId AS "clientId",
          usuarioCreadorId AS "creatorUserId",
          usuarioAsignadoId AS "assignedUserId",
          costoEstimado AS "estimatedCost",
          costoReal AS "actualCost",
          observaciones AS "observations"
        FROM ordentrabajo;
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
