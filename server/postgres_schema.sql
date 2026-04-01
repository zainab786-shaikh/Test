CREATE SCHEMA IF NOT EXISTS tenanta;
SET search_path TO tenanta, public;

-- CORE TABLES (Matching Server Models)
CREATE TABLE IF NOT EXISTS logindetail (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    adhaar VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS school (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT
);

CREATE TABLE IF NOT EXISTS standard (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS schoolstandard (
    "Id" SERIAL PRIMARY KEY,
    school INTEGER NOT NULL REFERENCES school("Id") ON DELETE CASCADE,
    standard INTEGER NOT NULL REFERENCES standard("Id") ON DELETE CASCADE,
    UNIQUE(school, standard)
);

CREATE TABLE IF NOT EXISTS student (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    adhaar VARCHAR(255),
    school INTEGER REFERENCES school("Id"),
    standard INTEGER REFERENCES standard("Id")
);

CREATE TABLE IF NOT EXISTS teacher (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    adhaar VARCHAR(255),
    school INTEGER REFERENCES school("Id"),
    standard INTEGER REFERENCES standard("Id")
);

CREATE TABLE IF NOT EXISTS subject (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    standard INTEGER NOT NULL REFERENCES standard("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lesson (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject INTEGER NOT NULL REFERENCES subject("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lessonsection (
    "Id" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    explanation TEXT,
    quiz TEXT,
    fillblanks TEXT,
    truefalse TEXT,
    subject INTEGER REFERENCES subject("Id"),
    lesson INTEGER REFERENCES lesson("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
    "Id" SERIAL PRIMARY KEY,
    student INTEGER REFERENCES student("Id") ON DELETE CASCADE,
    lessonsection INTEGER REFERENCES lessonsection("Id"),
    score INTEGER DEFAULT 0,
    quiz INTEGER DEFAULT 0,
    fillblanks INTEGER DEFAULT 0,
    truefalse INTEGER DEFAULT 0,
    shortquestion INTEGER DEFAULT 0,
    subject INTEGER REFERENCES subject("Id"),
    lesson INTEGER REFERENCES lesson("Id"),
    standard INTEGER REFERENCES standard("Id"),
    school INTEGER REFERENCES school("Id")
);

-- AI-GENERATED CONTENT (User Request)
CREATE TABLE IF NOT EXISTS lesson_hierarchy (
    path TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    parent_path TEXT
);

CREATE TABLE IF NOT EXISTS ai_lesson_sections (
    path TEXT PRIMARY KEY,
    content TEXT
);

CREATE TABLE IF NOT EXISTS ai_lesson_scores (
    path TEXT PRIMARY KEY,
    quiz_score INTEGER DEFAULT 0,
    truefalse_score INTEGER DEFAULT 0,
    shortquestion_score INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ai_lesson_contents (
    id SERIAL PRIMARY KEY,
    path TEXT UNIQUE,
    paragraph TEXT,
    explanation TEXT,
    summary TEXT,
    examples TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_quizzes (
    id SERIAL PRIMARY KEY,
    path TEXT UNIQUE,
    questions_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_truefalse (
    id SERIAL PRIMARY KEY,
    path TEXT UNIQUE,
    questions_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_short_questions (
    id SERIAL PRIMARY KEY,
    path TEXT UNIQUE,
    questions_json JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_student_school ON student(school);
CREATE INDEX IF NOT EXISTS idx_student_standard ON student(standard);
CREATE INDEX IF NOT EXISTS idx_subject_standard ON subject(standard);
CREATE INDEX IF NOT EXISTS idx_lesson_subject ON lesson(subject);
CREATE INDEX IF NOT EXISTS idx_lessonsection_lesson ON lessonsection(lesson);
CREATE INDEX IF NOT EXISTS idx_progress_student ON progress(student);
