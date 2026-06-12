import { WorkOrderAttachmentsResponse } from '../schemas/dto/response/work-order-attachments.response';
import { WorkOrderAttachmentModel } from '../schemas/models/work-order-attachments.model';

export interface InterfaceWorkOrderAttachmentsRepository {
  addWorkOrderAttachment(
    attachment: WorkOrderAttachmentModel,
  ): Promise<WorkOrderAttachmentsResponse | null>;

  getWorkOrderAttachmentById(
    attachmentId: string,
  ): Promise<WorkOrderAttachmentsResponse | null>;

  updateWorkOrderAttachment(
    attachmentId: string,
    attachment: WorkOrderAttachmentModel,
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
