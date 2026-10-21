import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceFinancialDashboardRepository } from '../../../../domain/contracts/dashboard.interface.repository';
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

  getMaterialCosts(): Promise<MaterialCostItemResponse[]> {
    return this.fetchList<MaterialCostItemResponse>(
      DASHBOARD_QUERIES.materialCosts,
    );
  }

  getEconomicBalance(): Promise<EconomicBalanceItemResponse[]> {
    return this.fetchList<EconomicBalanceItemResponse>(
      DASHBOARD_QUERIES.economicBalance,
    );
  }
}
