export class CreateWorkTypeRequest {
  name: string;
  description: string;
  departmentId?: number;

  constructor(name: string, description: string, departmentId?: number) {
    this.name = name;
    this.description = description;
    if (departmentId !== undefined) {
      this.departmentId = departmentId;
    }
  }
}
