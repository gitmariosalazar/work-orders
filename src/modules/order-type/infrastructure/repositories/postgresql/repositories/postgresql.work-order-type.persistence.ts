import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderTypeRepository } from '../../../../domain/contracts/work-order-type.interface.repository';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderTypeResponse } from '../../../../domain/schemas/dto/response/work-order-type.response';
import { WorkOrderTypeAdapter } from '../adapters/postgresql.work-order-type.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkOrderTypeModel } from '../../../../domain/schemas/models/work-order-type.model';

@Injectable()
export class PostgreSQLWorkOrderTypePersistence
  implements InterfaceWorkOrderTypeRepository {
  constructor(private readonly postgreSqlService: DatabaseServicePostgreSQL) { }

  async getAllWorkOrderTypes(): Promise<WorkOrderTypeResponse[]> {
    try {
      const query =
        'select tot.tipoordentrabajoid as "workOrderTypeId", tot.nombre as name, tot.descripcion as description from tipoordentrabajo tot;';

      const result = await this.postgreSqlService.query<WorkOrderTypeResponse>(
        query,
        [],
      );

      const workOrderTypes: WorkOrderTypeResponse[] = result.map(
        WorkOrderTypeAdapter.fromWorkOrderTypeSqlResponseToWorkOrderTypeResponse,
      );

      if (workOrderTypes.length === 0) {
        return [];
      }

      return workOrderTypes;
    } catch (error) {
      throw error;
    }
  }

  async verifyWorkOrderTypeExistsByName(
    workOrderTypeName: string,
  ): Promise<boolean> {
    try {
      const query =
        'select count(*) > 0 as "exists" from tipoordentrabajo where nombre = $1;';

      const values = [workOrderTypeName];

      const result = await this.postgreSqlService.query<{ exists: boolean }>(
        query,
        values,
      );

      return result[0].exists;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderTypeById(
    workOrderTypeId: number,
  ): Promise<WorkOrderTypeResponse | null> {
    try {
      const query =
        'select tot.tipoordentrabajoid as "workOrderTypeId", tot.nombre as name, tot.descripcion as description from tipoordentrabajo tot where tot.tipoordentrabajoid = $1;';

      const values = [workOrderTypeId];

      const result = await this.postgreSqlService.query<WorkOrderTypeResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Work Order Type with ID '${workOrderTypeId}' not found.`,
        });
      }

      const workOrderType: WorkOrderTypeResponse =
        WorkOrderTypeAdapter.fromWorkOrderTypeSqlResponseToWorkOrderTypeResponse(
          result[0],
        );

      return workOrderType;
    } catch (error) {
      throw error;
    }
  }

  async createWorkOrderType(
    workOrderType: WorkOrderTypeModel,
  ): Promise<WorkOrderTypeResponse | null> {
    try {
      const query =
        'insert into tipoordentrabajo (nombre, descripcion) values ($1, $2) returning tipoordentrabajoid as "workOrderTypeId", nombre as name, descripcion as description;';

      const values = [workOrderType.getName(), workOrderType.getDescription()];

      const result = await this.postgreSqlService.query<WorkOrderTypeResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create Work Order Type',
        });
      }

      const createdWorkOrderType: WorkOrderTypeResponse =
        WorkOrderTypeAdapter.fromWorkOrderTypeSqlResponseToWorkOrderTypeResponse(
          result[0],
        );

      return createdWorkOrderType;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrderType(
    workOrderTypeId: number,
    workOrderType: WorkOrderTypeModel,
  ): Promise<WorkOrderTypeResponse | null> {
    try {
      const query =
        'update tipoordentrabajo set nombre = $1, descripcion = $2 where tipoordentrabajoid = $3 returning tipoordentrabajoid as "workOrderTypeId", nombre as name, descripcion as description;';

      const values = [
        workOrderType.getName(),
        workOrderType.getDescription(),
        workOrderTypeId,
      ];

      const result = await this.postgreSqlService.query<WorkOrderTypeResponse>(
        query,
        values,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update Work Order Type',
        });
      }

      const updatedWorkOrderType: WorkOrderTypeResponse =
        WorkOrderTypeAdapter.fromWorkOrderTypeSqlResponseToWorkOrderTypeResponse(
          result[0],
        );

      return updatedWorkOrderType;
    } catch (error) {
      throw error;
    }
  }
}
