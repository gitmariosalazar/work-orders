import { InterfaceWorkTypeRepository } from '../../domain/contracts/work-type.interface.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InterfaceWorkTypeUseCase } from '../usecases/work-type.use-case.interface';
import { CreateWorkTypeRequest } from '../../domain/schemas/dto/request/create.work-type.request';
import { WorkTypeResponse } from '../../domain/schemas/dto/response/work-type.response';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';
import { WorkTypeModel } from '../../domain/schemas/models/work-type.model';
import { WorkTypeMapper } from '../mappers/work-type.mapper';
import { UpdateWorkTypeRequest } from '../../domain/schemas/dto/request/update.work-type.request';

@Injectable()
export class WorkTypeService implements InterfaceWorkTypeUseCase {
  constructor(
    @Inject('WorkTypeRepository')
    private readonly workTypeRepository: InterfaceWorkTypeRepository,
  ) {}

  async createWorkType(
    workType: CreateWorkTypeRequest,
  ): Promise<WorkTypeResponse | null> {
    try {
      const requiredFields: string[] = ['name', 'description', 'departmentId'];

      const missingFieldMessages: string[] = validateFields(
        workType,
        requiredFields,
      );

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const existWorkType = await this.verifyWorkTypeExistsByName(
        workType.name,
      );

      if (existWorkType) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Work Type with name '${workType.name}' already exists.`,
        });
      }

      const workTypeModel: WorkTypeModel =
        WorkTypeMapper.fromCreateWorkTypeRequestToWorkTypeModel(workType);

      console.log('Converted WorkTypeModel:', workTypeModel);

      const createdWorkType =
        await this.workTypeRepository.createWorkType(workTypeModel);

      if (!createdWorkType) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create Work Type',
        });
      }

      return createdWorkType;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkType(
    workTypeId: number,
    workType: UpdateWorkTypeRequest,
  ): Promise<WorkTypeResponse | null> {
    try {
      const requiredFields: string[] = ['name', 'description'];

      const missingFieldMessages: string[] = validateFields(
        workType,
        requiredFields,
      );

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const existWorkType = await this.verifyWorkTypeExistsByName(
        workType.name,
      );

      if (existWorkType) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `Work Type with name '${workType.name}' already exists.`,
        });
      }

      const workTypeModel: WorkTypeModel =
        WorkTypeMapper.fromUpdateWorkTypeRequestToWorkTypeModel(workType);

      const updatedWorkType = await this.workTypeRepository.updateWorkType(
        workTypeId,
        workTypeModel,
      );

      if (!updatedWorkType) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update Work Type',
        });
      }

      return updatedWorkType;
    } catch (error) {
      throw error;
    }
  }

  async getWorkTypeById(workTypeId: number): Promise<WorkTypeResponse | null> {
    try {
      if (!workTypeId || workTypeId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid workTypeId provided.',
        });
      }
      return await this.workTypeRepository.getWorkTypeById(workTypeId);
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkTypes(): Promise<WorkTypeResponse[]> {
    try {
      const workTypes = await this.workTypeRepository.getAllWorkTypes();

      if (workTypes.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No Work Types found.',
        });
      }

      return workTypes;
    } catch (error) {
      throw error;
    }
  }

  async verifyWorkTypeExistsByName(workTypeName: string): Promise<boolean> {
    try {
      return await this.workTypeRepository.verifyWorkTypeExistsByName(
        workTypeName,
      );
    } catch (error) {
      throw error;
    }
  }

  async findWorkTypesByDepartmentId(
    departmentId: number,
  ): Promise<WorkTypeResponse[]> {
    try {
      if (!departmentId || departmentId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid departmentId provided.',
        });
      }

      const workTypes =
        await this.workTypeRepository.findWorkTypesByDepartmentId(departmentId);

      if (workTypes.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No Work Types found for Department ID '${departmentId}'.`,
        });
      }

      return workTypes;
    } catch (error) {
      throw error;
    }
  }
}
