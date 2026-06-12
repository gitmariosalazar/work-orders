import { Injectable } from '@nestjs/common';
import { InterfaceWorkOrderAttachmentsRepository } from '../../../../domain/contracts/work-order-attachments.interface.repository';
import { WorkOrderAttachmentsResponse } from '../../../../domain/schemas/dto/response/work-order-attachments.response';
import { WorkOrderAttachmentsSqlResponse } from '../../../interfaces/sql/work-order-attachments.sql.response';
import { WorkOrderAttachmentAdapter } from '../adapters/work-order-attachments.adapter';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../../../settings/environments/status-code';
import { WorkOrderAttachmentModel } from '../../../../domain/schemas/models/work-order-attachments.model';
import { DatabaseAbstract } from '../../../../../../shared/connections/database/abstract/abstract.database';

@Injectable()
export class PostgresqlWorkOrderAttachmentsPersistence implements InterfaceWorkOrderAttachmentsRepository {
  constructor(private readonly databaseService: DatabaseAbstract) {}

  private readonly returnFields = `
    id_adjunto AS attachment_id,
    id_orden_trabajo AS work_order_id,
    nombre_archivo AS file_name,
    tipo_adjunto AS file_type,
    url_archivo AS file_url,
    created_at AS upload_date
  `;

  async findAllAttachments(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderAttachmentsResponse[]> {
    try {
      const query: string = `
      SELECT
          ${this.returnFields}
        FROM work_orders.adjuntos_orden_trabajo a
        WHERE a.is_deleted = FALSE
        ORDER BY a.created_at DESC
        LIMIT COALESCE($1::int, 100) OFFSET COALESCE($2::int, 0);
      `;

      const params = [limit ?? null, offset ?? null];
      const result =
        await this.databaseService.query<WorkOrderAttachmentsSqlResponse>(
          query,
          params,
        );

      return WorkOrderAttachmentAdapter.fromWorkOrderAttachmentsSqlResponsesToWorkOrderAttachmentsResponsesList(
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderAttachmentById(
    attachmentId: string,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      const query: string = `
      SELECT
          ${this.returnFields}
      FROM work_orders.adjuntos_orden_trabajo a
      WHERE a.id_adjunto = $1
        AND a.is_deleted = FALSE;
      `;

      const params = [attachmentId];
      const result =
        await this.databaseService.query<WorkOrderAttachmentsSqlResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Work order attachment not found',
        });
      }

      return WorkOrderAttachmentAdapter.fromWorkOrderAttachmentsSqlResponseToWorkOrderAttachmentsResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkOrderAttachment(attachmentId: string): Promise<boolean> {
    try {
      const query: string = `
      UPDATE work_orders.adjuntos_orden_trabajo
      SET
          is_deleted = TRUE,
          deleted_at = NOW(),
          updated_at = NOW()
      WHERE id_adjunto = $1
        AND is_deleted = FALSE;
      `;

      const params = [attachmentId];
      const result = await this.databaseService.execute(query, params);

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  async addWorkOrderAttachment(
    attachment: WorkOrderAttachmentModel,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      const query: string = `
      INSERT INTO work_orders.adjuntos_orden_trabajo
          (id_orden_trabajo, nombre_archivo, tipo_adjunto, url_archivo, mime_type, created_by)
      SELECT
          $1,
          $2,
          $3,
          $4,
          $5,
          ot.created_by
      FROM work_orders.orden_trabajo ot
      WHERE ot.id_orden_trabajo = $1
        AND ot.is_deleted = FALSE
      RETURNING
          ${this.returnFields};
      `;

      const params = [
        attachment.getWorkOrderId(),
        attachment.getFileName(),
        attachment.getFileType(),
        attachment.getFileUrl(),
        null,
      ];
      const result =
        await this.databaseService.query<WorkOrderAttachmentsSqlResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `Work order with ID ${attachment.getWorkOrderId()} does not exist.`,
        });
      }

      return WorkOrderAttachmentAdapter.fromWorkOrderAttachmentsSqlResponseToWorkOrderAttachmentsResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrderAttachment(
    attachmentId: string,
    attachment: WorkOrderAttachmentModel,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      const query: string = `
      UPDATE work_orders.adjuntos_orden_trabajo
      SET id_orden_trabajo = COALESCE($1, id_orden_trabajo),
          nombre_archivo = COALESCE($2, nombre_archivo),
          tipo_adjunto = COALESCE($3, tipo_adjunto),
          url_archivo = COALESCE($4, url_archivo),
          updated_at = NOW()
      WHERE id_adjunto = $6
        AND is_deleted = FALSE
      RETURNING
          ${this.returnFields};
      `;

      const params = [
        attachment.getWorkOrderId(),
        attachment.getFileName(),
        attachment.getFileType(),
        attachment.getFileUrl(),
        attachment.getUploadDate(),
        attachmentId,
      ];
      const result =
        await this.databaseService.query<WorkOrderAttachmentsSqlResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `Work order attachment with ID ${attachmentId} not found`,
        });
      }

      return WorkOrderAttachmentAdapter.fromWorkOrderAttachmentsSqlResponseToWorkOrderAttachmentsResponse(
        result[0],
      );
    } catch (error) {
      throw error;
    }
  }

  async findAttachmentsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderAttachmentsResponse[]> {
    try {
      const query: string = `
      SELECT
          ${this.returnFields}
      FROM work_orders.adjuntos_orden_trabajo a
      WHERE a.id_orden_trabajo = $1
        AND a.is_deleted = FALSE
      ORDER BY a.created_at DESC;
      `;

      const params = [workOrderId];
      const result =
        await this.databaseService.query<WorkOrderAttachmentsSqlResponse>(
          query,
          params,
        );

      return WorkOrderAttachmentAdapter.fromWorkOrderAttachmentsSqlResponsesToWorkOrderAttachmentsResponsesList(
        result,
      );
    } catch (error) {
      throw error;
    }
  }
}
