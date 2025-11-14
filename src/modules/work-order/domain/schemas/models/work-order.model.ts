export class WorkOrderModel {
  private workOrderId?: number;
  private description: string;
  private creationDate?: Date;
  private asignationDate?: Date;
  private startDate?: Date;
  private completionDate?: Date;
  private cancelationDate?: Date;
  private workOrderTypeId: number;
  private priorityId: number;
  private workOrderStatusId: number;
  private connectionId: string;
  private clientId?: string;
  private createdUserId: string;
  private assignedUserId?: string;
  private estimateCost?: number;
  private realCost?: number;
  private observations?: string;

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
    if (startDate) this.startDate = startDate;
    if (completionDate) this.completionDate = completionDate;
    if (cancelationDate) this.cancelationDate = cancelationDate;
    if (clientId) this.clientId = clientId;
    if (assignedUserId) this.assignedUserId = assignedUserId;
    if (estimateCost) this.estimateCost = estimateCost;
    if (realCost) this.realCost = realCost;
    if (observations) this.observations = observations;
  }

  getWorkOrderId(): number | undefined {
    return this.workOrderId;
  }

  getDescription(): string {
    return this.description;
  }

  getCreationDate(): Date | undefined {
    return this.creationDate;
  }

  getAsignationDate(): Date | undefined {
    return this.asignationDate;
  }

  getStartDate(): Date | undefined {
    return this.startDate;
  }

  getCompletionDate(): Date | undefined {
    return this.completionDate;
  }

  getCancelationDate(): Date | undefined {
    return this.cancelationDate;
  }

  getWorkOrderTypeId(): number {
    return this.workOrderTypeId;
  }

  getPriorityId(): number {
    return this.priorityId;
  }

  getWorkOrderStatusId(): number {
    return this.workOrderStatusId;
  }

  getConnectionId(): string {
    return this.connectionId;
  }

  getClientId(): string | undefined {
    return this.clientId;
  }

  getCreatedUserId(): string {
    return this.createdUserId;
  }

  getAssignedUserId(): string | undefined {
    return this.assignedUserId;
  }

  getEstimateCost(): number | undefined {
    return this.estimateCost;
  }

  getRealCost(): number | undefined {
    return this.realCost;
  }

  getObservations(): string | undefined {
    return this.observations;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  setAsignationDate(asignationDate: Date): void {
    this.asignationDate = asignationDate;
  }

  setStartDate(startDate: Date): void {
    this.startDate = startDate;
  }

  setCompletionDate(completionDate: Date): void {
    this.completionDate = completionDate;
  }

  setCancelationDate(cancelationDate: Date): void {
    this.cancelationDate = cancelationDate;
  }

  setWorkOrderTypeId(workOrderTypeId: number): void {
    this.workOrderTypeId = workOrderTypeId;
  }

  setPriorityId(priorityId: number): void {
    this.priorityId = priorityId;
  }

  setWorkOrderStatusId(workOrderStatusId: number): void {
    this.workOrderStatusId = workOrderStatusId;
  }

  setConnectionId(connectionId: string): void {
    this.connectionId = connectionId;
  }

  setClientId(clientId: string): void {
    this.clientId = clientId;
  }

  setCreatedUserId(createdUserId: string): void {
    this.createdUserId = createdUserId;
  }

  setAssignedUserId(assignedUserId: string): void {
    this.assignedUserId = assignedUserId;
  }

  setEstimateCost(estimateCost: number): void {
    this.estimateCost = estimateCost;
  }

  setRealCost(realCost: number): void {
    this.realCost = realCost;
  }

  setObservations(observations: string): void {
    this.observations = observations;
  }

  toJSON(): object {
    return {
      workOrderId: this.workOrderId,
      description: this.description,
      creationDate: this.creationDate,
      asignationDate: this.asignationDate,
      startDate: this.startDate,
      completionDate: this.completionDate,
      cancelationDate: this.cancelationDate,
      workOrderTypeId: this.workOrderTypeId,
      priorityId: this.priorityId,
      workOrderStatusId: this.workOrderStatusId,
      connectionId: this.connectionId,
      clientId: this.clientId,
      createdUserId: this.createdUserId,
      assignedUserId: this.assignedUserId,
      estimateCost: this.estimateCost,
      realCost: this.realCost,
      observations: this.observations,
    };
  }
}