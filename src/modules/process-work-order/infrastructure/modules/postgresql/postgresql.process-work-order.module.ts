import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';
import { ProcessWorkOrderController } from '../../controllers/process-work-order.controller';
import { ProcessWorkOrderService } from '../../../application/services/process-work-order.service';
import { PostgresqlProcessWorkOrderPersistence } from '../../repositories/postgresql/persistence/postgresql.process-work-order.persistence';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [ProcessWorkOrderController],
  providers: [
    ProcessWorkOrderService,
    {
      provide: 'ProcessWorkOrderRepository',
      useClass: PostgresqlProcessWorkOrderPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlProcessWorkOrderModule {}
