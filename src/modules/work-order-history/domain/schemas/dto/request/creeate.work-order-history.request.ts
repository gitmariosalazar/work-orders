export class CreateWorkHistoryRequest {
  workOrderId: number;
  statusId?: number;
  changeDate?: Date;
  userId: number;
  changeDescription?: string;
  cadastralKey?: string;
  orderCode?: string;

  constructor(
    workOrderId: number,
    userId: number,
    statusId?: number,
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
