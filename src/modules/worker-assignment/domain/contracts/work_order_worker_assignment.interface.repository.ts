import { WorkOrderWorkerAssignmentResponse } from '../schemas/dto/response/work-order-worker-assignment.response';
import { WorkOrderWorkerAssignmentModel } from '../schemas/models/work-order-worker-assignment.model';

export interface InterfaceWorkOrderWorkerAssignmentRepository {
  addWorkerAssignmentToWorkOrderList(
    workerAssignmentList: WorkOrderWorkerAssignmentModel[],
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null>;
  findWorkerAssignmentsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null>;
  findWorkerAssignmentByWorkerId(
    workerId: number,
  ): Promise<WorkOrderWorkerAssignmentResponse | null>;
}
