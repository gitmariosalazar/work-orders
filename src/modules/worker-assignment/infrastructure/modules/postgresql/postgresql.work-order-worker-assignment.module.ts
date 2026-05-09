import { Module } from '@nestjs/common';
import { WorkOrderWorkerAssignmentController } from '../../controllers/work-order-worker-assignment.controller';
import { WorkOrderWorkerAssignmentService } from '../../../application/services/work-order-worker-assignment.service';
import { PostgresqlWorkOrderWorkerAssignmentPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-worker-assignment.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [WorkOrderWorkerAssignmentController],
  providers: [
    WorkOrderWorkerAssignmentService,
    {
      provide: 'WorkOrderWorkerAssignmentRepository',
      useClass: PostgresqlWorkOrderWorkerAssignmentPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlWorkOrderWorkerAssignmentModule {}
