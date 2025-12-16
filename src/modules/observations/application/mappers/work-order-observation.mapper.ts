import { CreateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/create.work-order-observation.request';
import { UpdateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/update.work-order-observation.request';
import { WorkOrderObservationResponse } from '../../domain/schemas/dto/response/work-order-observation.response';
import { WorkOrderObservationModel } from '../../domain/schemas/models/work-order-observation.model';

export class WorkOrderObservationMapper {
  static fromWorkOrderObservationModelToWorkOrderObservationResponse(
    model: WorkOrderObservationModel,
  ): WorkOrderObservationResponse {
    return {
      observationId: model.getObservationId(),
      workOrderId: model.getWorkOrderId(),
      description: model.getDescription(),
      workerId: model.getWorkerId(),
      createdAt: model.getCreatedAt(),
    };
  }

  static fromWorkOrderObservationResponseToWorkOrderObservationModel(
    response: WorkOrderObservationResponse,
  ): WorkOrderObservationModel {
    return new WorkOrderObservationModel(
      response.observationId,
      response.workOrderId,
      response.description,
      response.workerId,
      response.createdAt,
    );
  }

  static fromCreateWorkOrderObservationRequestToWorkOrderObservationModel(
    request: CreateWorkOrderObservationRequest,
  ): WorkOrderObservationModel {
    return new WorkOrderObservationModel(
      0,
      request.workOrderId,
      request.description,
      request.workerId,
    );
  }

  static fromUpdateWorkOrderObservationRequestToWorkOrderObservationModel(
    request: Partial<UpdateWorkOrderObservationRequest>,
  ): Partial<WorkOrderObservationModel> {
    const model = new WorkOrderObservationModel(0, '', '', 0);

    if (request.workOrderId !== undefined) {
      model.setWorkOrderId(request.workOrderId);
    }
    if (request.description !== undefined) {
      model.setDescription(request.description);
    }
    if (request.workerId !== undefined) {
      model.setWorkerId(request.workerId);
    }

    return model;
  }
}
