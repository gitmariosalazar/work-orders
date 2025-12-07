import { Module } from '@nestjs/common';
import { WorkOrderHistoryController } from '../../controllers/work-order-history.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { PostgresqlWorkOrderHistoryPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-history.persistence';
import { WorkOrderHistoryService } from '../../../application/services/work-order-history.service';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';

@Module({
  imports: [KafkaServiceModule],
  controllers: [WorkOrderHistoryController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderHistoryService,
    {
      provide: 'WorkOrderHistoryRepository',
      useClass: PostgresqlWorkOrderHistoryPersistence,
    },
  ],
  exports: [],
})
export class PostgresqlWorkOrderHistoryModule {}
