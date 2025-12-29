import { GetWorkOrderPriorityStatisticsResponse } from '../../../../domain/schemas/dto/response/get_work_order_priority_statistics.response';
import { GetWorkOrderStatusStatisticsResponse } from '../../../../domain/schemas/dto/response/get_work_order_status_statistics.response';
import { GetWorkOrderTypeStatisticsResponse } from '../../../../domain/schemas/dto/response/get_work_order_type_statistics.response';
import {
  ViewAllWorkOrdersFullDetailsResponse,
  ViewWorkOrderAssignmentsResponse,
  ViewWorkOrderAttachmentsResponse,
  ViewWorkOrderMaterialsResponse,
  ViewWorkOrderObservationsResponse,
  ViewWorkOrdersByClientResponse,
  ViewWorkOrderStatisticsResponse,
} from '../../../../domain/schemas/dto/response/views.work-orders.response';
import { WorkOrderResponse } from '../../../../domain/schemas/dto/response/work-order.response';
import { WorkOrdersStatisticsKeyResponse } from '../../../../domain/schemas/dto/response/work_orders_statistics_key.response';
import { GetWorkOrderPriorityStatisticsSqlResponse } from '../../../interfaces/sql/get_work_order_priority_statistics.sql.response';
import { GetWorkOrderStatusStatisticsSqlResponse } from '../../../interfaces/sql/get_work_order_status_statistics.sql.response';
import { GetWorkOrderTypeStatisticsSqlResponse } from '../../../interfaces/sql/get_work_order_type_statistics.sql.response';
import {
  ViewAllWorkOrdersFullDetailsSqlResponse,
  ViewWorkOrderAssignmentsSqlResponse,
  ViewWorkOrderAttachmentsSqlResponse,
  ViewWorkOrderMaterialsSqlResponse,
  ViewWorkOrderObservationsSqlResponse,
  ViewWorkOrdersByClientSqlResponse,
  ViewWorkOrderStatisticsSqlResponse,
} from '../../../interfaces/sql/views.work-orders.sql.response';
import { WorkOrderSQLResponse } from '../../../interfaces/sql/work-order.sql.response';
import { WorkOrdersStatisticsKeySqlResponse } from '../../../interfaces/sql/work_orders_statistics_key.sql.response';

export class WorkOrderAdapter {
  static fromWorkOrderSQLResponseToWorkOrderResponse(
    workOrderSQLResponse: WorkOrderSQLResponse,
  ): WorkOrderResponse {
    return {
      workOrderId: workOrderSQLResponse.work_order_id,
      orderCode: workOrderSQLResponse.order_code,
      workTypeId: workOrderSQLResponse.work_type_id,
      priorityId: workOrderSQLResponse.priority_id,
      clientId: workOrderSQLResponse.client_id,
      location: workOrderSQLResponse.location || '',
      description: workOrderSQLResponse.description || '',
      createdUserId: workOrderSQLResponse.created_user_id || 0,
      assignedUserId: workOrderSQLResponse.assigned_user_id || 0,
      completedUserId: workOrderSQLResponse.completed_user_id || 0,
      coordinates: workOrderSQLResponse.coordinates,
      metadata: workOrderSQLResponse.metadata,
      cadastralKey: workOrderSQLResponse.cadastral_key,
      isDeleted: workOrderSQLResponse.is_deleted,
      creationDate: workOrderSQLResponse.creation_date,
      assignationDate: workOrderSQLResponse.assignation_date,
      completionDate: workOrderSQLResponse.completion_date,
      status: workOrderSQLResponse.status,
    };
  }

  static fromWorkOrderStattisticsSQLResponseToWorkOrderStatisticsResponse(
    workOrderSQLResponse: ViewWorkOrderStatisticsSqlResponse,
  ): ViewWorkOrderStatisticsResponse {
    return {
      workType: workOrderSQLResponse.work_type,
      priority: workOrderSQLResponse.priority,
      totalOrders: workOrderSQLResponse.total_orders,
      completedOrders: workOrderSQLResponse.completed_orders,
      cancelledOrders: workOrderSQLResponse.cancelled_orders,
      avgCompletionTimeHours: workOrderSQLResponse.avg_completion_time_hours,
    };
  }

