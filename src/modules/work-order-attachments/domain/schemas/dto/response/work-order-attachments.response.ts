export interface WorkOrderAttachmentsResponse {
  attachmentId: number;
  workOrderId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadDate: Date;
}
