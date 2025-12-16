import { CreateWorkHistoryRequest } from '../../domain/schemas/dto/request/creeate.work-order-history.request';
import { UpdateWorkOrderHistoryRequest } from '../../domain/schemas/dto/request/update.work-order-history.request';
import { WorkOrderHistoryResponse } from '../../domain/schemas/dto/response/work-order-history.response';
import { WorkOrderHistoryModel } from '../../domain/schemas/models/work-order-history.model';

export class WorkOrderHistoryMapper {
  static fromCreateWorkOrderHistoryRequestToWorkOrderHistoryModel(
    request: CreateWorkHistoryRequest,
  ): WorkOrderHistoryModel {
    return WorkOrderHistoryModel.create({
      workOrderHistoryId: 0,
      workOrderId: request.workOrderId,
      statusId: request.statusId,
      changeDate: request.changeDate || new Date(),
      userId: request.userId,
      changeDescription: request.changeDescription,
      cadastralKey: request.cadastralKey,
      orderCode: request.orderCode,
    });
  }

  static fromUpdateWorkOrderHistoryRequestToWorkOrderHistoryModel(
    request: Partial<UpdateWorkOrderHistoryRequest>,
  ): Partial<WorkOrderHistoryModel> {
    const workOrderHistoryModel: Partial<WorkOrderHistoryModel> = {};

    if (request.statusId !== undefined) {
      workOrderHistoryModel['statusId'] = request.statusId;
    }
    if (request.changeDate !== undefined) {
      workOrderHistoryModel['changeDate'] = request.changeDate;
    }
    if (request.userId !== undefined) {
      workOrderHistoryModel['userId'] = request.userId;
    }
    if (request.changeDescription !== undefined) {
      workOrderHistoryModel['changeDescription'] = request.changeDescription;
    }
    if (request.cadastralKey !== undefined) {
      workOrderHistoryModel['cadastralKey'] = request.cadastralKey;
    }
    if (request.orderCode !== undefined) {
      workOrderHistoryModel['orderCode'] = request.orderCode;
    }

    return workOrderHistoryModel;
  }

  static fromWorkOrderHistoryModelToWorkOrderHistoryResponse(
    model: WorkOrderHistoryModel,
  ): WorkOrderHistoryResponse {
    return {
      workOrderHistoryId: model.workOrderHistoryId,
      workOrderId: model.workOrderId,
      statusId: model.statusId,
      changeDate: model.changeDate,
      userId: model.userId,
      changeDescription: model.changeDescription,
      cadastralKey: model.cadastralKey,
      orderCode: model.orderCode,
    };
  }
}
