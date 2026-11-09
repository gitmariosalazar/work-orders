import { Controller } from '@nestjs/common';
import { WorkOrderWorkerAssignmentService } from '../../application/services/work-order-worker-assignment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWorkOrderWorkerAssignmentRequest } from '../../domain/schemas/dto/request/create-work-order-worker-assignment.request';
import { UserParams } from '../../../../shared/policies/work-order-user.policy';

@Controller('work-order-worker-assignment')
export class WorkOrderWorkerAssignmentController {
  constructor(
    private readonly workOrderWorkerAssignmentService: WorkOrderWorkerAssignmentService,
  ) {}

  @MessagePattern('assignment-worker.add_worker_assignment_to_work_order_list')
  async addWorkerAssignmentToWorkOrderList(
    @Payload()
    workerAssignmentList: CreateWorkOrderWorkerAssignmentRequest[],
  ) {
    return this.workOrderWorkerAssignmentService.addWorkerAssignmentToWorkOrderList(
      workerAssignmentList,
    );
  }

  @MessagePattern('assignment-worker.find_worker_assignment_by_worker_id')
  async findWorkerAssignmentByWorkerId(
    @Payload()
    payload: number | string | { workerId: number | string; user?: UserParams },
  ) {
    const workerId =
      typeof payload === 'object' && payload !== null && 'workerId' in payload
        ? payload.workerId
        : (payload as number | string);
    const user =
      typeof payload === 'object' && payload !== null && 'user' in payload
        ? payload.user
        : undefined;

    return this.workOrderWorkerAssignmentService.findWorkerAssignmentByWorkerId(
      workerId,
      user,
    );
  }

  @MessagePattern('assignment-worker.find_worker_assignments_by_work_order_id')
  async findWorkerAssignmentsByWorkOrderId(
    @Payload()
    payload: string | { workOrderId: string; user?: UserParams },
  ) {
    const workOrderId =
      typeof payload === 'object' && payload !== null && 'workOrderId' in payload
        ? payload.workOrderId
        : (payload as string);
    const user =
      typeof payload === 'object' && payload !== null && 'user' in payload
        ? payload.user
        : undefined;

    return this.workOrderWorkerAssignmentService.findWorkerAssignmentsByWorkOrderId(
      workOrderId,
      user,
    );
  }
}
