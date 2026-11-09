import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  InterfaceExecutiveDashboardRepository,
  UserParams,
} from '../../../../domain/contracts/dashboard.interface.repository';
import { DashboardUserPolicy } from '../../../../domain/policies/dashboard-user.policy';
import {
  ExecutiveOverviewResponse,
  HeaderKpisResponse,
  KeyStatisticsMatrixItemResponse,
  PriorityDistributionItemResponse,
  StatusDistributionItemResponse,
  WorkTypePerformanceItemResponse,
} from '../../../../domain/schemas/dto/response/dashboard.response';
import { DASHBOARD_QUERIES } from '../queries/dashboard.queries';
import { BaseDashboardPersistence } from './base-dashboard.persistence';

interface ExecutiveOverviewRow {
  dashboardExecutiveOverview: ExecutiveOverviewResponse;
}

@Injectable()
export class PostgresqlExecutiveDashboardPersistence
  extends BaseDashboardPersistence
  implements InterfaceExecutiveDashboardRepository
{
  constructor(databaseService: DatabaseAbstract) {
    super(databaseService);
  }

  getHeaderKpis(user?: UserParams): Promise<HeaderKpisResponse | null> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchOne<HeaderKpisResponse>(DASHBOARD_QUERIES.headerKpis, [
      filterUserId,
    ]);
  }

  getStatusDistribution(
    user?: UserParams,
  ): Promise<StatusDistributionItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<StatusDistributionItemResponse>(
      DASHBOARD_QUERIES.statusDistribution,
      [filterUserId],
    );
  }

  getPriorityDistribution(
    user?: UserParams,
  ): Promise<PriorityDistributionItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<PriorityDistributionItemResponse>(
      DASHBOARD_QUERIES.priorityDistribution,
      [filterUserId],
    );
  }

  getWorkTypePerformance(
    user?: UserParams,
  ): Promise<WorkTypePerformanceItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<WorkTypePerformanceItemResponse>(
      DASHBOARD_QUERIES.workTypePerformance,
      [filterUserId],
    );
  }

  getKeyStatisticsMatrix(
    user?: UserParams,
  ): Promise<KeyStatisticsMatrixItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<KeyStatisticsMatrixItemResponse>(
      DASHBOARD_QUERIES.keyStatisticsMatrix,
      [filterUserId],
    );
  }

  async getExecutiveOverview(
    user?: UserParams,
  ): Promise<ExecutiveOverviewResponse | null> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    const row = await this.fetchOne<ExecutiveOverviewRow>(
      DASHBOARD_QUERIES.executiveOverview,
      [filterUserId],
    );
    return row?.dashboardExecutiveOverview ?? null;
  }
}
