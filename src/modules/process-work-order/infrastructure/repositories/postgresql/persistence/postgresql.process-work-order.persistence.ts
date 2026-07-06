/* eslint-disable no-useless-catch */
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import {
  DatabaseAbstract,
  IDatabaseClient,
} from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceProcessWorkOrderRepository } from '../../../../domain/contracts/process-work-order.interface.repository';
import { ProcessWorkOrderModel } from '../../../../domain/schemas/models/process-work-order.model';
import {
  ProcessWorkOrderBatchResponse,
  ProcessWorkOrderResponse,
} from '../../../../domain/schemas/dto/response/process-work-order.response';
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
} from '../../../../domain/schemas/dto/process-work-order.commands';
import { ProcessWorkOrderRequest } from '../../../../domain/schemas/dto/request/process-work-order.request';
import {
  OrdenTrabajoDetalle,
  OrdenTrabajoTracking,
  OrdenTrabajoVistaCliente,
  WorkOrderListItem,
} from '../../../../domain/schemas/dto/response/work-orders.get.response';
import {
  OrdenTrabajoDetalleSqlResult,
  OrdenTrabajoTrackingSqlResult,
  OrdenTrabajoVistaClienteSqlResult,
  WorkOrderListItemSqlResult,
} from '../../../interfaces/sql/work-orders.sql.response';
import { ProcessWorkOrderAdapter } from '../adapters/postgresql.process-work-order.adapter';

type OrderSnapshot = {
  work_order_id: string;
  order_code: string;
  cadastral_key: string | null;
  current_status: string;
  current_status_name: string | null;
  created_by_user_id: string;
  assigned_user_id: string | null;
  completion_user_id: string | null;
  created_at: Date;
  assigned_at: Date | null;
  completed_at: Date | null;
};

type TransitionHistoryRow = {
  record_id: string;
  work_order_id: string;
  order_code: string;
  cadastral_key: string | null;
  previous_status: string | null;
  previous_status_name: string | null;
  new_status: string;
  new_status_name: string | null;
  current_status: string;
  current_status_name: string | null;
  processed_by_user_id: string;
  comment: string | null;
  processed_at: Date;
};

type GenericRecordRow = {
  record_id: string;
  work_order_id: string;
  processed_at: Date;
};

