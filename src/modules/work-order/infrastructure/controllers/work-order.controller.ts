import { Controller } from '@nestjs/common';
import { WorkOrderService } from '../../application/services/work-order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateWorkOrderRequest } from '../../domain/schemas/dto/request/create.work-order.request';
import { UpdateWorkOrderRequest } from '../../domain/schemas/dto/request/update.work-order.request';

@Controller('work-orders')
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @MessagePattern('work-orders.create-work-order')
  async createWorkOrder(workOrder: CreateWorkOrderRequest) {
    return this.workOrderService.createWorkOrder(workOrder);
  }

  @MessagePattern('work-orders.update-work-order')
  async updateWorkOrder(data: {
    orderCode: string;
    workOrder: UpdateWorkOrderRequest;
  }) {
    const { orderCode, workOrder } = data;
    return this.workOrderService.updateWorkOrder(orderCode, workOrder);
  }

  @MessagePattern('work-orders.get-work-order-by-order-code')
  async getWorkOrderById(orderCode: string) {
    return this.workOrderService.getWorkOrderById(orderCode);
  }

  @MessagePattern('work-orders.get-work-orders-by-client-id')
  async getWorkOrdersByClientId(clientId: string) {
    return this.workOrderService.getWorkOrdersByClientId(clientId);
  }

  @MessagePattern('work-orders.get-all-work-orders')
  async getAllWorkOrders(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getAllWorkOrders(limit, offset);
  }

  @MessagePattern('work-orders.get-all-work-orders-full-details')
  async getAllWorkOrdersFullDetails(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getAllWorkOrdersFullDetails(limit, offset);
  }

  @MessagePattern('work-orders.get-work-order-statistics')
  async getWorkOrderStatistics(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getWorkOrderStatistics(limit, offset);
  }

  @MessagePattern('work-orders.get-work-order-assignments')
  async getWorkOrderAssignments(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getWorkOrderAssignments(limit, offset);
  }

  @MessagePattern('work-orders.get-work-order-materials')
  async getWorkOrderMaterials(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getWorkOrderMaterials(limit, offset);
  }

  @MessagePattern('work-orders.get-work-order-observations')
  async getWorkOrderObservations(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getWorkOrderObservations(limit, offset);
  }

  @MessagePattern('work-orders.get-work-order-attachments')
  async getWorkOrderAttachments(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getWorkOrderAttachments(limit, offset);
  }

  @MessagePattern('work-orders.get-work-orders-by-client')
  async getWorkOrdersByClient(
    @Payload() data: { limit?: number; offset?: number },
  ) {
    const { limit, offset } = data;
    return this.workOrderService.getWorkOrdersByClient(limit, offset);
  }

  @MessagePattern('work-orders.find-work-orders-full-details-by-order-code')
  async findWorkOrdersFullDetailsByOrderCode(orderCode: string) {
    return this.workOrderService.findWorkOrdersFullDetailsByOrderCode(
      orderCode,
    );
  }

  @MessagePattern('work-orders.get-work-order-priority-statistics')
  async getWorkOrderPriorityStatistics() {
    return this.workOrderService.getWorkOrderPriorityStatistics();
  }

  @MessagePattern('work-orders.get-work-order-status-statistics')
  async getWorkOrderStatusStatistics() {
    return this.workOrderService.getWorkOrderStatusStatistics();
  }

  @MessagePattern('work-orders.get-work-order-type-statistics')
  async getWorkOrderTypeStatistics() {
    return this.workOrderService.getWorkOrderTypeStatistics();
  }

  @MessagePattern('work-orders.get-work-orders-statistics-key')
  async getWorkOrdersStatisticsKey() {
    return this.workOrderService.getWorkOrdersStatisticsKey();
  }
}
