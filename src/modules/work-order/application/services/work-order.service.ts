/* eslint-disable no-useless-catch */
import { Inject, Injectable } from '@nestjs/common';
import { InterfaceWorkOrderUseCase } from '../usecases/work-order.use-case.interface';
import { InterfaceWorkOrderRepository } from '../../domain/contracts/work-order.interface.repository';
import { CreateWorkOrderRequest } from '../../domain/schemas/dto/request/create.work-order.request';
import { WorkOrderResponse } from '../../domain/schemas/dto/response/work-order.response';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { statusCode } from '../../../../settings/environments/status-code';
import { RpcException } from '@nestjs/microservices';
import { WorkOrderModel } from '../../domain/schemas/models/work-order.model';
import { WorkOrderMapper } from '../mappers/work-order.mapper';

@Injectable()
export class WorkOrderService implements InterfaceWorkOrderUseCase {
  constructor(
    @Inject('WorkOrderRepository')
    private readonly workOrderRepository: InterfaceWorkOrderRepository,
  ) {}

  async createWorkOrder(
    workOrder: CreateWorkOrderRequest,
  ): Promise<WorkOrderResponse | null> {
    try {
      const requiredFields: string[] = [
        'description',
        'workTypeId',
        'priorityId',
        'status',
        'cadastralKey',
        'createdUserId',
        'clientId',
      ];

      const missingFieldMessages: string[] = validateFields(
        workOrder,
        requiredFields,
      );
      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const workOrderModel: WorkOrderModel =
        WorkOrderMapper.fromCreateWorkOrderRequestToWorkOrderModel(workOrder);
      const createWorkOrder =
        await this.workOrderRepository.createWorkOrder(workOrderModel);

      if (!createWorkOrder) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create work order',
        });
      }

      return createWorkOrder;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrder(
    orderCode: string,
    workOrder: CreateWorkOrderRequest,
  ): Promise<WorkOrderResponse | null> {
    try {
      if (!orderCode || orderCode.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order ID',
        });
      }

      const requiredFields: string[] = [
        'description',
        'workTypeId',
        'priorityId',
        'status',
        'cadastralKey',
        'createdUserId',
        'clientId',
      ];

      const missingFieldMessages: string[] = validateFields(
        workOrder,
        requiredFields,
      );
      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const workOrderModel: WorkOrderModel =
        WorkOrderMapper.fromCreateWorkOrderRequestToWorkOrderModel(workOrder);
      const updateWorkOrder = await this.workOrderRepository.updateWorkOrder(
        orderCode,
        workOrderModel,
      );

      if (!updateWorkOrder) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update work order',
        });
      }

      return updateWorkOrder;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderById(orderCode: string): Promise<WorkOrderResponse | null> {
    try {
      if (!orderCode || orderCode.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order ID',
        });
      }

      const workOrder =
        await this.workOrderRepository.getWorkOrderById(orderCode);

      if (!workOrder) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Work order with code ${orderCode} not found`,
        });
      }

      return workOrder;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrdersByClientId(
    clientId: string,
  ): Promise<WorkOrderResponse[]> {
    try {
      if (!clientId) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Client ID is required',
        });
      }

      const workOrders =
        await this.workOrderRepository.getWorkOrdersByClientId(clientId);

      if (workOrders.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No work orders found for client ID ${clientId}`,
        });
      }

      return workOrders;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrders(): Promise<WorkOrderResponse[]> {
    try {
      const workOrders = await this.workOrderRepository.getAllWorkOrders();

      if (workOrders.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work orders found',
        });
      }

      return workOrders;
    } catch (error) {
      throw error;
    }
  }
}
