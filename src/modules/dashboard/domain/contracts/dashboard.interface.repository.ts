import {
  CategoryDepartmentItemResponse,
  CrewAssignmentItemResponse,
  DailyTrendItemResponse,
  DispatchControlItemResponse,
  EconomicBalanceItemResponse,
  EscalationAuditItemResponse,
  ExecutiveOverviewResponse,
  FunnelSummaryResponse,
  HeaderKpisResponse,
  KeyStatisticsMatrixItemResponse,
  MaterialCostItemResponse,
  OriginChannelItemResponse,
  PriorityDistributionItemResponse,
  QualityIndicatorItemResponse,
  SlaMonitorItemResponse,
  StateMatrixItemResponse,
  StatusDistributionItemResponse,
  SyncDiscrepancyItemResponse,
  TechnicianDailyFeedItemResponse,
  TechnicianPerformanceItemResponse,
  TerritorialConcentrationItemResponse,
  WorkTypePerformanceItemResponse,
} from '../schemas/dto/response/dashboard.response';

export interface InterfaceIncidentOrderComparisonRepository {
  getFunnelSummary(): Promise<FunnelSummaryResponse | null>;
  getStateMatrix(): Promise<StateMatrixItemResponse[]>;
  getOriginChannelBreakdown(): Promise<OriginChannelItemResponse[]>;
  getCategoryDepartmentBreakdown(): Promise<CategoryDepartmentItemResponse[]>;
  getSyncDiscrepancies(): Promise<SyncDiscrepancyItemResponse[]>;
  getDispatchControl(limit: number): Promise<DispatchControlItemResponse[]>;
}

export interface InterfaceExecutiveDashboardRepository {
  getHeaderKpis(): Promise<HeaderKpisResponse | null>;
  getStatusDistribution(): Promise<StatusDistributionItemResponse[]>;
  getPriorityDistribution(): Promise<PriorityDistributionItemResponse[]>;
  getWorkTypePerformance(): Promise<WorkTypePerformanceItemResponse[]>;
  getKeyStatisticsMatrix(): Promise<KeyStatisticsMatrixItemResponse[]>;
  getExecutiveOverview(): Promise<ExecutiveOverviewResponse | null>;
}

export interface InterfaceTechnicianDashboardRepository {
  getTechnicianPerformance(): Promise<TechnicianPerformanceItemResponse[]>;
  getTechnicianDailyFeed(
    technicianId: string | null,
  ): Promise<TechnicianDailyFeedItemResponse[]>;
  getCrewAssignments(): Promise<CrewAssignmentItemResponse[]>;
}

export interface InterfaceQualitySlaDashboardRepository {
  getSlaMonitor(): Promise<SlaMonitorItemResponse[]>;
  getQualityIndicators(): Promise<QualityIndicatorItemResponse[]>;
  getEscalationAudit(): Promise<EscalationAuditItemResponse[]>;
}

export interface InterfaceFinancialDashboardRepository {
  getMaterialCosts(): Promise<MaterialCostItemResponse[]>;
  getEconomicBalance(): Promise<EconomicBalanceItemResponse[]>;
}

export interface InterfaceTrendsDashboardRepository {
  getDailyTrend(): Promise<DailyTrendItemResponse[]>;
  getTerritorialConcentration(): Promise<
    TerritorialConcentrationItemResponse[]
  >;
}
