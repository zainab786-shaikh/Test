#!/bin/bash

# Set variables
export PGUSER=postgres
export PGPASSWORD=postgres
DBNAME=tenanta

echo "Dropping database (if exists)..."
psql -U "$PGUSER" -c "DROP DATABASE IF EXISTS $DBNAME;"

echo "Creating database..."
psql -U "$PGUSER" -c "CREATE DATABASE $DBNAME;"

# Restore backup (choose one based on file type)

# For .sql file
echo "Restoring from SQL file..."
psql -U "$PGUSER" -d "$DBNAME" -f mydb_backup.sql

# For .dump / .backup file (uncomment if needed)
# echo "Restoring from dump file..."
# pg_restore -U "$PGUSER" -d "$DBNAME" mydb_backup.sql

# Pause equivalent
read -p "Press Enter to continue..."