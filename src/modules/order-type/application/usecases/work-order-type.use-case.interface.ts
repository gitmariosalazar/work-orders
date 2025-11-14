import { CreateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/create.work-order-type.request';
import { UpdateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/update.work-order-type.request';
import { WorkOrderTypeResponse } from '../../domain/schemas/dto/response/work-order-type.response';

export interface InterfaceWorkOrderTypeUseCase {
  createWorkOrderType(
    workOrderType: CreateWorkOrderTypeRequest,
  ): Promise<WorkOrderTypeResponse | null>;
  updateWorkOrderType(
    workOrderTypeId: number,
    workOrderType: UpdateWorkOrderTypeRequest,
  ): Promise<WorkOrderTypeResponse | null>;
  getWorkOrderTypeById(
    workOrderTypeId: number,
  ): Promise<WorkOrderTypeResponse | null>;
  getAllWorkOrderTypes(): Promise<WorkOrderTypeResponse[]>;
  verifyWorkOrderTypeExistsByName(
    workOrderTypeName: string,
  ): Promise<boolean>;
}
