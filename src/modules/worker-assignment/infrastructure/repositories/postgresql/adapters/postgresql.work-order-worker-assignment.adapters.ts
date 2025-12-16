import { WorkOrderWorkerAssignmentResponse } from '../../../../domain/schemas/dto/response/work-order-worker-assignment.response';
import { WorkOrderWorkerAssignmentSqlResponse } from '../../../interfaces/sql/work-order-worker-assignment.sql.response';

export class WorkOrderWorkerAssignmentAdapter {
  static fromWorkOrderWorkerAssignmentSqlResponseToWorkOrderWorkerAssignmentResponse(
    sqlResponse: WorkOrderWorkerAssignmentSqlResponse,
  ): WorkOrderWorkerAssignmentResponse {
    return {
      assignmentId: sqlResponse.assignment_id,
      workOrderId: sqlResponse.work_order_id,
      workerId: sqlResponse.worker_id,
      rolId: sqlResponse.rol_id,
      assignedDate: sqlResponse.assigned_date,
    };
  }

  static fromWorkOrderWorkerAssignmentSqlResponseListToWorkOrderWorkerAssignmentResponseList(
    sqlResponses: WorkOrderWorkerAssignmentSqlResponse[],
  ): WorkOrderWorkerAssignmentResponse[] {
    return sqlResponses.map((sqlResponse) =>
      this.fromWorkOrderWorkerAssignmentSqlResponseToWorkOrderWorkerAssignmentResponse(
        sqlResponse,
      ),
    );
  }
}
