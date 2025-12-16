import { WorkOrderResponse } from '../schemas/dto/response/work-order.response';
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
}
