import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PostgreSQLWorkOrderPersistence } from "../../repositories/postgresql/persistence/postgresql.work-order.persistence";
import { environments } from "../../../../../settings/environments/environments";
import { WorkOrderController } from "../../controllers/work-order.controller";
import { DatabaseServicePostgreSQL } from "../../../../../shared/connections/database/postgresql/postgresql.service";
import { WorkOrderService } from "../../../application/services/work-order.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.WORK_ORDER_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [environments.KAFKA_BROKER_URL],
            clientId: environments.WORK_ORDER_KAFKA_CLIENT_ID
          },
          consumer: {
            groupId: environments.WORK_ORDER_KAFKA_GROUP_ID
          }
        }
      }
    ]),
  ],
  controllers: [WorkOrderController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderService,
    {
      provide: 'WorkOrderRepository',
      useClass: PostgreSQLWorkOrderPersistence,
    }
  ],
  exports: [],
})
export class PostgreSQLWorkOrderModule { }