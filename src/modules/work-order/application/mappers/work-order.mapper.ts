import { CreateWorkOrderRequest } from '../../domain/schemas/dto/request/create.work-order.request';
import { WorkOrderModel } from '../../domain/schemas/models/work-order.model';

export class WorkOrderMapper {
  static fromCreateWorkOrderRequestToWorkOrderModel(
    request: Partial<CreateWorkOrderRequest>,
  ): WorkOrderModel {
    return new WorkOrderModel(
      request.orderCode!,
      request.workTypeId!,
      request.priorityId!,
      request.description!,
      request.location!,
      request.createdUserId!,
      undefined,
      request.clientId,
      request.creationDate,
      request.assignationDate,
      request.completionDate,
      request.status,
      request.assignedUserId,
      request.completedUserId,
      request.coordinates,
      request.metadata,
      request.cadastralKey,
    );
  }

  static fromWorkOrderModelToCreateWorkOrderRequest(
    model: WorkOrderModel,
  ): CreateWorkOrderRequest {
    return new CreateWorkOrderRequest(
      model.getOrderCode(),
      model.getWorkTypeId(),
      model.getPriorityId(),
      model.getDescription(),
      model.getLocation(),
      model.getCreatedUserId(),
      model.getClientId(),
      model.getCreationDate(),
      model.getAssignationDate(),
      model.getCompletionDate(),
      model.getStatus(),
      model.getAssignedUserId(),
      model.getCompletedUserId(),
      model.getCoordinates(),
      model.getMetadata(),
      model.getCadastralKey(),
    );
  }

  static fromUpdateWorkOrderRequestToWorkOrderModel(
    request: CreateWorkOrderRequest,
  ): WorkOrderModel {
    return new WorkOrderModel(
      request.orderCode,
      request.workTypeId,
      request.priorityId,
      request.description,
      request.location,
      request.createdUserId,
      undefined,
      request.clientId,
      request.creationDate,
      request.assignationDate,
      request.completionDate,
      request.status,
      request.assignedUserId,
      request.completedUserId,
      request.coordinates,
      request.metadata,
      request.cadastralKey,
    );
  }
}
