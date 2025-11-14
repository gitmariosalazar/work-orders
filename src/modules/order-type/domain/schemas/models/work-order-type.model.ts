export class WorkOrderTypeModel {
  private workOrderTypeId?: number;
  private name: string;
  private description: string;

  constructor(name: string, description: string, workOrderTypeId?: number) {
    this.name = name;
    this.description = description;
    if (workOrderTypeId) {
      this.workOrderTypeId = workOrderTypeId;
    }
  }

  getWorkOrderTypeId(): number | undefined {
    return this.workOrderTypeId;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  setName(name: string): void {
    this.name = name;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  toJSON(): object {
    return {
      workOrderTypeId: this.workOrderTypeId,
      name: this.name,
      description: this.description,
    };
  }

}