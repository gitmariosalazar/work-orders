export class WorkOrderHistoryModel {
  private constructor(
    private readonly props: {
      workOrderHistoryId?: number;
      workOrderId: number;
      statusId?: number;
      changeDate: Date;
      userId: number;
      changeDescription?: string;
      cadastralKey?: string;
      orderCode?: string;
    },
  ) {}
  public static create(props: {
    workOrderHistoryId?: number;
    workOrderId: number;
    statusId?: number;
    changeDate: Date;
    userId: number;
    changeDescription?: string;
    cadastralKey?: string;
    orderCode?: string;
  }): WorkOrderHistoryModel {
    return new WorkOrderHistoryModel(props);
  }

  public get workOrderHistoryId(): number | undefined {
    return this.props.workOrderHistoryId;
  }

  public get workOrderId(): number {
    return this.props.workOrderId;
  }

  public get statusId(): number | undefined {
    return this.props.statusId;
  }

  public get changeDate(): Date {
    return this.props.changeDate;
  }

  public get userId(): number {
    return this.props.userId;
  }

  public get changeDescription(): string | undefined {
    return this.props.changeDescription;
  }

  public get cadastralKey(): string | undefined {
    return this.props.cadastralKey;
  }

  public get orderCode(): string | undefined {
    return this.props.orderCode;
  }

  public set changeDescription(value: string | undefined) {
    this.props.changeDescription = value;
  }

  public set changeDate(value: Date) {
    this.props.changeDate = value;
  }

  public set statusId(value: number | undefined) {
    this.props.statusId = value;
  }

  public set userId(value: number) {
    this.props.userId = value;
  }

  public set cadastralKey(value: string | undefined) {
    this.props.cadastralKey = value;
  }

  public set orderCode(value: string | undefined) {
    this.props.orderCode = value;
  }

  public set workOrderId(value: number) {
    this.props.workOrderId = value;
  }

  public set workOrderHistoryId(value: number | undefined) {
    this.props.workOrderHistoryId = value;
  }

  public toJSON(): object {
    return {
      workOrderHistoryId: this.workOrderHistoryId,
      workOrderId: this.workOrderId,
      statusId: this.statusId,
      changeDate: this.changeDate,
      userId: this.userId,
      changeDescription: this.changeDescription,
      cadastralKey: this.cadastralKey,
      orderCode: this.orderCode,
    };
  }
}
