import {
  ProcessWorkOrderBatchResponse,
  ProcessWorkOrderResponse,
} from '../schemas/dto/response/process-work-order.response';
import { ProcessWorkOrderModel } from '../schemas/models/process-work-order.model';
import {
  AddAdditionalCostCommand,
  AddAdditionalCostsBatchCommand,
  AddPreparationInspectionDetailCommand,
  AddQualityControlDetailCommand,
  AddWorkOrderAttachmentCommand,
  AddWorkOrderMaterialCommand,
  AddWorkOrderMaterialsBatchCommand,
  AddWorkersBatchToWorkOrderCommand,
  AddWorkerToWorkOrderCommand,
  AssignWorkOrderToCrewCommand,
  AssignWorkOrderToWorkerCommand,
  CreatePreparationInspectionCommand,
  CreateQualityControlCommand,
  CreateWorkOrderCommand,
  RegisterSatisfactionSurveyCommand,
  RemoveWorkerFromWorkOrderCommand,
} from '../schemas/dto/process-work-order.commands';
import { ProcessWorkOrderRequest } from '../schemas/dto/request/process-work-order.request';
import {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking,
  OrdenTrabajoVistaCliente,
  WorkOrderListItem,
} from '../schemas/dto/response/work-orders.get.response';

export interface InterfaceProcessWorkOrderRepository {
  createWorkOrder(
    createWorkOrder: CreateWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  processWorkOrder(
    processWorkOrder: ProcessWorkOrderModel,
  ): Promise<ProcessWorkOrderResponse | null>;
  receiveWorkOrder(
    receiveWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null>;
  assignWorkOrderToCrew(
    assignWorkOrderToCrew: AssignWorkOrderToCrewCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  assignWorkOrderToWorker(
    assignWorkOrderToWorker: AssignWorkOrderToWorkerCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  startPreparation(
    startPreparation: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null>;
  createPreparationInspection(
    createPreparationInspection: CreatePreparationInspectionCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  addPreparationInspectionDetail(
    addPreparationInspectionDetail: AddPreparationInspectionDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  resolvePreparationInspection(
    resolvePreparationInspection: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null>;
  markWorkOrderExecutionStarted(
    markWorkOrderExecutionStarted: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null>;
  addWorkOrderMaterial(
    addWorkOrderMaterial: AddWorkOrderMaterialCommand,
  ): Promise<ProcessWorkOrderResponse | null>;

  /** Agrega un lote de materiales en una sola transacción (mínimo 1 ítem) */
  addWorkOrderMaterialsBatch(
    cmd: AddWorkOrderMaterialsBatchCommand,
  ): Promise<ProcessWorkOrderBatchResponse | null>;
  addAdditionalCost(
    addAdditionalCost: AddAdditionalCostCommand,
  ): Promise<ProcessWorkOrderResponse | null>;

  /** Agrega un lote de costos adicionales en una sola transacción (mínimo 1 ítem) */
  addAdditionalCostsBatch(
    cmd: AddAdditionalCostsBatchCommand,
  ): Promise<ProcessWorkOrderBatchResponse | null>;
  addWorkOrderAttachment(
    addWorkOrderAttachment: AddWorkOrderAttachmentCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  createQualityControl(
    createQualityControl: CreateQualityControlCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  addQualityControlDetail(
    addQualityControlDetail: AddQualityControlDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null>;
  resolveQualityControl(
    resolveQualityControl: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null>;
  completeWorkOrder(
    completeWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null>;
  registerSatisfactionSurvey(
    registerSatisfactionSurvey: RegisterSatisfactionSurveyCommand,
  ): Promise<ProcessWorkOrderResponse | null>;

  /** Agrega un trabajador directamente a la OT  */
  addWorkerToWorkOrder(
    cmd: AddWorkerToWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null>;

  /** Agrega un lote de trabajadores en una sola transacción (mínimo 1 ítem) */
  addWorkersBatchToWorkOrder(
    cmd: AddWorkersBatchToWorkOrderCommand,
  ): Promise<ProcessWorkOrderBatchResponse | null>;

  /** Remueve un trabajador de la OT (borrado lógico) */
  removeWorkerFromWorkOrder(
    cmd: RemoveWorkerFromWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null>;

  /** Detalle completo de una OT — panel administrativo */
  getOrdenTrabajoDetalleByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoDetalle | null>;

  /** Timeline y métricas de SLA de una OT — monitoreo interno */
  getOrdenTrabajoTrackingByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoTracking | null>;

  /** OTs vinculadas a un trámite — portal del cliente */
  getOrdenesTrabajoBySolicitudId(
    solicitudId: string,
  ): Promise<OrdenTrabajoVistaCliente[]>;

  getAllWorkOrders(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderListItem[]>;
}
