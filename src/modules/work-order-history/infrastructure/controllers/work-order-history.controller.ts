import { Controller } from "@nestjs/common";
import { WorkOrderHistoryService } from "../../application/services/work-order-history.service";
import { MessagePattern } from "@nestjs/microservices";
import { CreateWorkHistoryRequest } from "../../domain/schemas/dto/request/creeate.work-order-history.request";
import { UpdateWorkOrderHistoryRequest } from "../../domain/schemas/dto/request/update.work-order-history.request";

@Controller('work-orders-history')
export class WorkOrderHistoryController {
  constructor(
    private readonly workOrderHistoryService: WorkOrderHistoryService,
  ) { }

  @MessagePattern('work-orders-histories.create-work-order-history')
  async createWorkOrderHistory(workOrderHistory: CreateWorkHistoryRequest) {
    return this.workOrderHistoryService.createWorkOrderHistory(workOrderHistory);
  }

  @MessagePattern('work-orders-histories.update-work-order-history')
  async updateWorkOrderHistory(data: { workOrderHistoryId: number; workOrderHistory: UpdateWorkOrderHistoryRequest }) {
    const { workOrderHistoryId, workOrderHistory } = data;
    return this.workOrderHistoryService.updateWorkOrderHistory(workOrderHistoryId, workOrderHistory);
  }

  @MessagePattern('work-orders-histories.get-work-order-history-by-id')
  async getWorkOrderHistoryById(workOrderHistoryId: number) {
    return this.workOrderHistoryService.getWorkOrderHistoryById(workOrderHistoryId);
  }

  @MessagePattern('work-orders-histories.get-work-order-histories-by-work-order-id')
  async getWorkOrderHistoriesByWorkOrderId(workOrderId: number) {
    return this.workOrderHistoryService.getWorkOrderHistoriesByWorkOrderId(workOrderId);
  }

  @MessagePattern('work-orders-histories.get-all-work-order-histories')
  async getAllWorkOrderHistories() {
    return this.workOrderHistoryService.getAllWorkOrderHistories();
  }
}