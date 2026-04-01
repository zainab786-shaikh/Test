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


pg_dump -U postgres -d tenanta > full_backup.sql
pg_dump -U postgres -d tenanta -t table_one -t table_two > specific_tables.sql
pg_dump --data-only -U postgres -d tenanta > data_only.sql

pg_dump --data-only -U postgres -d tenanta -t tenanta.subject -t tenanta.lessonsection -t tenanta.lessonsection_lessoninfo -t tenanta.lessonsection_quiz -t tenanta.lessonsection_fillblanks -t tenanta.lessonsection_truefalse -t tenanta.lessonsection_shortquestion > data_only.sql

dropdb -U postgres tenanta
createdb -U postgres tenanta
psql -U postgres -d tenanta -f data_only.sql

### Adding the initial data:
INSERT INTO tenanta.school` VALUES (1, 'Saboo Siddik', 'Police Lane, Nagpada, Mumbai')

INSERT INTO tenanta.logindetail VALUES 
(1,'admin','1111-1111-1111','admin','admin'),
(2,'teacher','2222-2222-2222','teacher','teacher'),
(3,'Yusuf Shaikh','2222-2222-2220','student','student'),
(4,'principal','4444-4444-4444','principal','principal'),
(5,'Affan Ansari','5555-5555-5550','student','student'),
(6,'Zainab Shaikh','5555-5555-5551','student','student'),
(7,'Mehndi Shaikh','5555-5555-5553','student','student');

INSERT INTO tenanta.standard VALUES 
(1,'1st Semister'),
(2,'2nd Semister'),
(3,'3rd Semister'),
(4,'4th Semister'),
(5,'5th Semister'),
(6,'6th Semister');

CREATE EXTENSION IF NOT EXISTS vector;


select * from tenanta.logindetail;

select * from tenanta.school;
select * from tenanta.schoolstandard;
select * from tenanta.standard;
select * from tenanta.standardsubject;
select * from tenanta.subject;
select * from tenanta.lesson;
select * from tenanta.lessonsection;
select * from tenanta.lessonsection_fillblanks;
select * from tenanta.lessonsection_lessoninfo;
select * from tenanta.lessonsection_quiz;
select * from tenanta.lessonsection_shortquestion;
select * from tenanta.lessonsection_truefalse;

select * from tenanta.progress;
select * from tenanta.student;
