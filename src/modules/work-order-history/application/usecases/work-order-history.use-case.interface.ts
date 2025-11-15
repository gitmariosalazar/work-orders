import { CreateWorkHistoryRequest } from "../../domain/schemas/dto/request/creeate.work-order-history.request";
import { UpdateWorkOrderHistoryRequest } from "../../domain/schemas/dto/request/update.work-order-history.request";
import { WorkOrderHistoryResponse } from "../../domain/schemas/dto/response/work-order-history.response";

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
    workOrderId: number,
  ): Promise<WorkOrderHistoryResponse[] | null>;

  getAllWorkOrderHistories(): Promise<WorkOrderHistoryResponse[] | null>;
}