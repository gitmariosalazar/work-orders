export class CreateWorkHistoryRequest {
  workOrderId: number;
  changeDate: Date;
  previousStatusId?: number;
  newStatusId?: number;
  userId: number;
  changeDescription?: string;

  constructor(
    workOrderId: number,
    changeDate: Date,
    userId: number,
    previousStatusId?: number,
    newStatusId?: number,
    changeDescription?: string,
  ) {
    this.workOrderId = workOrderId;
    this.changeDate = changeDate;
    this.userId = userId;
    if (previousStatusId) this.previousStatusId = previousStatusId;
    if (newStatusId) this.newStatusId = newStatusId;
    if (changeDescription) this.changeDescription = changeDescription;
  }
}