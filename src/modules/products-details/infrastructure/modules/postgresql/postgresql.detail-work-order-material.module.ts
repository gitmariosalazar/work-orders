import { Module } from '@nestjs/common';
import { DetailsWorkOrderMaterialController } from '../../controllers/details-work-order-material.controller';
import { DetailWorkOrderMaterialService } from '../../../application/services/detail-work-order-material.service';
import { DetailWorkOrderMaterialPostgreSqlPersistence } from '../../repositories/postgresql/persistence/detail-work-order-material.persistence';
import { KafkaServiceModule } from '../../../../../shared/kafka/kafka-service.module';
import { DatabasePersistenceModule } from '../../../../../shared/connections/database/database-persistence.module';

@Module({
  imports: [KafkaServiceModule, DatabasePersistenceModule],
  controllers: [DetailsWorkOrderMaterialController],
  providers: [
    DetailWorkOrderMaterialService,
    {
      provide: 'DetailWorkOrderMaterialRepository',
      useClass: DetailWorkOrderMaterialPostgreSqlPersistence,
    },
  ],
  exports: [],
})
export class PostgreSqlDetailWorkOrderMaterialModule {}
