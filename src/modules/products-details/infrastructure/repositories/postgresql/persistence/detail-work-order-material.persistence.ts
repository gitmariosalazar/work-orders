/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { InterfaceDetailWorkOrderMaterialRepository } from '../../../../domain/contracts/detail-work-order-material.interface.repository';
import { DetailWorkOrderMaterialResponse } from '../../../../domain/schemas/dto/response/detail-work-order-material.response';
import { DetailWorkOrderMaterialModel } from '../../../../domain/schemas/models/detail-work-order-material.model';
import { DetailWorkOrderMaterialSqlResponse } from '../../../interfaces/sql/detail-work-order-material.sql.response';
import { DetailWorkOrderMaterialAdapter } from '../adapters/detail-work-order-material.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class DetailWorkOrderMaterialPostgreSqlPersistence implements InterfaceDetailWorkOrderMaterialRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async addDetailWorkOrderMaterials(
    detailWorkOrderMaterials: DetailWorkOrderMaterialModel[],
  ): Promise<DetailWorkOrderMaterialResponse[] | null> {
    try {
      const query = `
      INSERT INTO work_orders.detalle_orden_trabajo_material (
        id_orden_trabajo,
        id_material,
        cantidad,
        costo_unitario,
        codigo,
        nombre,
        created_by
      )
      SELECT
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        ot.created_by
      FROM work_orders.orden_trabajo ot
      WHERE ot.id_orden_trabajo = $1
        AND ot.is_deleted = FALSE
      RETURNING
        id_detalle_material AS detail_work_order_material_id,
        id_orden_trabajo AS work_order_id,
        id_material AS material_id,
        cantidad AS quantity,
        costo_unitario AS unit_cost,
        codigo AS code,
        nombre AS name,
        subtotal;
      `;

      const results = await this.databaseService.transaction<
        DetailWorkOrderMaterialSqlResponse[]
      >(async (client) => {
        const insertedRows: DetailWorkOrderMaterialSqlResponse[] = [];

        for (const detailWorkOrderMaterial of detailWorkOrderMaterials) {
          const values = [
            detailWorkOrderMaterial.getWorkOrderId(),
            detailWorkOrderMaterial.getMaterialId(),
            detailWorkOrderMaterial.getQuantity(),
            detailWorkOrderMaterial.getUnitCost(),
            detailWorkOrderMaterial.getCode(),
            detailWorkOrderMaterial.getName(),
          ];

          const result = await client.query<DetailWorkOrderMaterialSqlResponse>(
            query,
            values,
          );

          if (result.length === 0) {
            throw new RpcException({
              statusCode: statusCode.BAD_REQUEST,
              message: `Work order with ID ${detailWorkOrderMaterial.getWorkOrderId()} does not exist.`,
            });
          }

          insertedRows.push(result[0]);
        }

        return insertedRows;
      });

      if (results.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No detail work order materials were added',
        });
      }

      return DetailWorkOrderMaterialAdapter.fromDetailWorkOrderMaterialSqlResponseListToDetailWorkOrderMaterialResponseList(
        results,
      );
    } catch (error) {
      throw error;
    }
  }

  async getDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<DetailWorkOrderMaterialResponse[]> {
    try {
      const query = `
      SELECT
        id_detalle_material AS detail_work_order_material_id,
        id_orden_trabajo AS work_order_id,
        id_material AS material_id,
        cantidad AS quantity,
        costo_unitario AS unit_cost,
        codigo AS code,
        nombre AS name,
        subtotal
      FROM work_orders.detalle_orden_trabajo_material
      WHERE id_orden_trabajo = $1
        AND is_deleted = FALSE
      ORDER BY created_at DESC;
      `;
      const values = [workOrderId];
      const results =
        await this.databaseService.query<DetailWorkOrderMaterialSqlResponse>(
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
      UPDATE work_orders.detalle_orden_trabajo_material
      SET
        is_deleted = TRUE,
        deleted_at = NOW(),
        updated_at = NOW()
      WHERE id_orden_trabajo = $1
        AND is_deleted = FALSE;
      `;
      const values = [workOrderId];
      const result = await this.databaseService.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}
