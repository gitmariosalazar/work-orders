import { Injectable } from '@nestjs/common';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { InterfaceQualitySlaDashboardRepository } from '../../../../domain/contracts/dashboard.interface.repository';
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

  getSlaMonitor(): Promise<SlaMonitorItemResponse[]> {
    return this.fetchList<SlaMonitorItemResponse>(DASHBOARD_QUERIES.slaMonitor);
  }

  getQualityIndicators(): Promise<QualityIndicatorItemResponse[]> {
    return this.fetchList<QualityIndicatorItemResponse>(
      DASHBOARD_QUERIES.qualityIndicators,
    );
  }

  getEscalationAudit(): Promise<EscalationAuditItemResponse[]> {
    return this.fetchList<EscalationAuditItemResponse>(
      DASHBOARD_QUERIES.escalationAudit,
    );
  }
}
