export interface WorkTypeSqlResponse {
  work_type_id: number;
  name: string;
  description: string;
  department_id?: number;
}

export interface DepartmentSqlResponse {
  department_id: number;
  department_name: string;
  department_description: string;
  work_types: WorkTypeSqlResult[];
}

export interface WorkTypeSqlResult {
  type_code: string;
  type_name: string;
  type_description: string;
  suggested_priority: string;
}
