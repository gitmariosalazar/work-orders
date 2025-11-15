import { WorkOrderResponse } from "../../../../domain/schemas/dto/response/work-order.response";
import { WorkOrderSQLResponse } from "../../../interfaces/sql/work-order.sql.response";

export class WorkOrderAdapter {
  static fromWorkOrderSQLResponseToWorkOrderResponse(
    workOrderSQLResponse: WorkOrderSQLResponse,
  ): WorkOrderResponse {
    return {
      workOrderId: workOrderSQLResponse.workOrderId!,
      description: workOrderSQLResponse.description,
      creationDate: workOrderSQLResponse.creationDate,
      asignationDate: workOrderSQLResponse.asignationDate,
      startDate: workOrderSQLResponse.startDate,
      completionDate: workOrderSQLResponse.completionDate,
      cancelationDate: workOrderSQLResponse.cancelationDate,
      workOrderTypeId: workOrderSQLResponse.workOrderTypeId,
      priorityId: workOrderSQLResponse.priorityId,
      workOrderStatusId: workOrderSQLResponse.workOrderStatusId,
      connectionId: workOrderSQLResponse.connectionId,
      clientId: workOrderSQLResponse.clientId,
      createdUserId: workOrderSQLResponse.createdUserId,
      assignedUserId: workOrderSQLResponse.assignedUserId,
      estimateCost: workOrderSQLResponse.estimateCost,
      realCost: workOrderSQLResponse.realCost,
      observations: workOrderSQLResponse.observations,
    };
  }
}