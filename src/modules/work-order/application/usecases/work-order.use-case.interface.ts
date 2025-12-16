import { CreateWorkOrderRequest } from '../../domain/schemas/dto/request/create.work-order.request';
import { UpdateWorkOrderRequest } from '../../domain/schemas/dto/request/update.work-order.request';
import {
  ViewAllWorkOrdersFullDetailsResponse,
  ViewWorkOrderAssignmentsResponse,
  ViewWorkOrderAttachmentsResponse,
  ViewWorkOrderMaterialsResponse,
  ViewWorkOrderObservationsResponse,
  ViewWorkOrdersByClientResponse,
  ViewWorkOrderStatisticsResponse,
} from '../../domain/schemas/dto/response/views.work-orders.response';
import { WorkOrderResponse } from '../../domain/schemas/dto/response/work-order.response';

export interface InterfaceWorkOrderUseCase {
  createWorkOrder(
    workOrder: Partial<CreateWorkOrderRequest>,
  ): Promise<WorkOrderResponse | null>;
  updateWorkOrder(
    orderCode: string,
    workOrder: Partial<UpdateWorkOrderRequest>,
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
}
