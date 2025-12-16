import { Inject, Injectable } from '@nestjs/common';
import { InterfaceWorkOrderAttachmentsUseCase } from '../usecases/work-order-attachments.use-case.interface';
import { InterfaceWorkOrderAttachmentsRepository } from '../../domain/contracts/work-order-attachments.interface.repository';
import { CreateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/create.work-order-attachments.request';
import { WorkOrderAttachmentsResponse } from '../../domain/schemas/dto/response/work-order-attachments.response';
import { RpcException } from '@nestjs/microservices';
import { WorkOrderAttachmentModel } from '../../domain/schemas/models/work-order-attachments.model';
import { WorkOrderAttachmentMapper } from '../mappers/work-order-attachments.mapper';
import { UpdateWorkOrderAttachmentsRequest } from '../../domain/schemas/dto/request/update.work-order-attachments.request';
import { statusCode } from '../../../../settings/environments/status-code';
import { validateFields } from '../../../../shared/validators/fields.validators';

@Injectable()
export class WorkOrderAttachmentsService
  implements InterfaceWorkOrderAttachmentsUseCase
{
  constructor(
    @Inject('WorkOrderAttachmentsRepository')
    private readonly workOrderAttachmentsUseCase: InterfaceWorkOrderAttachmentsRepository,
  ) {}

  async addWorkOrderAttachment(
    attachment: CreateWorkOrderAttachmentsRequest,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      const requiredFields: string[] = [
        'workOrderId',
        'fileName',
        'fileType',
        'fileUrl',
      ];

      const missingFildsMessages: string[] = validateFields(
        attachment,
        requiredFields,
      );

      if (missingFildsMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFildsMessages,
        });
      }
      const attachmentModel: WorkOrderAttachmentModel =
        WorkOrderAttachmentMapper.fromCreateRequestToModel(attachment);

      const result =
        await this.workOrderAttachmentsUseCase.addWorkOrderAttachment(
          attachmentModel,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to add work order attachment',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrderAttachment(
    attachmentId: number,
    attachment: UpdateWorkOrderAttachmentsRequest,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      if (!attachmentId || attachmentId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid attachment ID',
        });
      }

      const existingAttachment =
        await this.workOrderAttachmentsUseCase.getWorkOrderAttachmentById(
          attachmentId,
        );

      if (!existingAttachment) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Work order attachment not found',
        });
      }

      const existingModel = new WorkOrderAttachmentModel(
        existingAttachment.attachmentId,
        existingAttachment.workOrderId,
        existingAttachment.fileName,
        existingAttachment.fileType,
        existingAttachment.fileUrl,
        existingAttachment.uploadDate,
      );

      const updatedModel = WorkOrderAttachmentMapper.fromUpdateRequestToModel(
        existingModel,
        attachment,
      );

      const result =
        await this.workOrderAttachmentsUseCase.updateWorkOrderAttachment(
          attachmentId,
          updatedModel,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update work order attachment',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderAttachmentById(
    attachmentId: number,
  ): Promise<WorkOrderAttachmentsResponse | null> {
    try {
      if (!attachmentId || attachmentId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid attachment ID',
        });
      }

      const result =
        await this.workOrderAttachmentsUseCase.getWorkOrderAttachmentById(
          attachmentId,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Work order attachment not found',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteWorkOrderAttachment(attachmentId: number): Promise<boolean> {
    try {
      if (!attachmentId || attachmentId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid attachment ID',
        });
      }

      const result =
        await this.workOrderAttachmentsUseCase.deleteWorkOrderAttachment(
          attachmentId,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to delete work order attachment',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAllAttachments(
    limit?: number,
    offset?: number,
  ): Promise<WorkOrderAttachmentsResponse[]> {
    try {
      const result = await this.workOrderAttachmentsUseCase.findAllAttachments(
        limit,
        offset,
      );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order attachments found',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAttachmentsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderAttachmentsResponse[]> {
    try {
      if (!workOrderId || workOrderId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order ID',
        });
      }

      const result =
        await this.workOrderAttachmentsUseCase.findAttachmentsByWorkOrderId(
          workOrderId,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No attachments found for the specified work order ID',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
