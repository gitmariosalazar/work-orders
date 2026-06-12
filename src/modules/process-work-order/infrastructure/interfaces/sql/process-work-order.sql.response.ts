export interface ProcessWorkOrderSqlResponse {
  process_id: number;
  work_order_id: string;
  order_code: string;
  cadastral_key?: string;
  previous_status?: string;
  previous_status_name?: string;
  new_status: string;
  new_status_name?: string;
  current_status: string;
  processed_by_user_id: string;
  comment?: string;
  processed_at: Date;
}
