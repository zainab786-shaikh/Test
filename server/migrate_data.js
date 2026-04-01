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
        // Drop and recreate tenanta schema for a clean slate
        await postgres.query('DROP SCHEMA IF EXISTS tenanta CASCADE;');
        const schema = fs.readFileSync(path.join(__dirname, 'postgres_schema.sql'), 'utf8');
        await postgres.query(schema);
        console.log('Schema initialized.');

        // 2. Define Table Mapping (Source MySQL -> Target Postgres)
        // Note: Using singular names to match existing MySQL tables and Expected Postgres tables
        const mapping = [
            { source: 'tenanta.logindetail', target: 'tenanta.logindetail' },
            { source: 'tenanta.school', target: 'tenanta.school' },
            { source: 'tenanta.standard', target: 'tenanta.standard' },
            { source: 'tenanta.schoolstandard', target: 'tenanta.schoolstandard' },
            { source: 'tenanta.student', target: 'tenanta.student' },
            { source: 'tenanta.teacher', target: 'tenanta.teacher' },
            { source: 'tenanta.subject', target: 'tenanta.subject' },
            { source: 'tenanta.lesson', target: 'tenanta.lesson' },
            { source: 'tenanta.lessonsection', target: 'tenanta.lessonsection' },
            { source: 'tenanta.progress', target: 'tenanta.progress' }
        ];

        for (const { source, target } of mapping) {
            console.log(`Migrating ${source} to ${target}...`);
            const [rows] = await mysql.query(`SELECT * FROM \`${source}\``);
            
            if (rows.length === 0) {
                console.log(`No data in ${source}. Skipping.`);
                continue;
            }

            // Map columns if necessary (e.g., Id -> "Id")
            const keys = Object.keys(rows[0]).map(k => k === 'Id' ? '"Id"' : `"${k}"`);
            const placeholders = keys.map(() => '?').join(', ');
            const columns = keys.join(', ');

            for (const row of rows) {
                const values = Object.values(row);
                await postgres.query(
                    `INSERT INTO ${target} (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
                    { replacements: values }
                );
            }
            console.log(`Migrated ${rows.length} rows to ${target}.`);
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
