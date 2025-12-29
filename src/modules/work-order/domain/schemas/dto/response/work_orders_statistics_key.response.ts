export class WorkOrdersStatisticsKeyResponse {
  totalOrders: number;
  statusId: number;
  statusName: string;
  workTypeId: number;
  workType: string;
  departmentId: number;
  departmentName: string;
  emergency: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  criticalOrders: number;
  createdToday: number;
  createdLast7Days: number;
  createdThisMonth: number;
  closed: number;
  completed: number;
  avgHoursToComplete: number | null;
  avgHoursToAssignment: number | null;
  avgHoursToExecution: number | null;
  pctCompletedInGroup: number;
  pctPendingOrAssigned: number;
  totalMaterialCost: number;
  avgWorkersPerOrder: number | null;
  totalWorkerAssignments: number | null;
}
