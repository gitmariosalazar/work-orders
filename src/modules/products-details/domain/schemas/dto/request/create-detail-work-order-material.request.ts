export class CreateDetailWorkOrderMaterialRequest {
  workOrderId: string;
  materialId: number;
  quantity: number;
  unitCost: number;
  code: string;
  name: string;

  constructor(
    workOrderId: string,
    materialId: number,
    quantity: number,
    unitCost: number,
    code: string,
    name: string,
  ) {
    this.workOrderId = workOrderId;
    this.materialId = materialId;
    this.quantity = quantity;
    this.unitCost = unitCost;
    this.code = code;
    this.name = name;
  }
}
