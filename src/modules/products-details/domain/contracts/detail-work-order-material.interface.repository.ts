import { DetailWorkOrderMaterialResponse } from '../schemas/dto/response/detail-work-order-material.response';
import { DetailWorkOrderMaterialModel } from '../schemas/models/detail-work-order-material.model';

export interface InterfaceDetailWorkOrderMaterialRepository {
  addDetailWorkOrderMaterials(
    detailWorkOrderMaterials: DetailWorkOrderMaterialModel[],
  ): Promise<DetailWorkOrderMaterialResponse[] | null>;

  getDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<DetailWorkOrderMaterialResponse[]>;
  deleteDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<boolean>;
}
