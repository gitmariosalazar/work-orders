export interface GetWorkOrderTypeStatisticsResponse {
  workType: string;
  workTypeId: number;
  quantity: number;
  completed: number;
  completionRatePercentage: number;
}
