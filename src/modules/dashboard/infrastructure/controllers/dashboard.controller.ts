import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DashboardService } from '../../application/services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @MessagePattern('work-orders.dashboard.funnel-summary')
  getFunnelSummary() {
    return this.dashboardService.getFunnelSummary();
  }

  @MessagePattern('work-orders.dashboard.state-matrix')
  getStateMatrix() {
    return this.dashboardService.getStateMatrix();
  }

  @MessagePattern('work-orders.dashboard.origin-channel')
  getOriginChannelBreakdown() {
    return this.dashboardService.getOriginChannelBreakdown();
  }

  @MessagePattern('work-orders.dashboard.category-department')
  getCategoryDepartmentBreakdown() {
    return this.dashboardService.getCategoryDepartmentBreakdown();
  }

  @MessagePattern('work-orders.dashboard.sync-discrepancies')
  getSyncDiscrepancies() {
    return this.dashboardService.getSyncDiscrepancies();
  }

  @MessagePattern('work-orders.dashboard.dispatch-control')
  getDispatchControl(@Payload() data: { limit?: number }) {
    return this.dashboardService.getDispatchControl(data?.limit);
  }

  @MessagePattern('work-orders.dashboard.header-kpis')
  getHeaderKpis() {
    return this.dashboardService.getHeaderKpis();
  }

  @MessagePattern('work-orders.dashboard.status-distribution')
  getStatusDistribution() {
    return this.dashboardService.getStatusDistribution();
  }

  @MessagePattern('work-orders.dashboard.priority-distribution')
  getPriorityDistribution() {
    return this.dashboardService.getPriorityDistribution();
  }

  @MessagePattern('work-orders.dashboard.work-type-performance')
  getWorkTypePerformance() {
    return this.dashboardService.getWorkTypePerformance();
  }

  @MessagePattern('work-orders.dashboard.key-statistics-matrix')
  getKeyStatisticsMatrix() {
    return this.dashboardService.getKeyStatisticsMatrix();
  }

  @MessagePattern('work-orders.dashboard.executive-overview')
  getExecutiveOverview() {
    return this.dashboardService.getExecutiveOverview();
  }

  @MessagePattern('work-orders.dashboard.technician-performance')
  getTechnicianPerformance() {
    return this.dashboardService.getTechnicianPerformance();
  }

  @MessagePattern('work-orders.dashboard.technician-daily-feed')
  getTechnicianDailyFeed(@Payload() data: { technicianId?: string }) {
    return this.dashboardService.getTechnicianDailyFeed(data?.technicianId);
  }

  @MessagePattern('work-orders.dashboard.crew-assignments')
  getCrewAssignments() {
    return this.dashboardService.getCrewAssignments();
  }

  @MessagePattern('work-orders.dashboard.sla-monitor')
  getSlaMonitor() {
    return this.dashboardService.getSlaMonitor();
  }

  @MessagePattern('work-orders.dashboard.quality-indicators')
  getQualityIndicators() {
    return this.dashboardService.getQualityIndicators();
  }

  @MessagePattern('work-orders.dashboard.escalation-audit')
  getEscalationAudit() {
    return this.dashboardService.getEscalationAudit();
  }

  @MessagePattern('work-orders.dashboard.material-costs')
  getMaterialCosts() {
    return this.dashboardService.getMaterialCosts();
  }

  @MessagePattern('work-orders.dashboard.economic-balance')
  getEconomicBalance() {
    return this.dashboardService.getEconomicBalance();
  }

  @MessagePattern('work-orders.dashboard.daily-trend')
  getDailyTrend() {
    return this.dashboardService.getDailyTrend();
  }

  @MessagePattern('work-orders.dashboard.territorial-concentration')
  getTerritorialConcentration() {
    return this.dashboardService.getTerritorialConcentration();
  }
}
