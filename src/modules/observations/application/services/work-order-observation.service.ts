/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable no-useless-catch */
import { Inject, Injectable } from '@nestjs/common';
import { InterfaceWorkOrderObservationRepository } from '../../domain/contracts/work-order-observation.interface.repository';
import { InterfaceWorkOrderObservationUseCase } from '../usecases/work-order-observation.use-case.interface';
import { CreateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/create.work-order-observation.request';
import { WorkOrderObservationResponse } from '../../domain/schemas/dto/response/work-order-observation.response';
import { validateFields } from '../../../../shared/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';
import { WorkOrderObservationModel } from '../../domain/schemas/models/work-order-observation.model';
import { WorkOrderObservationMapper } from '../mappers/work-order-observation.mapper';
import { UpdateWorkOrderObservationRequest } from '../../domain/schemas/dto/request/update.work-order-observation.request';

@Injectable()
export class WorkOrderObservationService implements InterfaceWorkOrderObservationUseCase {
  constructor(
    @Inject('WorkOrderObservationRepository')
    private readonly workOrderObservationRepository: InterfaceWorkOrderObservationRepository,
  ) {}

  async createWorkOrderObservation(
    workOrderObservation: CreateWorkOrderObservationRequest,
  ): Promise<WorkOrderObservationResponse | null> {
    try {
      const requiredFields: string[] = [
        'workOrderId',
        'description',
        'workerId',
      ];

      const missingFieldMessages: string[] = validateFields(
        workOrderObservation,
        requiredFields,
      );
      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const workOrderObservationModel: WorkOrderObservationModel =
        WorkOrderObservationMapper.fromCreateWorkOrderObservationRequestToWorkOrderObservationModel(
          workOrderObservation,
        );

      const createdWorkOrderObservation: WorkOrderObservationResponse | null =
        await this.workOrderObservationRepository.create(
          workOrderObservationModel,
        );

      if (!createdWorkOrderObservation) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create work order observation.',
        });
      }

      return createdWorkOrderObservation;
    } catch (error) {
      throw error;
    }
  }

  async updateWorkOrderObservation(
    workOrderObservationId: string,
    workOrderObservation: Partial<UpdateWorkOrderObservationRequest>,
  ): Promise<WorkOrderObservationResponse | null> {
    try {
      if (
        workOrderObservationId === undefined ||
        workOrderObservationId === null ||
        workOrderObservationId.trim() === ''
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'workOrderObservationId is required.',
        });
      }

      if (
        !workOrderObservation ||
        Object.keys(workOrderObservation).length === 0
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'At least one field is required to update the observation.',
        });
      }

      if (
        workOrderObservation.workOrderId !== undefined &&
        workOrderObservation.workOrderId.trim() === ''
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'workOrderId cannot be empty.',
        });
      }

      if (
        workOrderObservation.description !== undefined &&
        workOrderObservation.description.trim() === ''
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'description cannot be empty.',
        });
      }

      if (
        workOrderObservation.workerId !== undefined &&
        workOrderObservation.workerId.trim() === ''
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'workerId cannot be empty.',
        });
      }

      const workOrderObservationModelProps: Partial<WorkOrderObservationModel> =
        WorkOrderObservationMapper.fromUpdateWorkOrderObservationRequestToWorkOrderObservationModel(
          workOrderObservation,
        );

      const updatedWorkOrderObservation: WorkOrderObservationResponse | null =
        await this.workOrderObservationRepository.update(
          workOrderObservationId,
          workOrderObservationModelProps,
        );

      if (!updatedWorkOrderObservation) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to update work order observation.',
        });
      }

      return updatedWorkOrderObservation;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderObservationById(
    workOrderObservationId: string,
  ): Promise<WorkOrderObservationResponse | null> {
    try {
      if (
        workOrderObservationId === undefined ||
        workOrderObservationId === null ||
        workOrderObservationId.trim() === ''
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'workOrderObservationId is required.',
        });
      }

      const workOrderObservation: WorkOrderObservationResponse | null =
        await this.workOrderObservationRepository.getById(
          workOrderObservationId,
        );
      return workOrderObservation;
    } catch (error) {
      throw error;
    }
  }

  async getWorkOrderObservationsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderObservationResponse[]> {
    try {
      if (
        workOrderId === undefined ||
        workOrderId === null ||
        workOrderId.trim() === ''
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'workOrderId is required.',
        });
      }
      const workOrderObservations: WorkOrderObservationResponse[] =
        await this.workOrderObservationRepository.getByWorkOrderId(workOrderId);
      return workOrderObservations;
    } catch (error) {
      throw error;
    }
  }

  async getAllWorkOrderObservations(): Promise<WorkOrderObservationResponse[]> {
    try {
      const workOrderObservations: WorkOrderObservationResponse[] =
        await this.workOrderObservationRepository.getAll();

      if (!workOrderObservations || workOrderObservations.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No work order observations found.',
        });
      }

      return workOrderObservations;
    } catch (error) {
      throw error;
    }
  }
}
