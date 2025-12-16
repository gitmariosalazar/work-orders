import { WorkOrderAttachmentsResponse } from '../../../../domain/schemas/dto/response/work-order-attachments.response';
import { WorkOrderAttachmentsSqlResponse } from '../../../interfaces/sql/work-order-attachments.sql.response';

export class WorkOrderAttachmentAdapter {
  static fromWorkOrderAttachmentsSqlResponseToWorkOrderAttachmentsResponse(
    sqlResponse: WorkOrderAttachmentsSqlResponse,
  ): WorkOrderAttachmentsResponse {
    return {
      attachmentId: sqlResponse.attachment_id,
      workOrderId: sqlResponse.work_order_id,
      fileName: sqlResponse.file_name,
      fileType: sqlResponse.file_type,
      fileUrl: sqlResponse.file_url,
      uploadDate: sqlResponse.upload_date,
    };
  }

  static fromWorkOrderAttachmentsSqlResponsesToWorkOrderAttachmentsResponsesList(
    sqlResponses: WorkOrderAttachmentsSqlResponse[],
  ): WorkOrderAttachmentsResponse[] {
    return sqlResponses.map((sqlResponse) =>
      this.fromWorkOrderAttachmentsSqlResponseToWorkOrderAttachmentsResponse(
        sqlResponse,
      ),
    );
  }
}
