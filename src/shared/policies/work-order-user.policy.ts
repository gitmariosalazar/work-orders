export interface UserParams {
  id?: string;
  sub?: string;
  role?: string | Record<string, unknown>;
  roles?: Array<string | Record<string, unknown>>;
  permissions?: number[];
  user_type?: string;
  username?: string;
  email?: string;
}

/**
 * Política de dominio compartida para resolución de alcance (scope) y permisos de visualización en Órdenes de Trabajo.
 * Encapsula la lógica de negocio sobre qué roles y permisos otorgan acceso global (administrativo)
 * y cómo se resuelve el identificador de usuario para filtrado en la capa de persistencia.
 */
export class WorkOrderUserPolicy {
  protected static readonly ADMIN_ROLES: ReadonlySet<string> = new Set([
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

  /** IDs de permisos globales/administrativos en Órdenes de Trabajo */
  protected static readonly GLOBAL_PERMISSION_IDS: ReadonlySet<number> = new Set([
    88, // ot:dashboard_ejecutivo (acceso global a métricas y reportes ejecutivos)
    75, // ot:despachar (programar fechas, priorizar y despachar órdenes a cuadrillas)
    87, // ot:configurar (administrar tipos de trabajo, departamentos, prioridades y SLAs)
  ]);

  /**
   * Extrae de forma segura el nombre del rol como string, sin importar si
   * viene como string primitivo o como objeto (ej. { id: 1, name: 'ADMINISTRADOR' }).
   */
  protected static extractRoleName(rawRole: unknown): string | null {
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
   * Determina si el usuario posee privilegios administrativos, de despacho o de supervisión general.
   */
  static isAdmin(user?: UserParams | null): boolean {
    if (!user) {
      return false;
    }

    // Si tiene asignado algún permiso de administración/despacho/ejecutivo global
    if (Array.isArray(user.permissions)) {
      if (user.permissions.some((p) => this.GLOBAL_PERMISSION_IDS.has(p))) {
        return true;
      }
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
        normalized.includes('supervisor') ||
        normalized.includes('director') ||
        normalized.includes('gerente')
      );
    });
  }

  /**
   * Resuelve el ID del usuario a usar en el filtrado de consultas:
   * - Si es admin/despachador: retorna null (acceso global a todos los registros sin filtro).
   * - Si es usuario estándar (técnico/empleado): retorna user.id (filtro estricto a sus órdenes asignadas).
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
