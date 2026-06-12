export interface WorkOrderSQLResponse {
  work_order_id: string;
  order_code: string;
  work_type_id: number;
  priority_id: number;
  client_id?: string;
  creation_date?: Date;
  assignation_date?: Date;
  completion_date?: Date;
  status: string;
  description?: string;
  location?: string;
  created_user_id?: string;
  assigned_user_id?: string;
  completed_user_id?: string;
  coordinates?: string;
  metadata?: string;
  cadastral_key?: string;
  is_deleted?: boolean;
}
