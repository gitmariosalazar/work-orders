import { Module } from '@nestjs/common';
import { WorkOrderController } from '../../controllers/work-order.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderService } from '../../../application/services/work-order.service';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { PostgreSQLWorkOrderPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [WorkOrderController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderService,
    {
      provide: 'WorkOrderRepository',
      useClass: PostgreSQLWorkOrderPersistence,
    },
  ],
  exports: [],
})
export class PostgreSQLWorkOrderModule {}
