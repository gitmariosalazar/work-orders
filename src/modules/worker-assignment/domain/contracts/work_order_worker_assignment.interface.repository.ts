import { WorkOrderWorkerAssignmentResponse } from '../schemas/dto/response/work-order-worker-assignment.response';
import { WorkOrderWorkerAssignmentModel } from '../schemas/models/work-order-worker-assignment.model';
import { UserParams } from '../../../../shared/policies/work-order-user.policy';

export interface InterfaceWorkOrderWorkerAssignmentRepository {
  addWorkerAssignmentToWorkOrderList(
    workerAssignmentList: WorkOrderWorkerAssignmentModel[],
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
