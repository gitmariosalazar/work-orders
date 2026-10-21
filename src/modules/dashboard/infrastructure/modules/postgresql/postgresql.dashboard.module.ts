import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';
import { DashboardController } from '../../controllers/dashboard.controller';
import { DashboardService } from '../../../application/services/dashboard.service';
import { PostgresqlIncidentOrderComparisonPersistence } from '../../repositories/postgresql/persistence/postgresql.incident-order-comparison.persistence';
import { PostgresqlExecutiveDashboardPersistence } from '../../repositories/postgresql/persistence/postgresql.executive-dashboard.persistence';
import { PostgresqlTechnicianDashboardPersistence } from '../../repositories/postgresql/persistence/postgresql.technician-dashboard.persistence';
import { PostgresqlQualitySlaDashboardPersistence } from '../../repositories/postgresql/persistence/postgresql.quality-sla-dashboard.persistence';
import { PostgresqlFinancialDashboardPersistence } from '../../repositories/postgresql/persistence/postgresql.financial-dashboard.persistence';
import { PostgresqlTrendsDashboardPersistence } from '../../repositories/postgresql/persistence/postgresql.trends-dashboard.persistence';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    {
      provide: 'IncidentOrderComparisonRepository',
      useClass: PostgresqlIncidentOrderComparisonPersistence,
    },
    {
      provide: 'ExecutiveDashboardRepository',
      useClass: PostgresqlExecutiveDashboardPersistence,
    },
    {
      provide: 'TechnicianDashboardRepository',
      useClass: PostgresqlTechnicianDashboardPersistence,
    },
    {
      provide: 'QualitySlaDashboardRepository',
      useClass: PostgresqlQualitySlaDashboardPersistence,
    },
    {
      provide: 'FinancialDashboardRepository',
      useClass: PostgresqlFinancialDashboardPersistence,
    },
    {
      provide: 'TrendsDashboardRepository',
      useClass: PostgresqlTrendsDashboardPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlDashboardModule {}
