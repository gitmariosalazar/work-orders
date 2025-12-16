export interface WorkOrderWorkerAssignmentSqlResponse {
  assignment_id: number;
  work_order_id: string;
  worker_id: number;
  rol_id: number;
  assigned_date: Date;
}
