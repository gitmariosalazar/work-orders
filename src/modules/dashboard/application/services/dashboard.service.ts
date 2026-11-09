import { Inject, Injectable } from '@nestjs/common';
import {
  InterfaceExecutiveDashboardRepository,
  InterfaceFinancialDashboardRepository,
  InterfaceIncidentOrderComparisonRepository,
  InterfaceQualitySlaDashboardRepository,
  InterfaceTechnicianDashboardRepository,
  InterfaceTrendsDashboardRepository,
  UserParams,
} from '../../domain/contracts/dashboard.interface.repository';
import { DashboardUserPolicy } from '../../domain/policies/dashboard-user.policy';
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
} from '../../domain/schemas/dto/response/dashboard.response';

export const DEFAULT_DISPATCH_CONTROL_LIMIT = 100;
export const MAX_DISPATCH_CONTROL_LIMIT = 500;

@Injectable()
export class DashboardService {
  constructor(
    @Inject('IncidentOrderComparisonRepository')
    private readonly comparisonRepository: InterfaceIncidentOrderComparisonRepository,
    @Inject('ExecutiveDashboardRepository')
    private readonly executiveRepository: InterfaceExecutiveDashboardRepository,
    @Inject('TechnicianDashboardRepository')
    private readonly technicianRepository: InterfaceTechnicianDashboardRepository,
    @Inject('QualitySlaDashboardRepository')
    private readonly qualitySlaRepository: InterfaceQualitySlaDashboardRepository,
    @Inject('FinancialDashboardRepository')
    private readonly financialRepository: InterfaceFinancialDashboardRepository,
    @Inject('TrendsDashboardRepository')
    private readonly trendsRepository: InterfaceTrendsDashboardRepository,
  ) {}

  getFunnelSummary(user?: UserParams): Promise<FunnelSummaryResponse | null> {
    return this.comparisonRepository.getFunnelSummary(user);
  }

  getStateMatrix(user?: UserParams): Promise<StateMatrixItemResponse[]> {
    return this.comparisonRepository.getStateMatrix(user);
  }

  getOriginChannelBreakdown(
    user?: UserParams,
  ): Promise<OriginChannelItemResponse[]> {
    return this.comparisonRepository.getOriginChannelBreakdown(user);
  }

  getCategoryDepartmentBreakdown(
    user?: UserParams,
  ): Promise<CategoryDepartmentItemResponse[]> {
    return this.comparisonRepository.getCategoryDepartmentBreakdown(user);
  }

  getSyncDiscrepancies(
    user?: UserParams,
  ): Promise<SyncDiscrepancyItemResponse[]> {
    return this.comparisonRepository.getSyncDiscrepancies(user);
  }

  getDispatchControl(
    limit?: number,
    user?: UserParams,
  ): Promise<DispatchControlItemResponse[]> {
    const safeLimit =
      Number.isInteger(limit) && limit !== undefined && limit > 0
        ? Math.min(limit, MAX_DISPATCH_CONTROL_LIMIT)
        : DEFAULT_DISPATCH_CONTROL_LIMIT;
    return this.comparisonRepository.getDispatchControl(safeLimit, user);
  }

  getHeaderKpis(user?: UserParams): Promise<HeaderKpisResponse | null> {
    return this.executiveRepository.getHeaderKpis(user);
  }

  getStatusDistribution(
    user?: UserParams,
  ): Promise<StatusDistributionItemResponse[]> {
    return this.executiveRepository.getStatusDistribution(user);
  }

  getPriorityDistribution(
    user?: UserParams,
  ): Promise<PriorityDistributionItemResponse[]> {
    return this.executiveRepository.getPriorityDistribution(user);
  }

  getWorkTypePerformance(
    user?: UserParams,
  ): Promise<WorkTypePerformanceItemResponse[]> {
    return this.executiveRepository.getWorkTypePerformance(user);
  }

  getKeyStatisticsMatrix(
    user?: UserParams,
  ): Promise<KeyStatisticsMatrixItemResponse[]> {
    return this.executiveRepository.getKeyStatisticsMatrix(user);
  }

  getExecutiveOverview(
    user?: UserParams,
  ): Promise<ExecutiveOverviewResponse | null> {
    return this.executiveRepository.getExecutiveOverview(user);
  }

  getTechnicianPerformance(
    user?: UserParams,
  ): Promise<TechnicianPerformanceItemResponse[]> {
    return this.technicianRepository.getTechnicianPerformance(user);
  }

  getTechnicianDailyFeed(
    technicianId?: string,
    user?: UserParams,
  ): Promise<TechnicianDailyFeedItemResponse[]> {
    // Si no es admin, se neutraliza cualquier intento de IDOR forzando su propio user.id
    const effectiveTechnicianId = DashboardUserPolicy.isAdmin(user)
      ? (technicianId?.trim() || null)
      : (user?.id?.trim() || null);
    return this.technicianRepository.getTechnicianDailyFeed(
      effectiveTechnicianId,
      user,
    );
  }

  getCrewAssignments(user?: UserParams): Promise<CrewAssignmentItemResponse[]> {
    return this.technicianRepository.getCrewAssignments(user);
  }

  getSlaMonitor(user?: UserParams): Promise<SlaMonitorItemResponse[]> {
    return this.qualitySlaRepository.getSlaMonitor(user);
  }

  getQualityIndicators(
    user?: UserParams,
  ): Promise<QualityIndicatorItemResponse[]> {
    return this.qualitySlaRepository.getQualityIndicators(user);
  }

  getEscalationAudit(user?: UserParams): Promise<EscalationAuditItemResponse[]> {
    return this.qualitySlaRepository.getEscalationAudit(user);
  }

  getMaterialCosts(user?: UserParams): Promise<MaterialCostItemResponse[]> {
    return this.financialRepository.getMaterialCosts(user);
  }

  getEconomicBalance(
    user?: UserParams,
  ): Promise<EconomicBalanceItemResponse[]> {
    return this.financialRepository.getEconomicBalance(user);
  }

  getDailyTrend(user?: UserParams): Promise<DailyTrendItemResponse[]> {
    return this.trendsRepository.getDailyTrend(user);
  }

  getTerritorialConcentration(
    user?: UserParams,
  ): Promise<TerritorialConcentrationItemResponse[]> {
    return this.trendsRepository.getTerritorialConcentration(user);
  }
}
