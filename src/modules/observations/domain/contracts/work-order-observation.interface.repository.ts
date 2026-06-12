import { WorkOrderObservationResponse } from '../schemas/dto/response/work-order-observation.response';
import { WorkOrderObservationModel } from '../schemas/models/work-order-observation.model';

export interface InterfaceWorkOrderObservationRepository {
  create(
    workOrderObservation: WorkOrderObservationModel,
  ): Promise<WorkOrderObservationResponse | null>;
  update(
    workOrderObservationId: string,
    workOrderObservation: Partial<WorkOrderObservationModel>,
  ): Promise<WorkOrderObservationResponse | null>;
  getById(
    workOrderObservationId: string,
  ): Promise<WorkOrderObservationResponse | null>;
  getByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderObservationResponse[]>;
  getAll(): Promise<WorkOrderObservationResponse[]>;
}
