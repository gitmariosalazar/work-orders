export class WorkOrderModel {
  private workOrderId?: number;
  private orderCode: string;
  private workTypeId: number;
  private priorityId: number;
  private clientId?: string;
  private creationDate?: Date;
  private assignationDate?: Date;
  private completionDate?: Date;
  private status?: number;
  private description: string;
  private location: string;
  private createdUserId: number;
  private assignedUserId?: number;
  private completedUserId?: number;
  private coordinates?: string;
  private metadata?: string;
  private cadastralKey?: string;
  private isDeleted?: boolean;

  constructor(
    orderCode: string,
    workTypeId: number,
    priorityId: number,
    description: string,
    location: string,
    createdUserId: number,
    workOrderId?: number,
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
    isDeleted?: boolean,
  ) {
    this.orderCode = orderCode;
    this.workTypeId = workTypeId;
    this.priorityId = priorityId;
    this.description = description;
    this.location = location;
    this.createdUserId = createdUserId;
    if (workOrderId !== undefined) {
      this.workOrderId = workOrderId;
    }
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
    if (isDeleted !== undefined) {
      this.isDeleted = isDeleted;
    }
  }

  toResponse() {
    return {
      workOrderId: this.workOrderId,
      orderCode: this.orderCode,
      workTypeId: this.workTypeId,
      priorityId: this.priorityId,
      clientId: this.clientId,
      creationDate: this.creationDate,
      assignationDate: this.assignationDate,
      completionDate: this.completionDate,
      status: this.status,
      description: this.description,
      location: this.location,
      createdUserId: this.createdUserId,
      assignedUserId: this.assignedUserId,
      completedUserId: this.completedUserId,
      coordinates: this.coordinates,
      metadata: this.metadata,
      cadastralKey: this.cadastralKey,
      isDeleted: this.isDeleted,
    };
  }

  getWorkOrderId(): number | undefined {
    return this.workOrderId;
  }

  getOrderCode(): string {
    return this.orderCode;
  }

  getWorkTypeId(): number {
    return this.workTypeId;
  }

  getPriorityId(): number {
    return this.priorityId;
  }

  getClientId(): string | undefined {
    return this.clientId;
  }

  getCreationDate(): Date | undefined {
    return this.creationDate;
  }

  getAssignationDate(): Date | undefined {
    return this.assignationDate;
  }

  getCompletionDate(): Date | undefined {
    return this.completionDate;
  }

  getStatus(): number | undefined {
    return this.status;
  }

  getDescription(): string {
    return this.description;
  }

  getLocation(): string {
    return this.location;
  }

  getCreatedUserId(): number {
    return this.createdUserId;
  }

  getAssignedUserId(): number | undefined {
    return this.assignedUserId;
  }

  getCompletedUserId(): number | undefined {
    return this.completedUserId;
  }

  getCoordinates(): string | undefined {
    return this.coordinates;
  }

  getMetadata(): string | undefined {
    return this.metadata;
  }

  getCadastralKey(): string | undefined {
    return this.cadastralKey;
  }

  getIsDeleted(): boolean | undefined {
    return this.isDeleted;
  }

  setStatus(status: number): void {
    this.status = status;
  }

  setCompletionDate(completionDate: Date): void {
    this.completionDate = completionDate;
  }

  setAssignedUserId(assignedUserId: number): void {
    this.assignedUserId = assignedUserId;
  }

  setCompletedUserId(completedUserId: number): void {
    this.completedUserId = completedUserId;
  }

  setCoordinates(coordinates: string): void {
    this.coordinates = coordinates;
  }

  setMetadata(metadata: string): void {
    this.metadata = metadata;
  }

  setCadastralKey(cadastralKey: string): void {
    this.cadastralKey = cadastralKey;
  }

  setIsDeleted(isDeleted: boolean): void {
    this.isDeleted = isDeleted;
  }

  setAssignationDate(assignationDate: Date): void {
    this.assignationDate = assignationDate;
  }

  setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }

  setClientId(clientId: string): void {
    this.clientId = clientId;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setLocation(location: string): void {
    this.location = location;
  }

  setOrderCode(orderCode: string): void {
    this.orderCode = orderCode;
  }

  setPriorityId(priorityId: number): void {
    this.priorityId = priorityId;
  }

  setWorkTypeId(workTypeId: number): void {
    this.workTypeId = workTypeId;
  }

  setCreatedUserId(createdUserId: number): void {
    this.createdUserId = createdUserId;
  }

  setWorkOrderId(workOrderId: number): void {
    this.workOrderId = workOrderId;
  }
  /*
  setCompletionDateNull(): void {
    this.completionDate = undefined;
  }

  setAsignationDateNull(): void {
    this.asignationDate = undefined;
  }

  setClientIdNull(): void {
    this.clientId = undefined;
  }

  setAssignedUserIdNull(): void {
    this.assignedUserId = undefined;
  }

  setCompletedUserIdNull(): void {
    this.completedUserId = undefined;
  }

  setCoordinatesNull(): void {
    this.coordinates = undefined;
  }

  setMetadataNull(): void {
    this.metadata = undefined;
  }

  setCadastralKeyNull(): void {
    this.cadastralKey = undefined;
  }

  setIsDeletedNull(): void {
    this.isDeleted = undefined;
  }
  */
}
