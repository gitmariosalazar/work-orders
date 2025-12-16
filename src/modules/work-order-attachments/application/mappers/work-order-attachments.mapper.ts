import { CreateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/create.work-order-attachments.request';
import { UpdateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/update.work-order-attachments.request';
import { WorkOrderAttachmentsResponse } from '../../domain/schemas/dto/response/work-order-attachments.response';
import { WorkOrderAttachmentModel } from '../../domain/schemas/models/work-order-attachments.model';

export class WorkOrderAttachmentMapper {
  static fromCreateRequestToModel(
    request: CreateWorkOrderAttachmentsRequest,
  ): WorkOrderAttachmentModel {
    return new WorkOrderAttachmentModel(
      0,
      request.workOrderId,
      request.fileName,
      request.fileType,
      request.fileUrl,
      new Date(),
    );
  }

  static fromUpdateRequestToModel(
    existingModel: WorkOrderAttachmentModel,
    request: UpdateWorkOrderAttachmentsRequest,
  ): WorkOrderAttachmentModel {
    if (request.fileName) {
      existingModel.setFileName(request.fileName);
    }
    if (request.fileUrl) {
      existingModel.setFileUrl(request.fileUrl);
    }
    existingModel.setUploadDate(new Date());
    return existingModel;
  }

  static fromModelToResponse(
    model: WorkOrderAttachmentModel,
  ): WorkOrderAttachmentsResponse {
    return {
      attachmentId: model.getAttachmentId(),
      workOrderId: model.getWorkOrderId(),
      fileName: model.getFileName(),
      fileType: model.getFileType(),
      fileUrl: model.getFileUrl(),
      uploadDate: model.getUploadDate(),
    };
  }
}
