### Taking the backup of the database
pg_dump -U postgres -d tenanta -F p -f mydb_backup.sql

### Restoring database
psql -U postgres -d tenanta -f mydb_backup.sql