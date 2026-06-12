import { CreateDetailWorkOrderMaterialRequest } from '../../domain/schemas/dto/request/create-detail-work-order-material.request';
import { DetailWorkOrderMaterialResponse } from '../../domain/schemas/dto/response/detail-work-order-material.response';
import { DetailWorkOrderMaterialModel } from '../../domain/schemas/models/detail-work-order-material.model';

export class DetailWorkOrderMaterialMapper {
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

  public static toModel(
    request: CreateDetailWorkOrderMaterialRequest,
  ): DetailWorkOrderMaterialModel {
    return new DetailWorkOrderMaterialModel(
      '',
      request.workOrderId,
      request.materialId,
      request.quantity,
      request.unitCost,
      request.quantity * request.unitCost,
    );
  }

  public static toModelList(
    requests: CreateDetailWorkOrderMaterialRequest[],
  ): DetailWorkOrderMaterialModel[] {
    return requests.map((request) => this.toModel(request));
  }
}
