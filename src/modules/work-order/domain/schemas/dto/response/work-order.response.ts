import { UUID } from 'crypto';

export interface WorkOrderResponse {
  workOrderId: number;
  orderCode: string;
  workTypeId: number;
  priorityId: number;
  clientId?: string;
  creationDate?: Date;
  assignationDate?: Date;
  completionDate?: Date;
  status?: number;
  description: string;
  location: string;
  createdUserId: UUID | string;
  assignedUserId?: UUID | string | null;
  completedUserId?: UUID | string | null;
  coordinates?: string;
  metadata?: string;
  cadastralKey?: string;
  isDeleted?: boolean;
}
