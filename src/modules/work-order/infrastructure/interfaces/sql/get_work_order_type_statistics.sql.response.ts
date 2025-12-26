export interface GetWorkOrderTypeStatisticsSqlResponse {
  work_type: string;
  work_type_id: number;
  quantity: number;
  completed: number;
  completion_rate_percentage: number;
}
