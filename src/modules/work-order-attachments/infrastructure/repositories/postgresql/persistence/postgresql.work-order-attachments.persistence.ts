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
export class PostgresqlWorkOrderAttachmentsPersistence
  implements InterfaceWorkOrderAttachmentsRepository
{
  constructor(private readonly databaseService: DatabaseAbstract) {}

  async findAllAttachments(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderAttachmentsResponse[]> {
    try {
      const query: string = `
      SELECT
          a.id_adjunto AS attachment_id,
          a.id_orden_trabajo AS work_order_id,
          a.nombre_archivo AS file_name,
          a.tipo AS file_type,
          a.url_archivo AS file_url,
          a.fecha_subida AS upload_date
      FROM work_orders.adjuntos_orden_trabajo a LIMIT $1 OFFSET $2;  
      `;

      const params = [limit || 100, offset || 0];
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
    attachmentId: number,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      const query: string = `
      SELECT
          a.id_adjunto AS attachment_id,
          a.id_orden_trabajo AS work_order_id,
          a.nombre_archivo AS file_name,
          a.tipo AS file_type,
          a.url_archivo AS file_url,
          a.fecha_subida AS upload_date
      FROM work_orders.adjuntos_orden_trabajo a
      WHERE a.id_adjunto = $1;  
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

  async deleteWorkOrderAttachment(attachmentId: number): Promise<boolean> {
    try {
      const query: string = `
      DELETE FROM work_orders.adjuntos_orden_trabajo
      WHERE id_adjunto = $1;
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
          (id_orden_trabajo, nombre_archivo, tipo, url_archivo, fecha_subida)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
          id_adjunto AS attachment_id,
          id_orden_trabajo AS work_order_id,
          nombre_archivo AS file_name,
          tipo AS file_type,
          url_archivo AS file_url,
          fecha_subida AS upload_date;
      `;

      const params = [
        attachment.workOrderId,
        attachment.fileName,
        attachment.fileType,
        attachment.fileUrl,
        attachment.uploadDate,
      ];
      const result =
        await this.databaseService.query<WorkOrderAttachmentsSqlResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to add work order attachment',
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
    attachmentId: number,
    attachment: WorkOrderAttachmentModel,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      const query: string = `
      UPDATE work_orders.adjuntos_orden_trabajo
      SET id_orden_trabajo = COALESCE($1, id_orden_trabajo),
          nombre_archivo = COALESCE($2, nombre_archivo),
          tipo = COALESCE($3, tipo),
          url_archivo = COALESCE($4, url_archivo),
          fecha_subida = COALESCE($5, fecha_subida)
      WHERE id_adjunto = $6
      RETURNING
          id_adjunto AS attachment_id,
          id_orden_trabajo AS work_order_id,
          nombre_archivo AS file_name,
          tipo AS file_type,
          url_archivo AS file_url,
          fecha_subida AS upload_date;
      `;

      const params = [
        attachment.workOrderId,
        attachment.fileName,
        attachment.fileType,
        attachment.fileUrl,
        attachment.uploadDate,
        attachmentId,
      ];
      const result =
        await this.databaseService.query<WorkOrderAttachmentsSqlResponse>(
          query,
          params,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update work order attachment',
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
          a.id_adjunto AS attachment_id,
          a.id_orden_trabajo AS work_order_id,
          a.nombre_archivo AS file_name,
          a.tipo AS file_type,
          a.url_archivo AS file_url,
          a.fecha_subida AS upload_date
      FROM work_orders.adjuntos_orden_trabajo a
      WHERE a.id_orden_trabajo = $1;  
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
