const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixAllDb() {
  const client = new Client({
    connectionString: process.env.TENANT_1_DB_URI,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const schemas = ['tenanta', 'public'];

    for (const schema of schemas) {
      console.log(`Checking/Adding shortquestion to ${schema}.progress...`);
      await client.query(`ALTER TABLE IF EXISTS ${schema}.progress ADD COLUMN IF NOT EXISTS shortquestion INTEGER DEFAULT 0;`);
      
      console.log(`Resetting all student progress in ${schema}.progress to 0...`);
      const query = `
        UPDATE ${schema}.progress 
        SET quiz = 0, 
            fillblanks = 0, 
            truefalse = 0, 
            shortquestion = 0;
      `;
      const res = await client.query(query);
      console.log(`Reset ${schema}.progress complete. Updated ${res.rowCount} rows.`);

      if (schema === 'tenanta') {
          console.log(`Adding shortquestion to ${schema}.lessonsection...`);
          await client.query(`ALTER TABLE IF EXISTS ${schema}.lessonsection ADD COLUMN IF NOT EXISTS shortquestion TEXT;`);
      }
    }

    console.log('Global database fix and reset complete');
  } catch (err) {
    console.error('Error fixing database:', err);
  } finally {
    await client.end();
  }
}

fixAllDb();
