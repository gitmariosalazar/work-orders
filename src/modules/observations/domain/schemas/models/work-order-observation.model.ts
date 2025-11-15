export class WorkOrderObservationModel {
  constructor(
    private readonly props: {
      workOrderObservationId?: number;
      workOrderId: number;
      observationId: number;
      registerDate?: Date;
    }
  ) {
  }

  get workOrderObservationId(): number | undefined {
    return this.props.workOrderObservationId;
  }

  get workOrderId(): number {
    return this.props.workOrderId;
  }

  get observationId(): number {
    return this.props.observationId;
  }

  get registerDate(): Date | undefined {
    return this.props.registerDate;
  }

  set workOrderId(id: number) {
    this.props.workOrderId = id;
  }

  set observationId(id: number) {
    this.props.observationId = id;
  }

  set registerDate(date: Date | undefined) {
    this.props.registerDate = date;
  }

  static create(
    workOrderId: number,
    observationId: number,
    workOrderObservationId?: number,
    registerDate?: Date
  ): WorkOrderObservationModel {
    return new WorkOrderObservationModel({
      workOrderObservationId,
      workOrderId,
      observationId,
      registerDate,
    });
  }

  toJSON() {
    return {
      workOrderObservationId: this.workOrderObservationId,
      workOrderId: this.workOrderId,
      observationId: this.observationId,
      registerDate: this.registerDate,
    };
  }
}