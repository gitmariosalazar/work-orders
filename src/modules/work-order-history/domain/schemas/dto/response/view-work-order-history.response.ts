export interface ViewWorkOrderHistoryResponse {
  workOrderId: string;
  workOrderCode: string;
  cadastralKey: string;
  workOrderDescription?: string;
  workOrderLocation?: string;
  coordinatesWkt?: string;
  longitude?: number;
  latitude?: number;
  workType: string;
  department: string;
  priority: string;
  currentState: string;
  clientId: string;
  createdByUserId?: number;
  assignedToUserId?: number;
  completedByUserId?: number;
  creationDate: string;
  assignmentDate?: string;
  completionDate?: string;
  historicalId: number;
  historicalStateId?: number;
  historicalStateName?: string;
  stateChangeDate?: string;
  stateChangeUserId?: number;
  changeDescription?: string;
  changeNumber?: number;
}
