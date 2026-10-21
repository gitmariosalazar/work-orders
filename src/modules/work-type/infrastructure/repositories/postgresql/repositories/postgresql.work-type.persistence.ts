import { Injectable } from '@nestjs/common';
import { InterfaceWorkTypeRepository } from '../../../../domain/contracts/work-type.interface.repository';
import {
  DepartmentResponse,
  WorkTypeResponse,
} from '../../../../domain/schemas/dto/response/work-type.response';
import { WorkTypeAdapter } from '../adapters/postgresql.work-type.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkTypeModel } from '../../../../domain/schemas/models/work-type.model';
import {
  DepartmentSqlResponse,
  WorkTypeSqlResponse,
} from '../../../interfaces/sql/work-type.sql.response';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PostgreSQLWorkTypePersistence implements InterfaceWorkTypeRepository {
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

      return WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(
        result[0],
      );
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

      return WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(
        result[0],
      );
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

      return WorkTypeAdapter.fromWorkTypeSqlResponseToWorkTypeResponse(
        result[0],
      );
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

  async getAllDepartments(): Promise<DepartmentResponse[]> {
    try {
      const query = `
          SELECT
              dt.id_departamento AS "department_id",
              dt.nombre          AS "department_name",
              dt.descripcion     AS "department_description",
              COALESCE(
                  json_agg(
                      json_build_object(
                          'type_code', tw.id_tipo_trabajo,
                          'type_name', tw.nombre,
                          'type_description', tw.descripcion,
                          'suggested_priority', tw.prioridad_sugerida
                      ) ORDER BY tw.nombre
                  ) FILTER (WHERE tw.id_tipo_trabajo IS NOT NULL),
                  '[]'::json
              ) AS "work_types"
          FROM work_orders.departamento_trabajo dt
          LEFT JOIN work_orders.tipo_trabajo tw
              ON dt.id_departamento = tw.id_departamento
              AND tw.activo = true
          WHERE dt.activo = true
          GROUP BY
              dt.id_departamento,
              dt.nombre,
              dt.descripcion
          ORDER BY dt.id_departamento;
        `;

      const result = await this.databaseService.query<DepartmentSqlResponse>(
        query,
        [],
      );

      if (!result || result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No departments found.',
        });
      }

      const departments = result.map((item) =>
        WorkTypeAdapter.fromDepartmentSqlResponseToDepartmentResponse(item),
      );

      return departments;
    } catch (error) {
      throw error;
    }
  }
}
