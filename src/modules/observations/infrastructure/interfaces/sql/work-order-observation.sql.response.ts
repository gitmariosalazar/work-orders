export interface WorkOrderObservationSQLResponse {
  observation_id: string;
  work_order_id: string;
  description: string;
  worker_id: string;
  created_at?: Date;
}
