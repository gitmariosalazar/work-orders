export interface WorkOrderObservationResponse {
  observationId: number;
  workOrderId: string;
  description: string;
  workerId: number;
  createdAt?: Date;
}
