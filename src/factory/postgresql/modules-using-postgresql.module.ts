import { Module } from '@nestjs/common';
import { PostgreSQLWorkOrderModule } from '../../modules/work-order/infrastructure/modules/postgresql/postgresql.work-order.module';
import { PostgreSQLWorkTypeModule } from '../../modules/work-type/infrastructure/modules/postgresql/postgresql.work-order-type.module';
import { PostgresqlWorkOrderHistoryModule } from '../../modules/work-order-history/infrastructure/modules/postgresql/postgresql.work-order-history.module';
import { PostgreSqlWorkOrderObservationModule } from '../../modules/observations/infrastructure/modules/postgresql/work-order-observation.module';
import { PostgreSqlDetailWorkOrderMaterialModule } from '../../modules/products-details/infrastructure/modules/postgresql/postgresql.detail-work-order-material.module';
import { PostgresqlWorkOrderWorkerAssignmentModule } from '../../modules/worker-assignment/infrastructure/modules/postgresql/postgresql.work-order-worker-assignment.module';
import { PostgresqlWorkOrderAttachmentsModule } from '../../modules/work-order-attachments/infrastructure/modules/postgresql/postgresql.work-order-attachments.module';
@Module({
  imports: [
    PostgreSQLWorkTypeModule,
    PostgreSQLWorkOrderModule,
    PostgresqlWorkOrderHistoryModule,
    PostgreSqlWorkOrderObservationModule,
    PostgreSqlDetailWorkOrderMaterialModule,
    PostgresqlWorkOrderWorkerAssignmentModule,
    PostgresqlWorkOrderAttachmentsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppWorkOrdersModulesUsingPostgreSQL {}
