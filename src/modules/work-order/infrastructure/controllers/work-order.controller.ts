import { Controller } from "@nestjs/common";
import { WorkOrderService } from "../../application/services/work-order.service";
import { MessagePattern } from "@nestjs/microservices";
import { CreateWorkOrderRequest } from "../../domain/schemas/dto/request/create.work-order.request";
import { UpdateWorkOrderRequest } from "../../domain/schemas/dto/request/update.work-order.request";

@Controller('work-orders')
export class WorkOrderController {
  constructor(
    private readonly workOrderService: WorkOrderService,
  ) { }

  @MessagePattern('work-orders.create-work-order')
  async createWorkOrder(workOrder: CreateWorkOrderRequest) {
    return this.workOrderService.createWorkOrder(workOrder);
  }

  @MessagePattern('work-orders.update-work-order')
  async updateWorkOrder(data: { workOrderId: number; workOrder: UpdateWorkOrderRequest }) {
    const { workOrderId, workOrder } = data;
    return this.workOrderService.updateWorkOrder(workOrderId, workOrder);
  }

  @MessagePattern('work-orders.get-work-order-by-id')
  async getWorkOrderById(workOrderId: number) {
    return this.workOrderService.getWorkOrderById(workOrderId);
  }

  @MessagePattern('work-orders.get-work-orders-by-client-id')
  async getWorkOrdersByClientId(clientId: string) {
    return this.workOrderService.getWorkOrdersByClientId(clientId);
  }

  @MessagePattern('work-orders.get-all-work-orders')
  async getAllWorkOrders() {
    return this.workOrderService.getAllWorkOrders();
  }
}