export class WorkOrderWorkerAssignmentModel {
  private assignmentId: number;
  private workOrderId: string;
  private workerId: number;
  private rolId: number;
  private assignedDate: Date;

  constructor(
    assignmentId: number,
    workOrderId: string,
    workerId: number,
    rolId: number,
    assignedDate: Date,
  ) {
    this.assignmentId = assignmentId;
    this.workOrderId = workOrderId;
    this.workerId = workerId;
    this.rolId = rolId;
    this.assignedDate = assignedDate;
  }

  getAssignmentId(): number {
    return this.assignmentId;
  }

  getWorkOrderId(): string {
    return this.workOrderId;
  }

  getWorkerId(): number {
    return this.workerId;
  }

  getRolId(): number {
    return this.rolId;
  }

  getAssignedDate(): Date {
    return this.assignedDate;
  }

  setAssignedDate(assignedDate: Date): void {
    this.assignedDate = assignedDate;
  }

  setRolId(rolId: number): void {
    this.rolId = rolId;
  }

  setWorkerId(workerId: number): void {
    this.workerId = workerId;
  }

  setWorkOrderId(workOrderId: string): void {
    this.workOrderId = workOrderId;
  }

  setAssignmentId(assignmentId: number): void {
    this.assignmentId = assignmentId;
  }

  toJSON() {
    return {
      assignmentId: this.assignmentId,
      workOrderId: this.workOrderId,
      workerId: this.workerId,
      rolId: this.rolId,
      assignedDate: this.assignedDate,
    };
  }
}
