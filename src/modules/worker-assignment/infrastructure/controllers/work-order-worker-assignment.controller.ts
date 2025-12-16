import { Controller } from '@nestjs/common';
import { WorkOrderWorkerAssignmentService } from '../../application/services/work-order-worker-assignment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWorkOrderWorkerAssignmentRequest } from '../../domain/schemas/dto/request/create-work-order-worker-assignment.request';

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
  async findWorkerAssignmentByWorkerId(@Payload() workerId: number) {
    return this.workOrderWorkerAssignmentService.findWorkerAssignmentByWorkerId(
      workerId,
    );
  }

  @MessagePattern('assignment-worker.find_worker_assignments_by_work_order_id')
  async findWorkerAssignmentsByWorkOrderId(@Payload() workOrderId: string) {
    return this.workOrderWorkerAssignmentService.findWorkerAssignmentsByWorkOrderId(
      workOrderId,
    );
  }
}
