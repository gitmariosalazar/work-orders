import { GetWorkOrderPriorityStatisticsResponse } from '../schemas/dto/response/get_work_order_priority_statistics.response';
import { GetWorkOrderStatusStatisticsResponse } from '../schemas/dto/response/get_work_order_status_statistics.response';
import { GetWorkOrderTypeStatisticsResponse } from '../schemas/dto/response/get_work_order_type_statistics.response';
import {
  ViewAllWorkOrdersFullDetailsResponse,
  ViewWorkOrderAssignmentsResponse,
  ViewWorkOrderAttachmentsResponse,
  ViewWorkOrderMaterialsResponse,
  ViewWorkOrderObservationsResponse,
  ViewWorkOrdersByClientResponse,
  ViewWorkOrderStatisticsResponse,
} from '../schemas/dto/response/views.work-orders.response';
import { WorkOrderResponse } from '../schemas/dto/response/work-order.response';
import { WorkOrdersStatisticsKeyResponse } from '../schemas/dto/response/work_orders_statistics_key.response';
import { WorkOrderModel } from '../schemas/models/work-order.model';

export interface InterfaceWorkOrderRepository {
  createWorkOrder(
    workOrder: Partial<WorkOrderModel>,
  ): Promise<WorkOrderResponse | null>;
  updateWorkOrder(
    orderCode: string,
    workOrder: Partial<WorkOrderModel>,
  ): Promise<WorkOrderResponse | null>;
  getWorkOrderById(orderCode: string): Promise<WorkOrderResponse | null>;
  getWorkOrdersByClientId(clientId: string): Promise<WorkOrderResponse[]>;
  getAllWorkOrders(): Promise<WorkOrderResponse[]>;

  // Views
  getWorkOrderStatistics(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderStatisticsResponse[]>;
  getWorkOrderAssignments(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderAssignmentsResponse[]>;
  getWorkOrderMaterials(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderMaterialsResponse[]>;
  getWorkOrderObservations(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderObservationsResponse[]>;
  getWorkOrderAttachments(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderAttachmentsResponse[]>;
  getWorkOrdersByClient(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrdersByClientResponse[]>;
  getAllWorkOrdersFullDetails(
    limit?: number,
    offset?: number,
  ): Promise<ViewAllWorkOrdersFullDetailsResponse[]>;

  findWorkOrdersFullDetailsByOrderCode(
    orderCode: string,
  ): Promise<ViewAllWorkOrdersFullDetailsResponse | null>;

  getWorkOrderPriorityStatistics(): Promise<
    GetWorkOrderPriorityStatisticsResponse[]
  >;
  getWorkOrderStatusStatistics(): Promise<
    GetWorkOrderStatusStatisticsResponse[]
  >;
  getWorkOrderTypeStatistics(): Promise<GetWorkOrderTypeStatisticsResponse[]>;

  getWorkOrdersStatisticsKey(): Promise<WorkOrdersStatisticsKeyResponse[]>;
}
