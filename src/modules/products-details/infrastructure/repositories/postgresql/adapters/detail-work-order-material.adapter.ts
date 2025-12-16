import { DetailWorkOrderMaterialResponse } from '../../../../domain/schemas/dto/response/detail-work-order-material.response';
import { DetailWorkOrderMaterialModel } from '../../../../domain/schemas/models/detail-work-order-material.model';
import { DetailWorkOrderMaterialSqlResponse } from '../../../interfaces/sql/detail-work-order-material.sql.response';

export class DetailWorkOrderMaterialAdapter {
  public static toResponse(
    model: DetailWorkOrderMaterialModel,
  ): DetailWorkOrderMaterialResponse {
    return {
      detailWorkOrderMaterialId: model.getDetailWorkOrderMaterialId(),
      workOrderId: model.getWorkOrderId(),
      materialId: model.getMaterialId(),
      quantity: model.getQuantity(),
      unitCost: model.getUnitCost(),
      subtotal: model.getSubtotal(),
    };
  }

  public static toResponseList(
    models: DetailWorkOrderMaterialModel[],
  ): DetailWorkOrderMaterialResponse[] {
    return models.map((model) => this.toResponse(model));
  }

  public static fromDetailWorkOrderMaterialSqlResponseToDetailWorkOrderMaterialResponse(
    sqlResponse: DetailWorkOrderMaterialSqlResponse,
  ): DetailWorkOrderMaterialResponse {
    return {
      detailWorkOrderMaterialId: sqlResponse.detail_work_order_material_id,
      workOrderId: sqlResponse.work_order_id,
      materialId: sqlResponse.material_id,
      quantity: sqlResponse.quantity,
      unitCost: sqlResponse.unit_cost,
      subtotal: sqlResponse.subtotal,
    };
  }

  public static fromDetailWorkOrderMaterialSqlResponseListToDetailWorkOrderMaterialResponseList(
    sqlResponses: DetailWorkOrderMaterialSqlResponse[],
  ): DetailWorkOrderMaterialResponse[] {
    return sqlResponses.map((sqlResponse) =>
      this.fromDetailWorkOrderMaterialSqlResponseToDetailWorkOrderMaterialResponse(
        sqlResponse,
      ),
    );
  }
}
