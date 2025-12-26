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
import {
  ViewAllWorkOrdersFullDetailsResponse,
  ViewWorkOrderAssignmentsResponse,
  ViewWorkOrderAttachmentsResponse,
  ViewWorkOrderMaterialsResponse,
  ViewWorkOrderObservationsResponse,
  ViewWorkOrdersByClientResponse,
  ViewWorkOrderStatisticsResponse,
} from '../../domain/schemas/dto/response/views.work-orders.response';
import { GetWorkOrderPriorityStatisticsResponse } from '../../domain/schemas/dto/response/get_work_order_priority_statistics.response';
import { GetWorkOrderStatusStatisticsResponse } from '../../domain/schemas/dto/response/get_work_order_status_statistics.response';
import { GetWorkOrderTypeStatisticsResponse } from '../../domain/schemas/dto/response/get_work_order_type_statistics.response';

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

  async getWorkOrderStatistics(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderStatisticsResponse[]> {
    try {
      const statistics = await this.workOrderRepository.getWorkOrderStatistics(
        limit,
        offset,
      );

      if (statistics.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order statistics found',
        });
      }

      return statistics;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderAssignments(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderAssignmentsResponse[]> {
    try {
      const assignments =
        await this.workOrderRepository.getWorkOrderAssignments(limit, offset);

      if (assignments.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order assignments found',
        });
      }

      return assignments;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderMaterials(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderMaterialsResponse[]> {
    try {
      const materials = await this.workOrderRepository.getWorkOrderMaterials(
        limit,
        offset,
      );

      if (materials.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order materials found',
        });
      }

      return materials;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderObservations(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderObservationsResponse[]> {
    try {
      const observations =
        await this.workOrderRepository.getWorkOrderObservations(limit, offset);

      if (observations.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order observations found',
        });
      }

      return observations;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderAttachments(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrderAttachmentsResponse[]> {
    try {
      const attachments =
        await this.workOrderRepository.getWorkOrderAttachments(limit, offset);

      if (attachments.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order attachments found',
        });
      }

      return attachments;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrdersByClient(
    limit?: number,
    offset?: number,
  ): Promise<ViewWorkOrdersByClientResponse[]> {
    try {
      const ordersByClient =
        await this.workOrderRepository.getWorkOrdersByClient(limit, offset);

      if (ordersByClient.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work orders by client found',
        });
      }

      return ordersByClient;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrdersFullDetails(
    limit?: number,
    offset?: number,
  ): Promise<ViewAllWorkOrdersFullDetailsResponse[]> {
    try {
      const fullDetails =
        await this.workOrderRepository.getAllWorkOrdersFullDetails(
          limit,
          offset,
        );

      if (fullDetails.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work orders full details found',
        });
      }

      return fullDetails;
    } catch (error) {
      throw error;
    }
  }

  async findWorkOrdersFullDetailsByOrderCode(
    orderCode: string,
  ): Promise<ViewAllWorkOrdersFullDetailsResponse | null> {
    try {
      if (!orderCode || orderCode.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order code',
        });
      }

      const fullDetails =
        await this.workOrderRepository.findWorkOrdersFullDetailsByOrderCode(
          orderCode,
        );

      if (!fullDetails) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No work order full details found for order code ${orderCode}`,
        });
      }

      return fullDetails;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderPriorityStatistics(): Promise<
    GetWorkOrderPriorityStatisticsResponse[]
  > {
    try {
      const priorityStatistics =
        await this.workOrderRepository.getWorkOrderPriorityStatistics();

      if (priorityStatistics.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order priority statistics found',
        });
      }

      return priorityStatistics;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderStatusStatistics(): Promise<
    GetWorkOrderStatusStatisticsResponse[]
  > {
    try {
      const statusStatistics =
        await this.workOrderRepository.getWorkOrderStatusStatistics();

      if (statusStatistics.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order status statistics found',
        });
      }

      return statusStatistics;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderTypeStatistics(): Promise<
    GetWorkOrderTypeStatisticsResponse[]
  > {
    try {
      const typeStatistics =
        await this.workOrderRepository.getWorkOrderTypeStatistics();

      if (typeStatistics.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order type statistics found',
        });
      }

      return typeStatistics;
    } catch (error) {
      throw error;
    }
  }
}
