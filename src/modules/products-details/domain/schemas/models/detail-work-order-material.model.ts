export class DetailWorkOrderMaterialModel {
  private detailWorkOrderMaterialId: number;
  private workOrderId: string;
  private materialId: number;
  private quantity: number;
  private unitCost: number;
  private subtotal: number;

  constructor(
    detailWorkOrderMaterialId: number,
    workOrderId: string,
    materialId: number,
    quantity: number,
    unitCost: number,
    subtotal: number,
  ) {
    this.detailWorkOrderMaterialId = detailWorkOrderMaterialId;
    this.workOrderId = workOrderId;
    this.materialId = materialId;
    this.quantity = quantity;
    this.unitCost = unitCost;
    this.subtotal = subtotal;
  }

  public getDetailWorkOrderMaterialId(): number {
    return this.detailWorkOrderMaterialId;
  }

  public getWorkOrderId(): string {
    return this.workOrderId;
  }

  public getMaterialId(): number {
    return this.materialId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnitCost(): number {
    return this.unitCost;
  }

  public getSubtotal(): number {
    return this.subtotal;
  }

  setSubtotal(subtotal: number): void {
    this.subtotal = subtotal;
  }

  setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  setUnitCost(unitCost: number): void {
    this.unitCost = unitCost;
  }

  setMaterialId(materialId: number): void {
    this.materialId = materialId;
  }

  setWorkOrderId(workOrderId: string): void {
    this.workOrderId = workOrderId;
  }

  setDetailWorkOrderMaterialId(detailWorkOrderMaterialId: number): void {
    this.detailWorkOrderMaterialId = detailWorkOrderMaterialId;
  }

  toJSON() {
    return {
      detailWorkOrderMaterialId: this.detailWorkOrderMaterialId,
      workOrderId: this.workOrderId,
      materialId: this.materialId,
      quantity: this.quantity,
      unitCost: this.unitCost,
      subtotal: this.subtotal,
    };
  }
}
