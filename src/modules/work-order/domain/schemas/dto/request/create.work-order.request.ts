export class CreateWorkOrderRequest {
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
  constructor(
    orderCode: string,
    workTypeId: number,
    priorityId: number,
    description: string,
    location: string,
    createdUserId: number,
    clientId?: string,
    creationDate?: Date,
    assignationDate?: Date,
    completionDate?: Date,
    status?: number,
    assignedUserId?: number,
    completedUserId?: number,
    coordinates?: string,
    metadata?: string,
    cadastralKey?: string,
  ) {
    this.orderCode = orderCode;
    this.workTypeId = workTypeId;
    this.priorityId = priorityId;
    this.description = description;
    this.location = location;
    this.createdUserId = createdUserId;
    if (clientId !== undefined) {
      this.clientId = clientId;
    }
    if (creationDate !== undefined) {
      this.creationDate = creationDate;
    }
    if (assignationDate !== undefined) {
      this.assignationDate = assignationDate;
    }
    if (completionDate !== undefined) {
      this.completionDate = completionDate;
    }
    if (status !== undefined) {
      this.status = status;
    }
    if (assignedUserId !== undefined) {
      this.assignedUserId = assignedUserId;
    }
    if (completedUserId !== undefined) {
      this.completedUserId = completedUserId;
    }
    if (coordinates !== undefined) {
      this.coordinates = coordinates;
    }
    if (metadata !== undefined) {
      this.metadata = metadata;
    }
    if (cadastralKey !== undefined) {
      this.cadastralKey = cadastralKey;
    }
  }
}
