import { WorkOrderObservationResponse } from '../../../../domain/schemas/dto/response/work-order-observation.response';
import { WorkOrderObservationSQLResponse } from '../../../interfaces/sql/work-order-observation.sql.response';

export class WorkOrderObservationAdapter {
  static toResponse(
    result: WorkOrderObservationSQLResponse,
  ): WorkOrderObservationResponse {
    return {
      observationId: result.observation_id,
      workOrderId: result.work_order_id,
      description: result.description,
      workerId: result.worker_id,
      createdAt: result.created_at,
    };
  }
}
