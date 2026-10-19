export class CreateWorkOrderAttachmentsRequest {
  workOrderId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  evidenceStageCode: string;

  constructor(
    workOrderId: string,
    fileName: string,
    fileType: string,
    fileUrl: string,
    evidenceStageCode: string,
  ) {
    this.workOrderId = workOrderId;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileUrl = fileUrl;
    this.evidenceStageCode = evidenceStageCode;
  }
}
