import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { environments } from "../../../../../settings/environments/environments";
import { WorkOrderHistoryController } from "../../controllers/work-order-history.controller";
import { DatabaseServicePostgreSQL } from "../../../../../shared/connections/database/postgresql/postgresql.service";
import { PostgresqlWorkOrderHistoryPersistence } from "../../repositories/postgresql/persistence/postgresql.work-order-history.persistence";
import { WorkOrderHistoryService } from "../../../application/services/work-order-history.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.WORK_HISTORY_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: environments.WORK_HISTORY_KAFKA_CLIENT_ID,
            brokers: [environments.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: environments.WORK_HISTORY_KAFKA_GROUP_ID,
            allowAutoTopicCreation: true,
          },
        }
      }
    ])
  ],
  controllers: [WorkOrderHistoryController],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderHistoryService,
    {
      provide: 'WorkOrderHistoryRepository',
      useClass: PostgresqlWorkOrderHistoryPersistence,
    },
  ],
  exports: [],
})
export class PostgresqlWorkOrderHistoryModule { }