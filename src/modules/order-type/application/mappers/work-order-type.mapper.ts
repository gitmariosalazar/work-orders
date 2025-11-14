import { CreateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/create.work-order-type.request';
import { UpdateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/update.work-order-type.request';
import { WorkOrderTypeModel } from '../../domain/schemas/models/work-order-type.model';

export class WorkOrderTypeMapper {
  static fromCreateWorkOrderTypeRequestToWorkOrderTypeModel(
    workOrderType: CreateWorkOrderTypeRequest,
  ): WorkOrderTypeModel {
    return new WorkOrderTypeModel(
      workOrderType.name,
      workOrderType.description,
    );
  }

  static fromWorkOrderTypeModelToCreateWorkOrderTypeRequest(
    workOrderType: WorkOrderTypeModel,
  ): CreateWorkOrderTypeRequest {
    return new CreateWorkOrderTypeRequest(
      workOrderType.getName(),
      workOrderType.getDescription(),
    );
  }

  static fromUpdateWorkOrderTypeRequestToWorkOrderTypeModel(
    workOrderType: UpdateWorkOrderTypeRequest,
  ): WorkOrderTypeModel {
    return new WorkOrderTypeModel(
      workOrderType.name,
      workOrderType.description,
    );
  }
}
