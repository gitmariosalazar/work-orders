export class UpdateWorkOrderObservationRequest {
  workOrderId?: number;
  observationId?: number;

  constructor(
    workOrderId?: number,
    observationId?: number,
  ) {
    this.workOrderId = workOrderId;
    this.observationId = observationId;
  }
}