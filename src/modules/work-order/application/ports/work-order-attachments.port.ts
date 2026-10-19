export const WORK_ORDER_ATTACHMENTS_PORT = 'WorkOrderAttachmentsPort';

export interface InterfaceWorkOrderAttachmentsPort {
  attachImages(workOrderId: string, images: string[]): Promise<void>;
}
