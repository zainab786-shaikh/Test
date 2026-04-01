const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function debugDb() {
  const client = new Client({
    connectionString: process.env.TENANT_1_DB_URI,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const schema = 'tenanta';

    console.log(`Checking columns for ${schema}.progress...`);
    const colQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = '${schema}' AND table_name = 'progress';
    `;
    const colRes = await client.query(colQuery);
    console.log('Columns:', colRes.rows.map(r => r.column_name).join(', '));

    console.log(`Checking columns for ${schema}.lessonsection...`);
    const lsColRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = '${schema}' AND table_name = 'lessonsection';
    `);
    console.log('LessonSection Columns:', lsColRes.rows.map(r => r.column_name).join(', '));

    console.log('Fetching first 5 rows of progress...');
    const dataRes = await client.query(`SELECT * FROM ${schema}.progress LIMIT 5;`);
    console.log('Data:', JSON.stringify(dataRes.rows, null, 2));

  } catch (err) {
    console.error('Error debugging database:', err);
  } finally {
    await client.end();
  }
}

debugDb();
