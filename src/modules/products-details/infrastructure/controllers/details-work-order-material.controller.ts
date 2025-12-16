import { Controller } from '@nestjs/common';
import { DetailWorkOrderMaterialService } from '../../application/services/detail-work-order-material.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateDetailWorkOrderMaterialRequest } from '../../domain/schemas/dto/request/create-detail-work-order-material.request';

@Controller()
export class DetailsWorkOrderMaterialController {
  constructor(
    private readonly detailWorkOrderMaterialService: DetailWorkOrderMaterialService,
  ) {}
  @MessagePattern('detail_work_order_material.add_detail_work_order_materials')
  async addDetailWorkOrderMaterials(
    @Payload() detailWorkOrderMaterials: CreateDetailWorkOrderMaterialRequest[],
  ) {
    return this.detailWorkOrderMaterialService.addDetailWorkOrderMaterials(
      detailWorkOrderMaterials,
    );
  }

  @MessagePattern(
    'detail_work_order_material.get_detail_work_order_materials_by_work_order_id',
  )
  async getDetailWorkOrderMaterialsByWorkOrderId(
    @Payload() workOrderId: string,
  ) {
    return this.detailWorkOrderMaterialService.getDetailWorkOrderMaterialsByWorkOrderId(
      workOrderId,
    );
  }

  @MessagePattern(
    'detail_work_order_material.delete_detail_work_order_materials_by_work_order_id',
  )
  async deleteDetailWorkOrderMaterialsByWorkOrderId(
    @Payload() workOrderId: string,
  ) {
    return this.detailWorkOrderMaterialService.deleteDetailWorkOrderMaterialsByWorkOrderId(
      workOrderId,
    );
  }
}
