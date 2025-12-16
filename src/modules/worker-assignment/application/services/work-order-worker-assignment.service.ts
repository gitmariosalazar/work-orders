import { Inject, Injectable } from '@nestjs/common';
import { InterfaceWorkOrderWorkerAssignmentRepository } from '../../domain/contracts/work_order_worker_assignment.interface.repository';
import { InterfaceWorkOrderWorkerAssignmentUseCase } from '../usecases/work-order-worker-assignment.use-case.interface';
import { CreateWorkOrderWorkerAssignmentRequest } from '../../domain/schemas/dto/request/create-work-order-worker-assignment.request';
import { WorkOrderWorkerAssignmentResponse } from '../../domain/schemas/dto/response/work-order-worker-assignment.response';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from '../../../../settings/environments/status-code';
import { WorkOrderWorkerAssignmentMapper } from '../mappers/work-order-worker-assignment.mapper';
import { WorkOrderWorkerAssignmentModel } from '../../domain/schemas/models/work-order-worker-assignment.model';

@Injectable()
export class WorkOrderWorkerAssignmentService
  implements InterfaceWorkOrderWorkerAssignmentUseCase
{
  constructor(
    @Inject('WorkOrderWorkerAssignmentRepository')
    private readonly workOrderWorkerAssignmentRepository: InterfaceWorkOrderWorkerAssignmentRepository,
  ) {}

  async addWorkerAssignmentToWorkOrderList(
    workerAssignmentList: CreateWorkOrderWorkerAssignmentRequest[],
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null> {
    try {
      if (workerAssignmentList.length === 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Worker assignment list cannot be empty',
        });
      }

      const workerAssignmentListModels: WorkOrderWorkerAssignmentModel[] =
        WorkOrderWorkerAssignmentMapper.fromRequestToModelList(
          workerAssignmentList,
        );

      const result =
        await this.workOrderWorkerAssignmentRepository.addWorkerAssignmentToWorkOrderList(
          workerAssignmentListModels,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to add worker assignments to work order',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findWorkerAssignmentByWorkerId(
    workerId: number,
  ): Promise<WorkOrderWorkerAssignmentResponse | null> {
    try {
      if (!workerId || workerId <= 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid worker ID',
        });
      }

      const result =
        await this.workOrderWorkerAssignmentRepository.findWorkerAssignmentByWorkerId(
          workerId,
        );

      if (!result) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'Worker assignment not found',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  async findWorkerAssignmentsByWorkOrderId(
    workOrderId: string,
  ): Promise<WorkOrderWorkerAssignmentResponse[] | null> {
    try {
      if (!workOrderId || workOrderId.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid work order ID',
        });
      }

      const result =
        await this.workOrderWorkerAssignmentRepository.findWorkerAssignmentsByWorkOrderId(
          workOrderId,
        );

      if (!result || result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No worker assignments found for the given work order ID',
        });
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
}