@Injectable()
export class PostgresqlProcessWorkOrderPersistence implements InterfaceProcessWorkOrderRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async createWorkOrder(
    createWorkOrder: CreateWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    try {
      const result = await this.databaseService.transaction<
        Array<{
          record_id: string;
          work_order_id: string;
          order_code: string;
          cadastral_key: string | null;
          current_status: string;
          current_status_name: string | null;
          created_by_user_id: string;
          processed_at: Date;
        }>
      >(async (client) => {
        const query = `
          INSERT INTO work_orders.orden_trabajo (
            origen,
            id_tipo_trabajo,
            id_prioridad,
            id_cliente,
            clave_catastral,
            descripcion,
            direccion,
            geom_punto,
            created_by,
            metadata
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            CASE
              WHEN $8::double precision IS NULL OR $9::double precision IS NULL THEN NULL
              ELSE public.ST_SetSRID(public.ST_MakePoint($8, $9), 4326)
            END,
            $10,
            COALESCE($11::jsonb, '{}'::jsonb)
          )
          RETURNING
            id_orden_trabajo::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            codigo_orden AS order_code,
            clave_catastral AS cadastral_key,
            estado AS current_status,
            estado AS current_status_name,
            created_by::TEXT AS created_by_user_id,
            created_at AS processed_at;
        `;

        const rows = await client.query<{
          record_id: string;
          work_order_id: string;
          order_code: string;
          cadastral_key: string | null;
          current_status: string;
          current_status_name: string | null;
          created_by_user_id: string;
          processed_at: Date;
        }>(query, [
          createWorkOrder.origin,
          createWorkOrder.workTypeId,
          createWorkOrder.priorityId,
          createWorkOrder.clientId,
          createWorkOrder.cadastralKey ?? null,
          createWorkOrder.description ?? null,
          createWorkOrder.location,
          createWorkOrder.longitude ?? null,
          createWorkOrder.latitude ?? null,
          createWorkOrder.createdByUserId,
          createWorkOrder.metadata ?? null,
        ]);

        return rows;
      });

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order could not be created.',
        });
      }

      return this.mapSnapshotToResponse(
        'create_work_order',
        result[0].work_order_id,
        result[0].work_order_id,
        result[0].order_code,
        result[0].cadastral_key,
        null,
        null,
        result[0].current_status,
        result[0].current_status_name,
        result[0].created_by_user_id,
        result[0].created_by_user_id,
        null,
        result[0].processed_at,
      );
    } catch (error) {
      throw error;
    }
  }

  async processWorkOrder(
    processWorkOrder: ProcessWorkOrderModel,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(
      processWorkOrder.workOrderId,
      processWorkOrder.newStatus ?? '',
      processWorkOrder.userId,
      processWorkOrder.comment ?? null,
      'transition_work_order',
    );
  }

  async receiveWorkOrder(
    receiveWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(
      receiveWorkOrder.workOrderId,
      receiveWorkOrder.newStatus,
      receiveWorkOrder.userId,
      receiveWorkOrder.comment ?? null,
      'receive_work_order',
    );
  }

  async assignWorkOrderToCrew(
    assignWorkOrderToCrew: AssignWorkOrderToCrewCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    // El personal se gestiona individualmente vía addWorkerToWorkOrder.
    return this.databaseService.transaction(async (client) => {
      await client.query(
        `
            UPDATE work_orders.orden_trabajo
            SET usuario_asignacion = $2::uuid,
                fecha_asignacion = NOW(),
                updated_at = NOW()
            WHERE id_orden_trabajo = $1::uuid
              AND is_deleted = FALSE;
          `,
        [
          assignWorkOrderToCrew.workOrderId,
          assignWorkOrderToCrew.assignedByUserId,
        ],
      );

      return this.transitionWorkOrderWithClient(
        client,
        assignWorkOrderToCrew.workOrderId,
        'ASIGNADA',
        assignWorkOrderToCrew.assignedByUserId,
        assignWorkOrderToCrew.comment ?? 'Assigned.',
        'assign_work_order_to_crew',
        {},
      );
    });
  }

  async assignWorkOrderToWorker(
    assignWorkOrderToWorker: AssignWorkOrderToWorkerCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      await client.query(
        `
            UPDATE work_orders.orden_trabajo
            SET usuario_asignado = $2::uuid,
                usuario_asignacion = $3::uuid,
                fecha_asignacion = NOW(),
                updated_at = NOW()
            WHERE id_orden_trabajo = $1::uuid
              AND is_deleted = FALSE;
          `,
        [
          assignWorkOrderToWorker.workOrderId,
          assignWorkOrderToWorker.workerId,
          assignWorkOrderToWorker.assignedByUserId,
        ],
      );

      return this.transitionWorkOrderWithClient(
        client,
        assignWorkOrderToWorker.workOrderId,
        'ASIGNADA',
        assignWorkOrderToWorker.assignedByUserId,
        assignWorkOrderToWorker.comment ?? 'Assigned to worker.',
        'assign_work_order_to_worker',
        { assignedWorkerId: assignWorkOrderToWorker.workerId },
      );
    });
  }

  async startPreparation(
    startPreparation: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      // Si viene de REVISION_RECHAZADA, elimina (soft-delete) la inspeccion anterior
      // para que se pueda crear una nueva inspeccion en el proximo ciclo
      await client.query(
        `
          UPDATE work_orders.inspeccion_preparacion
          SET    is_deleted = TRUE,
                 updated_at = NOW()
          WHERE  id_orden_trabajo = $1::uuid
            AND  is_deleted       = FALSE;
        `,
        [startPreparation.workOrderId],
      );

      return this.transitionWorkOrderWithClient(
        client,
        startPreparation.workOrderId,
        startPreparation.newStatus,
        startPreparation.userId,
        startPreparation.comment ?? null,
        'start_preparation',
      );
    });
  }

  async createPreparationInspection(
    createPreparationInspection: CreatePreparationInspectionCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.inspeccion_preparacion (
            id_orden_trabajo,
            pasa_revision,
            observaciones,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4::uuid)
          RETURNING
            id_inspeccion::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          createPreparationInspection.workOrderId,
          createPreparationInspection.passed,
          createPreparationInspection.observations ?? null,
          createPreparationInspection.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Preparation inspection could not be created.',
        });
      }

      const snapshot = await this.getOrderSnapshot(
        client,
        createPreparationInspection.workOrderId,
      );

      return this.mapSnapshotToResponse(
        'create_preparation_inspection',
        result[0].record_id,
        createPreparationInspection.workOrderId,
        snapshot?.order_code ?? createPreparationInspection.workOrderId,
        snapshot?.cadastral_key ?? null,
        null,
        null,
        snapshot?.current_status ?? null,
        snapshot?.current_status_name ?? null,
        createPreparationInspection.createdByUserId,
        createPreparationInspection.createdByUserId,
        createPreparationInspection.passed,
        result[0].processed_at,
        { crewId: createPreparationInspection.crewId ?? null },
      );
    });
  }

  async addPreparationInspectionDetail(
    addPreparationInspectionDetail: AddPreparationInspectionDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.inspeccion_preparacion_detalle (
            id_inspeccion,
            codigo_item,
            cumple,
            observacion,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4, $5::uuid)
          RETURNING
            id_detalle::TEXT AS record_id,
            id_inspeccion::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          addPreparationInspectionDetail.inspectionId,
          addPreparationInspectionDetail.code,
          addPreparationInspectionDetail.passed,
          addPreparationInspectionDetail.comment ?? null,
          addPreparationInspectionDetail.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Preparation inspection detail could not be created.',
        });
      }

      return this.mapGenericResponse(
        'add_preparation_inspection_detail',
        result[0].record_id,
        addPreparationInspectionDetail.workOrderId,
        addPreparationInspectionDetail.createdByUserId,
        result[0].processed_at,
        {
          code: addPreparationInspectionDetail.code,
          passed: addPreparationInspectionDetail.passed,
        },
      );
    });
  }

  async resolvePreparationInspection(
    resolvePreparationInspection: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    console.log(
      '[RESOLVE-INSPECTION] newStatus received:',
      resolvePreparationInspection.newStatus,
      '| workOrderId:',
      resolvePreparationInspection.workOrderId,
    );
    return this.transitionWorkOrder(
      resolvePreparationInspection.workOrderId,
      resolvePreparationInspection.newStatus,
      resolvePreparationInspection.userId,
      resolvePreparationInspection.comment ?? null,
      'resolve_preparation_inspection',
    );
  }

  async markWorkOrderExecutionStarted(
    markWorkOrderExecutionStarted: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      await client.query(
        `
          UPDATE work_orders.orden_trabajo
          SET fecha_inicio_campo = NOW(),
              updated_at = NOW()
          WHERE id_orden_trabajo = $1::uuid
            AND is_deleted = FALSE;
        `,
        [markWorkOrderExecutionStarted.workOrderId],
      );

      return this.transitionWorkOrderWithClient(
        client,
        markWorkOrderExecutionStarted.workOrderId,
        markWorkOrderExecutionStarted.newStatus,
        markWorkOrderExecutionStarted.userId,
        markWorkOrderExecutionStarted.comment ?? null,
        'mark_work_order_execution_started',
      );
    });
  }

  async addWorkOrderMaterial(
    addWorkOrderMaterial: AddWorkOrderMaterialCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.detalle_orden_trabajo_material (
            id_orden_trabajo,
            id_material,
            cantidad,
            costo_unitario,
            codigo,
            nombre,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4, $5, $6, $7::uuid)
          RETURNING
            id_detalle_material::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          addWorkOrderMaterial.workOrderId,
          addWorkOrderMaterial.materialId,
          addWorkOrderMaterial.quantity,
          addWorkOrderMaterial.unitCost,
          addWorkOrderMaterial.codigoMaterial,
          addWorkOrderMaterial.nombreMaterial,
          addWorkOrderMaterial.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order material could not be created.',
        });
      }

      return this.mapGenericResponse(
        'add_work_order_material',
        result[0].record_id,
        result[0].work_order_id,
        addWorkOrderMaterial.createdByUserId,
        result[0].processed_at,
        {
          materialId: addWorkOrderMaterial.materialId,
          quantity: addWorkOrderMaterial.quantity,
          unitCost: addWorkOrderMaterial.unitCost,
        },
      );
    });
  }

  async addAdditionalCost(
    addAdditionalCost: AddAdditionalCostCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.costo_adicional_orden (
            id_orden_trabajo,
            concepto,
            cantidad,
            costo_unitario,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4, $5::uuid)
          RETURNING
            id_costo_adicional::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          addAdditionalCost.workOrderId,
          addAdditionalCost.concept,
          addAdditionalCost.quantity,
          addAdditionalCost.unitCost,
          addAdditionalCost.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Additional cost could not be created.',
        });
      }

      return this.mapGenericResponse(
        'add_additional_cost',
        result[0].record_id,
        result[0].work_order_id,
        addAdditionalCost.createdByUserId,
        result[0].processed_at,
        {
          concept: addAdditionalCost.concept,
          quantity: addAdditionalCost.quantity,
          unitCost: addAdditionalCost.unitCost,
        },
      );
    });
  }

  async addAdditionalCostsBatch(
    cmd: AddAdditionalCostsBatchCommand,
  ): Promise<ProcessWorkOrderBatchResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const items: ProcessWorkOrderResponse[] = [];

      for (const cost of cmd.costs) {
        const result = await client.query<GenericRecordRow>(
          `
            INSERT INTO work_orders.costo_adicional_orden (
              id_orden_trabajo,
              concepto,
              cantidad,
              costo_unitario,
              created_by
            )
            VALUES ($1::uuid, $2, $3, $4, $5::uuid)
            RETURNING
              id_costo_adicional::TEXT AS record_id,
              id_orden_trabajo::TEXT   AS work_order_id,
              created_at               AS processed_at;
          `,
          [
            cmd.workOrderId,
            cost.concept,
            cost.quantity,
            cost.unitCost,
            cmd.createdByUserId,
          ],
        );

        if (result.length === 0) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `Additional cost "${cost.concept}" could not be inserted.`,
          });
        }

        items.push(
          this.mapGenericResponse(
            'add_additional_cost',
            result[0].record_id,
            result[0].work_order_id,
            cmd.createdByUserId,
            result[0].processed_at,
            {
              concept: cost.concept,
              quantity: cost.quantity,
              unitCost: cost.unitCost,
            },
          ),
        );
      }

      return {
        action: 'add_additional_costs_batch',
        workOrderId: cmd.workOrderId,
        createdByUserId: cmd.createdByUserId,
        processedAt: items[items.length - 1].processedAt,
        count: items.length,
        items,
      };
    });
  }

  async addWorkOrderAttachment(
    addWorkOrderAttachment: AddWorkOrderAttachmentCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.adjuntos_orden_trabajo (
            id_orden_trabajo,
            nombre_archivo,
            tipo_adjunto,
            url_archivo,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4, $5::uuid)
          RETURNING
            id_adjunto::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          addWorkOrderAttachment.workOrderId,
          addWorkOrderAttachment.fileName,
          addWorkOrderAttachment.fileType,
          addWorkOrderAttachment.fileUrl,
          addWorkOrderAttachment.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Work order attachment could not be created.',
        });
      }

      return this.mapGenericResponse(
        'add_work_order_attachment',
        result[0].record_id,
        result[0].work_order_id,
        addWorkOrderAttachment.createdByUserId,
        result[0].processed_at,
        {
          fileName: addWorkOrderAttachment.fileName,
          fileType: addWorkOrderAttachment.fileType,
          fileUrl: addWorkOrderAttachment.fileUrl,
        },
      );
    });
  }

  async createQualityControl(
    createQualityControl: CreateQualityControlCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.control_calidad (
            id_orden_trabajo,
            trabajo_aprobado,
            comentarios,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4::uuid)
          RETURNING
            id_control::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          createQualityControl.workOrderId,
          createQualityControl.approved,
          createQualityControl.comments ?? null,
          createQualityControl.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Quality control could not be created.',
        });
      }

      const snapshot = await this.getOrderSnapshot(
        client,
        createQualityControl.workOrderId,
      );

      return this.mapSnapshotToResponse(
        'create_quality_control',
        result[0].record_id,
        createQualityControl.workOrderId,
        snapshot?.order_code ?? createQualityControl.workOrderId,
        snapshot?.cadastral_key ?? null,
        null,
        null,
        snapshot?.current_status ?? null,
        snapshot?.current_status_name ?? null,
        createQualityControl.createdByUserId,
        createQualityControl.createdByUserId,
        createQualityControl.approved,
        result[0].processed_at,
      );
    });
  }

  async addQualityControlDetail(
    addQualityControlDetail: AddQualityControlDetailCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.control_calidad_detalle (
            id_control,
            codigo_item,
            cumple,
            observacion,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4, $5::uuid)
          RETURNING
            id_detalle::TEXT AS record_id,
            id_control::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          addQualityControlDetail.controlId,
          addQualityControlDetail.code,
          addQualityControlDetail.passed,
          addQualityControlDetail.comment ?? null,
          addQualityControlDetail.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Quality control detail could not be created.',
        });
      }

      return this.mapGenericResponse(
        'add_quality_control_detail',
        result[0].record_id,
        addQualityControlDetail.workOrderId,
        addQualityControlDetail.createdByUserId,
        result[0].processed_at,
        {
          code: addQualityControlDetail.code,
          passed: addQualityControlDetail.passed,
        },
      );
    });
  }

  async resolveQualityControl(
    resolveQualityControl: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.transitionWorkOrder(
      resolveQualityControl.workOrderId,
      resolveQualityControl.newStatus,
      resolveQualityControl.userId,
      resolveQualityControl.comment ?? null,
      'resolve_quality_control',
    );
  }

  async completeWorkOrder(
    completeWorkOrder: ProcessWorkOrderRequest,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      await client.query(
        `
          UPDATE work_orders.orden_trabajo
          SET fecha_completada = NOW(),
              usuario_completacion = $2::uuid,
              updated_at = NOW()
          WHERE id_orden_trabajo = $1::uuid
            AND is_deleted = FALSE;
        `,
        [completeWorkOrder.workOrderId, completeWorkOrder.userId],
      );

      return this.transitionWorkOrderWithClient(
        client,
        completeWorkOrder.workOrderId,
        completeWorkOrder.newStatus,
        completeWorkOrder.userId,
        completeWorkOrder.comment ?? null,
        'complete_work_order',
      );
    });
  }

  async registerSatisfactionSurvey(
    registerSatisfactionSurvey: RegisterSatisfactionSurveyCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.encuesta_satisfaccion (
            id_orden_trabajo,
            calificacion,
            comentarios,
            created_by
          )
          VALUES ($1::uuid, $2, $3, $4::uuid)
          RETURNING
            id_encuesta::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          registerSatisfactionSurvey.workOrderId,
          registerSatisfactionSurvey.rating,
          registerSatisfactionSurvey.comments ?? null,
          registerSatisfactionSurvey.createdByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Satisfaction survey could not be created.',
        });
      }

      return this.mapGenericResponse(
        'register_satisfaction_survey',
        result[0].record_id,
        result[0].work_order_id,
        registerSatisfactionSurvey.createdByUserId,
        result[0].processed_at,
        { rating: registerSatisfactionSurvey.rating },
      );
    });
  }

  private async transitionWorkOrder(
    workOrderId: string,
    newStatus: string,
    userId: string,
    comment: string | null,
    action: string,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) =>
      this.transitionWorkOrderWithClient(
        client,
        workOrderId,
        newStatus,
        userId,
        comment,
        action,
      ),
    );
  }

  private async transitionWorkOrderWithClient(
    client: IDatabaseClient,
    workOrderId: string,
    newStatus: string,
    userId: string,
    comment: string | null,
    action: string,
    metadata?: Record<string, string | number | boolean | null>,
  ): Promise<ProcessWorkOrderResponse | null> {
    // 1. Transicionar la OT
    await client.query(
      `
        SELECT work_orders.fn_cambiar_estado_orden($1::uuid, $2, $3::uuid, $4);
      `,
      [workOrderId, newStatus, userId, comment],
    );

    // 2. Si la OT viene de acometidas, avanzar la solicitud en la misma transacción
    await this.advanceSolicitudFromOT(client, workOrderId, newStatus, userId);

    const latestHistory = await client.query<TransitionHistoryRow>(
      `
        SELECT
          hist.id_historial::TEXT AS record_id,
          hist.id_orden_trabajo::TEXT AS work_order_id,
          ot.codigo_orden AS order_code,
          ot.clave_catastral AS cadastral_key,
          hist.estado_anterior AS previous_status,
          previous_state.nombre AS previous_status_name,
          hist.estado_nuevo AS new_status,
          new_state.nombre AS new_status_name,
          ot.estado AS current_status,
          current_state.nombre AS current_status_name,
          hist.id_usuario::TEXT AS processed_by_user_id,
          hist.descripcion_cambio AS comment,
          hist.fecha_cambio AS processed_at
        FROM work_orders.historial_estado_orden_trabajo hist
        INNER JOIN work_orders.orden_trabajo ot
          ON ot.id_orden_trabajo = hist.id_orden_trabajo
        LEFT JOIN work_orders.cat_estado_orden previous_state
          ON previous_state.codigo = hist.estado_anterior
        LEFT JOIN work_orders.cat_estado_orden new_state
          ON new_state.codigo = hist.estado_nuevo
        LEFT JOIN work_orders.cat_estado_orden current_state
          ON current_state.codigo = ot.estado
        WHERE hist.id_orden_trabajo = $1::uuid
        ORDER BY hist.id_historial DESC
        LIMIT 1;
      `,
      [workOrderId],
    );

    if (latestHistory.length === 0) {
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: `The work order ${workOrderId} was processed, but the audit trail could not be loaded.`,
      });
    }

    const history = latestHistory[0];

    return {
      action,
      recordId: history.record_id,
      workOrderId: history.work_order_id,
      orderCode: history.order_code,
      cadastralKey: history.cadastral_key ?? undefined,
      previousStatus: history.previous_status ?? undefined,
      previousStatusName: history.previous_status_name ?? undefined,
      newStatus: history.new_status,
      newStatusName: history.new_status_name ?? undefined,
      currentStatus: history.current_status,
      currentStatusName: history.current_status_name ?? undefined,
      createdByUserId: userId,
      processedByUserId: history.processed_by_user_id,
      comment: history.comment ?? undefined,
      processedAt: history.processed_at,
      metadata,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Hook automático: avanza acometidas.solicitud cuando la OT ligada cambia
  // de estado. Se ejecuta dentro de la transacción padre.
  // ─────────────────────────────────────────────────────────────────────────
  private async advanceSolicitudFromOT(
    client: IDatabaseClient,
    workOrderId: string,
    newStatus: string,
    userId: string,
  ): Promise<void> {
    // ── Estados de OT que deben reflejarse en la solicitud de acometidas ────
    // Incluye tanto los estados genéricos como los diferenciados por tipo.
    const RELEVANT = new Set([
      // Genéricos (retrocompatibilidad)
      'EN_PROCESO',
      'EJECUTADA',
      'COMPLETADA',
      // Flujo INSPECCION (exclusivo acometidas)
      'EN_PROCESO_INSPECCION',
      'INSPECCION_EJECUTADA',
      'INSPECCION_COMPLETADA',
      // Flujo INSTALACION (exclusivo acometidas)
      'EN_PROCESO_INSTALACION',
      'INSTALACION_EJECUTADA',
      'INSTALACION_COMPLETADA',
    ]);
    if (!RELEVANT.has(newStatus)) return;

    // Obtener datos de la OT: origen, id_entidad_origen, tipo de trabajo
    const rows = await client.query<{
      origen: string;
      id_entidad_origen: string | null;
      tipo_trabajo_nombre: string;
      estado_solicitud: string | null;
    }>(
      `
        SELECT
          ot.origen,
          ot.id_entidad_origen::TEXT,
          tt.nombre AS tipo_trabajo_nombre,
          sol.estado AS estado_solicitud
        FROM work_orders.orden_trabajo ot
        JOIN work_orders.tipo_trabajo tt ON tt.id_tipo_trabajo = ot.id_tipo_trabajo
        LEFT JOIN acometidas.solicitud sol ON sol.id_solicitud = ot.id_entidad_origen
        WHERE ot.id_orden_trabajo = $1::uuid
        LIMIT 1;
      `,
      [workOrderId],
    );

    if (rows.length === 0) return;
    const row = rows[0];

    // Solo aplica a OTs originadas por el módulo de Acometidas
    if (
      row.origen !== 'SOLICITUD' ||
      !row.id_entidad_origen ||
      !row.estado_solicitud
    )
      return;

    const nombreTipo = (row.tipo_trabajo_nombre ?? '').trim().toUpperCase();
    const esInspeccion =
      nombreTipo.includes('INSPECCION') ||
      nombreTipo.includes('INSPECCIÓN') ||
      nombreTipo.includes('FACTIBILIDAD');
    const esInstalacion =
      nombreTipo.includes('INSTALACION') ||
      nombreTipo.includes('INSTALACIÓN') ||
      nombreTipo.includes('MEDIDOR');

    // ── Tabla de avance automático (estados diferenciados + genéricos) ───────
    //
    // Flujo INSPECCION:
    //   OT → EN_PROCESO_INSPECCION  + solicitud en ORDEN_INSPECCION_EMITIDA → INSPECCION_EN_PROCESO
    //   OT → INSPECCION_EJECUTADA   + solicitud en INSPECCION_EN_PROCESO    → INFORME_EN_REVISION
    //   OT → INSPECCION_COMPLETADA  + solicitud en INSPECCION_EN_PROCESO    → INFORME_EN_REVISION
    //   [Retrocompat] OT → EN_PROCESO + ORDEN_INSPECCION_EMITIDA            → INSPECCION_EN_PROCESO
    //   [Retrocompat] OT → EJECUTADA/COMPLETADA + INSPECCION_EN_PROCESO     → INFORME_EN_REVISION
    //
    // Flujo INSTALACION:
    //   OT → EN_PROCESO_INSTALACION  + solicitud en OT_INSTALACION_EMITIDA  → INSTALACION_EN_PROCESO
    //   OT → INSTALACION_EJECUTADA   + solicitud en INSTALACION_EN_PROCESO  → INSTALACION_COMPLETADA
    //   OT → INSTALACION_COMPLETADA  + solicitud en INSTALACION_EN_PROCESO  → INSTALACION_COMPLETADA
    //   [Retrocompat] OT → EN_PROCESO + OT_INSTALACION_EMITIDA              → INSTALACION_EN_PROCESO
    //   [Retrocompat] OT → COMPLETADA + INSTALACION_EN_PROCESO              → INSTALACION_COMPLETADA
    let nuevoEstadoSolicitud: string | null = null;

    if (esInspeccion) {
      if (
        (newStatus === 'EN_PROCESO_INSPECCION' || newStatus === 'EN_PROCESO') &&
        row.estado_solicitud === 'ORDEN_INSPECCION_EMITIDA'
      ) {
        nuevoEstadoSolicitud = 'INSPECCION_EN_PROCESO';
      } else if (
        (newStatus === 'INSPECCION_EJECUTADA' ||
          newStatus === 'INSPECCION_COMPLETADA' ||
          newStatus === 'EJECUTADA' ||
          newStatus === 'COMPLETADA') &&
        row.estado_solicitud === 'INSPECCION_EN_PROCESO'
      ) {
        // EJECUTADA/COMPLETADA llevan a INFORME_EN_REVISION para que el analista
        // decida manualmente si INFORME_APROBADO o RECHAZADA_TECNICA
        nuevoEstadoSolicitud = 'INFORME_EN_REVISION';
      }
    } else if (esInstalacion) {
      if (
        (newStatus === 'EN_PROCESO_INSTALACION' ||
          newStatus === 'EN_PROCESO') &&
        row.estado_solicitud === 'OT_INSTALACION_EMITIDA'
      ) {
        nuevoEstadoSolicitud = 'INSTALACION_EN_PROCESO';
      } else if (
        newStatus === 'COMPLETADA' &&
        row.estado_solicitud === 'INSTALACION_EN_PROCESO'
      ) {
        nuevoEstadoSolicitud = 'INSTALACION_COMPLETADA';
      }
    }

    if (!nuevoEstadoSolicitud) return;

    // Ejecutar la transición atómica de la solicitud usando la función existente
    await client.query(
      `
        SELECT acometidas.fn_cambiar_estado_solicitud(
          $1::uuid,
          $2,
          $3::uuid,
          $4,
          '{}'::jsonb
        );
      `,
      [
        row.id_entidad_origen,
        nuevoEstadoSolicitud,
        userId,
        `Avance automático por OT ${workOrderId} → ${newStatus}`,
      ],
    );
  }

  private async getOrderSnapshot(
    client: IDatabaseClient,
    workOrderId: string,
  ): Promise<OrderSnapshot | null> {
    const result = await client.query<OrderSnapshot>(
      `
        SELECT
          ot.id_orden_trabajo::TEXT        AS work_order_id,
          ot.codigo_orden                  AS order_code,
          ot.clave_catastral               AS cadastral_key,
          ot.estado                        AS current_status,
          ceo.nombre                       AS current_status_name,
          ot.created_by::TEXT              AS created_by_user_id,
          ot.usuario_asignado::TEXT        AS assigned_user_id,
          ot.usuario_completacion::TEXT    AS completion_user_id,
          ot.created_at,
          ot.fecha_asignacion              AS assigned_at,
          ot.fecha_completada              AS completed_at
        FROM  work_orders.orden_trabajo   ot
        JOIN  work_orders.cat_estado_orden ceo ON ceo.codigo = ot.estado
        WHERE ot.id_orden_trabajo = $1::uuid
        LIMIT 1;
      `,
      [workOrderId],
    );

    return result.length > 0 ? result[0] : null;
  }

  private mapSnapshotToResponse(
    action: string,
    recordId: string,
    workOrderId: string,
    orderCode: string,
    cadastralKey: string | null,
    previousStatus: string | null,
    previousStatusName: string | null,
    newStatus: string | null,
    newStatusName: string | null,
    createdByUserId: string,
    processedByUserId: string,
    approved: boolean | null,
    processedAt: Date,
    metadata?: Record<string, string | number | boolean | null>,
    currentStatus?: string | null,
    currentStatusName?: string | null,
  ): ProcessWorkOrderResponse {
    return {
      action,
      recordId,
      workOrderId,
      orderCode,
      cadastralKey: cadastralKey ?? undefined,
      previousStatus: previousStatus ?? undefined,
      previousStatusName: previousStatusName ?? undefined,
      newStatus: newStatus ?? undefined,
      newStatusName: newStatusName ?? undefined,
      currentStatus: currentStatus ?? newStatus ?? undefined,
      currentStatusName: currentStatusName ?? newStatusName ?? undefined,
      createdByUserId,
      processedByUserId,
      approved: approved ?? undefined,
      processedAt,
      metadata,
    };
  }

  private mapGenericResponse(
    action: string,
    recordId: string,
    workOrderId: string,
    createdByUserId: string,
    processedAt: Date,
    metadata?: Record<string, string | number | boolean | null>,
  ): ProcessWorkOrderResponse {
    return {
      action,
      recordId,
      workOrderId,
      createdByUserId,
      processedByUserId: createdByUserId,
      processedAt,
      metadata,
    };
  }

  async addWorkerToWorkOrder(
    cmd: AddWorkerToWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          INSERT INTO work_orders.asignacion_trabajador_orden (
            id_orden_trabajo,
            id_trabajador,
            id_rol,
            es_responsable,
            created_by
          )
          VALUES ($1::uuid, $2::uuid, $3, $4, $5::uuid)
          ON CONFLICT (id_orden_trabajo, id_trabajador) DO UPDATE
            SET is_deleted = FALSE,
                id_rol = EXCLUDED.id_rol,
                es_responsable = EXCLUDED.es_responsable,
                updated_at = NOW()
          RETURNING
            id_asignacion::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            created_at AS processed_at;
        `,
        [
          cmd.workOrderId,
          cmd.workerId,
          cmd.roleId ?? null,
          cmd.isResponsible ?? false,
          cmd.assignedByUserId,
        ],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Worker could not be added to work order.',
        });
      }

      // Si es responsable, actualizar usuario_asignado en la OT (desnormalización para búsquedas rápidas)
      if (cmd.isResponsible) {
        await client.query(
          `
            UPDATE work_orders.orden_trabajo
            SET usuario_asignado    = $2::uuid,
                usuario_asignacion  = $3::uuid,
                fecha_asignacion    = COALESCE(fecha_asignacion, NOW()),
                updated_at          = NOW()
            WHERE id_orden_trabajo = $1::uuid
              AND is_deleted = FALSE;
          `,
          [cmd.workOrderId, cmd.workerId, cmd.assignedByUserId],
        );
      }

      return this.mapGenericResponse(
        'add_worker_to_work_order',
        result[0].record_id,
        result[0].work_order_id,
        cmd.assignedByUserId,
        result[0].processed_at,
        {
          workerId: cmd.workerId,
          roleId: cmd.roleId ?? null,
          isResponsible: cmd.isResponsible ?? false,
        },
      );
    });
  }

  async addWorkOrderMaterialsBatch(
    cmd: AddWorkOrderMaterialsBatchCommand,
  ): Promise<ProcessWorkOrderBatchResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const items: ProcessWorkOrderResponse[] = [];

      for (const material of cmd.materials) {
        const result = await client.query<GenericRecordRow>(
          `
            INSERT INTO work_orders.detalle_orden_trabajo_material (
              id_orden_trabajo,
              id_material,
              cantidad,
              costo_unitario,
              codigo,
              nombre,
              created_by
            )
            VALUES ($1::uuid, $2, $3, $4, $5, $6, $7::uuid)
            RETURNING
              id_detalle_material::TEXT AS record_id,
              id_orden_trabajo::TEXT    AS work_order_id,
              created_at                AS processed_at;
          `,
          [
            cmd.workOrderId,
            material.materialId,
            material.quantity,
            material.unitCost,
            material.codigoMaterial,
            material.nombreMaterial,
            cmd.createdByUserId,
          ],
        );

        if (result.length === 0) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `Material ${material.materialId} could not be inserted.`,
          });
        }

        items.push(
          this.mapGenericResponse(
            'add_work_order_material',
            result[0].record_id,
            result[0].work_order_id,
            cmd.createdByUserId,
            result[0].processed_at,
            {
              materialId: material.materialId,
              quantity: material.quantity,
              unitCost: material.unitCost,
              codigoMaterial: material.codigoMaterial,
              nombreMaterial: material.nombreMaterial,
            },
          ),
        );
      }

      return {
        action: 'add_work_order_materials_batch',
        workOrderId: cmd.workOrderId,
        createdByUserId: cmd.createdByUserId,
        processedAt: items[items.length - 1].processedAt,
        count: items.length,
        items,
      };
    });
  }

  async addWorkersBatchToWorkOrder(
    cmd: AddWorkersBatchToWorkOrderCommand,
  ): Promise<ProcessWorkOrderBatchResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const items: ProcessWorkOrderResponse[] = [];

      for (const worker of cmd.workers) {
        const result = await client.query<GenericRecordRow>(
          `
            INSERT INTO work_orders.asignacion_trabajador_orden (
              id_orden_trabajo,
              id_trabajador,
              id_rol,
              es_responsable,
              created_by
            )
            VALUES ($1::uuid, $2::uuid, $3, $4, $5::uuid)
            ON CONFLICT (id_orden_trabajo, id_trabajador) DO UPDATE
              SET is_deleted     = FALSE,
                  id_rol         = EXCLUDED.id_rol,
                  es_responsable = EXCLUDED.es_responsable,
                  updated_at     = NOW()
            RETURNING
              id_asignacion::TEXT      AS record_id,
              id_orden_trabajo::TEXT   AS work_order_id,
              created_at               AS processed_at;
          `,
          [
            cmd.workOrderId,
            worker.workerId,
            worker.roleId ?? null,
            worker.isResponsible ?? false,
            cmd.assignedByUserId,
          ],
        );

        if (result.length === 0) {
          throw new RpcException({
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
            message: `Worker ${worker.workerId} could not be added.`,
          });
        }

        // Si es responsable, actualizar el campo desnormalizado de la OT
        if (worker.isResponsible) {
          await client.query(
            `
              UPDATE work_orders.orden_trabajo
              SET usuario_asignado   = $2::uuid,
                  usuario_asignacion = $3::uuid,
                  fecha_asignacion   = COALESCE(fecha_asignacion, NOW()),
                  updated_at         = NOW()
              WHERE id_orden_trabajo = $1::uuid
                AND is_deleted = FALSE;
            `,
            [cmd.workOrderId, worker.workerId, cmd.assignedByUserId],
          );
        }

        items.push(
          this.mapGenericResponse(
            'add_worker_to_work_order',
            result[0].record_id,
            result[0].work_order_id,
            cmd.assignedByUserId,
            result[0].processed_at,
            {
              workerId: worker.workerId,
              roleId: worker.roleId ?? null,
              isResponsible: worker.isResponsible ?? false,
            },
          ),
        );
      }

      return {
        action: 'add_workers_batch_to_work_order',
        workOrderId: cmd.workOrderId,
        createdByUserId: cmd.assignedByUserId,
        processedAt: items[items.length - 1].processedAt,
        count: items.length,
        items,
      };
    });
  }

  async removeWorkerFromWorkOrder(
    cmd: RemoveWorkerFromWorkOrderCommand,
  ): Promise<ProcessWorkOrderResponse | null> {
    return this.databaseService.transaction(async (client) => {
      const result = await client.query<GenericRecordRow>(
        `
          UPDATE work_orders.asignacion_trabajador_orden
          SET is_deleted  = TRUE,
              deleted_at  = NOW(),
              updated_at  = NOW()
          WHERE id_orden_trabajo = $1::uuid
            AND id_trabajador    = $2::uuid
            AND is_deleted = FALSE
          RETURNING
            id_asignacion::TEXT AS record_id,
            id_orden_trabajo::TEXT AS work_order_id,
            updated_at AS processed_at;
        `,
        [cmd.workOrderId, cmd.workerId],
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Worker assignment not found or already removed.',
        });
      }

      // Si era el responsable, limpiar usuario_asignado de la OT
      await client.query(
        `
          UPDATE work_orders.orden_trabajo
          SET usuario_asignado = NULL,
              updated_at       = NOW()
          WHERE id_orden_trabajo = $1::uuid
            AND usuario_asignado = $2::uuid
            AND is_deleted = FALSE;
        `,
        [cmd.workOrderId, cmd.workerId],
      );

      return this.mapGenericResponse(
        'remove_worker_from_work_order',
        result[0].record_id,
        result[0].work_order_id,
        cmd.removedByUserId,
        result[0].processed_at,
        { workerId: cmd.workerId },
      );
    });
  }

  async getOrdenTrabajoDetalleByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoDetalle | null> {
    const query: string = `
        SELECT
            -- ── Identificación ────────────────────────────────────────────────────────
            ot.id_orden_trabajo,
            ot.codigo_orden,
            ot.numero_secuencial,
            ot.version,
            ot.estado,
            ceo.nombre                                                      AS estado_label,
            ot.origen,
            coo.nombre                                                      AS origen_label,
            ot.id_entidad_origen,

            -- ── Clasificación ─────────────────────────────────────────────────────────
            tt.nombre                                                       AS tipo_trabajo,
            tt.descripcion                                                  AS tipo_trabajo_descripcion,
            dep.nombre                                                      AS departamento,
            pot.nivel                                                       AS prioridad,
            pot.sla_horas,

            -- ── Ubicación ─────────────────────────────────────────────────────────────
            ot.direccion,
            ot.ubicacion_detalles,
            ot.clave_catastral,
            public.ST_AsText(ot.geom_punto)                                AS coordenadas_punto,
            public.ST_AsText(ot.geom_trazado)                              AS coordenadas_trazado,
            public.ST_AsText(ot.geom_area)                                 AS coordenadas_area,
            public.ST_Y(ot.geom_punto)                                     AS latitud,
            public.ST_X(ot.geom_punto)                                     AS longitud,

            -- ── Descripción y Metadata ────────────────────────────────────────────────
            ot.descripcion,
            ot.metadata,

            -- ── Métricas de tiempo ────────────────────────────────────────────────────
            ot.fecha_creacion,
            ot.fecha_asignacion,
            ot.fecha_inicio_campo,
            ot.fecha_completada,
            ot.created_at,
            ot.updated_at,
            EXTRACT(DAY FROM (NOW() - ot.fecha_creacion))::INT              AS dias_en_proceso,
            (EXTRACT(EPOCH FROM (COALESCE(ot.fecha_completada, NOW()) - ot.fecha_creacion)) / 3600)
                ::NUMERIC(10,2)                                             AS horas_totales_proceso,
            (EXTRACT(EPOCH FROM (ot.fecha_asignacion - ot.fecha_creacion)) / 3600)
                ::NUMERIC(10,2)                                             AS horas_hasta_asignacion,
            (EXTRACT(EPOCH FROM (ot.fecha_completada - ot.fecha_inicio_campo)) / 3600)
                ::NUMERIC(10,2)                                             AS horas_ejecucion_campo,

            -- ── SLA ───────────────────────────────────────────────────────────────────
            ot.escala_supervisor,
            ot.motivo_escalamiento,
            CASE
                WHEN ot.fecha_completada IS NOT NULL
                    THEN (ot.fecha_completada <= ot.fecha_creacion + (pot.sla_horas || ' hours')::INTERVAL)
                ELSE (NOW() <= ot.fecha_creacion + (pot.sla_horas || ' hours')::INTERVAL)
            END                                                             AS cumple_sla,
            (pot.sla_horas - (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600))
                ::NUMERIC(10,2)                                             AS horas_restantes_sla,

            -- ── Asignación operativa ──────────────────────────────────────────────────
            CASE
                WHEN ot.usuario_asignado IS NOT NULL THEN 'INDIVIDUAL'
                ELSE 'SIN_ASIGNAR'
            END                                                             AS tipo_asignacion,


            -- Inspector / técnico individual asignado
            ua.username                                                     AS inspector_username,
            CONCAT(emp_asig.nombres, ' ', emp_asig.apellidos)               AS inspector_nombre,

            -- Responsable de asignación administrativa
            ot.usuario_asignacion                                           AS id_usuario_asignacion,
            CONCAT(emp_asig_adm.nombres, ' ', emp_asig_adm.apellidos)       AS nombre_asignador,

            -- Responsable de cierre
            ot.usuario_completacion                                         AS id_usuario_completacion,
            CONCAT(emp_cierre.nombres, ' ', emp_cierre.apellidos)           AS nombre_completador,

            -- Creador de la orden
            ot.created_by                                                   AS id_usuario_creador,
            uc.username                                                     AS creador_username,
            CONCAT(emp_crea.nombres, ' ', emp_crea.apellidos)               AS creador_nombre,

            -- ── Cliente vinculado ─────────────────────────────────────────────────────
            ot.id_cliente,

            -- ── Personal asignado directamente a la OT ──────────────────────────────────
            COALESCE(
                jsonb_agg(DISTINCT jsonb_build_object(
                    'id_asignacion',     ato.id_asignacion,
                    'id_trabajador',     ato.id_trabajador,
                    'nombre_trabajador', CONCAT(emp_ato.nombres, ' ', emp_ato.apellidos),
                    'rol',               rt_ato.nombre,
                    'es_responsable',    ato.es_responsable,
                    'fecha_asignacion',  ato.fecha_asignacion
                )) FILTER (WHERE ato.id_asignacion IS NOT NULL),
                '[]'::jsonb
            )                                                               AS personal_asignado,

            -- ── Materiales utilizados agrupados como JSON array ───────────────────────
            COALESCE(
                jsonb_agg(DISTINCT jsonb_build_object(
                    'id_detalle',       dotm.id_detalle_material,
                    'id_material',      dotm.id_material,
                    'cantidad',         dotm.cantidad,
                    'costo_unitario',   dotm.costo_unitario,
                    'codigo_material',  dotm.codigo,
                    'nombre_material',  dotm.nombre,
                    'subtotal',         dotm.subtotal
                )) FILTER (WHERE dotm.id_detalle_material IS NOT NULL),
                '[]'::jsonb
            )                                                               AS materiales,

            -- ── Adjuntos / Evidencias fotográficas agrupados como JSON array ──────────
            COALESCE(
                jsonb_agg(DISTINCT jsonb_build_object(
                    'id_adjunto',       aot.id_adjunto,
                    'nombre_archivo',   aot.nombre_archivo,
                    'url',              aot.url_archivo,
                    'tipo_adjunto',     aot.tipo_adjunto,
                    'mime_type',        aot.mime_type,
                    'fecha_carga',      aot.created_at
                )) FILTER (WHERE aot.id_adjunto IS NOT NULL),
                '[]'::jsonb
            )                                                               AS adjuntos,

            -- ── Observaciones / Bitácora de campo agrupadas como JSON array ───────────
            COALESCE(
                jsonb_agg(DISTINCT jsonb_build_object(
                    'id_observacion',   oot.id_observacion,
                    'texto',            oot.texto,
                    'fecha',            oot.created_at,
                    'autor_id',         oot.created_by
                )) FILTER (WHERE oot.id_observacion IS NOT NULL),
                '[]'::jsonb
            )                                                               AS observaciones,

            -- ── Costos adicionales agrupados como JSON array ───────────────────────────
            COALESCE(
                jsonb_agg(DISTINCT jsonb_build_object(
                    'id_costo',         cao.id_costo_adicional,
                    'concepto',         cao.concepto,
                    'cantidad',         cao.cantidad,
                    'costo_unitario',   cao.costo_unitario,
                    'total',            cao.total
                )) FILTER (WHERE cao.id_costo_adicional IS NOT NULL),
                '[]'::jsonb
            )                                                               AS costos_adicionales,

            -- ── Resumen de costos ─────────────────────────────────────────────────────
            COALESCE(SUM(dotm.subtotal) FILTER (WHERE dotm.id_detalle_material IS NOT NULL), 0)
                ::NUMERIC(12,2)                                             AS costo_total_materiales,
            COALESCE(SUM(cao.total)     FILTER (WHERE cao.id_costo_adicional IS NOT NULL), 0)
                ::NUMERIC(12,2)                                             AS costo_total_adicionales,
            (
                COALESCE(SUM(dotm.subtotal) FILTER (WHERE dotm.id_detalle_material IS NOT NULL), 0) +
                COALESCE(SUM(cao.total)     FILTER (WHERE cao.id_costo_adicional IS NOT NULL), 0)
            )::NUMERIC(12,2)                                               AS costo_total_orden,

            -- ── Checklist / Inspección  ───────────────────────────────────
            ic.id_inspeccion,
            ic.pasa_revision                                                AS checklist_aprobado,
            ic.observaciones                                                AS observaciones_checklist,

            -- ── Control de Calidad ────────────────────────────────────────────────────
            cc.id_control,
            cc.trabajo_aprobado                                             AS calidad_aprobada,
            cc.comentarios                                                  AS comentarios_calidad,

            -- ── Encuesta de Satisfacción ──────────────────────────────────────────────
            es.id_encuesta,
            es.calificacion                                                 AS calificacion_satisfaccion,
            es.comentarios                                                  AS comentarios_satisfaccion,

            -- ── Corte de Servicio vinculado ───────────────────────────────────────────
            cs.id_corte,
            cs.tipo_corte,
            cs.sector_afectado,
            cs.fecha_inicio                                                 AS corte_fecha_inicio,
            cs.fecha_fin_estimada                                           AS corte_fecha_fin_estimada,
            cs.fecha_restablecido                                           AS corte_fecha_restablecimiento,
            cs.notificacion_enviada                                         AS corte_notificado,

            -- ── Orden padre (jerarquía) ───────────────────────────────────────────────
            ot.id_orden_padre,
            ot_padre.codigo_orden                                           AS codigo_orden_padre

        FROM work_orders.orden_trabajo                  ot

        -- Catálogos
        JOIN  work_orders.cat_estado_orden              ceo  ON ceo.codigo        = ot.estado
        JOIN  work_orders.cat_origen_orden              coo  ON coo.codigo        = ot.origen
        JOIN  work_orders.tipo_trabajo                  tt   ON tt.id_tipo_trabajo = ot.id_tipo_trabajo
        JOIN  work_orders.departamento_trabajo          dep  ON dep.id_departamento = tt.id_departamento
        JOIN  work_orders.prioridad_orden_trabajo       pot  ON pot.id_prioridad   = ot.id_prioridad

        -- Personal asignado directamente a la OT
        LEFT JOIN work_orders.asignacion_trabajador_orden ato
              ON ato.id_orden_trabajo = ot.id_orden_trabajo
              AND ato.is_deleted       = FALSE
        LEFT JOIN public.usuarios                       u_ato   ON u_ato.usuario_id     = ato.id_trabajador
        LEFT JOIN public.empleados                      emp_ato ON emp_ato.usuario_id   = ato.id_trabajador
        LEFT JOIN work_orders.rol_trabajador            rt_ato  ON rt_ato.id_rol        = ato.id_rol

        -- Inspector / técnico individual
        LEFT JOIN public.usuarios                       ua      ON ua.usuario_id        = ot.usuario_asignado
        LEFT JOIN public.empleados                      emp_asig ON emp_asig.usuario_id = ot.usuario_asignado

        -- Responsable de asignación administrativa
        LEFT JOIN public.usuarios                       u_asig_adm   ON u_asig_adm.usuario_id  = ot.usuario_asignacion
        LEFT JOIN public.empleados                      emp_asig_adm ON emp_asig_adm.usuario_id = ot.usuario_asignacion

        -- Responsable de cierre
        LEFT JOIN public.usuarios                       u_cierre  ON u_cierre.usuario_id  = ot.usuario_completacion
        LEFT JOIN public.empleados                      emp_cierre ON emp_cierre.usuario_id = ot.usuario_completacion

        -- Creador de la orden
        LEFT JOIN public.usuarios                       uc       ON uc.usuario_id     = ot.created_by
        LEFT JOIN public.empleados                      emp_crea ON emp_crea.usuario_id = ot.created_by

        -- Detalles operativos
        LEFT JOIN work_orders.detalle_orden_trabajo_material dotm
              ON dotm.id_orden_trabajo = ot.id_orden_trabajo
              AND dotm.is_deleted       = FALSE
        LEFT JOIN work_orders.adjuntos_orden_trabajo    aot
              ON aot.id_orden_trabajo  = ot.id_orden_trabajo
              AND aot.is_deleted        = FALSE
        LEFT JOIN work_orders.observaciones_orden_trabajo oot
              ON oot.id_orden_trabajo  = ot.id_orden_trabajo
              AND oot.is_deleted        = FALSE
        LEFT JOIN work_orders.costo_adicional_orden     cao
              ON cao.id_orden_trabajo  = ot.id_orden_trabajo
              AND cao.is_deleted        = FALSE

        -- Control de calidad e inspección (tabla renombrada a inspeccion_preparacion)
        LEFT JOIN work_orders.inspeccion_preparacion    ic
              ON ic.id_orden_trabajo   = ot.id_orden_trabajo
              AND ic.is_deleted         = FALSE
        LEFT JOIN work_orders.control_calidad           cc
              ON cc.id_orden_trabajo   = ot.id_orden_trabajo
              AND cc.is_deleted         = FALSE

        -- Encuesta de satisfacción
        LEFT JOIN work_orders.encuesta_satisfaccion     es
              ON es.id_orden_trabajo   = ot.id_orden_trabajo
              AND es.is_deleted         = FALSE

        -- Corte de servicio
        LEFT JOIN work_orders.corte_servicio            cs
              ON cs.id_orden_trabajo   = ot.id_orden_trabajo
              AND cs.is_deleted         = FALSE

        -- Orden padre
        LEFT JOIN work_orders.orden_trabajo             ot_padre
              ON ot_padre.id_orden_trabajo = ot.id_orden_padre

        WHERE (
          ot.codigo_orden        = $1
        )
          AND ot.is_deleted = FALSE

        GROUP BY
            ot.id_orden_trabajo,
            ceo.nombre,
            coo.nombre,
            tt.nombre,   tt.descripcion,
            dep.nombre,
            pot.nivel,   pot.sla_horas,
            ua.username,
            emp_asig.nombres,    emp_asig.apellidos,
            emp_asig_adm.nombres, emp_asig_adm.apellidos,
            emp_cierre.nombres,  emp_cierre.apellidos,
            uc.username,
            emp_crea.nombres,    emp_crea.apellidos,
            ic.id_inspeccion,    ic.pasa_revision,    ic.observaciones,
            cc.id_control,       cc.trabajo_aprobado, cc.comentarios,
            es.id_encuesta,      es.calificacion,     es.comentarios,
            cs.id_corte,         cs.tipo_corte,       cs.sector_afectado,
            cs.fecha_inicio,     cs.fecha_fin_estimada, cs.fecha_restablecido, cs.notificacion_enviada,
            ot_padre.codigo_orden;
      `;
    const result =
      await this.databaseService.query<OrdenTrabajoDetalleSqlResult>(query, [
        numeroOrden,
      ]);
    const response =
      ProcessWorkOrderAdapter.fromOrdenTrabajoDetalleSqlResultToOrdenTrabajoDetalle(
        result[0],
      );
    return response;
  }

  async getOrdenTrabajoTrackingByNumeroOrden(
    numeroOrden: string,
  ): Promise<OrdenTrabajoTracking | null> {
    const query: string = `
      SELECT
          -- ── Identificación ────────────────────────────────────────────────────────
          ot.id_orden_trabajo,
          ot.codigo_orden,
          ot.numero_secuencial,
          ot.origen,
          ot.id_entidad_origen,

          -- ── Clasificación ─────────────────────────────────────────────────────────
          tt.nombre                                                       AS tipo_trabajo,
          dep.nombre                                                      AS departamento,
          pot.nivel                                                       AS prioridad,
          pot.sla_horas,

          -- ── Ubicación ─────────────────────────────────────────────────────────────
          ot.direccion,
          ot.clave_catastral,

          -- ── Fecha creación en español ─────────────────────────────────────────────
          LPAD(EXTRACT(DAY  FROM ot.fecha_creacion)::TEXT, 2, '0') || ' de ' ||
          CASE EXTRACT(MONTH FROM ot.fecha_creacion)
              WHEN 1  THEN 'enero'      WHEN 2  THEN 'febrero'   WHEN 3  THEN 'marzo'
              WHEN 4  THEN 'abril'      WHEN 5  THEN 'mayo'      WHEN 6  THEN 'junio'
              WHEN 7  THEN 'julio'      WHEN 8  THEN 'agosto'    WHEN 9  THEN 'septiembre'
              WHEN 10 THEN 'octubre'    WHEN 11 THEN 'noviembre'  WHEN 12 THEN 'diciembre'
          END || ', ' || EXTRACT(YEAR FROM ot.fecha_creacion)::TEXT       AS fecha_creacion_es,

          -- ── Estado actual ─────────────────────────────────────────────────────────
          ot.estado                                                       AS estado_codigo,
          ceo.nombre                                                      AS estado_actual_label,

          -- ── SLA ───────────────────────────────────────────────────────────────────
          ot.escala_supervisor,
          ot.motivo_escalamiento,
          EXTRACT(DAY FROM (NOW() - ot.fecha_creacion))::INT              AS dias_en_proceso,
          (EXTRACT(EPOCH FROM (COALESCE(ot.fecha_completada, NOW()) - ot.fecha_creacion)) / 3600)
              ::NUMERIC(10,2)                                             AS horas_totales_proceso,
          (pot.sla_horas - (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600))
              ::NUMERIC(10,2)                                             AS horas_restantes_sla,
          CASE
              WHEN (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600) > pot.sla_horas
              THEN TRUE ELSE FALSE
          END                                                             AS sla_vencido,

          -- ── Hitos de tiempo ───────────────────────────────────────────────────────
          ot.fecha_creacion,
          ot.fecha_asignacion,
          ot.fecha_inicio_campo,
          ot.fecha_completada,
          ot.created_at,
          ot.updated_at,

          -- ── Último movimiento (desde historial) ───────────────────────────────────
          (SELECT h.fecha_cambio
          FROM work_orders.historial_estado_orden_trabajo h
          WHERE h.id_orden_trabajo = ot.id_orden_trabajo
          ORDER BY h.fecha_cambio DESC LIMIT 1)                         AS ultimo_movimiento,
          (SELECT h.descripcion_cambio
          FROM work_orders.historial_estado_orden_trabajo h
          WHERE h.id_orden_trabajo = ot.id_orden_trabajo
          ORDER BY h.fecha_cambio DESC LIMIT 1)                         AS ultimo_comentario,
          (SELECT h.estado_nuevo
          FROM work_orders.historial_estado_orden_trabajo h
          WHERE h.id_orden_trabajo = ot.id_orden_trabajo
          ORDER BY h.fecha_cambio DESC LIMIT 1)                         AS ultimo_estado_codigo,

          -- ── Conteo de adjuntos ────────────────────────────────────────────────────
          (SELECT COUNT(*) FROM work_orders.adjuntos_orden_trabajo a
          WHERE a.id_orden_trabajo = ot.id_orden_trabajo AND a.is_deleted = FALSE
          )::INT                                                          AS adjuntos_total,

          -- ── Conteo de materiales ──────────────────────────────────────────────────
          (SELECT COUNT(*) FROM work_orders.detalle_orden_trabajo_material m
          WHERE m.id_orden_trabajo = ot.id_orden_trabajo AND m.is_deleted = FALSE
          )::INT                                                          AS materiales_total,
          (SELECT COALESCE(SUM(m.subtotal), 0) FROM work_orders.detalle_orden_trabajo_material m
          WHERE m.id_orden_trabajo = ot.id_orden_trabajo AND m.is_deleted = FALSE
          )::NUMERIC(12,2)                                               AS costo_total_materiales,

          -- ── Conteo de costos adicionales ──────────────────────────────────────────
          (SELECT COALESCE(SUM(c.total), 0) FROM work_orders.costo_adicional_orden c
          WHERE c.id_orden_trabajo = ot.id_orden_trabajo AND c.is_deleted = FALSE
          )::NUMERIC(12,2)                                               AS costo_total_adicionales,

          -- ── Observaciones ─────────────────────────────────────────────────────────
          (SELECT COUNT(*) FROM work_orders.observaciones_orden_trabajo o
          WHERE o.id_orden_trabajo = ot.id_orden_trabajo AND o.is_deleted = FALSE
          )::INT                                                          AS observaciones_total,

          -- ── Control de calidad ────────────────────────────────────────────────────
          (SELECT COUNT(*) FROM work_orders.control_calidad cq
          WHERE cq.id_orden_trabajo = ot.id_orden_trabajo
            AND cq.trabajo_aprobado = FALSE AND cq.is_deleted = FALSE
          )::INT                                                          AS rechazos_calidad,

          -- ── Inspección de preparación ─────────────────────────────────────────────
          (SELECT COUNT(*) FROM work_orders.inspeccion_preparacion ip
          WHERE ip.id_orden_trabajo = ot.id_orden_trabajo
            AND ip.pasa_revision    = FALSE AND ip.is_deleted = FALSE
          )::INT                                                          AS rechazos_checklist,

          -- ── Asignación ────────────────────────────────────────────────────────────
          CASE
              WHEN ot.usuario_asignado  IS NOT NULL THEN 'INDIVIDUAL'
              ELSE 'SIN_ASIGNAR'
          END                                                             AS tipo_asignacion,
          ua.username                                                     AS asignado_username,
          CONCAT(emp_asig.nombres, ' ', emp_asig.apellidos)               AS asignado_nombre,

          -- ── Encuesta de satisfacción ──────────────────────────────────────────────
          es.calificacion                                                 AS calificacion_satisfaccion,

          -- ── Cliente ───────────────────────────────────────────────────────────────
          ot.id_cliente,

          -- ── Timeline completo (JSON ordenado cronológicamente) ────────────────────
          (SELECT jsonb_agg(
              jsonb_build_object(
                  'estado',          h.estado_nuevo,
                  'estadoLabel',     h2.nombre,
                  'estadoAnterior',  h.estado_anterior,
                  'fecha',           h.fecha_cambio,
                  'comentario',      h.descripcion_cambio,
                  'usuario_id',      h.id_usuario
              ) ORDER BY h.fecha_cambio
          )
          FROM work_orders.historial_estado_orden_trabajo h
          JOIN work_orders.cat_estado_orden h2 ON h2.codigo = h.estado_nuevo
          WHERE h.id_orden_trabajo = ot.id_orden_trabajo
          )                                                               AS historial

      FROM work_orders.orden_trabajo                  ot
      JOIN  work_orders.cat_estado_orden              ceo  ON ceo.codigo         = ot.estado
      JOIN  work_orders.cat_origen_orden              coo  ON coo.codigo         = ot.origen
      JOIN  work_orders.tipo_trabajo                  tt   ON tt.id_tipo_trabajo  = ot.id_tipo_trabajo
      JOIN  work_orders.departamento_trabajo          dep  ON dep.id_departamento = tt.id_departamento
      JOIN  work_orders.prioridad_orden_trabajo       pot  ON pot.id_prioridad    = ot.id_prioridad
      -- personal gestionado en asignacion_trabajador_orden
      LEFT JOIN public.usuarios                       ua   ON ua.usuario_id       = ot.usuario_asignado
      LEFT JOIN public.empleados                      emp_asig ON emp_asig.usuario_id = ot.usuario_asignado
      LEFT JOIN work_orders.encuesta_satisfaccion     es
            ON es.id_orden_trabajo = ot.id_orden_trabajo
            AND es.is_deleted       = FALSE

      WHERE (
          ot.codigo_orden        = $1
      )
        AND ot.is_deleted = FALSE

      ORDER BY ot.fecha_creacion DESC;
      `;
    const result =
      await this.databaseService.query<OrdenTrabajoTrackingSqlResult>(query, [
        numeroOrden,
      ]);
    const response =
      ProcessWorkOrderAdapter.fromOrdenTrabajoTrackingSqlResultToOrdenTrabajoTracking(
        result[0],
      );
    return response;
  }

  async getOrdenesTrabajoBySolicitudId(
    solicitudId: string,
  ): Promise<OrdenTrabajoVistaCliente[]> {
    const query: string = `
      SELECT
          -- ── Identificación de la OT ───────────────────────────────────────────────
          sot.id_orden_trabajo,
          sot.tipo_orden,                                                 -- INSPECCION | INSTALACION | etc.
          ot.codigo_orden,                                                -- OT-2026-0000001
          ot.numero_secuencial,

          -- ── Descripción visible para el cliente ───────────────────────────────────
          tt.nombre                                                       AS tipo_trabajo,
          dep.nombre                                                      AS departamento_ejecutor,
          COALESCE(ot.descripcion, ot.metadata->>'descripcion', '')       AS descripcion,

          -- ── Estado actual con etiqueta legible ────────────────────────────────────
          ot.estado                                                       AS estado_codigo,
          eot.nombre                                                      AS estado_label,
          eot.descripcion                                                 AS estado_descripcion,
          -- Semáforo simple de progreso para mostrar en UI
          CASE ot.estado
              WHEN 'NOTIFICADA'         THEN 0
              WHEN 'PENDIENTE'          THEN 10
              WHEN 'ASIGNADA'           THEN 25
              WHEN 'PREPARACION'        THEN 40
              WHEN 'REVISION_RECHAZADA' THEN 35
              WHEN 'EN_PROCESO'         THEN 60
              WHEN 'EJECUTADA'          THEN 80
              WHEN 'RECHAZADA_TECNICA'  THEN 75
              WHEN 'COMPLETADA'         THEN 100
              WHEN 'CANCELADA'          THEN -1
          END                                                             AS progreso_pct,

          -- ── Prioridad y SLA ───────────────────────────────────────────────────────
          pot.nivel                                                       AS prioridad,
          pot.sla_horas,
          CASE
              WHEN ot.fecha_completada IS NOT NULL
                  THEN (ot.fecha_completada <= ot.fecha_creacion + (pot.sla_horas || ' hours')::INTERVAL)
              ELSE (NOW() <= ot.fecha_creacion + (pot.sla_horas || ' hours')::INTERVAL)
          END                                                             AS cumple_sla,

          -- ── Hitos de tiempo (para mostrar línea de tiempo al cliente) ─────────────
          ot.fecha_creacion,
          ot.fecha_asignacion,
          ot.fecha_inicio_campo,
          ot.fecha_completada,
          EXTRACT(DAY FROM (NOW() - ot.fecha_creacion))::INT              AS dias_en_proceso,

          -- Fecha creación en español
          LPAD(EXTRACT(DAY  FROM ot.fecha_creacion)::TEXT, 2, '0') || ' de ' ||
          CASE EXTRACT(MONTH FROM ot.fecha_creacion)
              WHEN 1  THEN 'enero'      WHEN 2  THEN 'febrero'   WHEN 3  THEN 'marzo'
              WHEN 4  THEN 'abril'      WHEN 5  THEN 'mayo'      WHEN 6  THEN 'junio'
              WHEN 7  THEN 'julio'      WHEN 8  THEN 'agosto'    WHEN 9  THEN 'septiembre'
              WHEN 10 THEN 'octubre'    WHEN 11 THEN 'noviembre'  WHEN 12 THEN 'diciembre'
          END || ', ' || EXTRACT(YEAR FROM ot.fecha_creacion)::TEXT       AS fecha_creacion_es,

          -- ── Ubicación de la OT ────────────────────────────────────────────────────
          ot.direccion                                                    AS direccion_trabajo,
          ot.ubicacion_detalles,
          public.ST_Y(ot.geom_punto)                                     AS latitud,
          public.ST_X(ot.geom_punto)                                     AS longitud,

          -- ── Técnico responsable ───────────────────────────────────────────────────
          CASE
              WHEN ot.usuario_asignado IS NOT NULL THEN 'TECNICO_INDIVIDUAL'
              ELSE 'PENDIENTE_ASIGNACION'
          END                                                             AS tipo_asignacion,
          -- personal directo en asignacion_trabajador_orden
          -- Técnico individual
          ua.username                                                     AS tecnico_username,
          CONCAT(emp_asig.nombres, ' ', emp_asig.apellidos)               AS tecnico_nombre,

          -- ── Último movimiento (para "última actualización" en el portal) ──────────
          (SELECT h.fecha_cambio
          FROM work_orders.historial_estado_orden_trabajo h
          WHERE h.id_orden_trabajo = ot.id_orden_trabajo
          ORDER BY h.fecha_cambio DESC LIMIT 1)                         AS ultima_actualizacion,
          (SELECT h.descripcion_cambio
          FROM work_orders.historial_estado_orden_trabajo h
          WHERE h.id_orden_trabajo = ot.id_orden_trabajo
          ORDER BY h.fecha_cambio DESC LIMIT 1)                         AS ultimo_comentario_tecnico,

          -- ── Evidencias fotográficas (el cliente puede ver las fotos del trabajo) ───
          (SELECT COUNT(*) FROM work_orders.adjuntos_orden_trabajo a
          WHERE a.id_orden_trabajo = ot.id_orden_trabajo AND a.is_deleted = FALSE
          )::INT                                                          AS total_fotos_evidencia,
          COALESCE(
              (SELECT jsonb_agg(jsonb_build_object(
                  'nombre',       a.nombre_archivo,
                  'url',          a.url_archivo,
                  'tipo',         a.tipo_adjunto,
                  'fecha_carga',  a.created_at
              ) ORDER BY a.created_at)
              FROM work_orders.adjuntos_orden_trabajo a
              WHERE a.id_orden_trabajo = ot.id_orden_trabajo AND a.is_deleted = FALSE),
              '[]'::jsonb
          )                                                               AS fotos_evidencia,

          -- ── Checklist de seguridad: revisión previa de preparación ────────────────
          (SELECT ip.pasa_revision
          FROM work_orders.inspeccion_preparacion ip
          WHERE ip.id_orden_trabajo = ot.id_orden_trabajo AND ip.is_deleted = FALSE
          ORDER BY ip.created_at DESC LIMIT 1)                          AS checklist_aprobado,

          -- ── Control de calidad: si el trabajo fue aprobado técnicamente ───────────
          (SELECT cc.trabajo_aprobado
          FROM work_orders.control_calidad cc
          WHERE cc.id_orden_trabajo = ot.id_orden_trabajo AND cc.is_deleted = FALSE
          ORDER BY cc.created_at DESC LIMIT 1)                          AS trabajo_aprobado_calidad,
          (SELECT cc.comentarios
          FROM work_orders.control_calidad cc
          WHERE cc.id_orden_trabajo = ot.id_orden_trabajo AND cc.is_deleted = FALSE
          ORDER BY cc.created_at DESC LIMIT 1)                          AS comentarios_calidad,

          -- ── Encuesta de satisfacción (¿ya fue calificada?) ────────────────────────
          es.calificacion                                                 AS calificacion_satisfaccion,
          es.comentarios                                                  AS comentarios_encuesta,
          CASE WHEN es.id_encuesta IS NOT NULL THEN TRUE ELSE FALSE END   AS encuesta_completada,

          -- ── Corte de servicio: si este trabajo genera un corte de agua ────────────
          cs.tipo_corte,
          cs.sector_afectado,
          cs.fecha_inicio                                                 AS corte_inicio,
          cs.fecha_fin_estimada                                           AS corte_fin_estimado,
          cs.fecha_restablecido,
          cs.notificacion_enviada                                         AS corte_notificado,

          -- ── Timeline completo (historial de estados para el stepper del cliente) ──
          (SELECT jsonb_agg(
              jsonb_build_object(
                  'estado',         h.estado_nuevo,
                  'estadoLabel',    h2.nombre,
                  'estadoAnterior', h.estado_anterior,
                  'fecha',          h.fecha_cambio,
                  'comentario',     h.descripcion_cambio
              ) ORDER BY h.fecha_cambio
          )
          FROM work_orders.historial_estado_orden_trabajo h
          JOIN work_orders.cat_estado_orden h2 ON h2.codigo = h.estado_nuevo
          WHERE h.id_orden_trabajo = ot.id_orden_trabajo
          )                                                               AS historial_estados

      FROM acometidas.solicitud_orden_trabajo         sot
      JOIN  work_orders.orden_trabajo                 ot   ON ot.id_orden_trabajo  = sot.id_orden_trabajo
      JOIN  work_orders.cat_estado_orden              eot  ON eot.codigo           = ot.estado
      JOIN  work_orders.tipo_trabajo                  tt   ON tt.id_tipo_trabajo   = ot.id_tipo_trabajo
      JOIN  work_orders.departamento_trabajo          dep  ON dep.id_departamento  = tt.id_departamento
      JOIN  work_orders.prioridad_orden_trabajo       pot  ON pot.id_prioridad     = ot.id_prioridad
      -- personal gestionado en asignacion_trabajador_orden
      LEFT JOIN public.usuarios                       ua   ON ua.usuario_id        = ot.usuario_asignado
      LEFT JOIN public.empleados                      emp_asig ON emp_asig.usuario_id = ot.usuario_asignado
      LEFT JOIN work_orders.encuesta_satisfaccion     es
            ON es.id_orden_trabajo = ot.id_orden_trabajo AND es.is_deleted = FALSE
      LEFT JOIN work_orders.corte_servicio            cs
            ON cs.id_orden_trabajo = ot.id_orden_trabajo AND cs.is_deleted = FALSE

      WHERE sot.id_solicitud::text = $1
        AND ot.is_deleted    = FALSE

      ORDER BY ot.fecha_creacion ASC;
      `;
    const result =
      await this.databaseService.query<OrdenTrabajoVistaClienteSqlResult>(
        query,
        [solicitudId],
      );
    const response = result.map((row) =>
      ProcessWorkOrderAdapter.fromOrdenTrabajoVistaClienteSqlResultToOrdenTrabajoVistaCliente(
        row,
      ),
    );
    return response;
  }

  async getAllWorkOrders(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderListItem[]> {
    const query: string = `
      SELECT
        ot.id_orden_trabajo::TEXT                       AS work_order_id,
        ot.codigo_orden                                 AS order_code,
        ot.origen,
        ot.id_tipo_trabajo                              AS work_type_id,   -- ✅ alias ot.
        tt.nombre                                       AS work_type_name,
        ot.id_prioridad                                 AS priority_id,
        ot.id_cliente::TEXT                             AS client_id,

        CASE
          WHEN emp.cliente_id IS NOT NULL
            THEN COALESCE(emp.razon_social, emp.nombre_comercial, 'Sin nombre')
          ELSE
            TRIM(COALESCE(ciud.nombres, '') || ' ' || COALESCE(ciud.apellidos, ''))
        END                                             AS client_name,

        CASE
          WHEN emp.cliente_id IS NOT NULL THEN 'JURIDICA'
          ELSE 'NATURAL'
        END                                             AS person_type,

        ot.fecha_creacion                               AS creation_date,
        ot.fecha_asignacion                             AS assignation_date,
        ot.fecha_completada                             AS completion_date,
        ot.estado                                       AS status,
        ot.descripcion                                  AS description,
        ot.direccion                                    AS location,
        ot.created_by::TEXT                             AS created_user_id,
        ot.usuario_asignacion::TEXT                     AS assigned_user_id,
        ot.usuario_completacion::TEXT                   AS completed_user_id,
        public.ST_AsText(ot.geom_punto)                 AS coordinates,
        ot.metadata::TEXT                               AS metadata,
        ot.clave_catastral                              AS cadastral_key,
        ot.is_deleted

      FROM work_orders.orden_trabajo ot                          -- ✅ alias ot
      INNER JOIN work_orders.tipo_trabajo tt ON tt.id_tipo_trabajo = ot.id_tipo_trabajo
      LEFT  JOIN public.cliente        c    ON c.cliente_id        = ot.id_cliente
      LEFT  JOIN public.ciudadano      ciud ON ciud.ciudadano_id   = c.cliente_id
      LEFT  JOIN public.empresa        emp  ON emp.cliente_id      = c.cliente_id
      WHERE  ot.is_deleted = FALSE
      ORDER  BY ot.fecha_creacion DESC
      LIMIT  COALESCE($1::int, 100)
      OFFSET COALESCE($2::int, 0);
      `;
    const result = await this.databaseService.query<WorkOrderListItemSqlResult>(
      query,
      [limit, offset],
    );
    const response = result.map((row) =>
      ProcessWorkOrderAdapter.fromWorkOrderListItemSqlResultToWorkOrderListItem(
        row,
      ),
    );
    return response;
  }
}
