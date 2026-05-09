import { Module } from '@nestjs/common';
import { WorkOrderController } from '../../controllers/work-order.controller';
import { WorkOrderService } from '../../../application/services/work-order.service';
import { PostgreSQLWorkOrderPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [WorkOrderController],
  providers: [
    WorkOrderService,
    {
      provide: 'WorkOrderRepository',
      useClass: PostgreSQLWorkOrderPersistence,
    },
  ],
  exports: [],
})
export class PostgreSQLWorkOrderModule {}
