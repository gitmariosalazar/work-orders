export interface WorkOrderHistoryResponse {
  workOrderHistoryId?: number;
  workOrderId: string;
  statusId?: string;
  changeDate: Date;
  userId: string;
  changeDescription?: string;
  cadastralKey?: string;
  orderCode?: string;
}
