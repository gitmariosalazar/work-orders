import { CreateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/create.work-order-observation.request';
import { UpdateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/update.work-order-observation.request';
import { WorkOrderObservationResponse } from '../../domain/schemas/dto/response/work-order-observation.response';
import { ObservationModel } from '../../domain/schemas/models/observation.model';
import { WorkOrderObservationModel } from '../../domain/schemas/models/work-order-observation.model';

export class WorkOrderObservationMapper {
  static fromWorkOrderObservationModelToWorkOrderObservationResponse(
    model: WorkOrderObservationModel,
  ): WorkOrderObservationResponse {
    return {
      workOrderObservationId: model.workOrderObservationId,
      workOrderId: model.workOrderId,
      observationId: model.observation.observationId,
      observationTitle: model.observation.observationTitle,
      observationDetails: model.observation.observationDetails,
      registerDate: model.registerDate,
    };
  }

  static fromWorkOrderObservationResponseToWorkOrderObservationModel(
    response: WorkOrderObservationResponse,
  ): WorkOrderObservationModel {
    return WorkOrderObservationModel.create(
      response.workOrderId,
      new ObservationModel({
        observationId: response.observationId,
        observationTitle: response.observationTitle,
        observationDetails: response.observationDetails,
      }
      ),
      response.workOrderObservationId,
      response.registerDate,
    );
  }

  static fromCreateWorkOrderObservationRequestToWorkOrderObservationModel(
    request: CreateWorkOrderObservationRequest,
  ): WorkOrderObservationModel {
    return WorkOrderObservationModel.create(
      request.workOrderId,
      new ObservationModel({
        observationId: 0,
        observationTitle: request.observationTitle,
        observationDetails: request.observationDetails,
      })
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
    if (request.observationTitle !== undefined) {
      if (!workOrderObservationModelProps.observation) {
        workOrderObservationModelProps.observation = new ObservationModel({
          observationId: 0,
          observationTitle: request.observationTitle,
          observationDetails: request.observationDetails || '',
        });
      } else {
        workOrderObservationModelProps.observation.observationTitle = request.observationTitle;
        workOrderObservationModelProps.observation.observationDetails = request.observationDetails || '';
      }
    }

    return workOrderObservationModelProps;
  }
}
