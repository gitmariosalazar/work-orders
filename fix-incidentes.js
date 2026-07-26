const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: '192.168.0.10',
    port: 5435,
    user: 'postgres',
    password: 'password-postgis',
    database: 'sigepaa_production_geo'
  });

  try {
    await client.connect();
    
    const res = await client.query(`
      WITH update_inc AS (
        UPDATE public.incidente_medidor im
        SET estado = 'EN_INSPECCION'
        FROM work_orders.orden_trabajo ot
        WHERE im.incidente_id = ot.id_entidad_origen
          AND ot.origen = 'INCIDENTE'
          AND im.estado = 'REPORTADO'
        RETURNING im.incidente_id, im.usuario_reporta_id
      )
      INSERT INTO public.historial_incidente (
        incidente_id, estado_anterior, estado_nuevo, usuario_id, observacion
      )
      SELECT 
        incidente_id, 
        'REPORTADO', 
        'EN_INSPECCION', 
        usuario_reporta_id, 
        'Actualización manual por orden de trabajo creada previamente'
      FROM update_inc
      RETURNING incidente_id;
    `);
    console.log(`Éxito: Se actualizaron ${res.rowCount} incidentes desfasados.`);
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

main();
