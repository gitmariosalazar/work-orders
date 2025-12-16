export interface WorkOrderHistorySQLResponse {
  work_order_history_id: number;
  work_order_id: number;
  status_id?: number;
  change_date: Date;
  user_id: number;
  change_description?: string;
  cadastral_key?: string;
  order_code?: string;
}

export interface ViewWorkOrderHistorySqlResponse {
  work_order_id: string;
  work_order_code: string;
  cadastral_key: string;
  work_order_description: string | null;
  work_order_location: string | null;
  coordinates_wkt: string | null;
  longitude: number | null;
  latitude: number | null;
  work_type: string;
  department: string;
  priority: string;
  current_state: string;
  client_id: string;
  created_by_user_id: number | null;
  assigned_to_user_id: number | null;
  completed_by_user_id: number | null;
  creation_date: string;
  assignment_date: string | null;
  completion_date: string | null;
  historical_id: number;
  historical_state_id: number | null;
  historical_state_name?: string;
  state_change_date: string | null;
  state_change_user_id: number | null;
  change_description: string | null;
  change_number: number | null;
}
