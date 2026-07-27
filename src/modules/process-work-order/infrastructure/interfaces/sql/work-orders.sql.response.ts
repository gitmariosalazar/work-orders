export interface TrabajadorAsignadoSqlResult {
  id_asignacion: string; // UUID
  id_trabajador: string; // UUID
  nombre_trabajador: string;
  rol: string | null;
  es_responsable: boolean;
  fecha_asignacion: string; // ISO Timestamp
}

export interface MaterialUtilizadoSqlResult {
  id_detalle: string; // UUID
  id_material: string; // UUID
  codigo_material: string;
  nombre_material: string | null; // ALTER TABLE agregado
  descripcion: string | null; // ALTER TABLE agregado
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
}

export interface AdjuntoEvidenciaSqlResult {
  id_adjunto: string; // UUID
  nombre_archivo: string;
  url: string;
  tipo_adjunto: string;
  mime_type: string;
  fecha_carga: string; // ISO Timestamp
}

export interface ObservacionBitacoraSqlResult {
  id_observacion: string; // UUID
  texto: string;
  fecha: string; // ISO Timestamp
  autor_id: string; // UUID
}

export interface CostoAdicionalSqlResult {
  id_costo: string; // UUID
  concepto: string;
  cantidad: number;
  costo_unitario: number;
  total: number;
  codigo: string | null; // ALTER TABLE agregado
  nombre: string | null; // ALTER TABLE agregado
}

export interface HitoHistorialTimelineSqlResult {
  estado: string;
  estadoLabel: string;
  estadoAnterior: string | null;
  fecha: string; // ISO Timestamp
  comentario: string | null;
  usuario_id?: string; // Incluido en la Query 2
}

export interface FotoEvidenciaClienteSqlResult {
  nombre: string;
  url: string;
  tipo: string;
  fecha_carga: string; // ISO Timestamp
}

export interface OrdenTrabajoDetalleSqlResult {
  // ── Identificación ──
  id_orden_trabajo: string; // UUID
  codigo_orden: string;
  numero_secuencial: number;
  version: number;
  estado: string;
  estado_label: string;
  origen: string;
  origen_label: string;
  codigo_entidad_origen: string | null; // Código de la entidad origen (ej: "SOLICITUD-12345")
  id_entidad_origen: string | null;

  // ── Clasificación ──
  tipo_trabajo: string;
  tipo_trabajo_descripcion: string | null;
  departamento: string;
  prioridad: string;
  sla_horas: number;

  // ── Ubicación (PostGIS / Catastral) ──
  direccion: string | null;
  ubicacion_detalles: string | null;
  clave_catastral: string | null;
  coordenadas_punto: string | null; // WKT ej: "POINT(-78.12 0.34)"
  coordenadas_trazado: string | null; // WKT ej: "LINESTRING(...)"
  coordenadas_area: string | null; // WKT ej: "POLYGON(...)"
  latitud: number | null;
  longitud: number | null;

  // ── Descripción y Metadata ──
  descripcion: string | null;
  metadata: Record<string, any> | null; // Campo JSONB nativo

  // ── Métricas de Tiempo ──
  fecha_creacion: string; // ISO Timestamp
  fecha_asignacion: string | null;
  fecha_inicio_campo: string | null;
  fecha_completada: string | null;
  created_at: string; // ISO Timestamp — NOT NULL en el schema
  updated_at: string; // ISO Timestamp — NOT NULL en el schema (fn_update_timestamp)
  dias_en_proceso: number;
  horas_totales_proceso: number;
  horas_hasta_asignacion: number | null;
  horas_ejecucion_campo: number | null;

  // ── SLA ──
  escala_supervisor: boolean;
  motivo_escalamiento: string | null;
  cumple_sla: boolean;
  horas_restantes_sla: number;

  // ── Asignación Operativa ──
  tipo_asignacion: 'INDIVIDUAL' | 'SIN_ASIGNAR';
  inspector_username: string | null;
  inspector_nombre: string | null;
  id_usuario_asignacion: string | null;
  nombre_asignador: string | null;
  id_usuario_completacion: string | null;
  nombre_completador: string | null;
  id_usuario_creador: string;
  creador_username: string;
  creador_nombre: string;

  // ── Cliente Vinculado ──
  id_cliente: string | null;

