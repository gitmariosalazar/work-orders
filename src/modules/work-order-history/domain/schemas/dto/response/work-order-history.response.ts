export interface WorkOrderHistoryResponse {
  workOrderHistoryId?: number;
  workOrderId: number;
  statusId?: number;
  changeDate: Date;
  userId: number;
  changeDescription?: string;
  cadastralKey?: string;
  orderCode?: string;
}
