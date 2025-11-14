import { WorkOrderTypeResponse } from "../../../../domain/schemas/dto/response/work-order-type.response";
import { WorkOrderTypeSqlResponse } from "../../../interfaces/sql/work-order-type.sql.response";

export class WorkOrderTypeAdapter {
  static fromWorkOrderTypeSqlResponseToWorkOrderTypeResponse(
    sqlResponse: WorkOrderTypeSqlResponse,
  ): WorkOrderTypeResponse {
    return {
      workOrderTypeId: sqlResponse.workOrderTypeId,
      name: sqlResponse.name,
      description: sqlResponse.description,
    };
  }
}