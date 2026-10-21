-- Mapea cada tipo de incidente a su tipo de trabajo por defecto.
ALTER TABLE public.tipo_incidente_medidor
  ADD COLUMN IF NOT EXISTS id_tipo_trabajo_default INTEGER
  REFERENCES work_orders.tipo_trabajo(id_tipo_trabajo) ON UPDATE CASCADE;

UPDATE public.tipo_incidente_medidor SET id_tipo_trabajo_default = CASE
  WHEN tipo_incidente_id IN (2,3,13,14,40,41,42) THEN 5   -- Fuga en red
  WHEN tipo_incidente_id IN (1,35,39) THEN 6              -- Fuga domiciliaria
  WHEN tipo_incidente_id IN (6,7,8,26,29,36,38) THEN 1    -- Medidor: instalación/calibración
  WHEN tipo_incidente_id IN (16,17) THEN 2                -- Retiro de medidor
  WHEN tipo_incidente_id IN (21,22,24,25) THEN 9          -- Limpieza de alcantarillado
  WHEN tipo_incidente_id IN (15,23) THEN 10               -- Reparación de alcantarillado
  WHEN tipo_incidente_id = 43 THEN 8                      -- Cambio de tubería/accesorios
  ELSE 12                                                 -- Inspección General
END
WHERE id_tipo_trabajo_default IS NULL;
