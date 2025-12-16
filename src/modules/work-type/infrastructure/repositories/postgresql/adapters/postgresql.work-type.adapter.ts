import { WorkTypeResponse } from '../../../../domain/schemas/dto/response/work-type.response';
import { WorkTypeSqlResponse } from '../../../interfaces/sql/work-type.sql.response';

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
}
