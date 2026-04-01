const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function resetProgress() {
  const client = new Client({
    connectionString: process.env.TENANT_1_DB_URI,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const schema = 'tenanta';

    console.log(`Resetting all student progress in ${schema}.progress to 0...`);
    const query = `
      UPDATE ${schema}.progress 
      SET quiz = 0, 
          fillblanks = 0, 
          truefalse = 0, 
          shortquestion = 0;
    `;
    const res = await client.query(query);

    console.log(`Progress reset complete. Updated ${res.rowCount} rows.`);
  } catch (err) {
    console.error('Error resetting progress:', err);
  } finally {
    await client.end();
  }
}

resetProgress();
