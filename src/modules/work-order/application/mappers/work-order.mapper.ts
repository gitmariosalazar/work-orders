import { CreateWorkOrderRequest } from "../../domain/schemas/dto/request/create.work-order.request";
import { WorkOrderModel } from "../../domain/schemas/models/work-order.model";

export class WorkOrderMapper {
  static fromCreateWorkOrderRequestToWorkOrderModel(request: CreateWorkOrderRequest): WorkOrderModel {
    return new WorkOrderModel(
      request.description,
      request.workOrderTypeId,
      request.priorityId,
      request.workOrderStatusId,
      request.connectionId,
      request.createdUserId,
      request.creationDate,
      request.asignationDate,
      request.startDate,
      request.completionDate,
      request.cancelationDate,
      request.clientId,
      request.assignedUserId,
      request.estimateCost,
      request.realCost,
      request.observations,
    );
  }

  static fromWorkOrderModelToCreateWorkOrderRequest(model: WorkOrderModel): CreateWorkOrderRequest {
    return new CreateWorkOrderRequest(
      model.getDescription(),
      model.getWorkOrderTypeId(),
      model.getPriorityId(),
      model.getWorkOrderStatusId(),
      model.getConnectionId(),
      model.getCreatedUserId(),
      model.getCreationDate(),
      model.getAsignationDate(),
      model.getStartDate(),
      model.getCompletionDate(),
      model.getCancelationDate(),
      model.getClientId(),
      model.getAssignedUserId(),
      model.getEstimateCost(),
      model.getRealCost(),
      model.getObservations(),
    );
  }

  static fromUpdateWorkOrderRequestToWorkOrderModel(request: CreateWorkOrderRequest): WorkOrderModel {
    return new WorkOrderModel(
      request.description,
      request.workOrderTypeId,
      request.priorityId,
      request.workOrderStatusId,
      request.connectionId,
      request.createdUserId,
      request.creationDate,
      request.asignationDate,
      request.startDate,
      request.completionDate,
      request.cancelationDate,
      request.clientId,
      request.assignedUserId,
      request.estimateCost,
      request.realCost,
      request.observations,
    );
  }
}