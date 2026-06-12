export class WorkOrderObservationModel {
  private observationId: string;
  private workOrderId: string;
  private description: string;
  private workerId: string;
  private createdAt?: Date;

  constructor(
    observationId: string,
    workOrderId: string,
    description: string,
    workerId: string,
    createdAt?: Date,
  ) {
    this.observationId = observationId;
    this.workOrderId = workOrderId;
    this.description = description;
    this.workerId = workerId;
    this.createdAt = createdAt;
  }

  getObservationId(): string {
    return this.observationId;
  }

  getWorkOrderId(): string {
    return this.workOrderId;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getWorkerId(): string {
    return this.workerId;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  setWorkerId(workerId: string): void {
    this.workerId = workerId;
  }

  setWorkOrderId(workOrderId: string): void {
    this.workOrderId = workOrderId;
  }

  toJSON() {
    return {
      observationId: this.observationId,
      workOrderId: this.workOrderId,
      description: this.description,
      workerId: this.workerId,
      createdAt: this.createdAt,
    };
  }
}
