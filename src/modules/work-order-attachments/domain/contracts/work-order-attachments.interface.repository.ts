import { WorkOrderAttachmentsResponse } from '../schemas/dto/response/work-order-attachments.response';
import { WorkOrderAttachmentModel } from '../schemas/models/work-order-attachments.model';

export interface InterfaceWorkOrderAttachmentsRepository {
  addWorkOrderAttachment(
    attachment: WorkOrderAttachmentModel,
  ): Promise<WorkOrderAttachmentsResponse | null>;

  getWorkOrderAttachmentById(
    attachmentId: number,
  ): Promise<WorkOrderAttachmentsResponse | null>;

  updateWorkOrderAttachment(
    attachmentId: number,
    attachment: WorkOrderAttachmentModel,
  ): Promise<WorkOrderAttachmentsResponse | null>;
  deleteWorkOrderAttachment(attachmentId: number): Promise<boolean>;

  findAttachmentsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderAttachmentsResponse[]>;

  findAllAttachments(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderAttachmentsResponse[]>;
}
