import { WorkOrderTypeResponse } from '../schemas/dto/response/work-order-type.response';
import { WorkOrderTypeModel } from './../schemas/models/work-order-type.model';
export interface InterfaceWorkOrderTypeRepository {
  createWorkOrderType(
    workOrderType: WorkOrderTypeModel,
  ): Promise<WorkOrderTypeResponse | null>;
  updateWorkOrderType(
    workOrderTypeId: number,
    workOrderType: WorkOrderTypeModel,
  ): Promise<WorkOrderTypeResponse | null>;
  getWorkOrderTypeById(
    workOrderTypeId: number,
  ): Promise<WorkOrderTypeResponse | null>;
  getAllWorkOrderTypes(): Promise<WorkOrderTypeResponse[]>;
  verifyWorkOrderTypeExistsByName(
    workOrderTypeName: string,
  ): Promise<boolean>;
}
