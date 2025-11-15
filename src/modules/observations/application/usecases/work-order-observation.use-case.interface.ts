import { CreateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/create.work-order-observation.request';
import { UpdateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/update.work-order-observation.request';
import { WorkOrderObservationResponse } from '../../domain/schemas/dto/response/work-order-observation.response';

export interface InterfaceWorkOrderObservationUseCase {
  createWorkOrderObservation(
    workOrderObservation: CreateWorkOrderObservationRequest,
  ): Promise<WorkOrderObservationResponse | null>;
  updateWorkOrderObservation(
    workOrderObservationId: number,
    workOrderObservation: Partial<UpdateWorkOrderObservationRequest>,
  ): Promise<WorkOrderObservationResponse | null>;
  getWorkOrderObservationById(
    workOrderObservationId: number,
  ): Promise<WorkOrderObservationResponse | null>;
  getWorkOrderObservationsByWorkOrderId(
    workOrderId: number,
  ): Promise<WorkOrderObservationResponse[]>;
  getAllWorkOrderObservations(): Promise<WorkOrderObservationResponse[]>;
}
