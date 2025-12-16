export class WorkOrderAttachmentModel {
  attachmentId: number;
  workOrderId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadDate: Date;

  constructor(
    attachmentId: number,
    workOrderId: string,
    fileName: string,
    fileType: string,
    fileUrl: string,
    uploadDate: Date,
  ) {
    this.attachmentId = attachmentId;
    this.workOrderId = workOrderId;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileUrl = fileUrl;
    this.uploadDate = uploadDate;
  }

  getAttachmentId(): number {
    return this.attachmentId;
  }

  getWorkOrderId(): string {
    return this.workOrderId;
  }

  getFileName(): string {
    return this.fileName;
  }

  getFileType(): string {
    return this.fileType;
  }

  getFileUrl(): string {
    return this.fileUrl;
  }

  getUploadDate(): Date {
    return this.uploadDate;
  }

  setFileUrl(fileUrl: string): void {
    this.fileUrl = fileUrl;
  }

  setUploadDate(uploadDate: Date): void {
    this.uploadDate = uploadDate;
  }

  setFileName(fileName: string): void {
    this.fileName = fileName;
  }

  setFileType(fileType: string): void {
    this.fileType = fileType;
  }

  setWorkOrderId(workOrderId: string): void {
    this.workOrderId = workOrderId;
  }

  setAttachmentId(attachmentId: number): void {
    this.attachmentId = attachmentId;
  }

  toJSON(): object {
    return {
      attachmentId: this.attachmentId,
      workOrderId: this.workOrderId,
      fileName: this.fileName,
      fileType: this.fileType,
      fileUrl: this.fileUrl,
      uploadDate: this.uploadDate,
    };
  }
}
