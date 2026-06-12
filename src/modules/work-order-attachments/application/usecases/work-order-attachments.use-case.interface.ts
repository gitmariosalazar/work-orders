import { CreateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/create.work-order-attachments.request';
import { UpdateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/update.work-order-attachments.request';
import { WorkOrderAttachmentsResponse } from '../../domain/schemas/dto/response/work-order-attachments.response';

export interface InterfaceWorkOrderAttachmentsUseCase {
  addWorkOrderAttachment(
    attachment: CreateWorkOrderAttachmentsRequest,
  ): Promise<WorkOrderAttachmentsResponse | null>;

  getWorkOrderAttachmentById(
    attachmentId: string,
  ): Promise<WorkOrderAttachmentsResponse | null>;

  updateWorkOrderAttachment(
    attachmentId: string,
    attachment: UpdateWorkOrderAttachmentsRequest,
  ): Promise<WorkOrderAttachmentsResponse | null>;
  deleteWorkOrderAttachment(attachmentId: string): Promise<boolean>;

  findAttachmentsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderAttachmentsResponse[]>;

  findAllAttachments(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderAttachmentsResponse[]>;
}
