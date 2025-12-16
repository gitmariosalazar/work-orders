export interface ViewWorkOrderStatisticsResponse {
  workType: string;
  priority: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  avgCompletionTimeHours: number | null;
}

export interface ViewWorkOrderAssignmentsResponse {
  workOrderId: string;
  workOrderCode: string;
  workerId: number;
  workerRole: string;
  assignmentDate: Date; // ISO date string
}

export interface ViewWorkOrderMaterialsResponse {
  workOrderId: string;
  workOrderCode: string;
  materialId: number;
  quantity: number;
  unitCost: string; // Decimal as string
  subtotalCost: string; // Decimal as string
}

export interface ViewWorkOrderObservationsResponse {
  workOrderId: string;
  workOrderCode: string;
  observationText: string;
  observationDate: Date; // ISO date string
  observerWorkerId: number | null;
}

export interface ViewWorkOrderAttachmentsResponse {
  workOrderId: string;
  workOrderCode: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadDate: Date; // ISO date string
}

export interface ViewWorkOrdersByClientResponse {
  clientId: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface ViewAllWorkOrdersFullDetailsResponse {
  workOrderId: string;
  workOrderCode: string;
  cadastralKey: string;
  workOrderDescription: string;
  workOrderLocation: string;
  coordinatesWkt: string;
  longitude: number;
  latitude: number;
  workType: string;
  department: string;
  priority: string;
  currentState: string;
  clientId: string;
  createdByUserId: number;
  assignedToUserId: number | null;
  completedByUserId: number | null;
  creationDate: Date; // ISO date string
  assignmentDate: Date | null; // ISO date string
  completionDate: Date | null; // ISO date string
  managementAttachments: Array<{
    fileName: string;
    fileType: string;
    fileUrl: string;
    uploadDate: Date; // ISO date string
  }>;
  materialsUsed: Array<{
    materialId: number;
    quantity: number;
    unitCost: string; // Decimal as string
    subtotalCost: string; // Decimal as string
  }>;
  observationsMade: Array<{
    observationText: string;
    observationDate: Date; // ISO date string
    observerWorkerId: number | null;
  }>;
  assignedWorkers: Array<{
    workerId: number;
    workerRole: string;
    assignmentDate: Date; // ISO date string
  }>;
}
