export class ObservationModel {
  constructor(
    private readonly props: {
      observationId: number,
      observationTitle: string,
      observationDetails: string,
    }) { }

  get observationId(): number {
    return this.props.observationId;
  }

  get observationTitle(): string {
    return this.props.observationTitle;
  }

  get observationDetails(): string {
    return this.props.observationDetails;
  }

  set observationTitle(title: string) {
    this.props.observationTitle = title;
  }

  set observationDetails(details: string) {
    this.props.observationDetails = details;
  }

  static create(
    observationId: number,
    observationTitle: string,
    observationDetails: string,
  ): ObservationModel {
    return new ObservationModel({
      observationId,
      observationTitle,
      observationDetails,
    });
  }

  toJSON() {
    return {
      observationId: this.observationId,
      observationTitle: this.observationTitle,
      observationDetails: this.observationDetails,
    };
  }

}