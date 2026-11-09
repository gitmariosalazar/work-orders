import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  InterfaceTechnicianDashboardRepository,
  UserParams,
} from '../../../../domain/contracts/dashboard.interface.repository';
import { DashboardUserPolicy } from '../../../../domain/policies/dashboard-user.policy';
import {
  CrewAssignmentItemResponse,
  TechnicianDailyFeedItemResponse,
  TechnicianPerformanceItemResponse,
} from '../../../../domain/schemas/dto/response/dashboard.response';
import { DASHBOARD_QUERIES } from '../queries/dashboard.queries';
import { BaseDashboardPersistence } from './base-dashboard.persistence';

@Injectable()
export class PostgresqlTechnicianDashboardPersistence
  extends BaseDashboardPersistence
  implements InterfaceTechnicianDashboardRepository
{
  constructor(databaseService: DatabaseAbstract) {
    super(databaseService);
  }

  getTechnicianPerformance(
    user?: UserParams,
  ): Promise<TechnicianPerformanceItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<TechnicianPerformanceItemResponse>(
      DASHBOARD_QUERIES.technicianPerformance,
      [filterUserId],
    );
  }

  getTechnicianDailyFeed(
    technicianId: string | null,
    _user?: UserParams,
  ): Promise<TechnicianDailyFeedItemResponse[]> {
    return this.fetchList<TechnicianDailyFeedItemResponse>(
      DASHBOARD_QUERIES.technicianDailyFeed,
      [technicianId],
    );
  }

  getCrewAssignments(user?: UserParams): Promise<CrewAssignmentItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<CrewAssignmentItemResponse>(
      DASHBOARD_QUERIES.crewAssignments,
      [filterUserId],
    );
  }
}
