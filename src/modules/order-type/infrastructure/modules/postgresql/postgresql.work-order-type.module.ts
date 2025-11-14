import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { environments } from "../../../../../settings/environments/environments";
import { WorkOrderTypeController } from "../../controllers/work-order-type.controller";
import { DatabaseServicePostgreSQL } from "../../../../../shared/connections/database/postgresql/postgresql.service";
import { WorkOrderTypeService } from "../../../application/services/work-order-type.service";
import { PostgreSQLWorkOrderTypePersistence } from "../../repositories/postgresql/repositories/postgresql.work-order-type.persistence";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.WORK_ORDER_TYPE_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [environments.KAFKA_BROKER_URL],
            clientId: environments.WORK_ORDER_TYPE_KAFKA_CLIENT_ID
          },
          consumer: {
            groupId: environments.WORK_ORDER_TYPE_KAFKA_GROUP_ID
          }
        }
      }
    ]),
  ],
  controllers: [
    WorkOrderTypeController
  ],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderTypeService,
    {
      provide: 'WorkOrderTypeRepository',
      useClass: PostgreSQLWorkOrderTypePersistence,
    }
  ],
})
export class PostgresqlWorkOrderTypeModule { }