export class WorkOrderObservationModel {
  private observationId: number;
  private workOrderId: string;
  private description: string;
  private workerId: number;
  private createdAt?: Date;

  constructor(
    observationId: number,
    workOrderId: string,
    description: string,
    workerId: number,
    createdAt?: Date,
  ) {
    this.observationId = observationId;
    this.workOrderId = workOrderId;
    this.description = description;
    this.workerId = workerId;
    this.createdAt = createdAt;
  }

  getObservationId(): number {
    return this.observationId;
  }

  getWorkOrderId(): string {
    console.log('Getting workOrderId:', this.workOrderId);
    return this.workOrderId;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getWorkerId(): number {
    return this.workerId;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  setWorkerId(workerId: number): void {
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
