export interface WorkOrderHistorySQLResponse {
  workOrderHistoryId?: number;
  workOrderId: number;
  changeDate: Date;
  previousStatusId?: number;
  newStatusId?: number;
  userId: number;
  changeDescription?: string;
}