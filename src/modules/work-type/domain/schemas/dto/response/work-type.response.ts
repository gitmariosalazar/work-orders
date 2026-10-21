export interface WorkTypeResponse {
  workTypeId: number;
  name: string;
  description: string;
  departmentId?: number;
}

export interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
  departmentDescription: string;
  workTypes: WorkType[];
}

export interface WorkType {
  typeCode: string;
  typeName: string;
  typeDescription: string;
  suggestedPriority: string;
}
