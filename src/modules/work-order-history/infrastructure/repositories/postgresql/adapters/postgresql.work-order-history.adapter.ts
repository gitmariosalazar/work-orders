import { WorkOrderHistoryResponse } from "../../../../domain/schemas/dto/response/work-order-history.response";
import { WorkOrderHistorySQLResponse } from "../../../interfaces/sql/work-order-history.sql.response";

export class WorkOrderHistoryAdapter {
  static fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
    sqlResponse: WorkOrderHistorySQLResponse,
  ): WorkOrderHistoryResponse {
    return {
      workOrderHistoryId: sqlResponse.workOrderHistoryId,
      workOrderId: sqlResponse.workOrderId,
      changeDate: sqlResponse.changeDate,
      previousStatusId: sqlResponse.previousStatusId,
      newStatusId: sqlResponse.newStatusId,
      userId: sqlResponse.userId,
      changeDescription: sqlResponse.changeDescription,
    };
  }
}