import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceTrendsDashboardRepository } from '../../../../domain/contracts/dashboard.interface.repository';
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

  getDailyTrend(): Promise<DailyTrendItemResponse[]> {
    return this.fetchList<DailyTrendItemResponse>(DASHBOARD_QUERIES.dailyTrend);
  }

  getTerritorialConcentration(): Promise<
    TerritorialConcentrationItemResponse[]
  > {
    return this.fetchList<TerritorialConcentrationItemResponse>(
      DASHBOARD_QUERIES.territorialConcentration,
    );
  }
}
