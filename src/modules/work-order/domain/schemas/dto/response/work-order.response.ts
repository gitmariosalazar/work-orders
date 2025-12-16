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
  createdUserId: number;
  assignedUserId?: number;
  completedUserId?: number;
  coordinates?: string;
  metadata?: string;
  cadastralKey?: string;
  isDeleted?: boolean;
}
