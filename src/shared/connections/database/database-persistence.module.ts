import { Module, Global } from '@nestjs/common';
import { DatabaseAbstract } from './abstract/abstract.database';
import { DatabaseServicePostgreSQL } from './postgresql/postgresql.service';
import { DatabaseServiceMySQL } from './mysql/mysql.service';
import { environments } from '../../../settings/environments/environments';

const getDatabaseService = () => {
  return environments.DATABASE_TYPE === 'mysql'
    ? DatabaseServiceMySQL
    : DatabaseServicePostgreSQL;
};

const databaseProvider = {
  provide: DatabaseAbstract,
  useExisting: getDatabaseService(),
};

@Global()
@Module({
  providers: [
    DatabaseServicePostgreSQL,
    DatabaseServiceMySQL,
    databaseProvider,
  ],
  exports: [DatabaseAbstract],
})
export class DatabasePersistenceModule {}
