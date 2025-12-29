export class WorkOrdersStatisticsKeySqlResponse {
  total_orders: number;
  status_id: number;
  status_name: string;
  work_type_id: number;
  work_type: string;
  department_id: number;
  department_name: string;
  emergency: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  critical_orders: number;
  created_today: number;
  created_last_7_days: number;
  created_this_month: number;
  closed: number;
  completed: number;
  avg_hours_to_complete: number | null;
  avg_hours_to_assignment: number | null;
  avg_hours_to_execution: number | null;
  pct_completed_in_group: number;
  pct_pending_or_assigned: number;
  total_material_cost: number;
  avg_workers_per_order: number | null;
  total_worker_assignments: number | null;
}
