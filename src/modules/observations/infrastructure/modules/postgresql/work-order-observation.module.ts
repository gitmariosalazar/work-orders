import { Module } from '@nestjs/common';
import { WorkOrderObservationController } from '../../controllers/work-order-observation.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderObservationService } from '../../../application/services/work-order-observation.service';
import { PostgreSqlWorkOrderObservationPersistence } from '../../repositories/postgresql/persistence/postgresql.work-order-observation.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';

@Module({
  imports: [KafkaServiceModule],
  controllers: [WorkOrderObservationController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderObservationService,
    {
      provide: 'WorkOrderObservationRepository',
      useClass: PostgreSqlWorkOrderObservationPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlWorkOrderObservationModule {}
