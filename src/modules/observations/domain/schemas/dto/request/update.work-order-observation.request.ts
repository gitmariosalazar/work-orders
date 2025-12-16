export class UpdateWorkOrderObservationRequest {
  workOrderId: string;
  description: string;
  workerId: number;

  constructor(workOrderId: string, description: string, workerId: number) {
    this.workOrderId = workOrderId;
    this.description = description;
    this.workerId = workerId;
  }
}
