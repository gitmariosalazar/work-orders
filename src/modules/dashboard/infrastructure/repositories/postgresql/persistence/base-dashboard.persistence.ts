import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';
import { JsonValue, snakeToCamel } from '../mappers/snake-to-camel.mapper';
import {
  wrapAsJsonArray,
  wrapAsJsonObject,
} from '../queries/dashboard.queries';

interface JsonRow {
  data: JsonValue;
}

export abstract class BaseDashboardPersistence {
  protected constructor(private readonly databaseService: DatabaseAbstract) {}

  protected async fetchList<T>(
    sql: string,
    params: ReadonlyArray<string | number | null> = [],
  ): Promise<T[]> {
    const rows = await this.execute(wrapAsJsonArray(sql), params);
    const data = rows[0]?.data;
    return Array.isArray(data) ? (snakeToCamel(data) as unknown as T[]) : [];
  }

  protected async fetchOne<T>(
    sql: string,
    params: ReadonlyArray<string | number | null> = [],
  ): Promise<T | null> {
    const rows = await this.execute(wrapAsJsonObject(sql), params);
    const data = rows[0]?.data;
    return data ? (snakeToCamel(data) as unknown as T) : null;
  }

  private async execute(
    sql: string,
    params: ReadonlyArray<string | number | null>,
  ): Promise<JsonRow[]> {
    try {
      return await this.databaseService.query<JsonRow>(sql, [...params]);
    } catch (error) {
      const err = error as Error;
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: `Dashboard query failed: ${err.message}`,
      });
    }
  }
}
