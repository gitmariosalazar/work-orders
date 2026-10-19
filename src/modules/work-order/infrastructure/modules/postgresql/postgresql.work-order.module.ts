import { Module } from '@nestjs/common';
import { WorkOrderController } from '../../controllers/work-order.controller';
import { WorkOrderService } from '../../../application/services/work-order.service';
import { PostgreSQLWorkOrderPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';
import { PostgreSqlWorkOrderAttachmentsModule } from '../../../../work-order-attachments/infrastructure/modules/postgresql/postgresql.work-order-attachments.module';
import { WorkOrderAttachmentsGateway } from '../../gateways/work-order-attachments.gateway';
import { WORK_ORDER_ATTACHMENTS_PORT } from '../../../application/ports/work-order-attachments.port';

@Module({
  imports: [
    KafkaServiceModule,
    DatabasePersistenceModule,
    PostgreSqlWorkOrderAttachmentsModule,
  ],
  controllers: [WorkOrderController],
  providers: [
    WorkOrderService,
    {
      provide: 'WorkOrderRepository',
      useClass: PostgreSQLWorkOrderPersistence,
    },
    {
      provide: WORK_ORDER_ATTACHMENTS_PORT,
      useClass: WorkOrderAttachmentsGateway,
    },
  ],
  exports: [],
})
export class PostgreSQLWorkOrderModule {}
