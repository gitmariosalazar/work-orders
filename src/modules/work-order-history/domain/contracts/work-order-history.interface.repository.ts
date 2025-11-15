import { WorkOrderHistoryResponse } from "../schemas/dto/response/work-order-history.response";
import { WorkOrderHistoryModel } from "../schemas/models/work-order-history.model";

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
  ): Promise<WorkOrderHistoryResponse | null>;

  findByWorkOrderId(
    workOrderId: number,
  ): Promise<WorkOrderHistoryResponse[] | null>;

  findAll(): Promise<WorkOrderHistoryResponse[] | null>;
}