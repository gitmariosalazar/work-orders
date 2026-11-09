import { UserParams, WorkOrderUserPolicy } from '../../../../shared/policies/work-order-user.policy';

export { UserParams };

/**
 * Política de dominio para resolución de alcance (scope) y permisos de visualización del Dashboard.
 * Hereda de la política general de órdenes de trabajo WorkOrderUserPolicy.
 */
export class DashboardUserPolicy extends WorkOrderUserPolicy {}
