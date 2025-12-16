export interface ViewWorkOrderStatisticsSqlResponse {
  work_type: string;
  priority: string;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  avg_completion_time_hours: number | null;
}

export interface ViewWorkOrderAssignmentsSqlResponse {
  work_order_id: string;
  work_order_code: string;
  worker_id: number;
  worker_role: string;
  assignment_date: string; // ISO date string
}

export interface ViewWorkOrderMaterialsSqlResponse {
  work_order_id: string;
  work_order_code: string;
  material_id: number;
  quantity: number;
  unit_cost: string; // Decimal as string
  subtotal_cost: string; // Decimal as string
}

export interface ViewWorkOrderObservationsSqlResponse {
  work_order_id: string;
  work_order_code: string;
  observation_text: string;
  observation_date: string; // ISO date string
  observer_worker_id: number | null;
}

export interface ViewWorkOrderAttachmentsSqlResponse {
  work_order_id: string;
  work_order_code: string;
  file_name: string;
  file_type: string;
  file_url: string;
  upload_date: string; // ISO date string
}

export interface ViewWorkOrdersByClientSqlResponse {
  client_id: string;
  total_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

export interface ViewAllWorkOrdersFullDetailsSqlResponse {
  work_order_id: string;
  work_order_code: string;
  cadastral_key: string;
  work_order_description: string;
  work_order_location: string;
  coordinates_wkt: string;
  longitude: number;
  latitude: number;
  work_type: string;
  department: string;
  priority: string;
  current_state: string;
  client_id: string;
  created_by_user_id: number;
  assigned_to_user_id: number | null;
  completed_by_user_id: number | null;
  creation_date: string; // ISO date string
  assignment_date: string | null; // ISO date string
  completion_date: string | null; // ISO date string
  management_attachments: Array<{
    file_name: string;
    file_type: string;
    file_url: string;
    upload_date: string; // ISO date string
  }>;
  materials_used: Array<{
    material_id: number;
    quantity: number;
    unit_cost: string; // Decimal as string
    subtotal_cost: string; // Decimal as string
  }>;
  observations_made: Array<{
    observation_text: string;
    observation_date: string; // ISO date string
    observer_worker_id: number | null;
  }>;
  assigned_workers: Array<{
    worker_id: number;
    worker_role: string;
    assignment_date: string; // ISO date string
  }>;
}
