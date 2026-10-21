import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceTechnicianDashboardRepository } from '../../../../domain/contracts/dashboard.interface.repository';
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

  getTechnicianPerformance(): Promise<TechnicianPerformanceItemResponse[]> {
    return this.fetchList<TechnicianPerformanceItemResponse>(
      DASHBOARD_QUERIES.technicianPerformance,
    );
  }

  getTechnicianDailyFeed(
    technicianId: string | null,
  ): Promise<TechnicianDailyFeedItemResponse[]> {
    return this.fetchList<TechnicianDailyFeedItemResponse>(
      DASHBOARD_QUERIES.technicianDailyFeed,
      [technicianId],
    );
  }

  getCrewAssignments(): Promise<CrewAssignmentItemResponse[]> {
    return this.fetchList<CrewAssignmentItemResponse>(
      DASHBOARD_QUERIES.crewAssignments,
    );
  }
}