  static fromViewWorkOrderAssignmentsSqlResponseToViewWorkOrderAssignmentsResponse(
    sqlResponse: ViewWorkOrderAssignmentsSqlResponse,
  ): ViewWorkOrderAssignmentsResponse {
    return {
      workOrderId: sqlResponse.work_order_id,
      workOrderCode: sqlResponse.work_order_code,
      workerId: sqlResponse.worker_id,
      workerRole: sqlResponse.worker_role,
      assignmentDate: new Date(sqlResponse.assignment_date),
    };
  }

  static fromViewWorkOrderMaterialsSqlResponseToViewWorkOrderMaterialsResponse(
    sqlResponse: ViewWorkOrderMaterialsSqlResponse,
  ): ViewWorkOrderMaterialsResponse {
    return {
      workOrderId: sqlResponse.work_order_id,
      workOrderCode: sqlResponse.work_order_code,
      materialId: sqlResponse.material_id,
      quantity: sqlResponse.quantity,
      unitCost: sqlResponse.unit_cost,
      subtotalCost: sqlResponse.subtotal_cost,
    };
  }

  static fromViewWorkOrderObservationsSqlResponseToViewWorkOrderObservationsResponse(
    sqlResponse: ViewWorkOrderObservationsSqlResponse,
  ): ViewWorkOrderObservationsResponse {
    return {
      workOrderId: sqlResponse.work_order_id,
      workOrderCode: sqlResponse.work_order_code,
      observationText: sqlResponse.observation_text,
      observationDate: new Date(sqlResponse.observation_date),
      observerWorkerId: sqlResponse.observer_worker_id,
    };
  }

  static fromViewWorkOrderAttachmentsSqlResponseToViewWorkOrderAttachmentsResponse(
    sqlResponse: ViewWorkOrderAttachmentsSqlResponse,
  ): ViewWorkOrderAttachmentsResponse {
    return {
      workOrderId: sqlResponse.work_order_id,
      workOrderCode: sqlResponse.work_order_code,
      fileName: sqlResponse.file_name,
      fileType: sqlResponse.file_type,
      fileUrl: sqlResponse.file_url,
      uploadDate: new Date(sqlResponse.upload_date),
    };
  }

  static fromViewWorkOrdersByClientSqlResponseToViewWorkOrdersByClientResponse(
    sqlResponse: ViewWorkOrdersByClientSqlResponse,
  ): ViewWorkOrdersByClientResponse {
    return {
      clientId: sqlResponse.client_id,
      totalOrders: sqlResponse.total_orders,
      completedOrders: sqlResponse.completed_orders,
      cancelledOrders: sqlResponse.cancelled_orders,
    };
  }

  static fromViewAllWorkOrdersFullDetailsSqlResponseToViewAllWorkOrdersFullDetailsResponse(
    sqlResponse: ViewAllWorkOrdersFullDetailsSqlResponse,
  ): ViewAllWorkOrdersFullDetailsResponse {
    return {
      workOrderId: sqlResponse.work_order_id,
      workOrderCode: sqlResponse.work_order_code,
      cadastralKey: sqlResponse.cadastral_key,
      workOrderDescription: sqlResponse.work_order_description,
      workOrderLocation: sqlResponse.work_order_location,
      coordinatesWkt: sqlResponse.coordinates_wkt,
      longitude: sqlResponse.longitude,
      latitude: sqlResponse.latitude,
      workType: sqlResponse.work_type,
      department: sqlResponse.department,
      priority: sqlResponse.priority,
      currentState: sqlResponse.current_state,
      clientId: sqlResponse.client_id,
      createdByUserId: sqlResponse.created_by_user_id,
      assignedToUserId: sqlResponse.assigned_to_user_id,
      completedByUserId: sqlResponse.completed_by_user_id,
      creationDate: new Date(sqlResponse.creation_date), // ISO date string
      assignmentDate: sqlResponse.assignment_date
        ? new Date(sqlResponse.assignment_date)
        : null, // ISO date string
      completionDate: sqlResponse.completion_date
        ? new Date(sqlResponse.completion_date)
        : null, // ISO date string
      managementAttachments:
        sqlResponse.management_attachments?.map((attachment) => ({
          fileName: attachment.file_name,
          fileType: attachment.file_type,
          fileUrl: attachment.file_url,
          uploadDate: new Date(attachment.upload_date),
        })) || [],
      materialsUsed:
        sqlResponse.materials_used?.map((material) => ({
          materialId: material.material_id,
          quantity: material.quantity,
          unitCost: material.unit_cost,
          subtotalCost: material.subtotal_cost,
        })) || [],
      observationsMade:
        sqlResponse.observations_made?.map((observation) => ({
          observationText: observation.observation_text,
          observationDate: new Date(observation.observation_date),
          observerWorkerId: observation.observer_worker_id,
        })) || [],
      assignedWorkers:
        sqlResponse.assigned_workers?.map((worker) => ({
          workerId: worker.worker_id,
          workerRole: worker.worker_role,
          assignmentDate: new Date(worker.assignment_date),
        })) || [],
    };
  }

