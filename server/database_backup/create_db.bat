@echo off

set PGUSER=postgres
set PGPASSWORD=postgres
set DBNAME=tenanta

REM Drop and create database
psql -U %PGUSER% -c "DROP DATABASE IF EXISTS %DBNAME%;"
psql -U %PGUSER% -c "CREATE DATABASE %DBNAME%;"

REM Restore backup (choose one based on file type)
REM For .sql file
psql -U %PGUSER% -d %DBNAME% -f mydb_backup.sql

REM For .dump / .backup file
REM pg_restore -U %PGUSER% -d %DBNAME% mydb_backup.sql

pause