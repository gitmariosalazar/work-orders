import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { environments } from "../../../../../settings/environments/environments";
import { allow } from "joi";
import { WorkOrderObservationController } from "../../controllers/work-order-observation.controller";
import { DatabaseServicePostgreSQL } from "../../../../../shared/connections/database/postgresql/postgresql.service";
import { WorkOrderObservationService } from "../../../application/services/work-order-observation.service";
import { PostgreSqlWorkOrderObservationPersistence } from "../../repositories/postgresql/persistence/postgresql.work-order-observation.persistence";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: environments.WORK_ORDER_OBSERVATION_KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: environments.WORK_ORDER_OBSERVATION_KAFKA_CLIENT_ID,
            brokers: [environments.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: environments.WORK_ORDER_OBSERVATION_KAFKA_GROUP_ID,
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [
    WorkOrderObservationController
  ],
  providers: [
    DatabaseServicePostgreSQL,
    WorkOrderObservationService,
    {
      provide: 'WorkOrderObservationRepository',
      useClass: PostgreSqlWorkOrderObservationPersistence,
    }
  ],
  exports: [],
})
export class PostgreSqlWorkOrderObservationModule { }