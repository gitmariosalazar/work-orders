export interface GetWorkOrderPriorityStatisticsSqlResponse {
  priority_level: string;
  priority_id: number;
  description: string;
  quantity: number;
  percentage_of_total: number;
}
