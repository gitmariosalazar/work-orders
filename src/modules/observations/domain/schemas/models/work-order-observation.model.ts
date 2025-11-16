import { ObservationModel } from "./observation.model";

export class WorkOrderObservationModel {
  constructor(
    private readonly props: {
      workOrderObservationId?: number;
      workOrderId: number;
      observation: ObservationModel;
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

  get observation(): ObservationModel {
    return this.props.observation;
  }

  get registerDate(): Date | undefined {
    return this.props.registerDate;
  }

  set workOrderId(id: number) {
    this.props.workOrderId = id;
  }

  set observation(observation: ObservationModel) {
    this.props.observation = observation;
  }

  set registerDate(date: Date | undefined) {
    this.props.registerDate = date;
  }

  static create(
    workOrderId: number,
    observation: ObservationModel,
    workOrderObservationId?: number,
    registerDate?: Date
  ): WorkOrderObservationModel {
    return new WorkOrderObservationModel({
      workOrderObservationId,
      workOrderId,
      observation: ObservationModel.create(
        observation.observationId,
        observation.observationTitle,
        observation.observationDetails,
      ),
      registerDate,
    });
  }

  toJSON() {
    return {
      workOrderObservationId: this.workOrderObservationId,
      workOrderId: this.workOrderId,
      observation: this.observation.toJSON(),
      registerDate: this.registerDate,
    };
  }
}