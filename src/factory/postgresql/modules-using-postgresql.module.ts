import { Module } from '@nestjs/common';
import { PostgreSQLWorkOrderModule } from '../../modules/work-order/infrastructure/modules/postgresql/postgresql.work-order.module';
import { PostgreSqlWorkOrderTypeModule } from '../../modules/work-type/infrastructure/modules/postgresql/postgresql.work-order-type.module';
import { PostgreSqlWorkOrderHistoryModule } from '../../modules/work-order-history/infrastructure/modules/postgresql/postgresql.work-order-history.module';
import { PostgreSqlWorkOrderObservationModule } from '../../modules/observations/infrastructure/modules/postgresql/work-order-observation.module';
import { PostgreSqlDetailWorkOrderMaterialModule } from '../../modules/products-details/infrastructure/modules/postgresql/postgresql.detail-work-order-material.module';
import { PostgreSqlWorkOrderWorkerAssignmentModule } from '../../modules/worker-assignment/infrastructure/modules/postgresql/postgresql.work-order-worker-assignment.module';
import { PostgreSqlWorkOrderAttachmentsModule } from '../../modules/work-order-attachments/infrastructure/modules/postgresql/postgresql.work-order-attachments.module';
import { PostgreSqlProcessWorkOrderModule } from '../../modules/process-work-order/infrastructure/modules/postgresql/postgresql.process-work-order.module';

@Module({
  imports: [
    PostgreSqlWorkOrderTypeModule,
    PostgreSQLWorkOrderModule,
    PostgreSqlWorkOrderHistoryModule,
    PostgreSqlWorkOrderObservationModule,
    PostgreSqlDetailWorkOrderMaterialModule,
    PostgreSqlWorkOrderWorkerAssignmentModule,
    PostgreSqlWorkOrderAttachmentsModule,
    PostgreSqlProcessWorkOrderModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppWorkOrdersModulesUsingPostgreSQL {}
