export interface WorkOrderObservationResponse {
  workOrderObservationId?: number;
  workOrderId: number;
  observationId: number;
  observationTitle: string;
  observationDetails: string;
  registerDate?: Date;
}