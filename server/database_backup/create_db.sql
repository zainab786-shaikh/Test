-- PostgreSQL database creation script

-- 1. Delete database if exists
DROP DATABASE IF EXISTS tenanta;

-- 2. Create database
CREATE DATABASE tenanta;

-- 3. Create user if not exists
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'root'
   ) THEN
      CREATE ROLE root LOGIN PASSWORD 'Allahu';
   END IF;
END
$$;

-- 4. Give ownership and privileges
ALTER DATABASE tenanta OWNER TO root;
GRANT ALL PRIVILEGES ON DATABASE tenanta TO root;

\c tenanta

-- Connect to the database (this would be done in psql with \c tenanta)
-- But since this is a script, assume we run it on the tenanta database
DROP SCHEMA IF EXISTS tenanta CASCADE;
CREATE SCHEMA IF NOT EXISTS tenanta AUTHORIZATION root;

-- Create enum type
DROP TYPE IF EXISTS role_enum CASCADE;
CREATE TYPE role_enum AS ENUM ('admin','principal','teacher','student','parent');

-- Tables
CREATE TABLE tenanta.school (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "address" varchar(255) NOT NULL
);

CREATE TABLE tenanta.standard (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL
);

CREATE TABLE tenanta.schoolstandard (
  "Id" SERIAL PRIMARY KEY,
  "school" int NOT NULL REFERENCES tenanta.school ("Id"),
  "standard" int NOT NULL REFERENCES tenanta.standard ("Id")
);

CREATE TABLE tenanta.logindetail (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "adhaar" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "role" role_enum NOT NULL
);

CREATE TABLE tenanta.student (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "adhaar" varchar(255) NOT NULL,
  "school" int NOT NULL REFERENCES tenanta.school ("Id"),
  "standard" int NOT NULL REFERENCES tenanta.standard ("Id")
);

CREATE TABLE tenanta.teacher (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "adhaar" varchar(255) NOT NULL,
  "school" int NOT NULL REFERENCES tenanta.school ("Id"),
  "standard" int NOT NULL REFERENCES tenanta.standard ("Id")
);

CREATE TABLE tenanta.subject (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "standard" int NOT NULL REFERENCES tenanta.standard ("Id")
);

CREATE TABLE tenanta.lesson (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "subject" int NOT NULL REFERENCES tenanta.subject ("Id")
);

CREATE TABLE tenanta.lessonsection (
  "Id" SERIAL PRIMARY KEY,
  "name" varchar(255) NOT NULL,
  "explanation" TEXT NOT NULL,
  "quiz" TEXT NOT NULL,
  "fillblanks" TEXT NOT NULL,
  "truefalse" TEXT NOT NULL,
  "subject" int NOT NULL REFERENCES tenanta.subject ("Id"),
  "lesson" int NOT NULL REFERENCES tenanta.lesson ("Id")
);

-- Insert data
INSERT INTO tenanta.school ("Id", "name", "address") VALUES (1, 'Saboo Siddik Polytechnic','Nagpada, Byculla, Mumbai');

INSERT INTO tenanta.standard ("Id", "name") VALUES (5, '5th Semester'),(6, '6th Semester');

INSERT INTO tenanta.schoolstandard ("Id", "school", "standard") VALUES (6,1,5),(7,1,6);

INSERT INTO tenanta.logindetail ("Id", "name", "adhaar", "password", "role") VALUES 
(1, 'admin','1111-1111-1111','admin','admin'),
(2, 'teacher','2222-2222-2222','teacher','teacher'),
(3, 'Yusuf Shaikh','2222-2222-2220','student','student'),
(4, 'principal','4444-4444-4444','principal','principal'),
(6, 'Affan Ansari','2222-2222-2221','student','student'),
(7, 'Zainab Shaikh','5555-5555-5550','student','student'),
(8, 'Mehndi Shaikh','5555-5555-5551','student','student');

INSERT INTO tenanta.student ("Id", "name", "adhaar", "school", "standard") VALUES 
(14, 'Yusuf Shaikh','2222-2222-2220',1,5),
(15, 'Aun Shaikh','2222-2222-2221',1,5),
(16, 'Zainab Shaikh','5555-5555-5550',1,6),
(17, 'Mehndi Shaikh','5555-5555-5551',1,6);

INSERT INTO tenanta.teacher ("Id", "name", "adhaar", "school", "standard") VALUES 
(1, 'teacher','2222-2222-2222',1,5);

INSERT INTO tenanta.subject ("Id", "name", "standard") VALUES 
(12, 'Environmental Studies',5),
(13, 'Operating Systems',5),
(14, 'Management',6),
(15, 'Programming with Python',6);

INSERT INTO tenanta.lesson ("Id", "name", "subject") VALUES 
(4, '1.Environment',12),
(5, '2.Energy Resources',12),
(6, '3.Ecosystem and Biodiversity',12),
(9, '1.Overview of Operating Systems',13),
(10, '2.Services and Components of Operating Systems',13),
(11, '3.Process Management',13),
(12, '1.Introduction to management concepts and managerial skills',14),
(13, '2.Planning and organizing at supervisory level',14),
(14, '3.Directing and Controlling at Supervisory level',14),
(15, '1.Introduction and Syntax of Python Program',15),
(16, '2.Python Operator and Control Flow Statement',15),
(17, '3.DataStructures in Python',15);

-- Add progress table if needed
CREATE TABLE tenanta.progress (
  "Id" SERIAL PRIMARY KEY,
  "quiz" int NOT NULL,
  "fillblanks" int NOT NULL,
  "truefalse" int NOT NULL,
  "school" int NOT NULL REFERENCES tenanta.school ("Id"),
  "standard" int NOT NULL REFERENCES tenanta.standard ("Id"),
  "student" int NOT NULL REFERENCES tenanta.student ("Id"),
  "subject" int REFERENCES tenanta.subject ("Id"),
  "lesson" int REFERENCES tenanta.lesson ("Id"),
  "lessonsection" int REFERENCES tenanta.lessonsection ("Id")
);

-- Insert lessonsection with escaped content
INSERT INTO tenanta.lessonsection ("Id", "name", "explanation", "quiz", "fillblanks", "truefalse", "subject", "lesson") VALUES 
(9, '1.1-Definitions and Need of Environmental Studies', '<div>\n    <h1>1.1 Definitions and Need of Environmental Studies</h1>\n    \n    <h2>Definition of Environmental Studies</h2>\n    <p>Environmental Studies is the branch of science that deals with the study of the environment, the problems it faces, and solutions to those problems. It includes understanding how human activities affect nature and how we can protect our surroundings for a better future.</p>\n    <p>In simple words, Environmental Studies is the study of our environment and how to keep it healthy.</p>\n</div>', '{}', '{}', '{}', 12, 4);