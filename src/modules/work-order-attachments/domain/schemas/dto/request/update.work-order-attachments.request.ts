export class UpdateWorkOrderAttachmentsRequest {
  workOrderId: number;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;

  constructor(
    workOrderId: number,
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
