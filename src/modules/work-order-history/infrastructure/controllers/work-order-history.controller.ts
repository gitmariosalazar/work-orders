import { Controller } from '@nestjs/common';
import { WorkOrderHistoryService } from '../../application/services/work-order-history.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { CreateWorkHistoryRequest } from '../../domain/schemas/dto/request/creeate.work-order-history.request';
import { UpdateWorkOrderHistoryRequest } from '../../domain/schemas/dto/request/update.work-order-history.request';
import { statusCode } from '../../../../settings/environments/status-code';
import { ViewWorkOrderHistoryResponse } from '../../domain/schemas/dto/response/view-work-order-history.response';
import { UserParams } from '../../../../shared/policies/work-order-user.policy';

@Controller('work-orders-history')
export class WorkOrderHistoryController {
  constructor(
    private readonly workOrderHistoryService: WorkOrderHistoryService,
  ) {}

  @MessagePattern('work-orders-histories.create-work-order-history')
  async createWorkOrderHistory(workOrderHistory: CreateWorkHistoryRequest) {
    return this.workOrderHistoryService.createWorkOrderHistory(
      workOrderHistory,
    );
  }

  @MessagePattern('work-orders-histories.update-work-order-history')
  async updateWorkOrderHistory(data: {
    workOrderHistoryId: number;
    workOrderHistory: UpdateWorkOrderHistoryRequest;
  }) {
    const { workOrderHistoryId, workOrderHistory } = data;
    return this.workOrderHistoryService.updateWorkOrderHistory(
      workOrderHistoryId,
      workOrderHistory,
    );
  }

  @MessagePattern('work-orders-histories.get-work-order-history-by-id')
  async getWorkOrderHistoryById(
    payload: number | { workOrderHistoryId: number; user?: UserParams },
  ) {
    const historyId =
      typeof payload === 'number' ? payload : payload.workOrderHistoryId;
    const user = typeof payload === 'object' ? payload.user : undefined;
    return this.workOrderHistoryService.getWorkOrderHistoryById(historyId, user);
  }

  @MessagePattern(
    'work-orders-histories.get-work-order-histories-by-work-order-id',
  )
  async getWorkOrderHistoriesByWorkOrderId(
    payload: string | { workOrderId: string; user?: UserParams },
  ) {
    const workOrderId =
      typeof payload === 'string' ? payload : payload.workOrderId;
    const user = typeof payload === 'object' ? payload.user : undefined;
    return this.workOrderHistoryService.getWorkOrderHistoriesByWorkOrderId(
      workOrderId,
      user,
    );
  }

  @MessagePattern('work-orders-histories.get-all-work-order-histories')
  async getAllWorkOrderHistories(payload?: { user?: UserParams }) {
    return this.workOrderHistoryService.getAllWorkOrderHistories(payload?.user);
  }

  @MessagePattern('work-orders-histories.find-all-view-histories-work-orders')
  async findAllViewHistoriesWorkOrders(pagination?: {
    limit?: number;
    offset?: number;
    user?: UserParams;
  }) {
    const safePagination = {
      limit: pagination?.limit ?? 100,
      offset: pagination?.offset ?? 0,
    };

    if (safePagination.limit < 1) safePagination.limit = 100;
    if (safePagination.offset < 0) safePagination.offset = 0;

    if (safePagination.limit > 1000) safePagination.limit = 1000;

    const response: ViewWorkOrderHistoryResponse[] =
      await this.workOrderHistoryService.findAllViewHistoriesWorkOrders(
        safePagination,
        pagination?.user,
      );
    return response;
  }

  @MessagePattern(
    'work-orders-histories.find-all-view-histories-work-orders-by-order-code',
  )
  async findAllViewHistoriesWorkOrdersByOrderCode(data: {
    orderCode: string;
    pagination?: { limit?: number; offset?: number };
    user?: UserParams;
  }) {
    const { orderCode, pagination, user } = data;

    if (
      !orderCode ||
      typeof orderCode !== 'string' ||
      orderCode.trim() === ''
    ) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Invalid orderCode parameter',
      });
    }

    const safePagination = {
      limit: pagination?.limit ?? 100,
      offset: pagination?.offset ?? 0,
    };

    if (safePagination.limit < 1) safePagination.limit = 100;
    if (safePagination.offset < 0) safePagination.offset = 0;

    if (safePagination.limit > 1000) safePagination.limit = 1000;

    return await this.workOrderHistoryService.findAllViewHistoriesWorkOrdersByOrderCode(
      orderCode.trim(),
      safePagination,
      user,
    );
  }
}
