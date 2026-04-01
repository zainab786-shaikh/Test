const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixDb() {
  const client = new Client({
    connectionString: process.env.TENANT_1_DB_URI,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const schema = 'tenanta';

    console.log(`Adding shortquestion to ${schema}.lessonsection...`);
    await client.query(`ALTER TABLE ${schema}.lessonsection ADD COLUMN IF NOT EXISTS shortquestion TEXT;`);

    console.log(`Adding shortquestion to ${schema}.progress...`);
    await client.query(`ALTER TABLE ${schema}.progress ADD COLUMN IF NOT EXISTS shortquestion INTEGER DEFAULT 0;`);

    console.log('Database fix complete');
  } catch (err) {
    console.error('Error fixing database:', err);
  } finally {
    await client.end();
  }
}

fixDb();
