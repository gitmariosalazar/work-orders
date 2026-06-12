export interface WorkOrderResponse {
  workOrderId: string;
  orderCode: string;
  workTypeId: number;
  priorityId: number;
  clientId?: string;
  creationDate?: Date;
  assignationDate?: Date;
  completionDate?: Date;
  status?: string;
  description: string;
  location: string;
  createdUserId: string;
  assignedUserId?: string | null;
  completedUserId?: string | null;
  coordinates?: string;
  metadata?: string;
  cadastralKey?: string;
  isDeleted?: boolean;
}
