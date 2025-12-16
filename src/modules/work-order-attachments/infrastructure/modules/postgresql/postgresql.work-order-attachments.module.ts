import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { WorkOrderAttachmentsController } from '../../controllers/work-order-attachments.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderAttachmentsService } from '../../../application/services/work-order-attachments.service';
import { PostgresqlWorkOrderAttachmentsPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-attachments.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [WorkOrderAttachmentsController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderAttachmentsService,
    {
      provide: 'WorkOrderAttachmentsRepository',
      useClass: PostgresqlWorkOrderAttachmentsPersistence,
    },
  ],
  exports: [],
})
export class PostgresqlWorkOrderAttachmentsModule {}
