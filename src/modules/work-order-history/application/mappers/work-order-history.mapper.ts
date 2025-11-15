import { CreateWorkHistoryRequest } from "../../domain/schemas/dto/request/creeate.work-order-history.request";
import { UpdateWorkOrderHistoryRequest } from "../../domain/schemas/dto/request/update.work-order-history.request";
import { WorkOrderHistoryResponse } from "../../domain/schemas/dto/response/work-order-history.response";
import { WorkOrderHistoryModel } from "../../domain/schemas/models/work-order-history.model";

export class WorkOrderHistoryMapper {
  static fromCreateWorkOrderHistoryRequestToWorkOrderHistoryModel(
    request: CreateWorkHistoryRequest,
  ): WorkOrderHistoryModel {
    return WorkOrderHistoryModel.create(
      request.workOrderId,
      request.changeDate,
      request.userId,
      request.previousStatusId,
      request.newStatusId,
      request.changeDescription,
    );
  }

  static fromUpdateWorkOrderHistoryRequestToWorkOrderHistoryModel(
    request: UpdateWorkOrderHistoryRequest,
  ): Partial<WorkOrderHistoryModel> {
    const workOrderHistoryModel: Partial<WorkOrderHistoryModel> = {};

    if (request.workOrderId !== undefined) {
      workOrderHistoryModel.workOrderId = request.workOrderId;
    }
    if (request.changeDate !== undefined) {
      workOrderHistoryModel.changeDate = request.changeDate;
    }
    if (request.previousStatusId !== undefined) {
      workOrderHistoryModel.previousStatusId = request.previousStatusId;
    }
    if (request.newStatusId !== undefined) {
      workOrderHistoryModel.newStatusId = request.newStatusId;
    }
    if (request.userId !== undefined) {
      workOrderHistoryModel.userId = request.userId;
    }
    if (request.changeDescription !== undefined) {
      workOrderHistoryModel.changeDescription = request.changeDescription;
    }

    return workOrderHistoryModel;
  }

  static fromWorkOrderHistoryModelToWorkOrderHistoryResponse(
    model: WorkOrderHistoryModel,
  ): WorkOrderHistoryResponse {
    return {
      workOrderHistoryId: model.workOrderHistoryId,
      workOrderId: model.workOrderId,
      changeDate: model.changeDate,
      previousStatusId: model.previousStatusId,
      newStatusId: model.newStatusId,
      userId: model.userId,
      changeDescription: model.changeDescription,
    };
  }
}