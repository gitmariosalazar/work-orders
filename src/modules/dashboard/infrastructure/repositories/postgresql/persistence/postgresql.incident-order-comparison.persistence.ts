import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  InterfaceIncidentOrderComparisonRepository,
  UserParams,
} from '../../../../domain/contracts/dashboard.interface.repository';
import { DashboardUserPolicy } from '../../../../domain/policies/dashboard-user.policy';
import {
  CategoryDepartmentItemResponse,
  DispatchControlItemResponse,
  FunnelSummaryResponse,
  OriginChannelItemResponse,
  StateMatrixItemResponse,
  SyncDiscrepancyItemResponse,
} from '../../../../domain/schemas/dto/response/dashboard.response';
import { DASHBOARD_QUERIES } from '../queries/dashboard.queries';
import { BaseDashboardPersistence } from './base-dashboard.persistence';

@Injectable()
export class PostgresqlIncidentOrderComparisonPersistence
  extends BaseDashboardPersistence
  implements InterfaceIncidentOrderComparisonRepository
{
  constructor(databaseService: DatabaseAbstract) {
    super(databaseService);
  }

  getFunnelSummary(user?: UserParams): Promise<FunnelSummaryResponse | null> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchOne<FunnelSummaryResponse>(
      DASHBOARD_QUERIES.funnelSummary,
      [filterUserId],
    );
  }

  getStateMatrix(user?: UserParams): Promise<StateMatrixItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<StateMatrixItemResponse>(
      DASHBOARD_QUERIES.stateMatrix,
      [filterUserId],
    );
  }

  getOriginChannelBreakdown(
    user?: UserParams,
  ): Promise<OriginChannelItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<OriginChannelItemResponse>(
      DASHBOARD_QUERIES.originChannel,
      [filterUserId],
    );
  }

  getCategoryDepartmentBreakdown(
    user?: UserParams,
  ): Promise<CategoryDepartmentItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<CategoryDepartmentItemResponse>(
      DASHBOARD_QUERIES.categoryDepartment,
      [filterUserId],
    );
  }

  getSyncDiscrepancies(
    user?: UserParams,
  ): Promise<SyncDiscrepancyItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<SyncDiscrepancyItemResponse>(
      DASHBOARD_QUERIES.syncDiscrepancies,
      [filterUserId],
    );
  }

  getDispatchControl(
    limit: number,
    user?: UserParams,
  ): Promise<DispatchControlItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<DispatchControlItemResponse>(
      DASHBOARD_QUERIES.dispatchControl,
      [limit, filterUserId],
    );
  }
}
