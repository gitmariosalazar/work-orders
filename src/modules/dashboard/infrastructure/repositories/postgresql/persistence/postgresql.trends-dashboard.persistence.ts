import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  InterfaceTrendsDashboardRepository,
  UserParams,
} from '../../../../domain/contracts/dashboard.interface.repository';
import { DashboardUserPolicy } from '../../../../domain/policies/dashboard-user.policy';
import {
  DailyTrendItemResponse,
  TerritorialConcentrationItemResponse,
} from '../../../../domain/schemas/dto/response/dashboard.response';
import { DASHBOARD_QUERIES } from '../queries/dashboard.queries';
import { BaseDashboardPersistence } from './base-dashboard.persistence';

@Injectable()
export class PostgresqlTrendsDashboardPersistence
  extends BaseDashboardPersistence
  implements InterfaceTrendsDashboardRepository
{
  constructor(databaseService: DatabaseAbstract) {
    super(databaseService);
  }

  getDailyTrend(user?: UserParams): Promise<DailyTrendItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<DailyTrendItemResponse>(
      DASHBOARD_QUERIES.dailyTrend,
      [filterUserId],
    );
  }

  getTerritorialConcentration(
    user?: UserParams,
  ): Promise<TerritorialConcentrationItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<TerritorialConcentrationItemResponse>(
      DASHBOARD_QUERIES.territorialConcentration,
      [filterUserId],
    );
  }
}
