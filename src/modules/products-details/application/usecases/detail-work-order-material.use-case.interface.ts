import { CreateDetailWorkOrderMaterialRequest } from '../../domain/schemas/dto/request/create-detail-work-order-material.request';
import { DetailWorkOrderMaterialResponse } from '../../domain/schemas/dto/response/detail-work-order-material.response';

export interface InterfaceDetailWorkOrderMaterialUseCase {
  addDetailWorkOrderMaterials(
    detailWorkOrderMaterials: CreateDetailWorkOrderMaterialRequest[],
  ): Promise<DetailWorkOrderMaterialResponse[] | null>;

  getDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<DetailWorkOrderMaterialResponse[]>;

  deleteDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<boolean>;
}
