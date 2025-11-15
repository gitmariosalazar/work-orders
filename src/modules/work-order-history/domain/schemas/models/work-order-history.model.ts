export class WorkOrderHistoryModel {
  private constructor(
    private readonly props: {
      workOrderHistoryId?: number;
      workOrderId: number;
      changeDate: Date;
      previousStatusId?: number;
      newStatusId?: number;
      userId: number;
      changeDescription?: string;
    },
  ) { }

  // === Getters (solo lectura) ===
  get workOrderHistoryId(): number | undefined {
    return this.props.workOrderHistoryId;
  }

  get workOrderId(): number {
    return this.props.workOrderId;
  }

  get changeDate(): Date {
    return this.props.changeDate;
  }

  get previousStatusId(): number | undefined {
    return this.props.previousStatusId;
  }

  get newStatusId(): number | undefined {
    return this.props.newStatusId;
  }

  get userId(): number {
    return this.props.userId;
  }

  get changeDescription(): string | undefined {
    return this.props.changeDescription;
  }

  set changeDescription(description: string | undefined) {
    this.props.changeDescription = description;
  }

  set newStatusId(statusId: number | undefined) {
    this.props.newStatusId = statusId;
  }

  set previousStatusId(statusId: number | undefined) {
    this.props.previousStatusId = statusId;
  }

  set changeDate(date: Date) {
    this.props.changeDate = date;
  }

  set workOrderId(id: number) {
    this.props.workOrderId = id;
  }

  set userId(id: number) {
    this.props.userId = id;
  }

  static create(
    workOrderId: number,
    changeDate: Date,
    userId: number,
    previousStatusId?: number,
    newStatusId?: number,
    changeDescription?: string,
  ): WorkOrderHistoryModel {
    return new WorkOrderHistoryModel({
      workOrderId,
      changeDate,
      userId,
      previousStatusId,
      newStatusId,
      changeDescription,
    });
  }

  // === toJSON para serialización limpia ===
  toJSON(): Record<string, any> {
    return { ...this.props };
  }
}
