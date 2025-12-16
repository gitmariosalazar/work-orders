import { CreateWorkOrderWorkerAssignmentRequest } from '../../domain/schemas/dto/request/create-work-order-worker-assignment.request';
import { WorkOrderWorkerAssignmentResponse } from '../../domain/schemas/dto/response/work-order-worker-assignment.response';

export interface InterfaceWorkOrderWorkerAssignmentUseCase {
  addWorkerAssignmentToWorkOrderList(
    workerAssignmentList: CreateWorkOrderWorkerAssignmentRequest[],
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null>;
  findWorkerAssignmentsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null>;
  findWorkerAssignmentByWorkerId(
    workerId: number,
  ): Promise<WorkOrderWorkerAssignmentResponse | null>;
}
