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

export interface UserParams {
  id?: string;
  sub?: string;
  role?: string | Record<string, unknown>;
  roles?: Array<string | Record<string, unknown>>;
  permissions?: number[];
  user_type?: string;
  username?: string;
  email?: string;
}

export interface InterfaceIncidentOrderComparisonRepository {
  getFunnelSummary(user?: UserParams): Promise<FunnelSummaryResponse | null>;
  getStateMatrix(user?: UserParams): Promise<StateMatrixItemResponse[]>;
  getOriginChannelBreakdown(
    user?: UserParams,
  ): Promise<OriginChannelItemResponse[]>;
  getCategoryDepartmentBreakdown(
    user?: UserParams,
  ): Promise<CategoryDepartmentItemResponse[]>;
  getSyncDiscrepancies(
    user?: UserParams,
  ): Promise<SyncDiscrepancyItemResponse[]>;
  getDispatchControl(
    limit: number,
    user?: UserParams,
  ): Promise<DispatchControlItemResponse[]>;
}

export interface InterfaceExecutiveDashboardRepository {
  getHeaderKpis(user?: UserParams): Promise<HeaderKpisResponse | null>;
  getStatusDistribution(
    user?: UserParams,
  ): Promise<StatusDistributionItemResponse[]>;
  getPriorityDistribution(
    user?: UserParams,
  ): Promise<PriorityDistributionItemResponse[]>;
  getWorkTypePerformance(
    user?: UserParams,
  ): Promise<WorkTypePerformanceItemResponse[]>;
  getKeyStatisticsMatrix(
    user?: UserParams,
  ): Promise<KeyStatisticsMatrixItemResponse[]>;
  getExecutiveOverview(
    user?: UserParams,
  ): Promise<ExecutiveOverviewResponse | null>;
}

export interface InterfaceTechnicianDashboardRepository {
  getTechnicianPerformance(
    user?: UserParams,
  ): Promise<TechnicianPerformanceItemResponse[]>;
  getTechnicianDailyFeed(
    technicianId: string | null,
    user?: UserParams,
  ): Promise<TechnicianDailyFeedItemResponse[]>;
  getCrewAssignments(user?: UserParams): Promise<CrewAssignmentItemResponse[]>;
}

export interface InterfaceQualitySlaDashboardRepository {
  getSlaMonitor(user?: UserParams): Promise<SlaMonitorItemResponse[]>;
  getQualityIndicators(
    user?: UserParams,
  ): Promise<QualityIndicatorItemResponse[]>;
  getEscalationAudit(user?: UserParams): Promise<EscalationAuditItemResponse[]>;
}

export interface InterfaceFinancialDashboardRepository {
  getMaterialCosts(user?: UserParams): Promise<MaterialCostItemResponse[]>;
  getEconomicBalance(user?: UserParams): Promise<EconomicBalanceItemResponse[]>;
}

export interface InterfaceTrendsDashboardRepository {
  getDailyTrend(user?: UserParams): Promise<DailyTrendItemResponse[]>;
  getTerritorialConcentration(
    user?: UserParams,
  ): Promise<TerritorialConcentrationItemResponse[]>;
}
