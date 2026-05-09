import { Module } from '@nestjs/common';
import { WorkTypeController } from '../../controllers/work-type.controller';
import { WorkTypeService } from '../../../application/services/work-type.service';
import { PostgreSQLWorkTypePersistence } from '../../repositories/postgresql/repositories/postgresql.work-type.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [WorkTypeController],
  providers: [
    WorkTypeService,
    {
      provide: 'WorkTypeRepository',
      useClass: PostgreSQLWorkTypePersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlWorkOrderTypeModule {}
