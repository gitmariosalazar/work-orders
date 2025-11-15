import { CreateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/create.work-order-observation.request';
import { UpdateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/update.work-order-observation.request';
import { WorkOrderObservationResponse } from '../../domain/schemas/dto/response/work-order-observation.response';
import { WorkOrderObservationModel } from '../../domain/schemas/models/work-order-observation.model';

export class WorkOrderObservationMapper {
  static fromWorkOrderObservationModelToWorkOrderObservationResponse(
    model: WorkOrderObservationModel,
  ): WorkOrderObservationResponse {
    return {
      workOrderObservationId: model.workOrderObservationId,
      workOrderId: model.workOrderId,
      observationId: model.observationId,
      registerDate: model.registerDate,
    };
  }

  static fromWorkOrderObservationResponseToWorkOrderObservationModel(
    response: WorkOrderObservationResponse,
  ): WorkOrderObservationModel {
    return WorkOrderObservationModel.create(
      response.workOrderId,
      response.observationId,
      response.workOrderObservationId,
      response.registerDate,
    );
  }

  static fromCreateWorkOrderObservationRequestToWorkOrderObservationModel(
    request: CreateWorkOrderObservationRequest,
  ): WorkOrderObservationModel {
    return WorkOrderObservationModel.create(
      request.workOrderId,
      request.observationId,
    );
  }

  static fromUpdateWorkOrderObservationRequestToWorkOrderObservationModel(
    request: Partial<UpdateWorkOrderObservationRequest>,
  ): Partial<WorkOrderObservationModel> {
    const workOrderObservationModelProps: Partial<WorkOrderObservationModel> =
      {};

    if (request.workOrderId !== undefined) {
      workOrderObservationModelProps.workOrderId = request.workOrderId;
    }
    if (request.observationId !== undefined) {
      workOrderObservationModelProps.observationId = request.observationId;
    }

    return workOrderObservationModelProps;
  }
}
