import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices/decorators/message-pattern.decorator";
import { WorkOrderObservationService } from "../../application/services/work-order-observation.service";
import { CreateWorkOrderObservationRequest } from "../../domain/schemas/dto/request/create.work-order-observation.request";
import { UpdateWorkOrderObservationRequest } from "../../domain/schemas/dto/request/update.work-order-observation.request";
import { Payload } from "@nestjs/microservices";

@Controller('work-orders-observations')
export class WorkOrderObservationController {
  constructor(
    private readonly workOrderObservationService: WorkOrderObservationService,
  ) { }

  @MessagePattern('work-orders-observations.create-work-order-observation')
  async createWorkOrderObservation(@Payload() workOrderObservation: CreateWorkOrderObservationRequest) {
    return this.workOrderObservationService.createWorkOrderObservation(workOrderObservation);
  }

  @MessagePattern('work-orders-observations.update-work-order-observation')
  async updateWorkOrderObservation(@Payload() data: { workOrderObservationId: number; workOrderObservation: Partial<UpdateWorkOrderObservationRequest> }) {
    const { workOrderObservationId, workOrderObservation } = data;
    return this.workOrderObservationService.updateWorkOrderObservation(workOrderObservationId, workOrderObservation);
  }

  @MessagePattern('work-orders-observations.get-work-order-observation-by-id')
  async getWorkOrderObservationById(@Payload() workOrderObservationId: number) {
    return this.workOrderObservationService.getWorkOrderObservationById(workOrderObservationId);
  }

  @MessagePattern('work-orders-observations.get-work-order-observations-by-work-order-id')
  async getWorkOrderObservationsByWorkOrderId(@Payload() workOrderId: number) {
    return this.workOrderObservationService.getWorkOrderObservationsByWorkOrderId(workOrderId);
  }

  @MessagePattern('work-orders-observations.get-all-work-order-observations')
  async getAllWorkOrderObservations() {
    return this.workOrderObservationService.getAllWorkOrderObservations();
  }
}