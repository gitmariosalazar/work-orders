export class CreateWorkHistoryRequest {
  workOrderId: string;
  statusId?: string;
  changeDate?: Date;
  userId: string;
  changeDescription?: string;
  cadastralKey?: string;
  orderCode?: string;

  constructor(
    workOrderId: string,
    userId: string,
    statusId?: string,
    changeDate?: Date,
    changeDescription?: string,
    cadastralKey?: string,
    orderCode?: string,
  ) {
    this.workOrderId = workOrderId;
    this.statusId = statusId;
    this.changeDate = changeDate || new Date();
    this.userId = userId;
    this.changeDescription = changeDescription;
    this.cadastralKey = cadastralKey;
    this.orderCode = orderCode;
  }
}
