import { Inject, Injectable } from '@nestjs/common';
import { InterfaceWorkOrderHistoryUseCase } from '../usecases/work-order-history.use-case.interface';
import { InterfaceWorkOrderHistoryRepository } from '../../domain/contracts/work-order-history.interface.repository';
import { CreateWorkHistoryRequest } from '../../domain/schemas/dto/request/creeate.work-order-history.request';
import { WorkOrderHistoryResponse } from '../../domain/schemas/dto/response/work-order-history.response';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';
import { WorkOrderHistoryModel } from '../../domain/schemas/models/work-order-history.model';
import { WorkOrderHistoryMapper } from '../mappers/work-order-history.mapper';
import { UpdateWorkOrderHistoryRequest } from '../../domain/schemas/dto/request/update.work-order-history.request';

@Injectable()
export class WorkOrderHistoryService
  implements InterfaceWorkOrderHistoryUseCase {
  constructor(
    @Inject('WorkOrderHistoryRepository')
    private readonly workOrderHistoryRepository: InterfaceWorkOrderHistoryRepository,
  ) { }

  async createWorkOrderHistory(
    createWorkOrderHistoryRequest: CreateWorkHistoryRequest,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      const requiredFields: string[] = ['workOrderId', 'changeDate', 'userId'];

      const missingFieldMessages: string[] = validateFields(
        createWorkOrderHistoryRequest,
        requiredFields,
      );

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const workOrderHistoryModel: WorkOrderHistoryModel =
        WorkOrderHistoryMapper.fromCreateWorkOrderHistoryRequestToWorkOrderHistoryModel(
          createWorkOrderHistoryRequest,
        );

      const createdWorkOrderHistory =
        await this.workOrderHistoryRepository.create(workOrderHistoryModel);

      if (!createdWorkOrderHistory) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create work order history.',
        });
      }

      return createdWorkOrderHistory;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrderHistory(
    workOrderHistoryId: number,
    updateWorkOrderHistoryRequest: Partial<UpdateWorkOrderHistoryRequest>,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      if (!workOrderHistoryId || workOrderHistoryId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order history ID.',
        });
      }

      if (Object.keys(updateWorkOrderHistoryRequest).length === 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message:
            'At least one field must be provided to update the work order history.',
        });
      }

      const requiredFields: string[] = [
        'previousStatusId',
        'newStatusId',
        'userId',
      ];

      const missingFieldMessages: string[] = validateFields(
        updateWorkOrderHistoryRequest,
        requiredFields,
      );

      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const workOrderHistoryModel: Partial<WorkOrderHistoryModel> =
        WorkOrderHistoryMapper.fromUpdateWorkOrderHistoryRequestToWorkOrderHistoryModel(
          updateWorkOrderHistoryRequest,
        );

      const updatedWorkOrderHistory =
        await this.workOrderHistoryRepository.update(
          workOrderHistoryId,
          workOrderHistoryModel,
        );

      if (!updatedWorkOrderHistory) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update work order history.',
        });
      }

      return updatedWorkOrderHistory;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderHistoryById(
    workOrderHistoryId: number,
  ): Promise<WorkOrderHistoryResponse | null> {
    try {
      if (!workOrderHistoryId || workOrderHistoryId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order history ID.',
        });
      }

      const workOrderHistory =
        await this.workOrderHistoryRepository.findById(workOrderHistoryId);

      if (!workOrderHistory) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Work order history not found.',
        });
      }

      return workOrderHistory;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderHistoriesByWorkOrderId(
    workOrderId: number,
  ): Promise<WorkOrderHistoryResponse[] | null> {
    try {
      if (!workOrderId || workOrderId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order ID.',
        });
      }

      const workOrderHistories =
        await this.workOrderHistoryRepository.findByWorkOrderId(workOrderId);

      if (!workOrderHistories || workOrderHistories.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order histories found for the given work order ID.',
        });
      }

      return workOrderHistories;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrderHistories(): Promise<WorkOrderHistoryResponse[] | null> {
    try {
      const workOrderHistories =
        await this.workOrderHistoryRepository.findAll();

      if (!workOrderHistories || workOrderHistories.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order histories found.',
        });
      }

      return workOrderHistories;
    } catch (error) {
      throw error;
    }
  }
}
