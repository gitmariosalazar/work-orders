import { CreateWorkOrderWorkerAssignmentRequest } from '../../domain/schemas/dto/request/create-work-order-worker-assignment.request';
import { WorkOrderWorkerAssignmentResponse } from '../../domain/schemas/dto/response/work-order-worker-assignment.response';
import { UserParams } from '../../../../shared/policies/work-order-user.policy';

export interface InterfaceWorkOrderWorkerAssignmentUseCase {
  addWorkerAssignmentToWorkOrderList(
    workerAssignmentList: CreateWorkOrderWorkerAssignmentRequest[],
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null>;
  findWorkerAssignmentsByWorkOrderId(
    workOrderId: string,
    user?: UserParams,
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null>;
  findWorkerAssignmentByWorkerId(
    workerId: number | string,
    user?: UserParams,
  ): Promise<WorkOrderWorkerAssignmentResponse | null>;
}
