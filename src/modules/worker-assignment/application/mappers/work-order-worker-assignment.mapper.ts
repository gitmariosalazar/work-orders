import { CreateWorkOrderWorkerAssignmentRequest } from '../../domain/schemas/dto/request/create-work-order-worker-assignment.request';
import { WorkOrderWorkerAssignmentResponse } from '../../domain/schemas/dto/response/work-order-worker-assignment.response';
import { WorkOrderWorkerAssignmentModel } from '../../domain/schemas/models/work-order-worker-assignment.model';

export class WorkOrderWorkerAssignmentMapper {
  static fromModelToResponse(
    model: WorkOrderWorkerAssignmentModel,
  ): WorkOrderWorkerAssignmentResponse {
    return {
      assignmentId: model.getAssignmentId(),
      workOrderId: model.getWorkOrderId(),
      workerId: model.getWorkerId(),
      rolId: model.getRolId(),
      assignedDate: model.getAssignedDate(),
    };
  }

  static fromModelToResponseList(
    models: WorkOrderWorkerAssignmentModel[],
  ): WorkOrderWorkerAssignmentResponse[] {
    return models.map((model) => this.fromModelToResponse(model));
  }

  static fromRequestToModel(
    request: CreateWorkOrderWorkerAssignmentRequest,
  ): WorkOrderWorkerAssignmentModel {
    return new WorkOrderWorkerAssignmentModel(
      0,
      request.workOrderId,
      request.workerId,
      request.rolId,
      new Date(),
    );
  }

  static fromRequestToModelList(
    requests: CreateWorkOrderWorkerAssignmentRequest[],
  ): WorkOrderWorkerAssignmentModel[] {
    return requests.map((request) => this.fromRequestToModel(request));
  }
}
