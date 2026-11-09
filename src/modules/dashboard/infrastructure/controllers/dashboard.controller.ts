import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DashboardService } from '../../application/services/dashboard.service';
import { UserParams } from '../../domain/contracts/dashboard.interface.repository';

export interface DashboardMessagePayload {
  limit?: number;
  technicianId?: string;
  user?: UserParams;
}

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @MessagePattern('work-orders.dashboard.funnel-summary')
  getFunnelSummary(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getFunnelSummary(data?.user);
  }

  @MessagePattern('work-orders.dashboard.state-matrix')
  getStateMatrix(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getStateMatrix(data?.user);
  }

  @MessagePattern('work-orders.dashboard.origin-channel')
  getOriginChannelBreakdown(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getOriginChannelBreakdown(data?.user);
  }

  @MessagePattern('work-orders.dashboard.category-department')
  getCategoryDepartmentBreakdown(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getCategoryDepartmentBreakdown(data?.user);
  }

  @MessagePattern('work-orders.dashboard.sync-discrepancies')
  getSyncDiscrepancies(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getSyncDiscrepancies(data?.user);
  }

  @MessagePattern('work-orders.dashboard.dispatch-control')
  getDispatchControl(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getDispatchControl(data?.limit, data?.user);
  }

  @MessagePattern('work-orders.dashboard.header-kpis')
  getHeaderKpis(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getHeaderKpis(data?.user);
  }

  @MessagePattern('work-orders.dashboard.status-distribution')
  getStatusDistribution(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getStatusDistribution(data?.user);
  }

  @MessagePattern('work-orders.dashboard.priority-distribution')
  getPriorityDistribution(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getPriorityDistribution(data?.user);
  }

  @MessagePattern('work-orders.dashboard.work-type-performance')
  getWorkTypePerformance(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getWorkTypePerformance(data?.user);
  }

  @MessagePattern('work-orders.dashboard.key-statistics-matrix')
  getKeyStatisticsMatrix(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getKeyStatisticsMatrix(data?.user);
  }

  @MessagePattern('work-orders.dashboard.executive-overview')
  getExecutiveOverview(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getExecutiveOverview(data?.user);
  }

  @MessagePattern('work-orders.dashboard.technician-performance')
  getTechnicianPerformance(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getTechnicianPerformance(data?.user);
  }

  @MessagePattern('work-orders.dashboard.technician-daily-feed')
  getTechnicianDailyFeed(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getTechnicianDailyFeed(
      data?.technicianId,
      data?.user,
    );
  }

  @MessagePattern('work-orders.dashboard.crew-assignments')
  getCrewAssignments(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getCrewAssignments(data?.user);
  }

  @MessagePattern('work-orders.dashboard.sla-monitor')
  getSlaMonitor(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getSlaMonitor(data?.user);
  }

  @MessagePattern('work-orders.dashboard.quality-indicators')
  getQualityIndicators(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getQualityIndicators(data?.user);
  }

  @MessagePattern('work-orders.dashboard.escalation-audit')
  getEscalationAudit(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getEscalationAudit(data?.user);
  }

  @MessagePattern('work-orders.dashboard.material-costs')
  getMaterialCosts(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getMaterialCosts(data?.user);
  }

  @MessagePattern('work-orders.dashboard.economic-balance')
  getEconomicBalance(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getEconomicBalance(data?.user);
  }

  @MessagePattern('work-orders.dashboard.daily-trend')
  getDailyTrend(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getDailyTrend(data?.user);
  }

  @MessagePattern('work-orders.dashboard.territorial-concentration')
  getTerritorialConcentration(@Payload() data?: DashboardMessagePayload) {
    return this.dashboardService.getTerritorialConcentration(data?.user);
  }
}
