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
    
    // 1. Agregar la columna
    await client.query(`
      ALTER TABLE public.incidente_medidor
      ADD COLUMN IF NOT EXISTS codigo_orden_trabajo varchar(30);
    `);
    console.log("Columna agregada exitosamente.");

    // 2. Actualizar los registros existentes
    const res = await client.query(`
      UPDATE public.incidente_medidor im
      SET codigo_orden_trabajo = ot.codigo_orden
      FROM work_orders.orden_trabajo ot
      WHERE im.incidente_id = ot.id_entidad_origen
        AND ot.origen = 'INCIDENTE'
        AND im.codigo_orden_trabajo IS NULL;
    `);
    console.log(`Éxito: Se actualizaron ${res.rowCount} incidentes con su código de OT correspondiente.`);
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await client.end();
  }
}

main();
