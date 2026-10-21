import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceIncidentOrderComparisonRepository } from '../../../../domain/contracts/dashboard.interface.repository';
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

  getFunnelSummary(): Promise<FunnelSummaryResponse | null> {
    return this.fetchOne<FunnelSummaryResponse>(
      DASHBOARD_QUERIES.funnelSummary,
    );
  }

  getStateMatrix(): Promise<StateMatrixItemResponse[]> {
    return this.fetchList<StateMatrixItemResponse>(
      DASHBOARD_QUERIES.stateMatrix,
    );
  }

  getOriginChannelBreakdown(): Promise<OriginChannelItemResponse[]> {
    return this.fetchList<OriginChannelItemResponse>(
      DASHBOARD_QUERIES.originChannel,
    );
  }

  getCategoryDepartmentBreakdown(): Promise<CategoryDepartmentItemResponse[]> {
    return this.fetchList<CategoryDepartmentItemResponse>(
      DASHBOARD_QUERIES.categoryDepartment,
    );
  }

  getSyncDiscrepancies(): Promise<SyncDiscrepancyItemResponse[]> {
    return this.fetchList<SyncDiscrepancyItemResponse>(
      DASHBOARD_QUERIES.syncDiscrepancies,
    );
  }

  getDispatchControl(limit: number): Promise<DispatchControlItemResponse[]> {
    return this.fetchList<DispatchControlItemResponse>(
      DASHBOARD_QUERIES.dispatchControl,
      [limit],
    );
  }
}
