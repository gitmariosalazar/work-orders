import { Module } from "@nestjs/common";
import { PostgresqlWorkOrderTypeModule } from "../../modules/order-type/infrastructure/modules/postgresql/postgresql.work-order-type.module";
@Module({
  imports: [
    PostgresqlWorkOrderTypeModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppWorkOrdersModulesUsingPostgreSQL { }