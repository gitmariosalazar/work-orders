import { Injectable } from '@nestjs/common';
import { InterfaceWorkTypeRepository } from '../../../../domain/contracts/work-type.interface.repository';
import { WorkTypeResponse } from '../../../../domain/schemas/dto/response/work-type.response';
import { WorkTypeAdapter } from '../adapters/postgresql.work-type.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkTypeModel } from '../../../../domain/schemas/models/work-type.model';
import { WorkTypeSqlResponse } from '../../../interfaces/sql/work-type.sql.response';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PostgreSQLWorkTypePersistence
  implements InterfaceWorkTypeRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async getAllWorkTypes(): Promise<WorkTypeResponse[]> {
    try {
      const query =
        'select t.id_tipo_trabajo as work_type_id, t.nombre as name, t.descripcion as description, t.id_departamento as department_id from work_orders.tipo_trabajo t';

      const result = await this.databaseService.query<WorkTypeSqlResponse>(
        query,
        [],
      );

      return result.map((item) =>
        WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(item),
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyWorkTypeExistsByName(workTypeName: string): Promise<boolean> {
    try {
      const query =
        'select count(*) > 0 as "exists" from work_orders.tipo_trabajo where lower(nombre) = lower($1);';

      const values = [workTypeName];

      const result = await this.databaseService.query<{ exists: boolean }>(
        query,
        values,
      );

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async getWorkTypeById(workTypeId: number): Promise<WorkTypeResponse | null> {
    try {
      const query =
        'select id_tipo_trabajo as work_type_id, nombre as name, descripcion as description, id_departamento as department_id from work_orders.tipo_trabajo where id_tipo_trabajo = $1;';

      const values = [workTypeId];

      const result = await this.databaseService.query<WorkTypeSqlResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Work Type with ID '${workTypeId}' not found.`,
        });
      }

      return WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(result[0]);
    } catch (error) {
      throw error;
    }
  }

  async createWorkType(
    workType: WorkTypeModel,
  ): Promise<WorkTypeResponse | null> {
    try {
      const query =
        'insert into work_orders.tipo_trabajo (nombre, descripcion, id_departamento) values ($1, $2, $3) returning id_tipo_trabajo as work_type_id, nombre as name, descripcion as description, id_departamento as department_id;';

      const values = [
        workType.getName(),
        workType.getDescription(),
        workType.getDepartmentId(),
      ];

      const result = await this.databaseService.query<WorkTypeSqlResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create Work Type',
        });
      }

      return WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(result[0]);
    } catch (error) {
      throw error;
    }
  }

  async updateWorkType(
    workTypeId: number,
    workType: WorkTypeModel,
  ): Promise<WorkTypeResponse | null> {
    try {
      const query =
        'update work_orders.tipo_trabajo set nombre = $1, descripcion = $2 where id_tipo_trabajo = $3 returning id_tipo_trabajo as work_type_id, nombre as name, descripcion as description, id_departamento as department_id;';

      const values = [
        workType.getName(),
        workType.getDescription(),
        workTypeId,
      ];

      const result = await this.databaseService.query<WorkTypeSqlResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update Work Type',
        });
      }

      return WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(result[0]);
    } catch (error) {
      throw error;
    }
  }

  async findWorkTypesByDepartmentId(
    departmentId: number,
  ): Promise<WorkTypeResponse[]> {
    try {
      const query =
        'select id_tipo_trabajo as work_type_id, nombre as name, descripcion as description, id_departamento as department_id from work_orders.tipo_trabajo where id_departamento = $1;';

      const values = [departmentId];

      const result = await this.databaseService.query<WorkTypeSqlResponse>(
        query,
        values,
      );

      return result.map((item) =>
        WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(item),
      );
    } catch (error) {
      throw error;
    }
  }
}
