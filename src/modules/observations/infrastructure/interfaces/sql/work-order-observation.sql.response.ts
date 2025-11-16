export interface WorkOrderObservationSQLResponse {
  workOrderObservationId?: number;
  workOrderId: number;
  observationId: number;
  observationTitle: string;
  observationDetails: string;
  registerDate?: Date;
}

export interface ObservationSQLResult {
  observationId: number
  observationTitle: string;
  observationDetails: string;
}