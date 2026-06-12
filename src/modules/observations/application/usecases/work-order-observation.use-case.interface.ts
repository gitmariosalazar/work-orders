import { CreateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/create.work-order-observation.request';
import { UpdateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/update.work-order-observation.request';
import { WorkOrderObservationResponse } from '../../domain/schemas/dto/response/work-order-observation.response';

export interface InterfaceWorkOrderObservationUseCase {
  createWorkOrderObservation(
    workOrderObservation: CreateWorkOrderObservationRequest,
  ): Promise<WorkOrderObservationResponse | null>;
  updateWorkOrderObservation(
    workOrderObservationId: string,
    workOrderObservation: Partial<UpdateWorkOrderObservationRequest>,
  ): Promise<WorkOrderObservationResponse | null>;
  getWorkOrderObservationById(
    workOrderObservationId: string,
  ): Promise<WorkOrderObservationResponse | null>;
  getWorkOrderObservationsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderObservationResponse[]>;
  getAllWorkOrderObservations(): Promise<WorkOrderObservationResponse[]>;
}
