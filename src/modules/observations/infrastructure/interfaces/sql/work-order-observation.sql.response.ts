import { UUID } from 'crypto';

export interface WorkOrderObservationSQLResponse {
  observation_id: number;
  work_order_id: UUID;
  description: string;
  worker_id: number;
  created_at?: Date;
}
