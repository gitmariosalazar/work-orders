import { Controller } from '@nestjs/common';
import { WorkOrderAttachmentsService } from '../../application/services/work-order-attachments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/create.work-order-attachments.request';
import { UpdateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/update.work-order-attachments.request';

@Controller('work-order-attachments')
export class WorkOrderAttachmentsController {
  constructor(
    private readonly workOrderAttachmentsService: WorkOrderAttachmentsService,
  ) {}

  @MessagePattern('work-order-attachments.add_work_order_attachment')
  async addWorkOrderAttachment(
    @Payload() attachment: CreateWorkOrderAttachmentsRequest,
  ) {
    return this.workOrderAttachmentsService.addWorkOrderAttachment(attachment);
  }

  @MessagePattern('work-order-attachments.find_all_attachments')
  async findAllAttachments() {
    return this.workOrderAttachmentsService.findAllAttachments();
  }

  @MessagePattern('work-order-attachments.get_work_order_attachment_by_id')
  async getWorkOrderAttachmentById(@Payload() attachmentId: number) {
    return this.workOrderAttachmentsService.getWorkOrderAttachmentById(
      attachmentId,
    );
  }

  @MessagePattern('work-order-attachments.delete_work_order_attachment')
  async deleteWorkOrderAttachment(@Payload() attachmentId: number) {
    return this.workOrderAttachmentsService.deleteWorkOrderAttachment(
      attachmentId,
    );
  }

  @MessagePattern('work-order-attachments.update_work_order_attachment')
  async updateWorkOrderAttachment(
    @Payload()
    data: {
      attachmentId: number;
      attachment: UpdateWorkOrderAttachmentsRequest;
    },
  ) {
    const { attachmentId, attachment } = data;
    return this.workOrderAttachmentsService.updateWorkOrderAttachment(
      attachmentId,
      attachment,
    );
  }

  @MessagePattern('work-order-attachments.find_attachments_by_work_order_id')
  async findAttachmentsByWorkOrderId(@Payload() workOrderId: string) {
    return this.workOrderAttachmentsService.findAttachmentsByWorkOrderId(
      workOrderId,
    );
  }
}
