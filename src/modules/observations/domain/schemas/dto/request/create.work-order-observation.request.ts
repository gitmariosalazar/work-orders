export class CreateWorkOrderObservationRequest {
  workOrderId: string;
  description: string;
  workerId: string;

  constructor(workOrderId: string, description: string, workerId: string) {
    this.workOrderId = workOrderId;
    this.description = description;
    this.workerId = workerId;
  }
}
