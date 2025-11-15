export class UpdateWorkOrderHistoryRequest {
  workOrderId?: number;
  changeDate?: Date;
  previousStatusId?: number;
  newStatusId?: number;
  userId?: number;
  changeDescription?: string;

  constructor(
    workOrderId?: number,
    changeDate?: Date,
    userId?: number,
    previousStatusId?: number,
    newStatusId?: number,
    changeDescription?: string,
  ) {
    if (workOrderId) this.workOrderId = workOrderId;
    if (changeDate) this.changeDate = changeDate;
    if (userId) this.userId = userId;
    if (previousStatusId) this.previousStatusId = previousStatusId;
    if (newStatusId) this.newStatusId = newStatusId;
    if (changeDescription) this.changeDescription = changeDescription;
  }
}