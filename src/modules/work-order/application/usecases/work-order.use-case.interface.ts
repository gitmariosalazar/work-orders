import { CreateWorkOrderRequest } from '../../domain/schemas/dto/request/create.work-order.request';
import { UpdateWorkOrderRequest } from '../../domain/schemas/dto/request/update.work-order.request';
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
}
