import { ViewWorkOrderHistoryResponse } from '../../../../domain/schemas/dto/response/view-work-order-history.response';
import { WorkOrderHistoryResponse } from '../../../../domain/schemas/dto/response/work-order-history.response';
import {
  ViewWorkOrderHistorySqlResponse,
  WorkOrderHistorySQLResponse,
} from '../../../interfaces/sql/work-order-history.sql.response';

export class WorkOrderHistoryAdapter {
  static fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
    sqlResponse: WorkOrderHistorySQLResponse,
  ): WorkOrderHistoryResponse {
    return {
      workOrderHistoryId: sqlResponse.work_order_history_id,
      workOrderId: sqlResponse.work_order_id,
      statusId: sqlResponse.status_id,
      changeDate: sqlResponse.change_date,
      userId: sqlResponse.user_id,
      changeDescription: sqlResponse.change_description,
      cadastralKey: sqlResponse.cadastral_key,
      orderCode: sqlResponse.order_code,
    };
  }

  static fromWorkOrderHistoriesSQLResponseToWorkOrderHistoriesResponse(
    sqlResponses: WorkOrderHistorySQLResponse[],
  ): WorkOrderHistoryResponse[] {
    return sqlResponses.map((sqlResponse) =>
      this.fromWorkOrderHistorySQLResponseToWorkOrderHistoryResponse(
        sqlResponse,
      ),
    );
  }

  static fromViewWorkOrderHistorySQLResponseToViewWorkOrderHistoryResponse(
    sqlResponse: ViewWorkOrderHistorySqlResponse,
  ): ViewWorkOrderHistoryResponse {
    return {
      workOrderId: sqlResponse.work_order_id,
      workOrderCode: sqlResponse.work_order_code,
      cadastralKey: sqlResponse.cadastral_key,
      workOrderDescription:
        sqlResponse.work_order_description === null
          ? undefined
          : sqlResponse.work_order_description,
      workOrderLocation:
        sqlResponse.work_order_location === null
          ? undefined
          : sqlResponse.work_order_location,
      coordinatesWkt:
        sqlResponse.coordinates_wkt === null
          ? undefined
          : sqlResponse.coordinates_wkt,
      longitude:
        sqlResponse.longitude === null ? undefined : sqlResponse.longitude,
      latitude:
        sqlResponse.latitude === null ? undefined : sqlResponse.latitude,
      workType: sqlResponse.work_type,
      department: sqlResponse.department,
      priority: sqlResponse.priority,
      currentState: sqlResponse.current_state,
      clientId: sqlResponse.client_id,
      createdByUserId:
        sqlResponse.created_by_user_id === null
          ? undefined
          : sqlResponse.created_by_user_id,
      assignedToUserId:
        sqlResponse.assigned_to_user_id === null
          ? undefined
          : sqlResponse.assigned_to_user_id,
      completedByUserId:
        sqlResponse.completed_by_user_id === null
          ? undefined
          : sqlResponse.completed_by_user_id,
      creationDate: sqlResponse.creation_date,
      assignmentDate:
        sqlResponse.assignment_date === null
          ? undefined
          : sqlResponse.assignment_date,
      completionDate:
        sqlResponse.completion_date === null
          ? undefined
          : sqlResponse.completion_date,
      historicalId: sqlResponse.historical_id,
      historicalStateId:
        sqlResponse.historical_state_id === null
          ? undefined
          : sqlResponse.historical_state_id,
      historicalStateName: sqlResponse.historical_state_name,
      stateChangeDate:
        sqlResponse.state_change_date === null
          ? undefined
          : sqlResponse.state_change_date,
      stateChangeUserId:
        sqlResponse.state_change_user_id === null
          ? undefined
          : sqlResponse.state_change_user_id,
      changeDescription:
        sqlResponse.change_description === null
          ? undefined
          : sqlResponse.change_description,
      changeNumber:
        sqlResponse.change_number === null
          ? undefined
          : sqlResponse.change_number,
    };
  }

  static fromViewWorkOrderHistoriesSQLResponseToViewWorkOrderHistoriesResponse(
    sqlResponses: ViewWorkOrderHistorySqlResponse[],
  ): ViewWorkOrderHistoryResponse[] {
    return sqlResponses.map((sqlResponse) =>
      this.fromViewWorkOrderHistorySQLResponseToViewWorkOrderHistoryResponse(
        sqlResponse,
      ),
    );
  }
}
