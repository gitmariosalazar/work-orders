import { CreateWorkTypeRequest } from '../../domain/schemas/dto/request/create.work-type.request';
import { UpdateWorkTypeRequest } from '../../domain/schemas/dto/request/update.work-type.request';
import { WorkTypeResponse } from '../../domain/schemas/dto/response/work-type.response';

export interface InterfaceWorkTypeUseCase {
  createWorkType(
    workType: CreateWorkTypeRequest,
  ): Promise<WorkTypeResponse | null>;
  updateWorkType(
    workTypeId: number,
    workType: UpdateWorkTypeRequest,
  ): Promise<WorkTypeResponse | null>;
  getWorkTypeById(workTypeId: number): Promise<WorkTypeResponse | null>;
  getAllWorkTypes(): Promise<WorkTypeResponse[]>;
  verifyWorkTypeExistsByName(workTypeName: string): Promise<boolean>;
  findWorkTypesByDepartmentId(
    departmentId: number,
  ): Promise<WorkTypeResponse[]>;
}
