import { ViewWorkOrderHistoryResponse } from '../schemas/dto/response/view-work-order-history.response';
import { WorkOrderHistoryResponse } from '../schemas/dto/response/work-order-history.response';
import { WorkOrderHistoryModel } from '../schemas/models/work-order-history.model';
import { UserParams } from '../../../../shared/policies/work-order-user.policy';

export interface InterfaceWorkOrderHistoryRepository {
  create(
    workOrderHistory: WorkOrderHistoryModel,
  ): Promise<WorkOrderHistoryResponse | null>;

  update(
    workOrderHistoryId: number,
    workOrderHistory: Partial<WorkOrderHistoryModel>,
  ): Promise<WorkOrderHistoryResponse | null>;

  findById(
    workOrderHistoryId: number,
    user?: UserParams,
  ): Promise<WorkOrderHistoryResponse | null>;

  findByWorkOrderId(
    workOrderId: string,
    user?: UserParams,
  ): Promise<WorkOrderHistoryResponse[] | null>;

  findAll(user?: UserParams): Promise<WorkOrderHistoryResponse[] | null>;

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
