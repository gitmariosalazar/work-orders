import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import {
  InterfaceQualitySlaDashboardRepository,
  UserParams,
} from '../../../../domain/contracts/dashboard.interface.repository';
import { DashboardUserPolicy } from '../../../../domain/policies/dashboard-user.policy';
import {
  EscalationAuditItemResponse,
  QualityIndicatorItemResponse,
  SlaMonitorItemResponse,
} from '../../../../domain/schemas/dto/response/dashboard.response';
import { DASHBOARD_QUERIES } from '../queries/dashboard.queries';
import { BaseDashboardPersistence } from './base-dashboard.persistence';

@Injectable()
export class PostgresqlQualitySlaDashboardPersistence
  extends BaseDashboardPersistence
  implements InterfaceQualitySlaDashboardRepository
{
  constructor(databaseService: DatabaseAbstract) {
    super(databaseService);
  }

  getSlaMonitor(user?: UserParams): Promise<SlaMonitorItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<SlaMonitorItemResponse>(
      DASHBOARD_QUERIES.slaMonitor,
      [filterUserId],
    );
  }

  getQualityIndicators(
    user?: UserParams,
  ): Promise<QualityIndicatorItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<QualityIndicatorItemResponse>(
      DASHBOARD_QUERIES.qualityIndicators,
      [filterUserId],
    );
  }

  getEscalationAudit(user?: UserParams): Promise<EscalationAuditItemResponse[]> {
    const filterUserId = DashboardUserPolicy.resolveScopeUserId(user);
    return this.fetchList<EscalationAuditItemResponse>(
      DASHBOARD_QUERIES.escalationAudit,
      [filterUserId],
    );
  }
}