  // ── Bloques Agregados (Arreglos JSONB garantizados por COALESCE) ──
  personal_asignado: TrabajadorAsignadoSqlResult[];
  materiales: MaterialUtilizadoSqlResult[];
  adjuntos: AdjuntoEvidenciaSqlResult[];
  observaciones: ObservacionBitacoraSqlResult[];
  costos_adicionales: CostoAdicionalSqlResult[];

  // ── Resumen de Costos Numéricos ──
  costo_total_materiales: number;
  costo_total_adicionales: number;
  costo_total_orden: number;

  // ── Checklist / Inspección de Preparación ──
  id_inspeccion: string | null; // UUID
  checklist_aprobado: boolean | null;
  observaciones_checklist: string | null;

  // ── Control de Calidad ──
  id_control: string | null; // UUID
  calidad_aprobada: boolean | null;
  comentarios_calidad: string | null;

  // ── Encuesta de Satisfacción ──
  id_encuesta: string | null; // UUID
  calificacion_satisfaccion: number | null;
  comentarios_satisfaccion: string | null;

  // ── Corte de Servicio Vinculado ──
  id_corte: string | null; // UUID
  tipo_corte: string | null;
  sector_afectado: string | null;
  corte_fecha_inicio: string | null;
  corte_fecha_fin_estimada: string | null;
  corte_fecha_restablecido: string | null;
  corte_notificado: boolean | null;

  // ── Orden Padre (Jerarquía) ──
  id_orden_padre: string | null; // UUID
  codigo_orden_padre: string | null;
}

export interface OrdenTrabajoTrackingSqlResult {
  // ── Identificación ──
  id_orden_trabajo: string; // UUID
  codigo_orden: string;
  numero_secuencial: number;
  origen: string;
  id_entidad_origen: string | null; // UUID o ID del trámite origen

  // ── Clasificación ──
  tipo_trabajo: string;
  departamento: string;
  prioridad: string;
  sla_horas: number;

  // ── Ubicación ──
  direccion: string | null;
  clave_catastral: string | null;

  // ── Fechas Formateadas y Hitos ──
  fecha_creacion_es: string; // Ej: "06 de junio, 2026"
  estado_codigo: string;
  estado_actual_label: string;

  // ── SLA e Indicadores de Proceso ──
  escala_supervisor: boolean;
  motivo_escalamiento: string | null;
  dias_en_proceso: number;
  horas_totales_proceso: number;
  horas_restantes_sla: number;
  sla_vencido: boolean;

  // ── Hitos de Tiempo Crudos ──
  fecha_creacion: string; // ISO Timestamp
  fecha_asignacion: string | null;
  fecha_inicio_campo: string | null;
  fecha_completada: string | null;
  created_at: string; // ISO Timestamp — NOT NULL en el schema
  updated_at: string; // ISO Timestamp — NOT NULL en el schema (fn_update_timestamp)

  // ── Último Movimiento (Campos Escalares del Historial) ──
  ultimo_movimiento: string | null; // ISO Timestamp
  ultimo_comentario: string | null;
  ultimo_estado_codigo: string | null;

  // ── Métricas y Conteos Computados ──
  adjuntos_total: number;
  materiales_total: number;
  costo_total_materiales: number;
  costo_total_adicionales: number;
  observaciones_total: number;
  rechazos_calidad: number;
  rechazos_checklist: number;

  // ── Asignación ──
  tipo_asignacion: 'INDIVIDUAL' | 'SIN_ASIGNAR';
  asignado_username: string | null;
  asignado_nombre: string | null;

  // ── Calificación ──
  calificacion_satisfaccion: number | null;

  // ── Cliente ──
  id_cliente: string | null;

  // ── Timeline Completo (Historial Completo de Cambios de Estado) ──
  historial: HitoHistorialTimelineSqlResult[] | null;
}

export interface OrdenTrabajoVistaClienteSqlResult {
  // ── Identificación de la OT ──
  id_orden_trabajo: string; // UUID — de orden_trabajo
  tipo_orden: string; // De solicitud_orden_trabajo: 'INSPECCION' | 'INSTALACION'
  codigo_orden: string; // Ej: OT-2026-0000001
  numero_secuencial: number;

