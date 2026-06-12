/* eslint-disable no-useless-catch */
import { Inject, Injectable } from '@nestjs/common';
import { InterfaceDetailWorkOrderMaterialUseCase } from '../usecases/detail-work-order-material.use-case.interface';
import { InterfaceDetailWorkOrderMaterialRepository } from '../../domain/contracts/detail-work-order-material.interface.repository';
import { CreateDetailWorkOrderMaterialRequest } from '../../domain/schemas/dto/request/create-detail-work-order-material.request';
import { DetailWorkOrderMaterialResponse } from '../../domain/schemas/dto/response/detail-work-order-material.response';
import { DetailWorkOrderMaterialMapper } from '../mappers/detail-work-order-material.mapper';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';

@Injectable()
export class DetailWorkOrderMaterialService implements InterfaceDetailWorkOrderMaterialUseCase {
  constructor(
    @Inject('DetailWorkOrderMaterialRepository')
    private readonly detailWorkOrderMaterialRepository: InterfaceDetailWorkOrderMaterialRepository,
  ) {}

  async addDetailWorkOrderMaterials(
    detailWorkOrderMaterials: CreateDetailWorkOrderMaterialRequest[],
  ): Promise<DetailWorkOrderMaterialResponse[] | null> {
    try {
      if (detailWorkOrderMaterials.length === 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'The detailWorkOrderMaterials array cannot be empty',
        });
      }

      const models = DetailWorkOrderMaterialMapper.toModelList(
        detailWorkOrderMaterials,
      );
      const result: DetailWorkOrderMaterialResponse[] | null =
        await this.detailWorkOrderMaterialRepository.addDetailWorkOrderMaterials(
          models,
        );

      if (result === null) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to add detail work order materials',
        });
      }
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No detail work order materials were added',
        });
      }

      if (result.length > 0) {
        return result;
      } else {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message:
            'Unexpected error occurred while adding detail work order materials',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<DetailWorkOrderMaterialResponse[]> {
    try {
      if (!workOrderId || workOrderId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'workOrderId must be provided',
        });
      }

      const result: DetailWorkOrderMaterialResponse[] =
        await this.detailWorkOrderMaterialRepository.getDetailWorkOrderMaterialsByWorkOrderId(
          workOrderId,
        );

      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message:
            'No detail work order materials found for the given workOrderId',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteDetailWorkOrderMaterialsByWorkOrderId(
    workOrderId: string,
  ): Promise<boolean> {
    try {
      if (!workOrderId || workOrderId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'workOrderId must be provided',
        });
      }

      const result: boolean =
        await this.detailWorkOrderMaterialRepository.deleteDetailWorkOrderMaterialsByWorkOrderId(
          workOrderId,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message:
            'No active detail work order materials found for the given workOrderId',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
