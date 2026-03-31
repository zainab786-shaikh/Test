# Setting up Database
## Installation of postgresql
sudo apt update
sudo apt install postgresql postgresql-contrib postgresql-client

sudo systemctl status postgresql

## Creation of the database
sudo -u postgres psql

### Creating user root and granting it access
CREATE USER root WITH PASSWORD 'your_password_here';
ALTER USER root WITH SUPERUSER;

-- Grant all privileges to your root user
CREATE USER root WITH PASSWORD 'your_password_here';
CREATE DATABASE my_database OWNER root;
GRANT ALL PRIVILEGES ON DATABASE my_database TO root;

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



### Adding the initial users:
INSERT INTO tenanta.logindetail VALUES (1,'admin','1111-1111-1111','admin','admin'),(2,'teacher','2222-2222-2222','teacher','teacher'),(3,'Yusuf Shaikh','2222-2222-2220','student','student'),(4,'principal','4444-4444-4444','principal','principal'),(6,'Affan Ansari','2222-2222-2221','student','student'),(7,'Zainab Shaikh','5555-5555-5550','student','student'),(8,'Mehndi Shaikh','5555-5555-5551','student','student');

INSERT INTO tenanta.school` VALUES (1, 'Saboo Siddik', 'Police Lane, Nagpada, Mumbai')


CREATE EXTENSION IF NOT EXISTS vector;