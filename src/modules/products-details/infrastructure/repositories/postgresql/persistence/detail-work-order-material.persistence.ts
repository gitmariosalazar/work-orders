/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InterfaceDetailWorkOrderMaterialRepository } from '../../../../domain/contracts/detail-work-order-material.interface.repository';
import { DatabaseServicePostgreSQL } from '../../../../../../shared/connections/database/postgresql/postgresql.service';
import { DetailWorkOrderMaterialResponse } from '../../../../domain/schemas/dto/response/detail-work-order-material.response';
import { DetailWorkOrderMaterialModel } from '../../../../domain/schemas/models/detail-work-order-material.model';
import { DetailWorkOrderMaterialSqlResponse } from '../../../interfaces/sql/detail-work-order-material.sql.response';
import { DetailWorkOrderMaterialAdapter } from '../adapters/detail-work-order-material.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';

@Injectable()
export class DetailWorkOrderMaterialPostgreSqlPersistence
  implements InterfaceDetailWorkOrderMaterialRepository
{
  constructor(private readonly postgreSqlService: DatabaseServicePostgreSQL) {}

  async addDetailWorkOrderMaterials(
    detailWorkOrderMaterials: DetailWorkOrderMaterialModel[],
  ): Promise<DetailWorkOrderMaterialResponse[] | null> {
    try {
      const query = `
      INSERT INTO work_orders.detalle_orden_trabajo_material(id_orden_trabajo, id_material, cantidad, costo_unitario) VALUES ($1, $2, $3, $4)
      RETURNING id_detalle_orden_trabajo_material AS detail_work_order_material_id, id_orden_trabajo AS work_order_id, id_material AS material_id, cantidad AS quantity, costo_unitario AS unit_cost, subtotal;
      `;
      const results: DetailWorkOrderMaterialSqlResponse[] = [];
      for (const detailWorkOrderMaterial of detailWorkOrderMaterials) {
        const values = [
          detailWorkOrderMaterial.getWorkOrderId(),
          detailWorkOrderMaterial.getMaterialId(),
          detailWorkOrderMaterial.getQuantity(),
          detailWorkOrderMaterial.getUnitCost(),
        ];
        const result =
          await this.postgreSqlService.query<DetailWorkOrderMaterialSqlResponse>(
            query,
            values,
          );
        results.push(result[0]);
      }
      if (results.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No detail work order materials were added',
        });
      }
      const responses: DetailWorkOrderMaterialResponse[] =
        DetailWorkOrderMaterialAdapter.fromDetailWorkOrderMaterialSqlResponseListToDetailWorkOrderMaterialResponseList(
          results,
        );
      return responses;
    } catch (error) {
      throw error;
    }
  }

  async getDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<DetailWorkOrderMaterialResponse[]> {
    try {
      const query = `
      SELECT  id_detalle_orden_trabajo_material AS detail_work_order_material_id, id_orden_trabajo AS work_order_id, id_material AS material_id, cantidad AS quantity, costo_unitario AS unit_cost, subtotal
      FROM work_orders.detalle_orden_trabajo_material
      WHERE id_orden_trabajo = $1;
      `;
      const values = [workOrderId];
      const results =
        await this.postgreSqlService.query<DetailWorkOrderMaterialSqlResponse>(
          query,
          values,
        );

      const responses: DetailWorkOrderMaterialResponse[] =
        DetailWorkOrderMaterialAdapter.fromDetailWorkOrderMaterialSqlResponseListToDetailWorkOrderMaterialResponseList(
          results,
        );

      if (responses.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message:
            'No detail work order materials found for the given workOrderId',
        });
      }

      return responses;
    } catch (error) {
      throw error;
    }
  }

  async deleteDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<boolean> {
    try {
      const query = `
      DELETE FROM work_orders.detalle_orden_trabajo_material
      WHERE id_orden_trabajo = $1;
      `;
      const values = [workOrderId];
      const result = await this.postgreSqlService.query<boolean>(query, values);
      return result[0];
    } catch (error) {
      throw error;
    }
  }
}
