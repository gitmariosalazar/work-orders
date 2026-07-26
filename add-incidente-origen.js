const { Client } = require('pg');

async function main() {
  const client = new Client({
    host: 'localhost',
    port: 5432, // Assuming standard port or we can check docker-compose
    user: 'root', // From user's previous command
    password: 'password123', // I don't know the password.
    database: 'epaa'
  });

  try {
    await client.connect();
    await client.query(`
      INSERT INTO work_orders.cat_origen_orden (codigo, nombre, descripcion) 
      VALUES ('INCIDENTE', 'Incidente Reportado', 'OT originada a partir de un incidente')
      ON CONFLICT DO NOTHING;
    `);
    console.log("Success");
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

main();
