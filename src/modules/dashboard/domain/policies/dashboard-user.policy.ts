import { UserParams } from '../contracts/dashboard.interface.repository';

/**
 * Política de dominio para resolución de alcance (scope) y permisos de visualización.
 * Encapsula la lógica de negocio sobre qué roles son considerados administrativos
 * y cómo se resuelve el identificador de usuario para filtrado en persistencia.
 */
export class DashboardUserPolicy {
  private static readonly ADMIN_ROLES: ReadonlySet<string> = new Set([
    'admin',
    'administrador',
    'superadmin',
    'super_admin',
    'super administrador',
    'super-admin',
    'director',
    'gerente',
    'supervisor',
  ]);

  /** ID del permiso ot:dashboard_ejecutivo (acceso global a métricas ejecutivas) */
  private static readonly EXECUTIVE_DASHBOARD_PERMISSION_ID = 88;

  /**
   * Extrae de forma segura el nombre del rol como string, sin importar si
   * viene como string primitivo o como objeto (ej. { id: 1, name: 'ADMIN' }).
   */
  private static extractRoleName(rawRole: unknown): string | null {
    if (rawRole === null || rawRole === undefined) {
      return null;
    }
    if (typeof rawRole === 'string') {
      const trimmed = rawRole.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
    if (typeof rawRole === 'object' && rawRole !== null) {
      const obj = rawRole as Record<string, unknown>;
      const candidate =
        obj.name ?? obj.nombre ?? obj.role ?? obj.rol ?? obj.description;
      if (typeof candidate === 'string') {
        const trimmed = candidate.trim();
        return trimmed.length > 0 ? trimmed : null;
      }
    }
    return null;
  }

  /**
   * Determina si el usuario posee privilegios administrativos o de supervisión general.
   */
  static isAdmin(user?: UserParams | null): boolean {
    if (!user) {
      return false;
    }

    // Si tiene asignado explícitamente el permiso ot:dashboard_ejecutivo (ID 88)
    if (
      Array.isArray(user.permissions) &&
      user.permissions.includes(this.EXECUTIVE_DASHBOARD_PERMISSION_ID)
    ) {
      return true;
    }

    const rawCandidates: unknown[] = [];
    if (user.role !== undefined && user.role !== null) {
      rawCandidates.push(user.role);
    }
    if (Array.isArray(user.roles)) {
      rawCandidates.push(...user.roles);
    }

    const cleanRoles: string[] = [];
    for (const candidate of rawCandidates) {
      const roleName = this.extractRoleName(candidate);
      if (roleName) {
        cleanRoles.push(roleName);
      }
    }

    return cleanRoles.some((roleName) => {
      const normalized = roleName.toLowerCase();
      if (this.ADMIN_ROLES.has(normalized)) {
        return true;
      }
      return (
        normalized.includes('admin') ||
        normalized.includes('super') ||
        normalized.includes('supervisor')
      );
    });
  }

  /**
   * Resuelve el ID del usuario a usar en el filtrado de consultas:
   * - Si es admin: retorna null (acceso global a todos los registros).
   * - Si es usuario estándar (técnico/empleado): retorna user.id (filtro estricto a su propiedad).
   * - Si no se provee usuario: retorna null (compatibilidad con llamadas internas del sistema).
   */
  static resolveScopeUserId(user?: UserParams | null): string | null {
    if (!user) {
      return null;
    }
    if (this.isAdmin(user)) {
      return null;
    }

    const rawId = (user.id ?? user.sub) as unknown;
    if (typeof rawId === 'string') {
      const cleanId = rawId.trim();
      return cleanId.length > 0 ? cleanId : null;
    }
    if (rawId !== null && rawId !== undefined) {
      const cleanId = String(rawId).trim();
      return cleanId.length > 0 ? cleanId : null;
    }
    return null;
  }
}
