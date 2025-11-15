import { Module } from "@nestjs/common";
import { PostgreSQLWorkOrderModule } from "../../modules/work-order/infrastructure/modules/postgresql/postgresql.work-order.module";
import { PostgreSQLWorkOrderTypeModule } from "../../modules/order-type/infrastructure/modules/postgresql/postgresql.work-order-type.module";
import { PostgresqlWorkOrderHistoryModule } from "../../modules/work-order-history/infrastructure/modules/postgresql/postgresql.work-order-history.module";
import { PostgreSqlWorkOrderObservationModule } from "../../modules/observations/infrastructure/modules/postgresql/work-order-observation.module";
@Module({
  imports: [
    PostgreSQLWorkOrderTypeModule,
    PostgreSQLWorkOrderModule,
    PostgresqlWorkOrderHistoryModule,
    PostgreSqlWorkOrderObservationModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppWorkOrdersModulesUsingPostgreSQL { }