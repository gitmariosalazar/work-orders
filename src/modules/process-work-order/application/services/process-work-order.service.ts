import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';
import { InterfaceProcessWorkOrderRepository } from '../../domain/contracts/process-work-order.interface.repository';
import { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
import { ProcessWorkOrderResponse } from '../../domain/schemas/dto/response/process-work-order.response';
import { ProcessWorkOrderMapper } from '../mappers/process-work-order.mapper';
import { InterfaceProcessWorkOrderUseCase } from '../usecases/process-work-order.use-case.interface';
import {
  AddAdditionalCostCommand,
  AddPreparationInspectionDetailCommand,
  AddQualityControlDetailCommand,
  AddWorkOrderAttachmentCommand,
  AddWorkOrderMaterialCommand,
  AddWorkerToWorkOrderCommand,
  AssignWorkOrderToCrewCommand,
  AssignWorkOrderToWorkerCommand,
  CreatePreparationInspectionCommand,
  CreateQualityControlCommand,
  CreateWorkOrderCommand,
  RegisterSatisfactionSurveyCommand,
  RemoveWorkerFromWorkOrderCommand,
} from '../../domain/schemas/dto/process-work-order.commands';
import {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking,
  OrdenTrabajoVistaCliente,
  WorkOrderListItem,
} from '../../domain/schemas/dto/response/work-orders.get.response';

@Injectable()
export class ProcessWorkOrderService implements InterfaceProcessWorkOrderUseCase {
  constructor(
    @Inject('ProcessWorkOrderRepository')
    private readonly processWorkOrderRepository: InterfaceProcessWorkOrderRepository,
  ) {}

  async createWorkOrder(
    createWorkOrder: CreateWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(createWorkOrder.origin, 'origin');
      this.validatePositiveInteger(createWorkOrder.workTypeId, 'workTypeId');
      this.validatePositiveInteger(createWorkOrder.priorityId, 'priorityId');
      this.validateString(createWorkOrder.clientId, 'clientId');
      this.validateString(createWorkOrder.location, 'location');
      this.validateString(createWorkOrder.createdByUserId, 'createdByUserId');

      const result =
        await this.processWorkOrderRepository.createWorkOrder(createWorkOrder);

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async processWorkOrder(
    processWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateTransitionRequest(processWorkOrder);

      const processWorkOrderModel =
        ProcessWorkOrderMapper.fromRequestToModel(processWorkOrder);

      const result = await this.processWorkOrderRepository.processWorkOrder(
        processWorkOrderModel,
      );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order could not be processed.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async receiveWorkOrder(
    receiveWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(receiveWorkOrder);
  }

  async assignWorkOrderToCrew(
    assignWorkOrderToCrew: AssignWorkOrderToCrewCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(assignWorkOrderToCrew.workOrderId, 'workOrderId');
      this.validateString(assignWorkOrderToCrew.crewId, 'crewId');
      this.validateString(
        assignWorkOrderToCrew.assignedByUserId,
        'assignedByUserId',
      );

      const result =
        await this.processWorkOrderRepository.assignWorkOrderToCrew(
          assignWorkOrderToCrew,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order could not be assigned to crew.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async assignWorkOrderToWorker(
    assignWorkOrderToWorker: AssignWorkOrderToWorkerCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(assignWorkOrderToWorker.workOrderId, 'workOrderId');
      this.validateString(assignWorkOrderToWorker.workerId, 'workerId');
      this.validateString(
        assignWorkOrderToWorker.assignedByUserId,
        'assignedByUserId',
      );

      const result =
        await this.processWorkOrderRepository.assignWorkOrderToWorker(
          assignWorkOrderToWorker,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order could not be assigned to worker.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async startPreparation(
    startPreparation: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(startPreparation);
  }

  async createPreparationInspection(
    createPreparationInspection: CreatePreparationInspectionCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(
        createPreparationInspection.workOrderId,
        'workOrderId',
      );
      this.validateString(
        createPreparationInspection.createdByUserId,
        'createdByUserId',
      );

      const result =
        await this.processWorkOrderRepository.createPreparationInspection(
          createPreparationInspection,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Preparation inspection could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addPreparationInspectionDetail(
    addPreparationInspectionDetail: AddPreparationInspectionDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(
        addPreparationInspectionDetail.workOrderId,
        'workOrderId',
      );
      this.validateString(
        addPreparationInspectionDetail.inspectionId,
        'inspectionId',
      );
      this.validateString(addPreparationInspectionDetail.code, 'code');
      this.validateString(
        addPreparationInspectionDetail.createdByUserId,
        'createdByUserId',
      );

      const result =
        await this.processWorkOrderRepository.addPreparationInspectionDetail(
          addPreparationInspectionDetail,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Preparation inspection detail could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async resolvePreparationInspection(
    resolvePreparationInspection: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(resolvePreparationInspection);
  }

  async markWorkOrderExecutionStarted(
    markWorkOrderExecutionStarted: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(markWorkOrderExecutionStarted);
  }

  async addWorkOrderMaterial(
    addWorkOrderMaterial: AddWorkOrderMaterialCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(addWorkOrderMaterial.workOrderId, 'workOrderId');
      this.validatePositiveInteger(
        addWorkOrderMaterial.materialId,
        'materialId',
      );
      this.validatePositiveNumber(addWorkOrderMaterial.quantity, 'quantity');
      this.validatePositiveNumber(addWorkOrderMaterial.unitCost, 'unitCost');
      this.validateString(
        addWorkOrderMaterial.createdByUserId,
        'createdByUserId',
      );

      const result =
        await this.processWorkOrderRepository.addWorkOrderMaterial(
          addWorkOrderMaterial,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order material could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addAdditionalCost(
    addAdditionalCost: AddAdditionalCostCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(addAdditionalCost.workOrderId, 'workOrderId');
      this.validateString(addAdditionalCost.concept, 'concept');
      this.validatePositiveNumber(addAdditionalCost.quantity, 'quantity');
      this.validatePositiveNumber(addAdditionalCost.unitCost, 'unitCost');
      this.validateString(addAdditionalCost.createdByUserId, 'createdByUserId');

      const result =
        await this.processWorkOrderRepository.addAdditionalCost(
          addAdditionalCost,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Additional cost could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addWorkOrderAttachment(
    addWorkOrderAttachment: AddWorkOrderAttachmentCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(addWorkOrderAttachment.workOrderId, 'workOrderId');
      this.validateString(addWorkOrderAttachment.fileName, 'fileName');
      this.validateString(addWorkOrderAttachment.fileType, 'fileType');
      this.validateString(addWorkOrderAttachment.fileUrl, 'fileUrl');
      this.validateString(
        addWorkOrderAttachment.createdByUserId,
        'createdByUserId',
      );

      const result =
        await this.processWorkOrderRepository.addWorkOrderAttachment(
          addWorkOrderAttachment,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order attachment could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async createQualityControl(
    createQualityControl: CreateQualityControlCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(createQualityControl.workOrderId, 'workOrderId');
      this.validateString(
        createQualityControl.createdByUserId,
        'createdByUserId',
      );

      const result =
        await this.processWorkOrderRepository.createQualityControl(
          createQualityControl,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Quality control could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async addQualityControlDetail(
    addQualityControlDetail: AddQualityControlDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(addQualityControlDetail.workOrderId, 'workOrderId');
      this.validateString(addQualityControlDetail.controlId, 'controlId');
      this.validateString(addQualityControlDetail.code, 'code');
      this.validateString(
        addQualityControlDetail.createdByUserId,
        'createdByUserId',
      );

      const result =
        await this.processWorkOrderRepository.addQualityControlDetail(
          addQualityControlDetail,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Quality control detail could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async resolveQualityControl(
    resolveQualityControl: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(resolveQualityControl);
  }

  async completeWorkOrder(
    completeWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(completeWorkOrder);
  }

  async registerSatisfactionSurvey(
    registerSatisfactionSurvey: RegisterSatisfactionSurveyCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(
        registerSatisfactionSurvey.workOrderId,
        'workOrderId',
      );
      this.validatePositiveInteger(registerSatisfactionSurvey.rating, 'rating');
      this.validateString(
        registerSatisfactionSurvey.createdByUserId,
        'createdByUserId',
      );

      const result =
        await this.processWorkOrderRepository.registerSatisfactionSurvey(
          registerSatisfactionSurvey,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Satisfaction survey could not be created.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // ─── Personal asignado directamente a la OT ──────────────────────────────────────

  async addWorkerToWorkOrder(
    cmd: AddWorkerToWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(cmd.workOrderId, 'workOrderId');
      this.validateString(cmd.workerId, 'workerId');
      this.validateString(cmd.assignedByUserId, 'assignedByUserId');

      const result =
        await this.processWorkOrderRepository.addWorkerToWorkOrder(cmd);

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Worker could not be added to work order.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async removeWorkerFromWorkOrder(
    cmd: RemoveWorkerFromWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      this.validateString(cmd.workOrderId, 'workOrderId');
      this.validateString(cmd.workerId, 'workerId');
      this.validateString(cmd.removedByUserId, 'removedByUserId');

      const result =
        await this.processWorkOrderRepository.removeWorkerFromWorkOrder(cmd);

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Worker could not be removed from work order.',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  private async transitionWorkOrder(
    request: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    this.validateTransitionRequest(request);

    const processWorkOrderModel =
      ProcessWorkOrderMapper.fromRequestToModel(request);

    const result = await this.processWorkOrderRepository.processWorkOrder(
      processWorkOrderModel,
    );

    if (!result) {
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: 'Work order could not be processed.',
      });
    }

    return result;
  }

  private validateTransitionRequest(request: ProcessWorkOrderRequest): void {
    if (!request) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Process work order payload is required.',
      });
    }

    const workOrderId = request.workOrderId?.trim();
    const newStatus = request.newStatus?.trim();
    const userId = request.userId?.trim();

    if (!workOrderId) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Work order ID is required.',
      });
    }

    if (!newStatus) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'New status is required.',
      });
    }

    if (!userId) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'User ID is required.',
      });
    }
  }

  private validateString(value: unknown, fieldName: string): void {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: `${fieldName} is required.`,
      });
    }
  }

  private validatePositiveInteger(value: number, fieldName: string): void {
    if (!Number.isInteger(value) || value <= 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: `${fieldName} must be a positive integer.`,
      });
    }
  }

  private validatePositiveNumber(value: number, fieldName: string): void {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: `${fieldName} must be a positive number.`,
      });
    }
  }

  async getOrdenTrabajoDetalleByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoDetalle | null> {
    try {
      this.validateString(numeroOrden, 'numeroOrden');

      const result =
        await this.processWorkOrderRepository.getOrdenTrabajoDetalleByNumeroOrden(
          numeroOrden,
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getOrdenesTrabajoBySolicitudId(
    solicitudId: string,
  ): Promise<OrdenTrabajoVistaCliente[]> {
    try {
      this.validateString(solicitudId, 'solicitudId');

      const result =
        await this.processWorkOrderRepository.getOrdenesTrabajoBySolicitudId(
          solicitudId,
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getOrdenTrabajoTrackingByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoTracking | null> {
    try {
      this.validateString(numeroOrden, 'numeroOrden');

      const result =
        await this.processWorkOrderRepository.getOrdenTrabajoTrackingByNumeroOrden(
          numeroOrden,
        );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrders(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderListItem[]> {
    try {
      // limit > 0 (cuántos traer)
      if (limit !== undefined) {
        this.validatePositiveInteger(limit, 'limit');
      }
      // offset >= 0 (desde qué posición — 0 es la primera fila, válido en SQL)
      if (offset !== undefined) {
        if (!Number.isInteger(offset) || offset < 0) {
          throw new RpcException({
            statusCode: 400,
            message: 'offset must be a non-negative integer.',
          });
        }
      }

      const result = await this.processWorkOrderRepository.getAllWorkOrders(
        limit,
        offset,
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
