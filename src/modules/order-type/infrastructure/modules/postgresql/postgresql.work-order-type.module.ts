import { Module } from '@nestjs/common';
import { WorkOrderTypeController } from '../../controllers/work-order-type.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { WorkOrderTypeService } from '../../../application/services/work-order-type.service';
import { PostgreSQLWorkOrderTypePersistence } from '../../repositories/postgresql/repositories/postgresql.work-order-type.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';

@Module({
  imports: [KafkaServiceModule],
  controllers: [WorkOrderTypeController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderTypeService,
    {
      provide: 'WorkOrderTypeRepository',
      useClass: PostgreSQLWorkOrderTypePersistence,
    },
  ],
  exports: [],
})
export class PostgreSQLWorkOrderTypeModule {}
