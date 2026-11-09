import { WorkOrderUserPolicy, UserParams } from './work-order-user.policy';

describe('WorkOrderUserPolicy', () => {
  describe('isAdmin', () => {
    it('should return false for null or undefined user', () => {
      expect(WorkOrderUserPolicy.isAdmin(null)).toBe(false);
      expect(WorkOrderUserPolicy.isAdmin(undefined)).toBe(false);
    });

    it('should return true for admin roles (e.g. SUPER ADMINISTRADOR, DIRECTOR)', () => {
      expect(
        WorkOrderUserPolicy.isAdmin({ id: '1', role: 'SUPER ADMINISTRADOR' }),
      ).toBe(true);
      expect(
        WorkOrderUserPolicy.isAdmin({ id: '2', roles: ['Director Técnico'] }),
      ).toBe(true);
      expect(
        WorkOrderUserPolicy.isAdmin({ id: '3', role: 'ADMINISTRADOR DE AGUA POTABLE' }),
      ).toBe(true);
    });

    it('should return true for dispatchers with permission ot:despachar (ID 75)', () => {
      const dispatcherUser: UserParams = {
        id: 'user-disp-1',
        role: 'DESPACHADOR',
        roles: ['despachador'],
        permissions: [66, 75],
      };
      expect(WorkOrderUserPolicy.isAdmin(dispatcherUser)).toBe(true);
    });

    it('should return true for executive users with permission ot:dashboard_ejecutivo (ID 88)', () => {
      const executiveUser: UserParams = {
        id: 'user-exec-1',
        role: 'ANALISTA',
        permissions: [66, 88],
      };
      expect(WorkOrderUserPolicy.isAdmin(executiveUser)).toBe(true);
    });

    it('should return true for config users with permission ot:configurar (ID 87)', () => {
      const configUser: UserParams = {
        id: 'user-cfg-1',
        role: 'CONFIGURADOR',
        permissions: [66, 87],
      };
      expect(WorkOrderUserPolicy.isAdmin(configUser)).toBe(true);
    });

    it('should return false for field technicians with only execution permissions (66, 76, 89)', () => {
      const techUser: UserParams = {
        id: 'a6f98fa1-013e-4c6a-89f9-47160986c4fa',
        role: 'TECNICO DE AGUA POTABLE',
        roles: ['TECNICO DE AGUA POTABLE'],
        permissions: [66, 76, 77, 78, 79, 80, 85, 86, 89],
      };
      expect(WorkOrderUserPolicy.isAdmin(techUser)).toBe(false);
    });
  });

  describe('resolveScopeUserId', () => {
    it('should return null for undefined or null user', () => {
      expect(WorkOrderUserPolicy.resolveScopeUserId(null)).toBeNull();
      expect(WorkOrderUserPolicy.resolveScopeUserId(undefined)).toBeNull();
    });

    it('should return null for admin / dispatcher user (global view)', () => {
      const admin: UserParams = {
        id: 'be616517-d1d4-4bd3-9c76-529a80bcf492',
        role: 'ADMINISTRADOR DE AGUA POTABLE',
        permissions: [66, 67, 68, 69, 75, 82, 83, 87, 88],
      };
      expect(WorkOrderUserPolicy.resolveScopeUserId(admin)).toBeNull();
    });

    it('should return user ID for field technician (scoped view to their assigned orders)', () => {
      const tech: UserParams = {
        id: 'a6f98fa1-013e-4c6a-89f9-47160986c4fa',
        role: 'TECNICO DE AGUA POTABLE',
        permissions: [66, 76, 89],
      };
      expect(WorkOrderUserPolicy.resolveScopeUserId(tech)).toBe(
        'a6f98fa1-013e-4c6a-89f9-47160986c4fa',
      );
    });
  });
});
