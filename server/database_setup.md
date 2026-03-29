# Setting up Database
## Installation of postgresql
sudo apt update
sudo apt install postgresql postgresql-contrib postgresql-client

sudo systemctl status postgresql

## Creation of the database
sudo -u postgres psql

-- Create the database if you haven't yet
CREATE DATABASE tenant_1_db;

-- Grant all privileges to your root user
GRANT ALL PRIVILEGES ON DATABASE tenant_1_db TO root;

## Gramt access to postgresql
sudo nano /etc/postgresql/16/main/postgresql.conf
listen_addresses = '*'

sudo nano /etc/postgresql/16/main/pg_hba.conf
host    all             root            0.0.0.0/0               scram-sha-256

sudo systemctl restart postgresql

sudo ufw allow 5432/tcp

npm install pg pg-hstore

-- This creates the "folder" Sequelize is looking for
CREATE SCHEMA IF NOT EXISTS tenanta;

-- Give your root user permission to use it
GRANT ALL ON SCHEMA tenanta TO root;

