import { Module } from '@nestjs/common';
import { WorkOrderHistoryController } from '../../controllers/work-order-history.controller';
import { WorkOrderHistoryService } from '../../../application/services/work-order-history.service';
import { PostgresqlWorkOrderHistoryPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-history.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [WorkOrderHistoryController],
  providers: [
    WorkOrderHistoryService,
    {
      provide: 'WorkOrderHistoryRepository',
      useClass: PostgresqlWorkOrderHistoryPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlWorkOrderHistoryModule {}
