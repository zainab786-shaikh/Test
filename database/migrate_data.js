const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Configuration
const mysqlUri = 'mysql://root:JjYp@786@127.0.0.1:3306/tenanta';
const postgresUri = 'postgres://postgres:postgres@127.0.0.1:5432/tenanta';

const mysql = new Sequelize(mysqlUri, { logging: false });
const postgres = new Sequelize(postgresUri, { logging: false });

async function migrate() {
    try {
        console.log('Connecting to databases...');
        await mysql.authenticate();
        await postgres.authenticate();
        console.log('Connected.');

        // 1. Initialize Postgres Schema
        console.log('Initializing Postgres Schema...');
        const schema = fs.readFileSync(path.join(__dirname, 'postgres_schema.sql'), 'utf8');
        await postgres.query(schema);
        console.log('Schema initialized.');

        // 2. Define Tables to Migrate (in order of dependencies)
        const tables = [
            'schools',
            'standards',
            'school_standards',
            'students',
            'subjects',
            'lessons',
            'lesson_sections',
            'progress'
        ];

        for (const table of tables) {
            console.log(`Migrating table: ${table}...`);
            const [rows] = await mysql.query(`SELECT * FROM ${table}`);
            
            if (rows.length === 0) {
                console.log(`No data in ${table}. Skipping.`);
                continue;
            }

            // Map columns if necessary (e.g., Id -> "Id")
            const keys = Object.keys(rows[0]).map(k => k === 'Id' ? '"Id"' : k);
            const placeholders = keys.map(() => '?').join(', ');
            const columns = keys.join(', ');

            for (const row of rows) {
                const values = Object.values(row);
                await postgres.query(
                    `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
                    { replacements: values }
                );
            }
            console.log(`Migrated ${rows.length} rows from ${table}.`);
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mysql.close();
        await postgres.close();
    }
}

migrate();
 residential