  // ── Detalles y Descripciones ──
  tipo_trabajo: string; // De cat trabajo.nombre
  departamento_ejecutor: string;
  descripcion: string; // COALESCE(ot.descripcion, ot.metadata->>'descripcion', '')

  // ── Estado y Progreso en UI ──
  estado_codigo: string; // Código interno del estado (NOTIFICADA, EN_PROCESO, etc.)
  estado_label: string; // Nombre legible del estado
  estado_descripcion: string | null;
  progreso_pct: number; // 0–100 para barra de progreso. -1 = CANCELADA

  // ── SLA y Gestión de Tiempos ──
  prioridad: string;
  sla_horas: number;
  cumple_sla: boolean;
  fecha_creacion: string; // ISO Timestamp
  fecha_asignacion: string | null;
  fecha_inicio_campo: string | null;
  fecha_completada: string | null;
  dias_en_proceso: number;
  fecha_creacion_es: string; // Ej: "06 de junio, 2026"

  // ── Ubicación Geográfica ──
  direccion_trabajo: string | null;
  ubicacion_detalles: string | null;
  latitud: number | null; // ST_Y(geom_punto)
  longitud: number | null; // ST_X(geom_punto)

  // ── Datos del Ejecutor Técnico ──
  tipo_asignacion: 'TECNICO_INDIVIDUAL' | 'PENDIENTE_ASIGNACION';
  tecnico_username: string | null;
  tecnico_nombre: string | null;

  // ── Última Actualización del Portal ──
  ultima_actualizacion: string | null; // ISO Timestamp del último historial
  ultimo_comentario_tecnico: string | null; // descripcion_cambio del último historial

  // ── Evidencias de Campo ──
  total_fotos_evidencia: number;
  fotos_evidencia: FotoEvidenciaClienteSqlResult[]; // COALESCE → nunca null, puede ser []

  // ── Validaciones y Filtros Internos de Calidad / Seguridad ──
  checklist_aprobado: boolean | null; // inspeccion_preparacion.pasa_revision
  trabajo_aprobado_calidad: boolean | null; // control_calidad.trabajo_aprobado
  comentarios_calidad: string | null; // control_calidad.comentarios

  // ── Feedback (Satisfacción del Usuario) ──
  calificacion_satisfaccion: number | null; // 1–5
  comentarios_encuesta: string | null;
  encuesta_completada: boolean; // TRUE si existe registro en encuesta_satisfaccion

  // ── Afectaciones Vinculadas (Corte de Agua) ──
  tipo_corte: string | null; // 'PROGRAMADO' | 'EMERGENCIA'
  sector_afectado: string | null;
  corte_inicio: string | null; // ISO Timestamp
  corte_fin_estimado: string | null; // ISO Timestamp
  fecha_restablecido: string | null; // ISO Timestamp
  corte_notificado: boolean | null;

  // ── Cliente Vinculado ──
  id_cliente: string | null; // ot.id_cliente (faltaba en versión anterior)

  // ── Stepper / Timeline Completo para el Portal del Cliente ──
  historial_estados: HitoHistorialTimelineSqlResult[] | null; // null si aún no hay historial
}

/** Resultado de la query de listado de Órdenes de Trabajo */
export interface WorkOrderListItemSqlResult {
  /** UUID de la orden */
  work_order_id: string;
  /** Código legible, ej: "OT-2026-0000001" */
  order_code: string;
  /** Origen de la OT */
  origin: string;
  /** FK al tipo de trabajo */
  work_type_id: number;
  /** Nombre del tipo de trabajo (join con tipo_trabajo) */
  work_type_name: string;
  /** FK a la prioridad */
  priority_id: number;
  /** Cédula / RUC del cliente */
  client_id: string;
  /** Nombre completo (persona natural) o razón social (empresa) */
  client_name: string;
  /** Tipo de persona derivado del join */
  person_type: string;
  /** Estado del ciclo de vida */
  status: string;

  creation_date: string; // ISO 8601
  assignation_date: string | null;
  completion_date: string | null;

  description: string | null;
  location: string;
  cadastral_key: string | null;
  /** WKT, ej: "POINT(-78.484 -0.179)" */
  coordinates: string | null;

  created_user_id: string;
  assigned_user_id: string | null;
  completed_user_id: string | null;

  /** JSON serializado como TEXT en la BD */
  metadata: string | null;
  is_deleted: boolean;
}
