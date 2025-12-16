import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { WorkOrderWorkerAssignmentController } from '../../controllers/work-order-worker-assignment.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderWorkerAssignmentService } from '../../../application/services/work-order-worker-assignment.service';
import { PostgresqlWorkOrderWorkerAssignmentPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-worker-assignment.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [WorkOrderWorkerAssignmentController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderWorkerAssignmentService,
    {
      provide: 'WorkOrderWorkerAssignmentRepository',
      useClass: PostgresqlWorkOrderWorkerAssignmentPersistence,
    },
  ],
  exports: [],
})
export class PostgresqlWorkOrderWorkerAssignmentModule {}
