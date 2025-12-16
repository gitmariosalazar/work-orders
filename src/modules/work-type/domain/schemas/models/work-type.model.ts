export class WorkTypeModel {
  private workTypeId?: number;
  private name: string;
  private description: string;
  private departmentId?: number;

  constructor(
    name: string,
    description: string,
    workTypeId?: number,
    departmentId?: number,
  ) {
    this.name = name;
    this.description = description;
    if (workTypeId !== undefined) {
      this.workTypeId = workTypeId;
    }
    if (departmentId !== undefined) {
      this.departmentId = departmentId;
    }
  }

  getWorkTypeId(): number | undefined {
    return this.workTypeId;
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

  getDepartmentId(): number | undefined {
    return this.departmentId;
  }

  setDepartmentId(departmentId: number): void {
    this.departmentId = departmentId;
  }

  toJSON(): object {
    return {
      workTypeId: this.workTypeId,
      name: this.name,
      description: this.description,
      departmentId: this.departmentId,
    };
  }
}
