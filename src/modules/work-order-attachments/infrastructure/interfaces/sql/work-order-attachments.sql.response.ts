export interface WorkOrderAttachmentsSqlResponse {
  attachment_id: string;
  work_order_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  upload_date: Date;
}
