export class UpdateWorkOrderHistoryRequest {
  userId: number;
  statusId?: number;
  changeDate?: Date;
  changeDescription?: string;
  cadastralKey?: string;
  orderCode?: string;

  constructor(
    userId: number,
    statusId?: number,
    changeDate?: Date,
    changeDescription?: string,
    cadastralKey?: string,
    orderCode?: string,
  ) {
    this.statusId = statusId;
    this.changeDate = changeDate || new Date();
    this.userId = userId;
    this.changeDescription = changeDescription;
    this.cadastralKey = cadastralKey;
    this.orderCode = orderCode;
  }
}
