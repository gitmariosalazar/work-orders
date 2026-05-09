import { Module } from '@nestjs/common';
import { WorkOrderObservationController } from '../../controllers/work-order-observation.controller';
import { WorkOrderObservationService } from '../../../application/services/work-order-observation.service';
import { PostgreSqlWorkOrderObservationPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-observation.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [WorkOrderObservationController],
  providers: [
    WorkOrderObservationService,
    {
      provide: 'WorkOrderObservationRepository',
      useClass: PostgreSqlWorkOrderObservationPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlWorkOrderObservationModule {}
