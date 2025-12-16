import { CreateWorkTypeRequest } from '../../domain/schemas/dto/request/create.work-type.request';
import { UpdateWorkTypeRequest } from '../../domain/schemas/dto/request/update.work-type.request';
import { WorkTypeModel } from '../../domain/schemas/models/work-type.model';

export class WorkTypeMapper {
  static fromCreateWorkTypeRequestToWorkTypeModel(
    workType: CreateWorkTypeRequest,
  ): WorkTypeModel {
    console.log('Mapping CreateWorkTypeRequest to WorkTypeModel:', workType);
    return new WorkTypeModel(
      workType.name,
      workType.description,
      undefined,
      workType.departmentId,
    );
  }

  static fromWorkTypeModelToCreateWorkTypeRequest(
    workType: WorkTypeModel,
  ): CreateWorkTypeRequest {
    return new CreateWorkTypeRequest(
      workType.getName(),
      workType.getDescription(),
      workType.getDepartmentId(),
    );
  }

  static fromUpdateWorkTypeRequestToWorkTypeModel(
    workType: UpdateWorkTypeRequest,
  ): WorkTypeModel {
    return new WorkTypeModel(
      workType.name,
      workType.description,
      undefined,
      workType.departmentId,
    );
  }
}
