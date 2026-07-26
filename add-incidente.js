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
    await client.query(`
      INSERT INTO work_orders.cat_origen_orden (codigo, nombre, descripcion) 
      VALUES ('INCIDENTE', 'Incidente Reportado', 'OT originada a partir de un incidente')
      ON CONFLICT DO NOTHING;
    `);
    console.log("Success inserting INCIDENTE into cat_origen_orden");
  } catch(e) {
    console.error("Error:", e.message);
  } finally {
    await client.end();
  }
}

main();
