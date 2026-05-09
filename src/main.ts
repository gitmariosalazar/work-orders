// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { environments } from './settings/environments/environments';
import * as morgan from 'morgan';
import { DatabaseAbstract } from './shared/connections/database/abstract/abstract.database';

async function bootstrap() {
  const logger = new Logger('WorkOrdersBootstrap');

  // ==============================================
  // 1. HTTP Instance (API REST + can produce to Kafka)
  // ==============================================
  const httpApp = await NestFactory.create(AppModule);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  httpApp.use(morgan('dev'));
  await httpApp.listen(environments.NODE_ENV === 'production' ? 3014 : 4014);
  /*
  logger.log(
    `HTTP API listening on port ${environments.NODE_ENV === 'production' ? 3014 : 4014}`,
  );
  */

  // Database connection for the HTTP part (you can also inject it, but this is quick)
  const dbService = httpApp.get(DatabaseAbstract);
  logger.log(await dbService.connect());

  // ==============================================
  // 2. PURE Kafka Instance (only consumes events, NO HTTP)
  // ==============================================
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: environments.WORK_ORDERS_KAFKA_CLIENT_ID, // this is the pure consumer
          brokers: [environments.KAFKA_BROKER_URL],
        },
        consumer: {
          groupId: environments.WORK_ORDERS_KAFKA_GROUP_ID, // main consumption group
          allowAutoTopicCreation: true,
          // Optional: retry if Kafka goes down
          retry: { retries: 5 },
        },
      },
    },
  );

  await kafkaApp.listen();
  logger.log(`Nest application successfully started`);
}

void bootstrap();
