import { Injectable } from "@nestjs/common";
import { DatabaseServicePostgreSQL } from "../../../../../../shared/connections/database/postgresql/postgresql.service";
import { InterfaceWorkOrderObservationRepository } from "../../../../domain/contracts/work-order-observation.interface.repository";
import { WorkOrderObservationResponse } from "../../../../domain/schemas/dto/response/work-order-observation.response";
import { WorkOrderObservationModel } from "../../../../domain/schemas/models/work-order-observation.model";
import { RpcException } from "@nestjs/microservices";
import { statusCode } from "../../../../../../settings/environments/status-code";
import { WorkOrderObservationAdapter } from "../adapters/work-order-observation.adapter";
import { ObservationSQLResult } from "../../../interfaces/sql/work-order-observation.sql.response";

@Injectable()
export class PostgreSqlWorkOrderObservationPersistence implements InterfaceWorkOrderObservationRepository {
  constructor(
    private readonly postgreSqlService: DatabaseServicePostgreSQL
  ) { }

  async create(workOrderObservation: WorkOrderObservationModel): Promise<WorkOrderObservationResponse | null> {
    try {

      const insertObservationQuery: string = `
        INSERT INTO observacion (tituloobservacion, detalleobservacion) VALUES ($1,$2) returning observacionid as
        "observationId", tituloobservacion as "observationTitle", detalleobservacion as "observationDetails";
      `;
      const insertObservationParams = [workOrderObservation.observation.observationTitle, workOrderObservation.observation.observationDetails];

      const resultFirst = await this.postgreSqlService.query<ObservationSQLResult>(insertObservationQuery, insertObservationParams);
      console.log(`result`, resultFirst);
      const observationIdResult: number = resultFirst[0].observationId;

      const query: string = `
      INSERT INTO observacionordentrabajo (observacionId, ordenTrabajoId) VALUES ($1, $2)
      RETURNING observacionOrdenTrabajoId AS "workOrderObservationId", ordenTrabajoId AS "workOrderId", observacionId AS "observationId", fechaRegistro AS "registerDate";
      `;
      const params = [
        observationIdResult,
        workOrderObservation.workOrderId,
      ];

      const result = await this.postgreSqlService.query<WorkOrderObservationResponse>(query, params);

      const observationWorkOrderId: number = result[0].workOrderObservationId!;

      if (result.length > 0) {
        const createdWorkOrderObservation: WorkOrderObservationResponse = WorkOrderObservationAdapter.toResponse(result[0]);

        const selectQuery: string = `
          SELECT o.observacionId, oot.ordenTrabajoId as "workOrderId", o.tituloobservacion AS "observationTitle", o.detalleobservacion AS "observationDetails", oot.fechaRegistro AS "registerDate"
          FROM observacion o INNER JOIN observacionordentrabajo oot ON oot.observacionid = o.observacionid
          WHERE oot.observacionOrdenTrabajoId = $1;
        `;
        const selectParams = [observationWorkOrderId];

        const selectResult = await this.postgreSqlService.query<WorkOrderObservationResponse>(selectQuery, selectParams);

        if (selectResult.length > 0) {
          const response = WorkOrderObservationAdapter.toResponse(selectResult[0]);
          return response;
        }

        return createdWorkOrderObservation;
      } else {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Failed to create work order observation.`,
        })
      }

    } catch (error) {
      throw error;
    }
  }

  async update(workOrderObservationId: number, workOrderObservation: Partial<WorkOrderObservationModel>): Promise<WorkOrderObservationResponse | null> {
    try {

      const query: string = `
      UPDATE observacionordentrabajo
      SET observacionId = COALESCE($1, observacionId),
          ordenTrabajoId = COALESCE($2, ordenTrabajoId)
      WHERE observacionOrdenTrabajoId = $3
      RETURNING observacionOrdenTrabajoId AS "workOrderObservationId", ordenTrabajoId AS "workOrderId", observacionId AS "observationId", fechaRegistro AS "registerDate";
      `;

      const params = [
        workOrderObservation.observation?.observationId ?? null,
        workOrderObservation.workOrderId ?? null,
        workOrderObservationId,
      ];

      const result = await this.postgreSqlService.query<WorkOrderObservationResponse>(query, params);

      if (result.length > 0) {
        const updatedWorkOrderObservation: WorkOrderObservationResponse = WorkOrderObservationAdapter.toResponse(result[0]);

        return updatedWorkOrderObservation;
      } else {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: `Failed to update work order observation.`,
        })
      }

    } catch (error) {
      throw error;
    }
  }

  async getByWorkOrderId(workOrderId: number): Promise<WorkOrderObservationResponse[]> {
    try {

      const query: string = `
      SELECT observacionOrdenTrabajoId AS "workOrderObservationId", ordenTrabajoId AS "workOrderId", observacionId AS "observationId", fechaRegistro AS "registerDate"
      FROM observacionordentrabajo
      WHERE ordenTrabajoId = $1;
      `;

      const params = [workOrderId];

      const result = await this.postgreSqlService.query<WorkOrderObservationResponse>(query, params);

      if (result.length === 0) {
        return [];
      }

      const workOrderObservations: WorkOrderObservationResponse[] = result.map((record) =>
        WorkOrderObservationAdapter.toResponse(record),
      );

      return workOrderObservations;

    } catch (error) {
      throw error;
    }
  }

  async getById(workOrderObservationId: number): Promise<WorkOrderObservationResponse | null> {
    try {

      const query: string = `
      SELECT observacionOrdenTrabajoId AS "workOrderObservationId", ordenTrabajoId AS "workOrderId", observacionId AS "observationId", fechaRegistro AS "registerDate"
      FROM observacionordentrabajo
      WHERE ordenTrabajoObservacionId = $1;
      `;

      const params = [workOrderObservationId];

      const result = await this.postgreSqlService.query<WorkOrderObservationResponse>(query, params);

      if (result.length === 0) {
        return null;
      }

      const workOrderObservation: WorkOrderObservationResponse = WorkOrderObservationAdapter.toResponse(result[0]);

      return workOrderObservation;

    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<WorkOrderObservationResponse[]> {
    try {

      const query: string = `
      SELECT observacionOrdenTrabajoId AS "workOrderObservationId", ordenTrabajoId AS "workOrderId", observacionId AS "observationId", fechaRegistro AS "registerDate"
      FROM observacionordentrabajo;
      `;

      const result = await this.postgreSqlService.query<WorkOrderObservationResponse>(query, []);

      if (result.length === 0) {
        return [];
      }

      const workOrderObservations: WorkOrderObservationResponse[] = result.map((record) =>
        WorkOrderObservationAdapter.toResponse(record),
      );

      return workOrderObservations;

    } catch (error) {
      throw error;
    }
  }
}