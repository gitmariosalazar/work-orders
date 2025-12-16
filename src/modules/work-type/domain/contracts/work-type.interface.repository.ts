import { WorkTypeResponse } from '../schemas/dto/response/work-type.response';
import { WorkTypeModel } from '../schemas/models/work-type.model';
export interface InterfaceWorkTypeRepository {
  createWorkType(workType: WorkTypeModel): Promise<WorkTypeResponse | null>;
  updateWorkType(
    workTypeId: number,
    workType: WorkTypeModel,
  ): Promise<WorkTypeResponse | null>;
  getWorkTypeById(workTypeId: number): Promise<WorkTypeResponse | null>;
  getAllWorkTypes(): Promise<WorkTypeResponse[]>;
  verifyWorkTypeExistsByName(workTypeName: string): Promise<boolean>;
  findWorkTypesByDepartmentId(
    departmentId: number,
  ): Promise<WorkTypeResponse[]>;
}
