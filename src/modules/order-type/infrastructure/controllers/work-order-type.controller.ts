import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Post, Put } from "@nestjs/common";
import { WorkOrderTypeService } from "../../application/services/work-order-type.service";
import { CreateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/create.work-order-type.request';
import { UpdateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/update.work-order-type.request';

@Controller('work-order-types')
export class WorkOrderTypeController {
  constructor(
    private readonly workOrderTypeService: WorkOrderTypeService,
  ) { }

  @Post('create-work-order-type')
  @MessagePattern('work-order-type.create-work-order-type')
  async createWorkOrderType(@Payload() workOrderType: CreateWorkOrderTypeRequest) {
    return this.workOrderTypeService.createWorkOrderType(workOrderType);
  }

  @Put('update-work-order-type/:workOrderTypeId')
  @MessagePattern('work-order-type.update-work-order-type')
  async updateWorkOrderType(
    @Payload() data: { workOrderTypeId: number; workOrderType: UpdateWorkOrderTypeRequest },
  ) {
    const { workOrderTypeId, workOrderType } = data;
    return this.workOrderTypeService.updateWorkOrderType(workOrderTypeId, workOrderType);
  }

  @MessagePattern('work-order-type.get-work-order-type-by-id')
  async getWorkOrderTypeById(@Payload() workOrderTypeId: number) {
    return this.workOrderTypeService.getWorkOrderTypeById(workOrderTypeId);
  }

  @MessagePattern('work-order-type.get-all-work-order-types')
  async getAllWorkOrderTypes() {
    return this.workOrderTypeService.getAllWorkOrderTypes();
  }

  @MessagePattern('work-order-type.verify-work-order-type-exists-by-name')
  async verifyWorkOrderTypeExistsByName(@Payload() workOrderTypeName: string) {
    return this.workOrderTypeService.verifyWorkOrderTypeExistsByName(workOrderTypeName);
  }
}