export class UpdateWorkOrderAttachmentsRequest {
  workOrderId: string;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;

  constructor(
    workOrderId: string,
    fileName?: string,
    fileType?: string,
    fileUrl?: string,
  ) {
    this.workOrderId = workOrderId;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileUrl = fileUrl;
  }
}