  static fromViewWorkOrdersFullDetailsSqlResponseToViewWorkOrdersFullDetailsResponse(
    sqlResponse: ViewAllWorkOrdersFullDetailsSqlResponse,
  ): ViewAllWorkOrdersFullDetailsResponse {
    return this.fromViewAllWorkOrdersFullDetailsSqlResponseToViewAllWorkOrdersFullDetailsResponse(
      sqlResponse,
    );
  }

  static fromWorkOrderPriorityStatisticsSQLResponseToWorkOrderPriorityStatisticsResponse(
    workOrderSQLResponse: GetWorkOrderPriorityStatisticsSqlResponse,
  ): GetWorkOrderPriorityStatisticsResponse {
    return {
      priorityLevel: workOrderSQLResponse.priority_level,
      priorityId: workOrderSQLResponse.priority_id,
      description: workOrderSQLResponse.description,
      quantity: workOrderSQLResponse.quantity,
      percentageOfTotal: workOrderSQLResponse.percentage_of_total,
    };
  }

  static fromWorkOrderStatusStatisticsSQLResponseToWorkOrderStatusStatisticsResponse(
    workOrderSQLResponse: GetWorkOrderStatusStatisticsSqlResponse,
  ): GetWorkOrderStatusStatisticsResponse {
    return {
      statusName: workOrderSQLResponse.status_name,
      statusId: workOrderSQLResponse.status_id,
      statusDescription: workOrderSQLResponse.status_description,
      quantity: workOrderSQLResponse.quantity,
      percentageOfTotal: workOrderSQLResponse.percentage_of_total,
    };
  }

  static fromWorkOrderTypeStatisticsSQLResponseToWorkOrderTypeStatisticsResponse(
    workOrderSQLResponse: GetWorkOrderTypeStatisticsSqlResponse,
  ): GetWorkOrderTypeStatisticsResponse {
    return {
      workType: workOrderSQLResponse.work_type,
      workTypeId: workOrderSQLResponse.work_type_id,
      quantity: workOrderSQLResponse.quantity,
      completed: workOrderSQLResponse.completed,
      completionRatePercentage: workOrderSQLResponse.completion_rate_percentage,
    };
  }

  static fromWorkOrdersStatisticsKeySqlResponseToWorkOrdersStatisticsKeyResponse(
    sqlResponse: WorkOrdersStatisticsKeySqlResponse,
  ): WorkOrdersStatisticsKeyResponse {
    return {
      totalOrders: sqlResponse.total_orders,
      statusId: sqlResponse.status_id,
      statusName: sqlResponse.status_name,
      workTypeId: sqlResponse.work_type_id,
      workType: sqlResponse.work_type,
      departmentId: sqlResponse.department_id,
      departmentName: sqlResponse.department_name,
      emergency: sqlResponse.emergency,
      urgent: sqlResponse.urgent,
      high: sqlResponse.high,
      medium: sqlResponse.medium,
      low: sqlResponse.low,
      criticalOrders: sqlResponse.critical_orders,
      createdToday: sqlResponse.created_today,
      createdLast7Days: sqlResponse.created_last_7_days,
      createdThisMonth: sqlResponse.created_this_month,
      closed: sqlResponse.closed,
      completed: sqlResponse.completed,
      avgHoursToComplete: sqlResponse.avg_hours_to_complete,
      avgHoursToAssignment: sqlResponse.avg_hours_to_assignment,
      avgHoursToExecution: sqlResponse.avg_hours_to_execution,
      pctCompletedInGroup: sqlResponse.pct_completed_in_group,
      pctPendingOrAssigned: sqlResponse.pct_pending_or_assigned,
      totalMaterialCost: sqlResponse.total_material_cost,
      avgWorkersPerOrder: sqlResponse.avg_workers_per_order,
      totalWorkerAssignments: sqlResponse.total_worker_assignments,
    };
  }
}
