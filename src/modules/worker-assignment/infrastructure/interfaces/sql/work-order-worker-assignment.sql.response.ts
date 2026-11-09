export interface WorkOrderWorkerAssignmentSqlResponse {
  assignment_id: number | string;
  work_order_id: string;
  worker_id: number | string;
  rol_id: number;
  assigned_date: Date;
}
