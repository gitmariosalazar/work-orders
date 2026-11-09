import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  InterfaceFinancialDashboardRepository,
  UserParams,
} from '../../../../domain/contracts/dashboard.interface.repository';
import { DashboardUserPolicy } from '../../../../domain/policies/dashboard-user.policy';
import {
  EconomicBalanceItemResponse,
  MaterialCostItemResponse,
} from '../../../../domain/schemas/dto/response/dashboard.response';
import { DASHBOARD_QUERIES } from '../queries/dashboard.queries';
import { BaseDashboardPersistence } from './base-dashboard.persistence';

@Injectable()
export class PostgresqlFinancialDashboardPersistence
  extends BaseDashboardPersistence
  implements InterfaceFinancialDashboardRepository
{
  constructor(databaseService: DatabaseAbstract) {
    super(databaseService);
  }

  getMaterialCosts(user?: UserParams): Promise<MaterialCostItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<MaterialCostItemResponse>(
      DASHBOARD_QUERIES.materialCosts,
      [filterUserId],
    );
  }

  getEconomicBalance(
    user?: UserParams,
  ): Promise<EconomicBalanceItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<EconomicBalanceItemResponse>(
      DASHBOARD_QUERIES.economicBalance,
      [filterUserId],
    );
  }
}
