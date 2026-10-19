import { Inject, Injectable } from '@nestjs/common';
import { InterfaceWorkOrderAttachmentsPort } from '../../application/ports/work-order-attachments.port';
import { InterfaceWorkOrderAttachmentsUseCase } from '../../../work-order-attachments/application/usecases/work-order-attachments.use-case.interface';
import { WorkOrderAttachmentFileRequest } from '../../../work-order-attachments/domain/schemas/dto/request/work-order-attachment-file.request';

const INITIAL_REPORT_STAGE = 'REPORTE_INICIAL';
const IMAGE_ATTACHMENT_TYPE = 'IMAGEN';
const DEFAULT_IMAGE_NAME = 'imagen';
const MAX_FILE_NAME_LENGTH = 255;

@Injectable()
export class WorkOrderAttachmentsGateway implements InterfaceWorkOrderAttachmentsPort {
  constructor(
    @Inject('WorkOrderAttachmentsUseCase')
    private readonly attachmentsUseCase: InterfaceWorkOrderAttachmentsUseCase,
  ) {}

  async attachImages(workOrderId: string, images: string[]): Promise<void> {
    const files: WorkOrderAttachmentFileRequest[] = images.map((url) => ({
      fileName: this.extractFileName(url),
      fileType: IMAGE_ATTACHMENT_TYPE,
      fileUrl: url,
      evidenceStageCode: INITIAL_REPORT_STAGE,
    }));

    await this.attachmentsUseCase.addWorkOrderAttachments(workOrderId, files);
  }

  private extractFileName(url: string): string {
    const withoutQuery = (url ?? '').split(/[?#]/)[0];
    const lastSegment = withoutQuery.split('/').filter(Boolean).pop();
    return (lastSegment ?? DEFAULT_IMAGE_NAME).slice(0, MAX_FILE_NAME_LENGTH);
  }
}
