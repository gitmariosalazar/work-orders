/* Consultas de dashboards. Cada consulta se envuelve para devolver un JSON con tipos numéricos nativos. */
export const wrapAsJsonArray = (sql: string): string =>
  `SELECT COALESCE(json_agg(row_to_json(q)), '[]'::json) AS data FROM (
${sql}
) q`;

export const wrapAsJsonObject = (sql: string): string =>
  `SELECT row_to_json(q) AS data FROM (
${sql}
) q LIMIT 1`;

export const DASHBOARD_QUERIES = {
  funnelSummary: `
WITH base_reportes_ot AS (
    SELECT
        im.incidente_id,
        im.codigo_incidente,
        im.estado AS estado_incidente,
        im.origen_reporte,
        im.prioridad AS prioridad_incidente,
        im.fecha_reporte,
        im.fecha_resolucion,
        ot.id_orden_trabajo,
        ot.codigo_orden,
        ot.estado AS estado_ot,
        ot.usuario_asignado,
        ot.fecha_creacion AS fecha_creacion_ot,
        ot.fecha_asignacion AS fecha_asignacion_ot,
        ot.fecha_inicio_campo AS fecha_inicio_campo_ot,
        ot.fecha_completada AS fecha_completada_ot,
        CASE WHEN ot.id_orden_trabajo IS NOT NULL THEN 1 ELSE 0 END AS tiene_ot,
        CASE
            WHEN ot.id_orden_trabajo IS NULL AND im.estado NOT IN ('RESUELTO', 'FALSO_REPORTE') THEN 'EN_TRIAJE_SIN_OT'
            WHEN ot.id_orden_trabajo IS NULL AND im.estado = 'RESUELTO' THEN 'RESUELTO_DIRECTO_SIN_OT'
            WHEN ot.id_orden_trabajo IS NULL AND im.estado = 'FALSO_REPORTE' THEN 'FALSO_REPORTE_DESCARTADO'
            WHEN ot.estado IN ('NOTIFICADA', 'PENDIENTE') AND ot.usuario_asignado IS NULL THEN 'OT_PENDIENTE_ASIGNACION'
            WHEN ot.estado IN ('ASIGNADA', 'REASIGNADA') OR (ot.usuario_asignado IS NOT NULL AND ot.fecha_inicio_campo IS NULL AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA', 'EN_ESPERA')) THEN 'OT_ASIGNADA_A_TECNICO'
            WHEN ot.estado IN ('EN_PROGRESO', 'REANUDADA') OR (ot.fecha_inicio_campo IS NOT NULL AND ot.fecha_completada IS NULL AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA', 'EN_ESPERA')) THEN 'OT_EN_PROCESO_CAMPO'
            WHEN ot.estado = 'EN_ESPERA' THEN 'OT_EN_ESPERA_PAUSADA'
            WHEN ot.estado = 'COMPLETADA' OR im.estado = 'RESUELTO' THEN 'COMPLETADA_RESUELTA'
            WHEN ot.estado = 'CANCELADA' THEN 'OT_CANCELADA'
            ELSE 'OT_OTRO_ESTADO'
        END AS etapa_embudo
    FROM public.incidente_medidor im
    LEFT JOIN work_orders.orden_trabajo ot
        ON (
            im.codigo_orden_trabajo = ot.codigo_orden
            OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
        )
        AND ot.is_deleted = FALSE
    WHERE im.is_deleted = FALSE
)
SELECT
    COUNT(*) AS total_reportes_ingresados,
    COUNT(*) FILTER (WHERE tiene_ot = 0 AND estado_incidente NOT IN ('RESUELTO', 'FALSO_REPORTE')) AS reportes_en_triaje_sin_ot,
    COUNT(*) FILTER (WHERE tiene_ot = 1) AS reportes_con_orden_trabajo,
    ROUND(100.0 * COUNT(*) FILTER (WHERE tiene_ot = 1) / NULLIF(COUNT(*), 0), 2) AS pct_tasa_conversion_a_ot,
    COUNT(*) FILTER (WHERE etapa_embudo = 'OT_PENDIENTE_ASIGNACION') AS ot_pendientes_asignar,
    COUNT(*) FILTER (WHERE etapa_embudo = 'OT_ASIGNADA_A_TECNICO') AS ot_asignadas_a_cuadrilla,
    COUNT(*) FILTER (WHERE etapa_embudo = 'OT_EN_PROCESO_CAMPO') AS ot_en_proceso_ejecucion,
    COUNT(*) FILTER (WHERE etapa_embudo = 'OT_EN_ESPERA_PAUSADA') AS ot_en_espera_pausadas,
    COUNT(*) FILTER (WHERE etapa_embudo = 'COMPLETADA_RESUELTA') AS ot_completadas_resueltas,
    COUNT(*) FILTER (WHERE etapa_embudo = 'OT_CANCELADA' OR estado_incidente = 'FALSO_REPORTE') AS ot_canceladas_o_falsos_reportes,
    COUNT(*) FILTER (WHERE etapa_embudo IN ('EN_TRIAJE_SIN_OT', 'OT_PENDIENTE_ASIGNACION', 'OT_ASIGNADA_A_TECNICO', 'OT_EN_PROCESO_CAMPO', 'OT_EN_ESPERA_PAUSADA')) AS total_carga_activa_pendiente,
    ROUND(100.0 * COUNT(*) FILTER (WHERE etapa_embudo = 'COMPLETADA_RESUELTA') / NULLIF(COUNT(*), 0), 2) AS pct_tasa_resolucion_global,
    ROUND(AVG(EXTRACT(EPOCH FROM (fecha_creacion_ot - fecha_reporte)) / 3600.0) FILTER (WHERE fecha_creacion_ot IS NOT NULL)::numeric, 2) AS horas_promedio_triaje_a_creacion_ot,
    ROUND(AVG(EXTRACT(EPOCH FROM (fecha_asignacion_ot - fecha_creacion_ot)) / 3600.0) FILTER (WHERE fecha_asignacion_ot IS NOT NULL)::numeric, 2) AS horas_promedio_asignacion_tecnico,
    ROUND(AVG(EXTRACT(EPOCH FROM (fecha_completada_ot - fecha_inicio_campo_ot)) / 3600.0) FILTER (WHERE fecha_completada_ot IS NOT NULL AND fecha_inicio_campo_ot IS NOT NULL)::numeric, 2) AS horas_promedio_ejecucion_campo,
    ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(fecha_resolucion, fecha_completada_ot) - fecha_reporte)) / 3600.0) FILTER (WHERE fecha_resolucion IS NOT NULL OR fecha_completada_ot IS NOT NULL)::numeric, 2) AS horas_promedio_ciclo_completo_resolucion
FROM base_reportes_ot
`,
  stateMatrix: `
SELECT
    im.estado AS estado_incidente,
    COALESCE(ot.estado, 'SIN_ORDEN_TRABAJO') AS estado_orden_trabajo,
    COALESCE(ceo.nombre, 'Sin Orden Generada') AS nombre_estado_ot,
    COUNT(*) AS cantidad_reportes,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS porcentaje_del_total_reportes,
    ROUND(AVG(EXTRACT(EPOCH FROM (NOW() - im.fecha_reporte)) / 86400.0)::numeric, 1) AS dias_promedio_abierto,
    COUNT(*) FILTER (WHERE im.prioridad = 'CRITICA') AS criticos_en_esta_etapa,
    CASE
        WHEN ot.estado IS NULL AND im.estado = 'REPORTADO' THEN 'En Bandeja de Entrada: Requiere asignar o inspeccionar'
        WHEN ot.estado IS NULL AND im.estado = 'RESUELTO' THEN 'Cerrado administrativamente sin requerir cuadrilla'
        WHEN ot.estado = 'COMPLETADA' AND im.estado != 'RESUELTO' THEN 'ALERTA: OT Completada pero Reporte aún no cerrado'
        WHEN ot.estado = 'CANCELADA' AND im.estado NOT IN ('RESUELTO', 'FALSO_REPORTE') THEN 'ALERTA: OT Cancelada pero Reporte sigue pendiente'
        WHEN ot.estado IN ('EN_PROGRESO', 'REANUDADA') THEN 'En curso en territorio'
        WHEN ot.estado = 'ASIGNADA' THEN 'Cuadrilla designada pendiente de iniciar campo'
        ELSE 'Normal'
    END AS diagnostico_operativo
FROM public.incidente_medidor im
LEFT JOIN work_orders.orden_trabajo ot
    ON (
        im.codigo_orden_trabajo = ot.codigo_orden
        OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
    )
    AND ot.is_deleted = FALSE
LEFT JOIN work_orders.cat_estado_orden ceo ON ot.estado = ceo.codigo
WHERE im.is_deleted = FALSE
GROUP BY im.estado, ot.estado, ceo.nombre
ORDER BY 
    CASE im.estado
        WHEN 'REPORTADO' THEN 1
        WHEN 'EN_INSPECCION' THEN 2
        WHEN 'RESUELTO' THEN 3
        WHEN 'FALSO_REPORTE' THEN 4
        ELSE 5
    END,
    cantidad_reportes DESC
`,
  originChannel: `
SELECT
    im.origen_reporte AS canal_origen,
    COUNT(*) AS total_reportes,
    COUNT(ot.id_orden_trabajo) AS con_orden_trabajo,
    ROUND(100.0 * COUNT(ot.id_orden_trabajo) / NULLIF(COUNT(*), 0), 2) AS tasa_conversion_ot_pct,
    COUNT(*) FILTER (WHERE ot.usuario_asignado IS NOT NULL) AS asignados_a_tecnico,
    COUNT(*) FILTER (WHERE ot.estado IN ('EN_PROGRESO', 'REANUDADA')) AS en_proceso_campo,
    COUNT(*) FILTER (WHERE im.estado = 'RESUELTO' OR ot.estado = 'COMPLETADA') AS total_resueltos,
    ROUND(100.0 * COUNT(*) FILTER (WHERE im.estado = 'RESUELTO' OR ot.estado = 'COMPLETADA') / NULLIF(COUNT(*), 0), 2) AS tasa_exito_resolucion_pct,
    COUNT(*) FILTER (WHERE im.estado = 'FALSO_REPORTE' OR ot.estado = 'CANCELADA') AS descartados_falsos,
    ROUND(100.0 * COUNT(*) FILTER (WHERE im.estado = 'FALSO_REPORTE' OR ot.estado = 'CANCELADA') / NULLIF(COUNT(*), 0), 2) AS tasa_descarte_pct,
    ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(im.fecha_resolucion, ot.fecha_completada) - im.fecha_reporte)) / 3600.0)
          FILTER (WHERE im.fecha_resolucion IS NOT NULL OR ot.fecha_completada IS NOT NULL)::numeric, 1) AS horas_promedio_resolucion
FROM public.incidente_medidor im
LEFT JOIN work_orders.orden_trabajo ot
    ON (
        im.codigo_orden_trabajo = ot.codigo_orden
        OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
    )
    AND ot.is_deleted = FALSE
WHERE im.is_deleted = FALSE
GROUP BY im.origen_reporte
ORDER BY total_reportes DESC
`,
  categoryDepartment: `
SELECT
    c.nombre AS categoria_problema,
    t.nombre AS tipo_problema,
    t.prioridad_sugerida,
    COALESCE(dt.nombre, 'Pendiente Asignación Departamento') AS departamento_responsable,
    COUNT(im.incidente_id) AS total_incidentes,
    COUNT(ot.id_orden_trabajo) AS total_ots_creadas,
    COUNT(*) FILTER (WHERE ot.usuario_asignado IS NOT NULL AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA')) AS ots_asignadas_activas,
    COUNT(*) FILTER (WHERE ot.estado IN ('EN_PROGRESO', 'REANUDADA')) AS ots_en_proceso_campo,
    COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' OR im.estado = 'RESUELTO') AS total_completados,
    ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' OR im.estado = 'RESUELTO') / NULLIF(COUNT(im.incidente_id), 0), 2) AS pct_cumplimiento,
    COALESCE(SUM(im.costo_reparacion), 0.00) AS costo_reparacion_acumulado,
    ROUND(AVG(EXTRACT(EPOCH FROM (COALESCE(im.fecha_resolucion, ot.fecha_completada, NOW()) - im.fecha_reporte)) / 86400.0)::numeric, 1) AS dias_promedio_atencion
FROM public.incidente_medidor im
JOIN public.tipo_incidente_medidor t ON im.tipo_incidente_id = t.tipo_incidente_id
JOIN public.categoria_incidente_medidor c ON t.categoria_incidente_id = c.categoria_incidente_id
LEFT JOIN work_orders.orden_trabajo ot
    ON (
        im.codigo_orden_trabajo = ot.codigo_orden
        OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
    )
    AND ot.is_deleted = FALSE
LEFT JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
LEFT JOIN work_orders.departamento_trabajo dt ON tt.id_departamento = dt.id_departamento
WHERE im.is_deleted = FALSE
GROUP BY c.nombre, t.nombre, t.prioridad_sugerida, dt.nombre
ORDER BY total_incidentes DESC
`,
  syncDiscrepancies: `
SELECT
    im.codigo_incidente,
    ot.codigo_orden,
    im.estado AS estado_incidente,
    ot.estado AS estado_ot,
    im.fecha_reporte,
    ot.fecha_completada AS fecha_completada_ot,
    ot.fecha_asignacion AS fecha_asignacion_ot,
    CASE
        WHEN ot.estado = 'COMPLETADA' AND im.estado != 'RESUELTO'
            THEN 'DESFASE: OT finalizada en campo pero incidente sigue abierto'
        WHEN ot.id_orden_trabajo IS NOT NULL AND im.estado = 'REPORTADO' AND ot.estado IN ('ASIGNADA', 'EN_PROGRESO')
            THEN 'DESFASE: OT en ejecución pero incidente no pasó a EN_INSPECCION'
        WHEN ot.estado = 'CANCELADA' AND im.estado = 'EN_INSPECCION'
            THEN 'DESFASE: OT cancelada sin reasignar ni cerrar el incidente'
        WHEN im.estado = 'RESUELTO' AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA')
            THEN 'DESFASE: Incidente cerrado administrativamente con OT aún activa'
        ELSE 'CONSISTENTE'
    END AS tipo_desfase,
    COALESCE(emp.nombres || ' ' || emp.apellidos, u.username, 'Sin Asignar') AS tecnico_asignado
FROM public.incidente_medidor im
JOIN work_orders.orden_trabajo ot
    ON (
        im.codigo_orden_trabajo = ot.codigo_orden
        OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
    )
    AND ot.is_deleted = FALSE
LEFT JOIN public.usuarios u ON ot.usuario_asignado = u.usuario_id
LEFT JOIN public.empleados emp ON u.usuario_id = emp.usuario_id
WHERE im.is_deleted = FALSE
  AND (
      (ot.estado = 'COMPLETADA' AND im.estado != 'RESUELTO')
      OR (im.estado = 'REPORTADO' AND ot.estado IN ('ASIGNADA', 'EN_PROGRESO'))
      OR (ot.estado = 'CANCELADA' AND im.estado = 'EN_INSPECCION')
      OR (im.estado = 'RESUELTO' AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA'))
  )
ORDER BY im.fecha_reporte DESC
`,
  dispatchControl: `
SELECT
    im.codigo_incidente,
    im.fecha_reporte,
    im.acometida_id,
    im.direccion_referencia,
    im.origen_reporte,
    im.prioridad AS prioridad_reporte,
    im.estado AS estado_reporte,
    ot.codigo_orden,
    COALESCE(ot.estado, 'SIN_OT') AS estado_ot,
    COALESCE(ceo.nombre, 'Sin Orden') AS nombre_estado_ot,
    tt.nombre AS tipo_trabajo,
    COALESCE(emp.nombres || ' ' || emp.apellidos, u.username, 'Por Asignar') AS tecnico_responsable,
    ot.fecha_asignacion,
    ot.fecha_inicio_campo,
    ot.fecha_completada,
    pot.sla_horas,
    ROUND((EXTRACT(EPOCH FROM (NOW() - im.fecha_reporte)) / 3600.0)::numeric, 1) AS horas_desde_reporte,
    CASE
        WHEN im.estado = 'RESUELTO' OR ot.estado = 'COMPLETADA' THEN 'RESUELTO_VERDE'
        WHEN ot.id_orden_trabajo IS NULL AND (EXTRACT(EPOCH FROM (NOW() - im.fecha_reporte)) / 3600.0) > 24 THEN 'ROJO_SIN_OT_CRITICO'
        WHEN ot.id_orden_trabajo IS NULL THEN 'AMARILLO_PENDIENTE_TRIAJE'
        WHEN ot.fecha_completada IS NULL AND (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0) > COALESCE(pot.sla_horas, 48) THEN 'ROJO_SLA_VENCIDO'
        WHEN ot.fecha_completada IS NULL AND (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0) > (COALESCE(pot.sla_horas, 48) * 0.75) THEN 'AMARILLO_SLA_POR_VENCER'
        ELSE 'VERDE_EN_PLAZO'
    END AS semaforo_sla
FROM public.incidente_medidor im
LEFT JOIN work_orders.orden_trabajo ot
    ON (
        im.codigo_orden_trabajo = ot.codigo_orden
        OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
    )
    AND ot.is_deleted = FALSE
LEFT JOIN work_orders.cat_estado_orden ceo ON ot.estado = ceo.codigo
LEFT JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
LEFT JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
LEFT JOIN public.usuarios u ON ot.usuario_asignado = u.usuario_id
LEFT JOIN public.empleados emp ON u.usuario_id = emp.usuario_id
WHERE im.is_deleted = FALSE
ORDER BY 
    CASE im.prioridad
        WHEN 'CRITICA' THEN 1
        WHEN 'ALTA' THEN 2
        WHEN 'MEDIA' THEN 3
        ELSE 4
    END,
    im.fecha_reporte ASC
LIMIT $1::int
`,
  headerKpis: `
SELECT
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE ot.estado IN ('NOTIFICADA', 'PENDIENTE', 'ASIGNADA', 'REASIGNADA')) AS pending_or_assigned,
    COUNT(*) FILTER (WHERE ot.estado IN ('EN_PROGRESO', 'REANUDADA')) AS in_progress,
    COUNT(*) FILTER (WHERE ot.estado = 'EN_ESPERA') AS on_hold,
    COUNT(*) FILTER (WHERE pot.nivel IN ('Emergencia', 'Urgente')) AS critical_orders,
    COUNT(*) FILTER (WHERE pot.nivel = 'Emergencia') AS emergency,
    COUNT(*) FILTER (WHERE pot.nivel = 'Urgente') AS urgent,
    COUNT(*) FILTER (WHERE pot.nivel = 'Alta') AS high,
    COUNT(*) FILTER (WHERE pot.nivel = 'Media') AS medium,
    COUNT(*) FILTER (WHERE pot.nivel = 'Baja') AS low,
    COUNT(*) FILTER (WHERE ot.fecha_creacion >= CURRENT_DATE) AS created_today,
    COUNT(*) FILTER (WHERE ot.fecha_creacion >= CURRENT_DATE - INTERVAL '7 days') AS created_last_7_days,
    COUNT(*) FILTER (WHERE ot.fecha_creacion >= DATE_TRUNC('month', CURRENT_DATE)) AS created_this_month,
    COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') AS completed,
    COUNT(*) FILTER (WHERE ot.estado IN ('COMPLETADA', 'CANCELADA')) AS closed,
    ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') / NULLIF(COUNT(*), 0), 2) AS completion_rate,
    COALESCE(SUM(mat.costo_total_materiales), 0.00) AS total_material_cost,
    ROUND(AVG(EXTRACT(EPOCH FROM (ot.fecha_completada - ot.fecha_creacion)) / 3600.0) FILTER (WHERE ot.fecha_completada IS NOT NULL)::numeric, 2) AS avg_hours_to_complete,
    ROUND(AVG(EXTRACT(EPOCH FROM (ot.fecha_asignacion - ot.fecha_creacion)) / 3600.0) FILTER (WHERE ot.fecha_asignacion IS NOT NULL)::numeric, 2) AS avg_hours_to_assignment
FROM work_orders.orden_trabajo ot
JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
LEFT JOIN (
    SELECT id_orden_trabajo, SUM(subtotal) AS costo_total_materiales
    FROM work_orders.detalle_orden_trabajo_material
    WHERE is_deleted = FALSE
    GROUP BY id_orden_trabajo
) mat ON ot.id_orden_trabajo = mat.id_orden_trabajo
WHERE ot.is_deleted = FALSE
`,
  statusDistribution: `
SELECT
    ceo.nombre AS status_name,
    ot.estado AS status_id,
    ceo.descripcion AS status_description,
    COUNT(*) AS quantity,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS percentage_of_total,
    CASE ot.estado
        WHEN 'NOTIFICADA'   THEN '#9E9E9E' -- Gris
        WHEN 'PENDIENTE'    THEN '#FF9800' -- Naranja
        WHEN 'ASIGNADA'     THEN '#2196F3' -- Azul
        WHEN 'REASIGNADA'   THEN '#3F51B5' -- Índigo
        WHEN 'EN_PROGRESO'  THEN '#00BCD4' -- Cian
        WHEN 'EN_ESPERA'    THEN '#FFC107' -- Ámbar
        WHEN 'REANUDADA'    THEN '#009688' -- Verde azulado
        WHEN 'COMPLETADA'   THEN '#4CAF50' -- Verde
        WHEN 'CANCELADA'    THEN '#F44336' -- Rojo
        ELSE '#607D8B'
    END AS color_hex
FROM work_orders.orden_trabajo ot
JOIN work_orders.cat_estado_orden ceo ON ot.estado = ceo.codigo
WHERE ot.is_deleted = FALSE
GROUP BY ceo.codigo, ceo.nombre, ot.estado, ceo.descripcion
ORDER BY quantity DESC
`,
  priorityDistribution: `
SELECT
    pot.nivel AS priority_level,
    pot.id_prioridad AS priority_id,
    pot.descripcion AS description,
    pot.sla_horas,
    COUNT(*) AS quantity,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS percentage_of_total,
    COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' AND ot.fecha_completada <= (ot.fecha_creacion + (pot.sla_horas || ' hours')::interval)) AS cumplieron_sla,
    ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' AND ot.fecha_completada <= (ot.fecha_creacion + (pot.sla_horas || ' hours')::interval)) / 
          NULLIF(COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA'), 0), 2) AS tasa_cumplimiento_sla_pct,
    CASE pot.nivel
        WHEN 'Emergencia' THEN '#D32F2F' -- Rojo fuerte
        WHEN 'Urgente'    THEN '#F57C00' -- Naranja oscuro
        WHEN 'Alta'       THEN '#FBC02D' -- Amarillo ámbar
        WHEN 'Media'      THEN '#1976D2' -- Azul
        WHEN 'Baja'       THEN '#388E3C' -- Verde
        ELSE '#757575'
    END AS color_hex
FROM work_orders.orden_trabajo ot
JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
WHERE ot.is_deleted = FALSE
GROUP BY pot.nivel, pot.id_prioridad, pot.descripcion, pot.sla_horas
ORDER BY
    CASE pot.nivel
        WHEN 'Emergencia' THEN 1
        WHEN 'Urgente'    THEN 2
        WHEN 'Alta'       THEN 3
        WHEN 'Media'      THEN 4
        WHEN 'Baja'       THEN 5
        ELSE 6
    END
`,
  workTypePerformance: `
SELECT
    tt.nombre AS work_type,
    tt.id_tipo_trabajo AS work_type_id,
    dt.nombre AS department_name,
    COUNT(*) AS quantity,
    COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') AS completed,
    COUNT(*) FILTER (WHERE ot.estado IN ('EN_PROGRESO', 'REANUDADA')) AS in_progress,
    COUNT(*) FILTER (WHERE ot.estado IN ('NOTIFICADA', 'PENDIENTE', 'ASIGNADA')) AS pending,
    ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') / NULLIF(COUNT(*), 0), 2) AS completion_rate_percentage,
    ROUND(AVG(EXTRACT(EPOCH FROM (ot.fecha_completada - ot.fecha_creacion)) / 3600.0) FILTER (WHERE ot.fecha_completada IS NOT NULL)::numeric, 1) AS avg_hours_to_complete
FROM work_orders.orden_trabajo ot
JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
JOIN work_orders.departamento_trabajo dt ON tt.id_departamento = dt.id_departamento
WHERE ot.is_deleted = FALSE
GROUP BY tt.nombre, tt.id_tipo_trabajo, dt.nombre
ORDER BY quantity DESC
`,
  keyStatisticsMatrix: `
SELECT
    COUNT(*) AS total_orders,
    eot.codigo AS status_id,
    eot.nombre AS status_name,
    ot.id_tipo_trabajo AS work_type_id,
    tt.nombre AS work_type,
    dt.id_departamento AS department_id,
    dt.nombre AS department_name,
    COUNT(*) FILTER (WHERE pot.nivel = 'Emergencia') AS emergency,
    COUNT(*) FILTER (WHERE pot.nivel = 'Urgente') AS urgent,
    COUNT(*) FILTER (WHERE pot.nivel = 'Alta') AS high,
    COUNT(*) FILTER (WHERE pot.nivel = 'Media') AS medium,
    COUNT(*) FILTER (WHERE pot.nivel = 'Baja') AS low,
    COUNT(*) FILTER (WHERE pot.nivel IN ('Emergencia', 'Urgente')) AS critical_orders,
    COUNT(*) FILTER (WHERE ot.fecha_creacion >= CURRENT_DATE) AS created_today,
    COUNT(*) FILTER (WHERE ot.fecha_creacion >= CURRENT_DATE - INTERVAL '7 days') AS created_last_7_days,
    COUNT(*) FILTER (WHERE ot.fecha_creacion >= DATE_TRUNC('month', CURRENT_DATE)) AS created_this_month,
    COUNT(*) FILTER (WHERE eot.codigo IN ('COMPLETADA', 'CANCELADA')) AS closed,
    COUNT(*) FILTER (WHERE eot.codigo = 'COMPLETADA') AS completed,
    ROUND(AVG(EXTRACT(EPOCH FROM (ot.fecha_completada - ot.fecha_creacion)) / 3600.0) FILTER (WHERE ot.fecha_completada IS NOT NULL)::numeric, 2) AS avg_hours_to_complete,
    ROUND(AVG(EXTRACT(EPOCH FROM (ot.fecha_asignacion - ot.fecha_creacion)) / 3600.0) FILTER (WHERE ot.fecha_asignacion IS NOT NULL)::numeric, 2) AS avg_hours_to_assignment,
    ROUND((100.0 * COUNT(*) FILTER (WHERE eot.codigo = 'COMPLETADA') / NULLIF(COUNT(*), 0))::numeric, 2) AS pct_completed_in_group,
    ROUND((100.0 * COUNT(*) FILTER (WHERE eot.codigo IN ('NOTIFICADA', 'PENDIENTE', 'ASIGNADA', 'REASIGNADA')) / NULLIF(COUNT(*), 0))::numeric, 2) AS pct_pending_or_assigned,
    COALESCE(SUM(mat.costo_total), 0.00)::numeric(12,2) AS total_material_cost,
    ROUND(AVG(trab.cantidad_trabajadores)::numeric, 1) AS avg_workers_per_order,
    COALESCE(SUM(trab.cantidad_trabajadores), 0) AS total_worker_assignments
FROM work_orders.orden_trabajo ot
JOIN work_orders.cat_estado_orden eot ON eot.codigo = ot.estado
JOIN work_orders.tipo_trabajo tt ON tt.id_tipo_trabajo = ot.id_tipo_trabajo
JOIN work_orders.departamento_trabajo dt ON dt.id_departamento = tt.id_departamento
JOIN work_orders.prioridad_orden_trabajo pot ON pot.id_prioridad = ot.id_prioridad
LEFT JOIN (
    SELECT id_orden_trabajo, SUM(subtotal) AS costo_total
    FROM work_orders.detalle_orden_trabajo_material
    WHERE is_deleted = FALSE
    GROUP BY id_orden_trabajo
) mat ON ot.id_orden_trabajo = mat.id_orden_trabajo
LEFT JOIN (
    SELECT id_orden_trabajo, COUNT(*) AS cantidad_trabajadores
    FROM work_orders.asignacion_trabajador_orden
    WHERE is_deleted = FALSE
    GROUP BY id_orden_trabajo
) trab ON ot.id_orden_trabajo = trab.id_orden_trabajo
WHERE ot.is_deleted = FALSE
GROUP BY eot.codigo, eot.nombre, ot.id_tipo_trabajo, tt.nombre, dt.id_departamento, dt.nombre
ORDER BY dt.nombre, tt.nombre, total_orders DESC
`,
  technicianPerformance: `
SELECT
    u.usuario_id AS id_tecnico,
    COALESCE(emp.nombres || ' ' || emp.apellidos, u.username) AS nombre_tecnico,
    emp.cedula,
    emp.telefono_interno,
    COUNT(ot.id_orden_trabajo) AS total_ordenes_asignadas_historicas,
    COUNT(*) FILTER (WHERE ot.estado IN ('ASIGNADA', 'REASIGNADA')) AS ordenes_por_iniciar,
    COUNT(*) FILTER (WHERE ot.estado IN ('EN_PROGRESO', 'REANUDADA')) AS ordenes_en_ejecucion_hoy,
    COUNT(*) FILTER (WHERE ot.estado = 'EN_ESPERA') AS ordenes_en_pausa,
    COUNT(*) FILTER (WHERE ot.estado NOT IN ('COMPLETADA', 'CANCELADA')) AS total_backlog_activo,
    COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') AS total_completadas,
    COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' AND ot.fecha_completada >= DATE_TRUNC('month', CURRENT_DATE)) AS completadas_este_mes,
    ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' AND ot.fecha_completada <= (ot.fecha_creacion + (pot.sla_horas || ' hours')::interval)) /
          NULLIF(COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA'), 0), 2) AS tasa_cumplimiento_sla_pct,
    ROUND(AVG(EXTRACT(EPOCH FROM (ot.fecha_completada - ot.fecha_inicio_campo)) / 3600.0)
          FILTER (WHERE ot.fecha_completada IS NOT NULL AND ot.fecha_inicio_campo IS NOT NULL)::numeric, 1) AS horas_promedio_en_campo
FROM work_orders.orden_trabajo ot
JOIN public.usuarios u ON ot.usuario_asignado = u.usuario_id
LEFT JOIN public.empleados emp ON u.usuario_id = emp.usuario_id
JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
WHERE ot.is_deleted = FALSE
GROUP BY u.usuario_id, emp.nombres, emp.apellidos, u.username, emp.cedula, emp.telefono_interno
ORDER BY total_backlog_activo DESC, total_completadas DESC
`,
  technicianDailyFeed: `
SELECT
    ot.id_orden_trabajo,
    ot.codigo_orden,
    ot.estado,
    ceo.nombre AS nombre_estado,
    tt.nombre AS tipo_trabajo,
    pot.nivel AS prioridad,
    pot.sla_horas,
    ot.direccion,
    ot.ubicacion_detalles,
    ot.clave_catastral,
    ot.fecha_asignacion,
    ot.fecha_inicio_campo,
    public.ST_Y(ot.geom_punto) AS latitud,
    public.ST_X(ot.geom_punto) AS longitud,
    ROUND((EXTRACT(EPOCH FROM ((ot.fecha_creacion + (pot.sla_horas || ' hours')::interval) - NOW())) / 3600.0)::numeric, 1) AS horas_restantes_sla,
    ROW_NUMBER() OVER (
        ORDER BY 
            CASE pot.nivel
                WHEN 'Emergencia' THEN 1
                WHEN 'Urgente'    THEN 2
                WHEN 'Alta'       THEN 3
                WHEN 'Media'      THEN 4
                ELSE 5
            END,
            ot.fecha_asignacion ASC
    ) = 1 AS es_orden_mas_prioritaria
FROM work_orders.orden_trabajo ot
JOIN work_orders.cat_estado_orden ceo ON ot.estado = ceo.codigo
JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
WHERE ot.is_deleted = FALSE
  AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA')
  AND ($1::text IS NULL OR ot.usuario_asignado::text = $1::text)
ORDER BY 
    CASE pot.nivel
        WHEN 'Emergencia' THEN 1
        WHEN 'Urgente'    THEN 2
        WHEN 'Alta'       THEN 3
        WHEN 'Media'      THEN 4
        ELSE 5
    END,
    ot.fecha_asignacion ASC
`,
  crewAssignments: `
SELECT
    ot.codigo_orden,
    ot.estado AS estado_ot,
    tt.nombre AS tipo_trabajo,
    COALESCE(emp.nombres || ' ' || emp.apellidos, u.username) AS nombre_trabajador,
    emp.cedula,
    rt.nombre AS rol_en_cuadrilla,
    ato.es_responsable,
    ato.fecha_asignacion
FROM work_orders.asignacion_trabajador_orden ato
JOIN work_orders.orden_trabajo ot ON ato.id_orden_trabajo = ot.id_orden_trabajo
JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
JOIN public.usuarios u ON ato.id_trabajador = u.usuario_id
LEFT JOIN public.empleados emp ON u.usuario_id = emp.usuario_id
LEFT JOIN work_orders.rol_trabajador rt ON ato.id_rol = rt.id_rol
WHERE ato.is_deleted = FALSE 
  AND ot.is_deleted = FALSE
  AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA')
ORDER BY ot.codigo_orden, ato.es_responsable DESC, nombre_trabajador ASC
`,
  slaMonitor: `
SELECT
    ot.codigo_orden,
    tt.nombre AS tipo_trabajo,
    dt.nombre AS departamento,
    pot.nivel AS prioridad,
    pot.sla_horas,
    ot.fecha_creacion,
    COALESCE(emp.nombres || ' ' || emp.apellidos, u.username, 'Sin asignar') AS tecnico_asignado,
    ROUND((EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0)::numeric, 1) AS horas_transcurridas,
    ROUND((pot.sla_horas - (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0))::numeric, 1) AS horas_holgura_sla,
    CASE
        WHEN (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0) > pot.sla_horas
            THEN 'VENCIDA (Incumplida)'
        WHEN (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0) >= (pot.sla_horas * 0.75)
            THEN 'EN RIESGO CRÍTICO (>75% del SLA)'
        WHEN (EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0) >= (pot.sla_horas * 0.50)
            THEN 'PRECAUCIÓN (>50% del SLA)'
        ELSE 'A TIEMPO'
    END AS estado_sla_semaforo
FROM work_orders.orden_trabajo ot
JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
JOIN work_orders.departamento_trabajo dt ON tt.id_departamento = dt.id_departamento
JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
LEFT JOIN public.usuarios u ON ot.usuario_asignado = u.usuario_id
LEFT JOIN public.empleados emp ON u.usuario_id = emp.usuario_id
WHERE ot.is_deleted = FALSE
  AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA')
ORDER BY horas_holgura_sla ASC
`,
  qualityIndicators: `
SELECT
    dt.nombre AS departamento,
    tt.nombre AS tipo_trabajo,
    COUNT(DISTINCT ot.id_orden_trabajo) AS total_ordenes_inspeccionadas,
    COUNT(ip.id_inspeccion) AS total_inspecciones_preparacion,
    COUNT(ip.id_inspeccion) FILTER (WHERE ip.pasa_revision = TRUE) AS preinspecciones_aprobadas,
    COUNT(ip.id_inspeccion) FILTER (WHERE ip.pasa_revision = FALSE) AS preinspecciones_rechazadas,
    ROUND(100.0 * COUNT(ip.id_inspeccion) FILTER (WHERE ip.pasa_revision = TRUE) / NULLIF(COUNT(ip.id_inspeccion), 0), 2) AS pct_aprobacion_preinspeccion,
    COUNT(cc.id_control) AS total_controles_calidad,
    COUNT(cc.id_control) FILTER (WHERE cc.trabajo_aprobado = TRUE) AS trabajos_calidad_aprobados,
    COUNT(cc.id_control) FILTER (WHERE cc.trabajo_aprobado = FALSE) AS trabajos_calidad_rechazados_retrabajo,
    ROUND(100.0 * COUNT(cc.id_control) FILTER (WHERE cc.trabajo_aprobado = TRUE) / NULLIF(COUNT(cc.id_control), 0), 2) AS pct_aprobacion_calidad_final
FROM work_orders.orden_trabajo ot
JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
JOIN work_orders.departamento_trabajo dt ON tt.id_departamento = dt.id_departamento
LEFT JOIN work_orders.inspeccion_preparacion ip ON ot.id_orden_trabajo = ip.id_orden_trabajo AND ip.is_deleted = FALSE
LEFT JOIN work_orders.control_calidad cc ON ot.id_orden_trabajo = cc.id_orden_trabajo AND cc.is_deleted = FALSE
WHERE ot.is_deleted = FALSE
GROUP BY dt.nombre, tt.nombre
ORDER BY total_ordenes_inspeccionadas DESC
`,
  escalationAudit: `
SELECT
    ot.codigo_orden,
    tt.nombre AS tipo_trabajo,
    dt.nombre AS departamento,
    ot.estado AS estado_actual,
    ot.fecha_creacion,
    COALESCE(emp.nombres || ' ' || emp.apellidos, u.username) AS tecnico_que_escalo,
    ot.motivo_escalamiento
FROM work_orders.orden_trabajo ot
JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
JOIN work_orders.departamento_trabajo dt ON tt.id_departamento = dt.id_departamento
LEFT JOIN public.usuarios u ON ot.usuario_asignado = u.usuario_id
LEFT JOIN public.empleados emp ON u.usuario_id = emp.usuario_id
WHERE ot.is_deleted = FALSE
  AND ot.escala_supervisor = TRUE
ORDER BY ot.fecha_creacion DESC
`,
  materialCosts: `
SELECT
    dt.nombre AS departamento,
    tt.nombre AS tipo_trabajo,
    dotm.codigo AS codigo_material,
    dotm.nombre AS descripcion_material,
    SUM(dotm.cantidad) AS cantidad_total_consumida,
    ROUND(AVG(dotm.costo_unitario), 2) AS costo_unitario_promedio,
    SUM(dotm.subtotal) AS costo_total_materiales,
    COUNT(DISTINCT ot.id_orden_trabajo) AS ordenes_que_lo_utilizaron
FROM work_orders.detalle_orden_trabajo_material dotm
JOIN work_orders.orden_trabajo ot ON dotm.id_orden_trabajo = ot.id_orden_trabajo
JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
JOIN work_orders.departamento_trabajo dt ON tt.id_departamento = dt.id_departamento
WHERE dotm.is_deleted = FALSE 
  AND ot.is_deleted = FALSE
GROUP BY dt.nombre, tt.nombre, dotm.codigo, dotm.nombre
ORDER BY costo_total_materiales DESC
`,
  economicBalance: `
SELECT
    DATE_TRUNC('month', ot.fecha_creacion)::date AS mes,
    COUNT(DISTINCT ot.id_orden_trabajo) AS total_ordenes,
    COALESCE(SUM(mat.costo_materiales), 0.00) AS costo_total_materiales_epaa,
    COALESCE(SUM(ad.costo_adicionales), 0.00) AS costo_total_adicionales_epaa,
    (COALESCE(SUM(mat.costo_materiales), 0.00) + COALESCE(SUM(ad.costo_adicionales), 0.00)) AS costo_operativo_total_incurrido,
    COALESCE(SUM(im.costo_reparacion) FILTER (WHERE im.cobrar_a_usuario = TRUE), 0.00) AS monto_cobrable_a_usuarios,
    (COALESCE(SUM(im.costo_reparacion) FILTER (WHERE im.cobrar_a_usuario = TRUE), 0.00) -
     (COALESCE(SUM(mat.costo_materiales), 0.00) + COALESCE(SUM(ad.costo_adicionales), 0.00))) AS balance_neto_recuperacion
FROM work_orders.orden_trabajo ot
LEFT JOIN public.incidente_medidor im
    ON (
        ot.codigo_orden = im.codigo_orden_trabajo
        OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
    )
LEFT JOIN (
    SELECT id_orden_trabajo, SUM(subtotal) AS costo_materiales
    FROM work_orders.detalle_orden_trabajo_material
    WHERE is_deleted = FALSE
    GROUP BY id_orden_trabajo
) mat ON ot.id_orden_trabajo = mat.id_orden_trabajo
LEFT JOIN (
    SELECT id_orden_trabajo, SUM(total) AS costo_adicionales
    FROM work_orders.costo_adicional_orden
    WHERE is_deleted = FALSE
    GROUP BY id_orden_trabajo
) ad ON ot.id_orden_trabajo = ad.id_orden_trabajo
WHERE ot.is_deleted = FALSE
GROUP BY DATE_TRUNC('month', ot.fecha_creacion)
ORDER BY mes DESC
`,
  dailyTrend: `
WITH dias AS (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE,
        INTERVAL '1 day'
    )::date AS fecha
),
reportes_diarios AS (
    SELECT DATE_TRUNC('day', fecha_reporte)::date AS fecha, COUNT(*) AS nuevos_incidentes
    FROM public.incidente_medidor
    WHERE is_deleted = FALSE AND fecha_reporte >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', fecha_reporte)
),
ots_creadas AS (
    SELECT DATE_TRUNC('day', fecha_creacion)::date AS fecha, COUNT(*) AS nuevas_ots
    FROM work_orders.orden_trabajo
    WHERE is_deleted = FALSE AND fecha_creacion >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', fecha_creacion)
),
ots_completadas AS (
    SELECT DATE_TRUNC('day', fecha_completada)::date AS fecha, COUNT(*) AS ots_completadas
    FROM work_orders.orden_trabajo
    WHERE is_deleted = FALSE AND fecha_completada >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', fecha_completada)
)
SELECT
    d.fecha,
    COALESCE(rd.nuevos_incidentes, 0) AS incidentes_reportados,
    COALESCE(oc.nuevas_ots, 0) AS ordenes_creadas,
    COALESCE(comp.ots_completadas, 0) AS ordenes_completadas,
    (COALESCE(comp.ots_completadas, 0) - COALESCE(oc.nuevas_ots, 0)) AS balance_flujo_neto
FROM dias d
LEFT JOIN reportes_diarios rd ON d.fecha = rd.fecha
LEFT JOIN ots_creadas oc ON d.fecha = oc.fecha
LEFT JOIN ots_completadas comp ON d.fecha = comp.fecha
ORDER BY d.fecha ASC
`,
  territorialConcentration: `
SELECT
    COALESCE(p.nombre, 'Sin Parroquia Asignada') AS parroquia,
    COALESCE(ac.sector::text, 'Sin Sector') AS sector_hidrometrico,
    COUNT(DISTINCT im.incidente_id) AS total_incidentes_zona,
    COUNT(DISTINCT ot.id_orden_trabajo) AS total_ots_zona,
    COUNT(DISTINCT ot.id_orden_trabajo) FILTER (WHERE ot.estado NOT IN ('COMPLETADA', 'CANCELADA')) AS ots_activas_en_campo,
    COUNT(DISTINCT im.incidente_id) FILTER (WHERE im.prioridad = 'CRITICA') AS incidentes_criticos,
    ROUND(AVG(public.ST_Y(COALESCE(ot.geom_punto, im.coordenadas, ac.coordenadas)))::numeric, 6) AS latitud_centroide,
    ROUND(AVG(public.ST_X(COALESCE(ot.geom_punto, im.coordenadas, ac.coordenadas)))::numeric, 6) AS longitud_centroide
FROM public.incidente_medidor im
LEFT JOIN work_orders.orden_trabajo ot
    ON (
        im.codigo_orden_trabajo = ot.codigo_orden
        OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
    )
    AND ot.is_deleted = FALSE
LEFT JOIN public.acometida ac ON im.acometida_id = ac.acometida_id
LEFT JOIN public.predio pr ON ac.clave_catastral = pr.clave_catastral
LEFT JOIN public.direccion dir ON pr.direccion = dir.calle_principal -- o vinculación geográfica
LEFT JOIN public.parroquia p ON dir.parroquia_id = p.parroquia_id
WHERE im.is_deleted = FALSE
GROUP BY p.nombre, ac.sector
HAVING COUNT(DISTINCT im.incidente_id) > 0 OR COUNT(DISTINCT ot.id_orden_trabajo) > 0
ORDER BY total_incidentes_zona DESC
`,
  executiveOverview: `
SELECT jsonb_build_object(
    'metadata', jsonb_build_object(
        'empresa', 'EPAA - Empresa Pública de Agua Potable y Alcantarillado',
        'sistema', 'SIGEPAA Work Orders & Incidents Analytics',
        'generado_en', NOW()
    ),
    'comparativa_incidentes_vs_ots', (
        SELECT jsonb_build_object(
            'total_reportes', COUNT(*),
            'reportes_sin_ot', COUNT(*) FILTER (WHERE ot.id_orden_trabajo IS NULL AND im.estado NOT IN ('RESUELTO', 'FALSO_REPORTE')),
            'reportes_con_ot', COUNT(*) FILTER (WHERE ot.id_orden_trabajo IS NOT NULL),
            'tasa_conversion_ot_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE ot.id_orden_trabajo IS NOT NULL) / NULLIF(COUNT(*), 0), 2),
            'ot_pendientes_asignacion', COUNT(*) FILTER (WHERE ot.estado IN ('NOTIFICADA', 'PENDIENTE') AND ot.usuario_asignado IS NULL),
            'ot_asignadas_a_cuadrilla', COUNT(*) FILTER (WHERE ot.estado IN ('ASIGNADA', 'REASIGNADA') OR (ot.usuario_asignado IS NOT NULL AND ot.fecha_inicio_campo IS NULL AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA', 'EN_ESPERA'))),
            'ot_en_proceso_campo', COUNT(*) FILTER (WHERE ot.estado IN ('EN_PROGRESO', 'REANUDADA')),
            'ot_en_espera', COUNT(*) FILTER (WHERE ot.estado = 'EN_ESPERA'),
            'ot_completadas_resueltas', COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' OR im.estado = 'RESUELTO'),
            'tasa_resolucion_global_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA' OR im.estado = 'RESUELTO') / NULLIF(COUNT(*), 0), 2)
        )
        FROM public.incidente_medidor im
        LEFT JOIN work_orders.orden_trabajo ot
            ON (
                im.codigo_orden_trabajo = ot.codigo_orden
                OR (ot.origen = 'INCIDENTE' AND (ot.id_entidad_origen = im.incidente_id OR ot.codigo_entidad_origen = im.codigo_incidente))
            )
            AND ot.is_deleted = FALSE
        WHERE im.is_deleted = FALSE
    ),
    'kpis_ordenes_trabajo', (
        SELECT jsonb_build_object(
            'total_ordenes', COUNT(*),
            'pendientes_o_asignadas', COUNT(*) FILTER (WHERE ot.estado IN ('NOTIFICADA', 'PENDIENTE', 'ASIGNADA', 'REASIGNADA')),
            'en_progreso', COUNT(*) FILTER (WHERE ot.estado IN ('EN_PROGRESO', 'REANUDADA')),
            'criticas', COUNT(*) FILTER (WHERE pot.nivel IN ('Emergencia', 'Urgente')),
            'emergencias', COUNT(*) FILTER (WHERE pot.nivel = 'Emergencia'),
            'urgentes', COUNT(*) FILTER (WHERE pot.nivel = 'Urgente'),
            'creadas_hoy', COUNT(*) FILTER (WHERE ot.fecha_creacion >= CURRENT_DATE),
            'creadas_ultimos_7_dias', COUNT(*) FILTER (WHERE ot.fecha_creacion >= CURRENT_DATE - INTERVAL '7 days'),
            'creadas_este_mes', COUNT(*) FILTER (WHERE ot.fecha_creacion >= DATE_TRUNC('month', CURRENT_DATE)),
            'completadas', COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA'),
            'cerradas', COUNT(*) FILTER (WHERE ot.estado IN ('COMPLETADA', 'CANCELADA')),
            'tasa_cumplimiento_pct', ROUND(100.0 * COUNT(*) FILTER (WHERE ot.estado = 'COMPLETADA') / NULLIF(COUNT(*), 0), 2),
            'horas_promedio_resolucion', ROUND(AVG(EXTRACT(EPOCH FROM (ot.fecha_completada - ot.fecha_creacion)) / 3600.0) FILTER (WHERE ot.fecha_completada IS NOT NULL)::numeric, 1)
        )
        FROM work_orders.orden_trabajo ot
        JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
        WHERE ot.is_deleted = FALSE
    ),
    'distribucion_estados', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
            'status_id', estado,
            'status_name', nombre,
            'quantity', cantidad,
            'percentage', porcentaje
        )), '[]'::jsonb)
        FROM (
            SELECT
                ot.estado,
                ceo.nombre,
                COUNT(*) AS cantidad,
                ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS porcentaje
            FROM work_orders.orden_trabajo ot
            JOIN work_orders.cat_estado_orden ceo ON ot.estado = ceo.codigo
            WHERE ot.is_deleted = FALSE
            GROUP BY ot.estado, ceo.nombre
            ORDER BY cantidad DESC
        ) t
    ),
    'distribucion_prioridades', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
            'priority_id', id_prioridad,
            'priority_level', nivel,
            'quantity', cantidad,
            'percentage', porcentaje,
            'sla_horas', sla_horas
        )), '[]'::jsonb)
        FROM (
            SELECT
                pot.id_prioridad,
                pot.nivel,
                pot.sla_horas,
                COUNT(*) AS cantidad,
                ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS porcentaje
            FROM work_orders.orden_trabajo ot
            JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
            WHERE ot.is_deleted = FALSE
            GROUP BY pot.id_prioridad, pot.nivel, pot.sla_horas
            ORDER BY 
                CASE pot.nivel
                    WHEN 'Emergencia' THEN 1
                    WHEN 'Urgente' THEN 2
                    WHEN 'Alta' THEN 3
                    WHEN 'Media' THEN 4
                    ELSE 5
                END
        ) t
    ),
    'ordenes_atencion_inmediata', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
            'codigo_orden', codigo_orden,
            'tipo_trabajo', tipo_trabajo,
            'prioridad', prioridad,
            'estado', estado,
            'tecnico', tecnico,
            'horas_transcurridas', horas_transcurridas,
            'sla_horas', sla_horas
        )), '[]'::jsonb)
        FROM (
            SELECT
                ot.codigo_orden,
                tt.nombre AS tipo_trabajo,
                pot.nivel AS prioridad,
                ceo.nombre AS estado,
                COALESCE(emp.nombres || ' ' || emp.apellidos, u.username, 'Sin Asignar') AS tecnico,
                ROUND((EXTRACT(EPOCH FROM (NOW() - ot.fecha_creacion)) / 3600.0)::numeric, 1) AS horas_transcurridas,
                pot.sla_horas
            FROM work_orders.orden_trabajo ot
            JOIN work_orders.cat_estado_orden ceo ON ot.estado = ceo.codigo
            JOIN work_orders.tipo_trabajo tt ON ot.id_tipo_trabajo = tt.id_tipo_trabajo
            JOIN work_orders.prioridad_orden_trabajo pot ON ot.id_prioridad = pot.id_prioridad
            LEFT JOIN public.usuarios u ON ot.usuario_asignado = u.usuario_id
            LEFT JOIN public.empleados emp ON u.usuario_id = emp.usuario_id
            WHERE ot.is_deleted = FALSE 
              AND ot.estado NOT IN ('COMPLETADA', 'CANCELADA')
              AND pot.nivel IN ('Emergencia', 'Urgente')
            ORDER BY 
                CASE pot.nivel WHEN 'Emergencia' THEN 1 ELSE 2 END,
                horas_transcurridas DESC
            LIMIT 5
        ) t
    )
) AS dashboard_executive_overview
`,
} as const;
