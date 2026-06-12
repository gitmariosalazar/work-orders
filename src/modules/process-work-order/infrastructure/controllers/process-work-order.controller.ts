import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProcessWorkOrderService } from '../../application/services/process-work-order.service';
import { ProcessWorkOrderRequest } from '../../domain/schemas/dto/request/process-work-order.request';
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

@Controller('process-work-orders')
export class ProcessWorkOrderController {
  constructor(
    private readonly processWorkOrderService: ProcessWorkOrderService,
  ) {}

  @MessagePattern('work-orders.process-work-order.create')
  async createWorkOrder(createWorkOrder: CreateWorkOrderCommand) {
    return this.processWorkOrderService.createWorkOrder(createWorkOrder);
  }

  @MessagePattern('work-orders.process-work-order')
  async processWorkOrder(processWorkOrder: ProcessWorkOrderRequest) {
    return this.processWorkOrderService.processWorkOrder(processWorkOrder);
  }

  @MessagePattern('work-orders.process-work-order.receive')
  async receiveWorkOrder(receiveWorkOrder: ProcessWorkOrderRequest) {
    return this.processWorkOrderService.receiveWorkOrder(receiveWorkOrder);
  }

  @MessagePattern('work-orders.process-work-order.assign-crew')
  async assignWorkOrderToCrew(
    assignWorkOrderToCrew: AssignWorkOrderToCrewCommand,
  ) {
    return this.processWorkOrderService.assignWorkOrderToCrew(
      assignWorkOrderToCrew,
    );
  }

  @MessagePattern('work-orders.process-work-order.assign-worker')
  async assignWorkOrderToWorker(
    assignWorkOrderToWorker: AssignWorkOrderToWorkerCommand,
  ) {
    return this.processWorkOrderService.assignWorkOrderToWorker(
      assignWorkOrderToWorker,
    );
  }

  @MessagePattern('work-orders.process-work-order.start-preparation')
  async startPreparation(startPreparation: ProcessWorkOrderRequest) {
    return this.processWorkOrderService.startPreparation(startPreparation);
  }

  @MessagePattern(
    'work-orders.process-work-order.create-preparation-inspection',
  )
  async createPreparationInspection(
    createPreparationInspection: CreatePreparationInspectionCommand,
  ) {
    return this.processWorkOrderService.createPreparationInspection(
      createPreparationInspection,
    );
  }

  @MessagePattern(
    'work-orders.process-work-order.add-preparation-inspection-detail',
  )
  async addPreparationInspectionDetail(
    addPreparationInspectionDetail: AddPreparationInspectionDetailCommand,
  ) {
    return this.processWorkOrderService.addPreparationInspectionDetail(
      addPreparationInspectionDetail,
    );
  }

  @MessagePattern(
    'work-orders.process-work-order.resolve-preparation-inspection',
  )
  async resolvePreparationInspection(
    resolvePreparationInspection: ProcessWorkOrderRequest,
  ) {
    return this.processWorkOrderService.resolvePreparationInspection(
      resolvePreparationInspection,
    );
  }

  @MessagePattern('work-orders.process-work-order.start-execution')
  async markWorkOrderExecutionStarted(
    markWorkOrderExecutionStarted: ProcessWorkOrderRequest,
  ) {
    return this.processWorkOrderService.markWorkOrderExecutionStarted(
      markWorkOrderExecutionStarted,
    );
  }

  @MessagePattern('work-orders.process-work-order.add-work-order-material')
  async addWorkOrderMaterial(
    addWorkOrderMaterial: AddWorkOrderMaterialCommand,
  ) {
    return this.processWorkOrderService.addWorkOrderMaterial(
      addWorkOrderMaterial,
    );
  }

  @MessagePattern('work-orders.process-work-order.add-additional-cost')
  async addAdditionalCost(addAdditionalCost: AddAdditionalCostCommand) {
    return this.processWorkOrderService.addAdditionalCost(addAdditionalCost);
  }

  @MessagePattern('work-orders.process-work-order.add-work-order-attachment')
  async addWorkOrderAttachment(
    addWorkOrderAttachment: AddWorkOrderAttachmentCommand,
  ) {
    return this.processWorkOrderService.addWorkOrderAttachment(
      addWorkOrderAttachment,
    );
  }

  @MessagePattern('work-orders.process-work-order.create-quality-control')
  async createQualityControl(
    createQualityControl: CreateQualityControlCommand,
  ) {
    return this.processWorkOrderService.createQualityControl(
      createQualityControl,
    );
  }

  @MessagePattern('work-orders.process-work-order.add-quality-control-detail')
  async addQualityControlDetail(
    addQualityControlDetail: AddQualityControlDetailCommand,
  ) {
    return this.processWorkOrderService.addQualityControlDetail(
      addQualityControlDetail,
    );
  }

  @MessagePattern('work-orders.process-work-order.resolve-quality-control')
  async resolveQualityControl(resolveQualityControl: ProcessWorkOrderRequest) {
    return this.processWorkOrderService.resolveQualityControl(
      resolveQualityControl,
    );
  }

  @MessagePattern('work-orders.process-work-order.complete')
  async completeWorkOrder(completeWorkOrder: ProcessWorkOrderRequest) {
    return this.processWorkOrderService.completeWorkOrder(completeWorkOrder);
  }

  @MessagePattern('work-orders.process-work-order.register-satisfaction-survey')
  async registerSatisfactionSurvey(
    registerSatisfactionSurvey: RegisterSatisfactionSurveyCommand,
  ) {
    return this.processWorkOrderService.registerSatisfactionSurvey(
      registerSatisfactionSurvey,
    );
  }

  // ─── Personal asignado directamente a la OT ───────────────────────────────────────

  @MessagePattern('work-orders.process-work-order.add-worker')
  async addWorkerToWorkOrder(cmd: AddWorkerToWorkOrderCommand) {
    return this.processWorkOrderService.addWorkerToWorkOrder(cmd);
  }

  @MessagePattern('work-orders.process-work-order.remove-worker')
  async removeWorkerFromWorkOrder(cmd: RemoveWorkerFromWorkOrderCommand) {
    return this.processWorkOrderService.removeWorkerFromWorkOrder(cmd);
  }

  @MessagePattern('work-orders.process-work-order.get-detalle-by-numero-orden')
  async getOrdenTrabajoDetalleByNumeroOrden(payload: { numeroOrden: string }) {
    return this.processWorkOrderService.getOrdenTrabajoDetalleByNumeroOrden(
      payload.numeroOrden,
    );
  }

  @MessagePattern('work-orders.process-work-order.get-tracking-by-numero-orden')
  async getOrdenTrabajoTrackingByNumeroOrden(payload: { numeroOrden: string }) {
    return this.processWorkOrderService.getOrdenTrabajoTrackingByNumeroOrden(
      payload.numeroOrden,
    );
  }

  @MessagePattern('work-orders.process-work-order.get-ordenes-by-solicitud-id')
  async getOrdenesTrabajoBySolicitudId(payload: { solicitudId: string }) {
    return this.processWorkOrderService.getOrdenesTrabajoBySolicitudId(
      payload.solicitudId,
    );
  }

  @MessagePattern('work-orders.process-work-order.get-all-work-orders')
  async getAllWorkOrders(payload: { limit?: number; offset?: number }) {
    const { limit, offset } = payload;
    return this.processWorkOrderService.getAllWorkOrders(limit, offset);
  }
}
