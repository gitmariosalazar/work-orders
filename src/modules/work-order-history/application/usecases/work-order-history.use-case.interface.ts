import { CreateWorkHistoryRequest } from '../../domain/schemas/dto/request/creeate.work-order-history.request';
import { UpdateWorkOrderHistoryRequest } from '../../domain/schemas/dto/request/update.work-order-history.request';
import { ViewWorkOrderHistoryResponse } from '../../domain/schemas/dto/response/view-work-order-history.response';
import { WorkOrderHistoryResponse } from '../../domain/schemas/dto/response/work-order-history.response';

export interface InterfaceWorkOrderHistoryUseCase {
  createWorkOrderHistory(
    createWorkOrderHistoryRequest: CreateWorkHistoryRequest,
  ): Promise<WorkOrderHistoryResponse | null>;

  updateWorkOrderHistory(
    workOrderHistoryId: number,
    updateWorkOrderHistoryRequest: Partial<UpdateWorkOrderHistoryRequest>,
  ): Promise<WorkOrderHistoryResponse | null>;

  getWorkOrderHistoryById(
    workOrderHistoryId: number,
  ): Promise<WorkOrderHistoryResponse | null>;

  getWorkOrderHistoriesByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderHistoryResponse[] | null>;

  getAllWorkOrderHistories(): Promise<WorkOrderHistoryResponse[] | null>;

  findAllViewHistoriesWorkOrders(pagination?: {
    limit?: number;
    offset?: number;
  }): Promise<ViewWorkOrderHistoryResponse[]>;

  findAllViewHistoriesWorkOrdersByOrderCode(
    orderCode: string,
    pagination?: {
      limit?: number;
      offset?: number;
    },
  ): Promise<ViewWorkOrderHistoryResponse[]>;
}
