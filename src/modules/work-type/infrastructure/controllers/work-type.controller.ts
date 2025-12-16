import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller, Post, Put } from '@nestjs/common';
import { WorkTypeService } from '../../application/services/work-type.service';
import { CreateWorkTypeRequest } from '../../domain/schemas/dto/request/create.work-type.request';
import { UpdateWorkTypeRequest } from '../../domain/schemas/dto/request/update.work-type.request';

@Controller('work--types')
export class WorkTypeController {
  constructor(private readonly workTypeService: WorkTypeService) {}

  @Post('create-work-type')
  @MessagePattern('work-type.create-work-type')
  async createWorkType(@Payload() workType: CreateWorkTypeRequest) {
    console.log('Received createWorkType request:', workType);
    return this.workTypeService.createWorkType(workType);
  }

  @Put('update-work-type/:workTypeId')
  @MessagePattern('work-type.update-work-type')
  async updateWorkType(
    @Payload()
    data: {
      workTypeId: number;
      workType: UpdateWorkTypeRequest;
    },
  ) {
    const { workTypeId, workType } = data;
    return this.workTypeService.updateWorkType(workTypeId, workType);
  }

  @MessagePattern('work-type.get-work-type-by-id')
  async getWorkTypeById(@Payload() workTypeId: number) {
    return this.workTypeService.getWorkTypeById(workTypeId);
  }

  @MessagePattern('work-type.get-all-work-types')
  async getAllWorkTypes() {
    return this.workTypeService.getAllWorkTypes();
  }

  @MessagePattern('work-type.verify-work-type-exists-by-name')
  async verifyWorkTypeExistsByName(@Payload() workTypeName: string) {
    return this.workTypeService.verifyWorkTypeExistsByName(workTypeName);
  }

  @MessagePattern('work-type.find-work-types-by-department-id')
  async findWorkTypesByDepartmentId(@Payload() departmentId: number) {
    return this.workTypeService.findWorkTypesByDepartmentId(departmentId);
  }
}
