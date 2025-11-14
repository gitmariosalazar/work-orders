import { WorkOrderResponse } from "../schemas/dto/response/work-order.response";
import { WorkOrderModel } from "../schemas/models/work-order.model";

export interface InterfaceWorkOrderRepository {
  createWorkOrder(workOrder: WorkOrderModel): Promise<WorkOrderResponse | null>;
  updateWorkOrder(workOrderId: number, workOrder: WorkOrderModel): Promise<WorkOrderResponse | null>;
  getWorkOrderById(workOrderId: number): Promise<WorkOrderResponse | null>;
  getWorkOrdersByClientId(clientId: string): Promise<WorkOrderResponse[]>;
  getAllWorkOrders(): Promise<WorkOrderResponse[]>;
}