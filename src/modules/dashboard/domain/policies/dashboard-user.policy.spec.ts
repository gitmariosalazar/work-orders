import { DashboardUserPolicy } from './dashboard-user.policy';
import { UserParams } from '../contracts/dashboard.interface.repository';

describe('DashboardUserPolicy', () => {
  describe('isAdmin', () => {
    it('should return false when user is undefined or null', () => {
      expect(DashboardUserPolicy.isAdmin(undefined)).toBe(false);
      expect(DashboardUserPolicy.isAdmin(null)).toBe(false);
    });

    it('should return true for admin role regardless of casing', () => {
      const user1: UserParams = { id: 'u-1', role: 'ADMIN' };
      const user2: UserParams = { id: 'u-2', role: 'administrador' };
      const user3: UserParams = { id: 'u-3', role: 'Super_Admin' };
      const user4: UserParams = { id: 'u-4', role: 'SUPERVISOR' };

      expect(DashboardUserPolicy.isAdmin(user1)).toBe(true);
      expect(DashboardUserPolicy.isAdmin(user2)).toBe(true);
      expect(DashboardUserPolicy.isAdmin(user3)).toBe(true);
      expect(DashboardUserPolicy.isAdmin(user4)).toBe(true);
    });

    it('should return true if any role in roles array is an admin role', () => {
      const user: UserParams = {
        id: 'u-1',
        roles: ['technician', 'SUPER ADMINISTRADOR'],
      };
      expect(DashboardUserPolicy.isAdmin(user)).toBe(true);
    });

    it('should handle role objects (e.g. { id: 1, name: "ADMINISTRADOR" }) without throwing error', () => {
      const userWithRoleObj: UserParams = {
        id: 'u-1',
        role: { id: 1, name: 'ADMINISTRADOR', description: 'Admin' },
        roles: [{ id: 1, name: 'ADMINISTRADOR' }],
      };
      expect(DashboardUserPolicy.isAdmin(userWithRoleObj)).toBe(true);
    });

    it('should handle non-admin role objects without throwing error', () => {
      const userWithTechRoleObj: UserParams = {
        id: 'u-tech-1',
        role: { id: 5, name: 'TECNICO_CAMPO' },
        roles: [{ id: 5, name: 'TECNICO_CAMPO' }],
      };
      expect(DashboardUserPolicy.isAdmin(userWithTechRoleObj)).toBe(false);
    });

    it('should safely handle unexpected non-string/malformed types without throwing', () => {
      const malformedUser: UserParams = {
        id: 'u-weird',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: 12345 as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        roles: [null, undefined, 42, {}] as any,
      };
      expect(DashboardUserPolicy.isAdmin(malformedUser)).toBe(false);
    });

    it('should return false for regular technician or operator', () => {
      const user: UserParams = {
        id: 'u-technician-1',
        role: 'TECNICO',
        roles: ['operador', 'tecnico'],
      };
      expect(DashboardUserPolicy.isAdmin(user)).toBe(false);
    });

    it('should return true if user has executive dashboard permission (ID 88) even with non-admin role', () => {
      const userWithPermission: UserParams = {
        id: 'u-analyst-1',
        role: 'ANALISTA',
        roles: ['analista_planificacion'],
        permissions: [1, 28, 88],
      };
      expect(DashboardUserPolicy.isAdmin(userWithPermission)).toBe(true);
    });
  });

  describe('resolveScopeUserId', () => {
    it('should return null if user is undefined or null', () => {
      expect(DashboardUserPolicy.resolveScopeUserId(undefined)).toBeNull();
      expect(DashboardUserPolicy.resolveScopeUserId(null)).toBeNull();
    });

    it('should return null if user is admin (full access to all data)', () => {
      const adminUser: UserParams = { id: 'admin-id-123', role: 'admin' };
      expect(DashboardUserPolicy.resolveScopeUserId(adminUser)).toBeNull();
    });

    it('should return the user id if user is non-admin (scoped access)', () => {
      const techUser: UserParams = { id: 'tech-id-456', role: 'tecnico' };
      expect(DashboardUserPolicy.resolveScopeUserId(techUser)).toBe('tech-id-456');
    });

    it('should trim whitespace around user id', () => {
      const techUser: UserParams = { id: '  tech-id-789  ', role: 'operador' };
      expect(DashboardUserPolicy.resolveScopeUserId(techUser)).toBe('tech-id-789');
    });

    it('should work when user role is an object representation of admin', () => {
      const adminObjUser: UserParams = {
        id: 'admin-id-999',
        role: { id: 1, name: 'SUPER ADMINISTRADOR' },
      };
      expect(DashboardUserPolicy.resolveScopeUserId(adminObjUser)).toBeNull();
    });

    it('should correctly handle the exact token format from the auth system', () => {
      const exactTokenUser: UserParams = {
        sub: '6203181e-19b4-4119-a683-9872e43c3512',
        user_type: 'employee',
        username: '1003938477',
        email: 'mariosalazar.ms.10@gmail.com',
        roles: ['SUPER ADMINISTRADOR'],
      };
      expect(DashboardUserPolicy.isAdmin(exactTokenUser)).toBe(true);
      expect(DashboardUserPolicy.resolveScopeUserId(exactTokenUser)).toBeNull();
    });

    it('should correctly scope when exact token format belongs to a regular technician', () => {
      const techTokenUser: UserParams = {
        sub: '6203181e-19b4-4119-a683-9872e43c3512',
        user_type: 'employee',
        username: '1003938477',
        email: 'mariosalazar.ms.10@gmail.com',
        roles: ['TECNICO DE CAMPO'],
      };
      expect(DashboardUserPolicy.isAdmin(techTokenUser)).toBe(false);
      expect(DashboardUserPolicy.resolveScopeUserId(techTokenUser)).toBe(
        '6203181e-19b4-4119-a683-9872e43c3512',
      );
    });
  });
});
