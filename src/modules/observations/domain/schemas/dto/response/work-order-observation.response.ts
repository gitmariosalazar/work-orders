export interface WorkOrderObservationResponse {
  observationId: string;
  workOrderId: string;
  description: string;
  workerId: string;
  createdAt?: Date;
}
