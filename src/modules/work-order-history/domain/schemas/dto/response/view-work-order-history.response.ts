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
  createdByUserId?: string;
  assignedToUserId?: string;
  completedByUserId?: string;
  creationDate: string;
  assignmentDate?: string;
  completionDate?: string;
  historicalId: number;
  historicalStateId?: string;
  historicalStateName?: string;
  stateChangeDate?: string;
  stateChangeUserId?: string;
  changeDescription?: string;
  changeNumber?: number;
}
