import { Module } from "@nestjs/common";
import { PostgreSQLWorkOrderModule } from "../../modules/work-order/infrastructure/modules/postgresql/postgresql.work-order.module";
import { PostgreSQLWorkOrderTypeModule } from "../../modules/order-type/infrastructure/modules/postgresql/postgresql.work-order-type.module";
@Module({
  imports: [
    PostgreSQLWorkOrderTypeModule,
    PostgreSQLWorkOrderModule,
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppWorkOrdersModulesUsingPostgreSQL { }