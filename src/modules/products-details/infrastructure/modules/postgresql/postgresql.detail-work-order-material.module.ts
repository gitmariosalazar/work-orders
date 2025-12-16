import { Module } from '@nestjs/common';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DetailsWorkOrderMaterialController } from '../../controllers/details-work-order-material.controller';
import { DatabaseServicePostgreSQL } from '../../../../../shared/connections/database/postgresql/postgresql.service';
import { DetailWorkOrderMaterialService } from '../../../application/services/detail-work-order-material.service';
import { DetailWorkOrderMaterialPostgreSqlPersistence } from '../../repositories/postgresql/persistence/detail-work-order-material.persistence';

@Module({
  imports: [KafkaServiceModule],
  controllers: [DetailsWorkOrderMaterialController],
  providers: [
    DatabaseServicePostgreSQL,
    DetailWorkOrderMaterialService,
    {
      provide: 'DetailWorkOrderMaterialRepository',
      useClass: DetailWorkOrderMaterialPostgreSqlPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlDetailWorkOrderMaterialModule {}
