import { CreateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/create.work-order-attachments.request';
import { WorkOrderAttachmentFileRequest } from '../../domain/schemas/dto/request/work-order-attachment-file.request';
import { UpdateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/update.work-order-attachments.request';
import { WorkOrderAttachmentsResponse } from '../../domain/schemas/dto/response/work-order-attachments.response';
import { WorkOrderAttachmentModel } from '../../domain/schemas/models/work-order-attachments.model';

export class WorkOrderAttachmentMapper {
  static fromCreateRequestToModel(
    request: CreateWorkOrderAttachmentsRequest,
  ): WorkOrderAttachmentModel {
    return new WorkOrderAttachmentModel(
      '',
      request.workOrderId,
      request.fileName,
      request.fileType,
      request.fileUrl,
      request.evidenceStageCode,
      new Date(),
    );
  }

  static fromFileRequestToModel(
    workOrderId: string,
    file: WorkOrderAttachmentFileRequest,
  ): WorkOrderAttachmentModel {
    return new WorkOrderAttachmentModel(
      '',
      workOrderId,
      file.fileName,
      file.fileType,
      file.fileUrl,
      file.evidenceStageCode,
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
    if (request.fileType) {
      existingModel.setFileType(request.fileType);
    }
    if (request.fileUrl) {
      existingModel.setFileUrl(request.fileUrl);
    }
    if (request.evidenceStageCode) {
      existingModel.setEvidenceStageCode(request.evidenceStageCode);
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
      evidenceStageCode: model.getEvidenceStageCode(),
      uploadDate: model.getUploadDate(),
    };
  }
}
