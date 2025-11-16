export class CreateWorkOrderObservationRequest {
  workOrderId: number;
  observationTitle: string;
  observationDetails: string;

  constructor(
    workOrderId: number,
    observationTitle: string,
    observationDetails: string,
  ) {
    this.workOrderId = workOrderId;
    this.observationTitle = observationTitle;
    this.observationDetails = observationDetails;
  }
}