import { UUID } from 'crypto';

export interface WorkOrderSQLResponse {
  work_order_id: number;
  order_code: string;
  work_type_id: number;
  priority_id: number;
  client_id?: string;
  creation_date?: Date;
  assignation_date?: Date;
  completion_date?: Date;
  status: number;
  description?: string;
  location?: string;
  created_user_id?: UUID;
  assigned_user_id?: UUID;
  completed_user_id?: UUID;
  coordinates?: string;
  metadata?: string;
  cadastral_key?: string;
  is_deleted?: boolean;
}
