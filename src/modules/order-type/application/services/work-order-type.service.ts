import { InterfaceWorkOrderTypeRepository } from './../../domain/contracts/work-order-type.interface.repository';
import { Inject, Injectable } from "@nestjs/common";
import { InterfaceWorkOrderTypeUseCase } from "../usecases/work-order-type.use-case.interface";
import { CreateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/create.work-order-type.request';
import { WorkOrderTypeResponse } from '../../domain/schemas/dto/response/work-order-type.response';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';
import { WorkOrderTypeModel } from '../../domain/schemas/models/work-order-type.model';
import { WorkOrderTypeMapper } from '../mappers/work-order-type.mapper';
import { UpdateWorkOrderTypeRequest } from '../../domain/schemas/dto/request/update.work-order-type.request';

@Injectable()
export class WorkOrderTypeService implements InterfaceWorkOrderTypeUseCase {
  constructor(
    @Inject('WorkOrderTypeRepository')
    private readonly workOrderTypeRepository: InterfaceWorkOrderTypeRepository,
  ) { }

  async createWorkOrderType(workOrderType: CreateWorkOrderTypeRequest): Promise<WorkOrderTypeResponse | null> {
    try {

      const requiredFields: string[] = ['name', 'description'];

      const missingFieldMessages: string[] = validateFields(workOrderType, requiredFields);

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        })
      }

      const existWorkOrderType = await this.verifyWorkOrderTypeExistsByName(workOrderType.name);

      if (existWorkOrderType) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Work Order Type with name '${workOrderType.name}' already exists.`,
        });
      }

      const workOrderTypeModel: WorkOrderTypeModel = WorkOrderTypeMapper.fromCreateWorkOrderTypeRequestToWorkOrderTypeModel(workOrderType);

      const createdWorkOrderType = await this.workOrderTypeRepository.createWorkOrderType(workOrderTypeModel);

      if (!createdWorkOrderType) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create Work Order Type',
        });
      }

      return createdWorkOrderType;

    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrderType(workOrderTypeId: number, workOrderType: UpdateWorkOrderTypeRequest): Promise<WorkOrderTypeResponse | null> {
    try {

      const requiredFields: string[] = ['name', 'description'];

      const missingFieldMessages: string[] = validateFields(workOrderType, requiredFields);

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        })
      }

      const existWorkOrderType = await this.verifyWorkOrderTypeExistsByName(workOrderType.name);

      if (existWorkOrderType) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Work Order Type with name '${workOrderType.name}' already exists.`,
        });
      }

      const workOrderTypeModel: WorkOrderTypeModel = WorkOrderTypeMapper.fromUpdateWorkOrderTypeRequestToWorkOrderTypeModel(workOrderType);

      const updatedWorkOrderType = await this.workOrderTypeRepository.updateWorkOrderType(workOrderTypeId, workOrderTypeModel);

      if (!updatedWorkOrderType) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update Work Order Type',
        });
      }

      return updatedWorkOrderType;

    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderTypeById(workOrderTypeId: number): Promise<WorkOrderTypeResponse | null> {
    try {
      if (!workOrderTypeId || workOrderTypeId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid workOrderTypeId provided.',
        });
      }
      return await this.workOrderTypeRepository.getWorkOrderTypeById(workOrderTypeId);
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrderTypes(): Promise<WorkOrderTypeResponse[]> {
    try {
      const workOrderTypes = await this.workOrderTypeRepository.getAllWorkOrderTypes();

      if (workOrderTypes.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No Work Order Types found.',
        });
      }

      return workOrderTypes;
    } catch (error) {
      throw error;
    }
  }


  async verifyWorkOrderTypeExistsByName(workOrderTypeName: string): Promise<boolean> {
    try {
      return await this.workOrderTypeRepository.verifyWorkOrderTypeExistsByName(workOrderTypeName);
    } catch (error) {
      throw error;
    }
  }
}