const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function findTables() {
  const client = new Client({
    connectionString: process.env.TENANT_1_DB_URI,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    console.log('Listing all tables named "progress" or "lessonsection"...');
    const query = `
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('progress', 'lessonsection');
    `;
    const res = await client.query(query);
    console.log('Found tables:', JSON.stringify(res.rows, null, 2));

    console.log('Checking current search_path...');
    const spRes = await client.query('SHOW search_path;');
    console.log('Search path:', spRes.rows[0].search_path);

  } catch (err) {
    console.error('Error finding tables:', err);
  } finally {
    await client.end();
  }
}

findTables();
