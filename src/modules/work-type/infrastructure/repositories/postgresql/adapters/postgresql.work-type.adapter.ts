import {
  DepartmentResponse,
  WorkTypeResponse,
} from '../../../../domain/schemas/dto/response/work-type.response';
import {
  DepartmentSqlResponse,
  WorkTypeSqlResponse,
} from '../../../interfaces/sql/work-type.sql.response';

export class WorkTypeAdapter {
  static fromWorkTypeSqlResponseToWorkTypeResponse(
    sqlResponse: WorkTypeSqlResponse,
  ): WorkTypeResponse {
    return {
      workTypeId: sqlResponse.work_type_id,
      name: sqlResponse.name,
      description: sqlResponse.description,
      departmentId: sqlResponse.department_id,
    };
  }

  static fromDepartmentSqlResponseToDepartmentResponse(
    sqlResponse: DepartmentSqlResponse,
  ): DepartmentResponse {
    return {
      departmentId: sqlResponse.department_id,
      departmentName: sqlResponse.department_name,
      departmentDescription: sqlResponse.department_description,
      workTypes: sqlResponse.work_types.map((workType) => ({
        typeCode: workType.type_code,
        typeName: workType.type_name,
        typeDescription: workType.type_description,
        suggestedPriority: workType.suggested_priority,
      })),
    };
  }
}
