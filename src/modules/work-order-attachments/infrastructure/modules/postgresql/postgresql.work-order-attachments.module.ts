import { Module } from '@nestjs/common';
import { WorkOrderAttachmentsController } from '../../controllers/work-order-attachments.controller';
import { WorkOrderAttachmentsService } from '../../../application/services/work-order-attachments.service';
import { PostgresqlWorkOrderAttachmentsPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-attachments.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [WorkOrderAttachmentsController],
  providers: [
    WorkOrderAttachmentsService,
    {
      provide: 'WorkOrderAttachmentsRepository',
      useClass: PostgresqlWorkOrderAttachmentsPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlWorkOrderAttachmentsModule {}
