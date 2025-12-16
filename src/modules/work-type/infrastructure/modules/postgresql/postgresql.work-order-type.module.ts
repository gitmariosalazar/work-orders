import { Module } from '@nestjs/common';
import { WorkTypeController } from '../../controllers/work-type.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkTypeService } from '../../../application/services/work-type.service';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { PostgreSQLWorkTypePersistence } from '../../repositories/postgresql/repositories/postgresql.work-type.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [WorkTypeController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkTypeService,
    {
      provide: 'WorkTypeRepository',
      useClass: PostgreSQLWorkTypePersistence,
    },
  ],
  exports: [],
})
export class PostgreSQLWorkTypeModule {}
