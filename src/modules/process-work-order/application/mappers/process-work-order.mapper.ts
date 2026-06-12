import { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
import { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import { ProcessWorkOrderModel } from '../../domain/schemas/models/process-work-order.model';

export class ProcessWorkOrderMapper {
  static fromRequestToModel(
    request: ProcessWorkOrderRequest,
  ): ProcessWorkOrderModel {
    return ProcessWorkOrderModel.create({
      workOrderId: request.workOrderId.trim(),
      newStatus: request.newStatus.trim(),
      userId: request.userId.trim(),
      comment: request.comment?.trim() || undefined,
    });
  }

  static fromModelToResponse(
    model: ProcessWorkOrderModel,
  ): ProcessWorkOrderResponse {
    return {
      action: 'process_work_order',
      recordId: '',
      workOrderId: model.workOrderId,
      newStatus: model.newStatus,
      currentStatus: model.newStatus,
      createdByUserId: model.userId,
      processedByUserId: model.userId,
      comment: model.comment,
      processedAt: new Date(),
    };
  }
}
