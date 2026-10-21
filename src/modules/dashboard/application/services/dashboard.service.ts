import { Inject, Injectable } from '@nestjs/common';
import {
  InterfaceExecutiveDashboardRepository,
  InterfaceFinancialDashboardRepository,
  InterfaceIncidentOrderComparisonRepository,
  InterfaceQualitySlaDashboardRepository,
  InterfaceTechnicianDashboardRepository,
  InterfaceTrendsDashboardRepository,
} from '../../domain/contracts/dashboard.interface.repository';
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

  getFunnelSummary(): Promise<FunnelSummaryResponse | null> {
    return this.comparisonRepository.getFunnelSummary();
  }

  getStateMatrix(): Promise<StateMatrixItemResponse[]> {
    return this.comparisonRepository.getStateMatrix();
  }

  getOriginChannelBreakdown(): Promise<OriginChannelItemResponse[]> {
    return this.comparisonRepository.getOriginChannelBreakdown();
  }

  getCategoryDepartmentBreakdown(): Promise<CategoryDepartmentItemResponse[]> {
    return this.comparisonRepository.getCategoryDepartmentBreakdown();
  }

  getSyncDiscrepancies(): Promise<SyncDiscrepancyItemResponse[]> {
    return this.comparisonRepository.getSyncDiscrepancies();
  }

  getDispatchControl(limit?: number): Promise<DispatchControlItemResponse[]> {
    const safeLimit =
      Number.isInteger(limit) && limit !== undefined && limit > 0
        ? Math.min(limit, MAX_DISPATCH_CONTROL_LIMIT)
        : DEFAULT_DISPATCH_CONTROL_LIMIT;
    return this.comparisonRepository.getDispatchControl(safeLimit);
  }

  getHeaderKpis(): Promise<HeaderKpisResponse | null> {
    return this.executiveRepository.getHeaderKpis();
  }

  getStatusDistribution(): Promise<StatusDistributionItemResponse[]> {
    return this.executiveRepository.getStatusDistribution();
  }

  getPriorityDistribution(): Promise<PriorityDistributionItemResponse[]> {
    return this.executiveRepository.getPriorityDistribution();
  }

  getWorkTypePerformance(): Promise<WorkTypePerformanceItemResponse[]> {
    return this.executiveRepository.getWorkTypePerformance();
  }

  getKeyStatisticsMatrix(): Promise<KeyStatisticsMatrixItemResponse[]> {
    return this.executiveRepository.getKeyStatisticsMatrix();
  }

  getExecutiveOverview(): Promise<ExecutiveOverviewResponse | null> {
    return this.executiveRepository.getExecutiveOverview();
  }

  getTechnicianPerformance(): Promise<TechnicianPerformanceItemResponse[]> {
    return this.technicianRepository.getTechnicianPerformance();
  }

  getTechnicianDailyFeed(
    technicianId?: string,
  ): Promise<TechnicianDailyFeedItemResponse[]> {
    const normalizedId = technicianId?.trim() ? technicianId.trim() : null;
    return this.technicianRepository.getTechnicianDailyFeed(normalizedId);
  }

  getCrewAssignments(): Promise<CrewAssignmentItemResponse[]> {
    return this.technicianRepository.getCrewAssignments();
  }

  getSlaMonitor(): Promise<SlaMonitorItemResponse[]> {
    return this.qualitySlaRepository.getSlaMonitor();
  }

  getQualityIndicators(): Promise<QualityIndicatorItemResponse[]> {
    return this.qualitySlaRepository.getQualityIndicators();
  }

  getEscalationAudit(): Promise<EscalationAuditItemResponse[]> {
    return this.qualitySlaRepository.getEscalationAudit();
  }

  getMaterialCosts(): Promise<MaterialCostItemResponse[]> {
    return this.financialRepository.getMaterialCosts();
  }

  getEconomicBalance(): Promise<EconomicBalanceItemResponse[]> {
    return this.financialRepository.getEconomicBalance();
  }

  getDailyTrend(): Promise<DailyTrendItemResponse[]> {
    return this.trendsRepository.getDailyTrend();
  }

  getTerritorialConcentration(): Promise<
    TerritorialConcentrationItemResponse[]
  > {
    return this.trendsRepository.getTerritorialConcentration();
  }
}
