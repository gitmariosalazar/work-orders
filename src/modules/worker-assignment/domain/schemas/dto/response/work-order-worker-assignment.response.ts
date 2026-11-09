export interface WorkOrderWorkerAssignmentResponse {
  assignmentId: number | string;
  workOrderId: string;
  workerId: number | string;
  rolId: number;
  assignedDate: Date;
}
