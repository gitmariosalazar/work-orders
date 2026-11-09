import { CreateWorkHistoryRequest } from '../../domain/schemas/dto/request/creeate.work-order-history.request';
import { UpdateWorkOrderHistoryRequest } from '../../domain/schemas/dto/request/update.work-order-history.request';
import { ViewWorkOrderHistoryResponse } from '../../domain/schemas/dto/response/view-work-order-history.response';
import { WorkOrderHistoryResponse } from '../../domain/schemas/dto/response/work-order-history.response';
import { UserParams } from '../../../../shared/policies/work-order-user.policy';

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
    user?: UserParams,
  ): Promise<WorkOrderHistoryResponse | null>;

  getWorkOrderHistoriesByWorkOrderId(
    workOrderId: string,
    user?: UserParams,
  ): Promise<WorkOrderHistoryResponse[] | null>;

  getAllWorkOrderHistories(user?: UserParams): Promise<WorkOrderHistoryResponse[] | null>;

  findAllViewHistoriesWorkOrders(
    pagination?: {
      limit?: number;
      offset?: number;
    },
    user?: UserParams,
  ): Promise<ViewWorkOrderHistoryResponse[]>;

  findAllViewHistoriesWorkOrdersByOrderCode(
    orderCode: string,
    pagination?: {
      limit?: number;
      offset?: number;
    },
    user?: UserParams,
  ): Promise<ViewWorkOrderHistoryResponse[]>;
}
