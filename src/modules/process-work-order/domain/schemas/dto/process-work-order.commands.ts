export interface CreateWorkOrderCommand {
  origin: string;
  workTypeId: number;
  priorityId: number;
  clientId: string;
  cadastralKey?: string;
  description?: string;
  location: string;
  longitude?: number | null;
  latitude?: number | null;
  createdByUserId: string;
  metadata?: string;
}

export interface AssignWorkOrderToCrewCommand {
  workOrderId: string;
  crewId: string;
  assignedByUserId: string;
  comment?: string;
}

export interface AssignWorkOrderToWorkerCommand {
  workOrderId: string;
  workerId: string;
  assignedByUserId: string;
  comment?: string;
}

export interface CreatePreparationInspectionCommand {
  workOrderId: string;
  crewId?: string | null;
  createdByUserId: string;
  passed: boolean;
  observations?: string;
}

export interface AddPreparationInspectionDetailCommand {
  workOrderId: string;
  inspectionId: string;
  code: string;
  passed: boolean;
  createdByUserId: string;
  comment?: string;
}

export interface AddWorkOrderMaterialCommand {
  workOrderId: string;
  materialId: number;
  quantity: number;
  unitCost: number;
  createdByUserId: string;
}

export interface AddAdditionalCostCommand {
  workOrderId: string;
  concept: string;
  quantity: number;
  unitCost: number;
  createdByUserId: string;
}

export interface AddWorkOrderAttachmentCommand {
  workOrderId: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  createdByUserId: string;
}

export interface CreateQualityControlCommand {
  workOrderId: string;
  createdByUserId: string;
  approved: boolean;
  comments?: string;
}

export interface AddQualityControlDetailCommand {
  workOrderId: string;
  controlId: string;
  code: string;
  passed: boolean;
  createdByUserId: string;
  comment?: string;
}

export interface RegisterSatisfactionSurveyCommand {
  workOrderId: string;
  rating: number;
  createdByUserId: string;
  comments?: string;
}

export interface AddWorkerToWorkOrderCommand {
  /** UUID de la orden de trabajo */
  workOrderId: string;
  /** UUID del usuario/trabajador a agregar */
  workerId: string;
  /** id_rol de rol_trabajador (1=Líder, 2=Técnico Operativo, 3=Supervisor GIS) */
  roleId?: number | null;
  /** TRUE = técnico responsable de la OT (solo 1 por orden) */
  isResponsible?: boolean;
  /** UUID del usuario que realiza la asignación */
  assignedByUserId: string;
}

export interface RemoveWorkerFromWorkOrderCommand {
  /** UUID de la orden de trabajo */
  workOrderId: string;
  /** UUID del trabajador a remover */
  workerId: string;
  /** UUID del usuario que realiza la remoción */
  removedByUserId: string;
}
