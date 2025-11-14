export class CreateWorkOrderRequest {
  workOrderId?: number;
  description: string;
  creationDate?: Date;
  asignationDate?: Date;
  startDate?: Date;
  completionDate?: Date;
  cancelationDate?: Date;
  workOrderTypeId: number;
  priorityId: number;
  workOrderStatusId: number;
  connectionId: string;
  clientId?: string;
  createdUserId: string;
  assignedUserId?: string;
  estimateCost?: number;
  realCost?: number;
  observations?: string;

  constructor(
    description: string,
    workOrderTypeId: number,
    priorityId: number,
    workOrderStatusId: number,
    connectionId: string,
    createdUserId: string,
    creationDate?: Date,
    asignationDate?: Date,
    startDate?: Date,
    completionDate?: Date,
    cancelationDate?: Date,
    clientId?: string,
    assignedUserId?: string,
    estimateCost?: number,
    realCost?: number,
    observations?: string,
  ) {
    this.description = description;
    this.workOrderTypeId = workOrderTypeId;
    this.priorityId = priorityId;
    this.workOrderStatusId = workOrderStatusId;
    this.connectionId = connectionId;
    this.createdUserId = createdUserId;
    if (creationDate) this.creationDate = creationDate;
    if (asignationDate) this.asignationDate = asignationDate;
    if (startDate) this.startDate
    this.startDate = startDate;;
    if (completionDate) this.completionDate = completionDate;
    if (cancelationDate) this.cancelationDate = cancelationDate;
    if (clientId) this.clientId = clientId;
    if (assignedUserId) this.assignedUserId = assignedUserId;
    if (estimateCost) this.estimateCost = estimateCost;
    if (realCost) this.realCost = realCost;
    if (observations) this.observations = observations;
  }
}