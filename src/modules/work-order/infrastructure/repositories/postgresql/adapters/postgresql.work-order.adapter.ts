import { WorkOrderResponse } from '../../../../domain/schemas/dto/response/work-order.response';
import { WorkOrderSQLResponse } from '../../../interfaces/sql/work-order.sql.response';

export class WorkOrderAdapter {
  static fromWorkOrderSQLResponseToWorkOrderResponse(
    workOrderSQLResponse: WorkOrderSQLResponse,
  ): WorkOrderResponse {
    return {
      workOrderId: workOrderSQLResponse.work_order_id,
      orderCode: workOrderSQLResponse.order_code,
      workTypeId: workOrderSQLResponse.work_type_id,
      priorityId: workOrderSQLResponse.priority_id,
      clientId: workOrderSQLResponse.client_id,
      location: workOrderSQLResponse.location || '',
      description: workOrderSQLResponse.description || '',
      createdUserId: workOrderSQLResponse.created_user_id || 0,
      assignedUserId: workOrderSQLResponse.assigned_user_id || 0,
      completedUserId: workOrderSQLResponse.completed_user_id || 0,
      coordinates: workOrderSQLResponse.coordinates,
      metadata: workOrderSQLResponse.metadata,
      cadastralKey: workOrderSQLResponse.cadastral_key,
      isDeleted: workOrderSQLResponse.is_deleted,
      creationDate: workOrderSQLResponse.creation_date,
      assignationDate: workOrderSQLResponse.assignation_date,
      completionDate: workOrderSQLResponse.completion_date,
      status: workOrderSQLResponse.status,
    };
  }
}
