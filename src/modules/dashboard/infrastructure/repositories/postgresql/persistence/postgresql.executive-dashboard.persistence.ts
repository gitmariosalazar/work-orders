import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceExecutiveDashboardRepository } from '../../../../domain/contracts/dashboard.interface.repository';
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

  getHeaderKpis(): Promise<HeaderKpisResponse | null> {
    return this.fetchOne<HeaderKpisResponse>(DASHBOARD_QUERIES.headerKpis);
  }

  getStatusDistribution(): Promise<StatusDistributionItemResponse[]> {
    return this.fetchList<StatusDistributionItemResponse>(
      DASHBOARD_QUERIES.statusDistribution,
    );
  }

  getPriorityDistribution(): Promise<PriorityDistributionItemResponse[]> {
    return this.fetchList<PriorityDistributionItemResponse>(
      DASHBOARD_QUERIES.priorityDistribution,
    );
  }

  getWorkTypePerformance(): Promise<WorkTypePerformanceItemResponse[]> {
    return this.fetchList<WorkTypePerformanceItemResponse>(
      DASHBOARD_QUERIES.workTypePerformance,
    );
  }

  getKeyStatisticsMatrix(): Promise<KeyStatisticsMatrixItemResponse[]> {
    return this.fetchList<KeyStatisticsMatrixItemResponse>(
      DASHBOARD_QUERIES.keyStatisticsMatrix,
    );
  }

  async getExecutiveOverview(): Promise<ExecutiveOverviewResponse | null> {
    const row = await this.fetchOne<ExecutiveOverviewRow>(
      DASHBOARD_QUERIES.executiveOverview,
    );
    return row?.dashboardExecutiveOverview ?? null;
  }
}
