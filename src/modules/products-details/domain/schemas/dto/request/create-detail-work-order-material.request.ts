export class CreateDetailWorkOrderMaterialRequest {
  workOrderId: string;
  materialId: number;
  quantity: number;
  unitCost: number;

  constructor(
    workOrderId: string,
    materialId: number,
    quantity: number,
    unitCost: number,
  ) {
    this.workOrderId = workOrderId;
    this.materialId = materialId;
    this.quantity = quantity;
    this.unitCost = unitCost;
  }
}
