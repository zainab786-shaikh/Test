--
-- PostgreSQL database dump
--

\restrict 3gd8LtnGu0pVnZ83cUclpfK5voD0BTmSxmtbk5PXj1J0obzgzTbdBuQWjXiQUj3

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tenanta; Type: SCHEMA; Schema: -; Owner: root
--

CREATE SCHEMA tenanta;


ALTER SCHEMA tenanta OWNER TO root;

--
-- Name: enum_logindetail_role; Type: TYPE; Schema: tenanta; Owner: root
--

CREATE TYPE tenanta.enum_logindetail_role AS ENUM (
    'admin',
    'principal',
    'teacher',
    'student',
    'parent'
);


ALTER TYPE tenanta.enum_logindetail_role OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: lesson; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.lesson (
    "Id" integer NOT NULL,
    path character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    subject integer NOT NULL
);


ALTER TABLE tenanta.lesson OWNER TO root;

--
-- Name: lesson_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."lesson_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."lesson_Id_seq" OWNER TO root;

--
-- Name: lesson_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."lesson_Id_seq" OWNED BY tenanta.lesson."Id";


--
-- Name: lessonsection; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.lessonsection (
    "Id" integer NOT NULL,
    name character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    "lessoninfoId" integer NULL,
    "quizId" integer NULL,
    "fillblanksId" integer NULL,
    "truefalseId" integer NULL,
    "shortquestionId" integer NULL,
    subject integer NOT NULL,
    lesson integer NOT NULL
);


ALTER TABLE tenanta.lessonsection OWNER TO root;

--
-- Name: lessonsection_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."lessonsection_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."lessonsection_Id_seq" OWNER TO root;

--
-- Name: lessonsection_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."lessonsection_Id_seq" OWNED BY tenanta.lessonsection."Id";


--
-- Name: lessonsection_fillblanks; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.lessonsection_fillblanks (
    "Id" integer NOT NULL,
    path character varying(255) NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE tenanta.lessonsection_fillblanks OWNER TO root;

--
-- Name: lessonsection_fillblanks_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."lessonsection_fillblanks_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."lessonsection_fillblanks_Id_seq" OWNER TO root;

--
-- Name: lessonsection_fillblanks_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."lessonsection_fillblanks_Id_seq" OWNED BY tenanta.lessonsection_fillblanks."Id";


--
-- Name: lessonsection_lessoninfo; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.lessonsection_lessoninfo (
    "Id" integer NOT NULL,
    path character varying(255) NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE tenanta.lessonsection_lessoninfo OWNER TO root;

--
-- Name: lessonsection_lessoninfo_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."lessonsection_lessoninfo_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."lessonsection_lessoninfo_Id_seq" OWNER TO root;

--
-- Name: lessonsection_lessoninfo_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."lessonsection_lessoninfo_Id_seq" OWNED BY tenanta.lessonsection_lessoninfo."Id";


--
-- Name: lessonsection_quiz; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.lessonsection_quiz (
    "Id" integer NOT NULL,
    path character varying(255) NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE tenanta.lessonsection_quiz OWNER TO root;

--
-- Name: lessonsection_quiz_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."lessonsection_quiz_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."lessonsection_quiz_Id_seq" OWNER TO root;

--
-- Name: lessonsection_quiz_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."lessonsection_quiz_Id_seq" OWNED BY tenanta.lessonsection_quiz."Id";


--
-- Name: lessonsection_shortquestion; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.lessonsection_shortquestion (
    "Id" integer NOT NULL,
    path character varying(255) NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE tenanta.lessonsection_shortquestion OWNER TO root;

--
-- Name: lessonsection_shortquestion_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."lessonsection_shortquestion_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."lessonsection_shortquestion_Id_seq" OWNER TO root;

--
-- Name: lessonsection_shortquestion_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."lessonsection_shortquestion_Id_seq" OWNED BY tenanta.lessonsection_shortquestion."Id";


--
-- Name: lessonsection_truefalse; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.lessonsection_truefalse (
    "Id" integer NOT NULL,
    path character varying(255) NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE tenanta.lessonsection_truefalse OWNER TO root;

--
-- Name: lessonsection_truefalse_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."lessonsection_truefalse_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."lessonsection_truefalse_Id_seq" OWNER TO root;

--
-- Name: lessonsection_truefalse_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."lessonsection_truefalse_Id_seq" OWNED BY tenanta.lessonsection_truefalse."Id";


--
-- Name: logindetail; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.logindetail (
    "Id" integer NOT NULL,
    name character varying(255) NOT NULL,
    adhaar character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role tenanta.enum_logindetail_role NOT NULL
);


ALTER TABLE tenanta.logindetail OWNER TO root;

--
-- Name: logindetail_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."logindetail_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."logindetail_Id_seq" OWNER TO root;

--
-- Name: logindetail_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."logindetail_Id_seq" OWNED BY tenanta.logindetail."Id";


--
-- Name: progress; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.progress (
    "Id" integer NOT NULL,
    quiz integer NOT NULL,
    fillblanks integer NOT NULL,
    truefalse integer NOT NULL,
    school integer NOT NULL,
    standard integer NOT NULL,
    student integer NOT NULL,
    subject integer,
    lesson integer,
    lessonsection integer
);


ALTER TABLE tenanta.progress OWNER TO root;

--
-- Name: progress_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."progress_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."progress_Id_seq" OWNER TO root;

--
-- Name: progress_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."progress_Id_seq" OWNED BY tenanta.progress."Id";


--
-- Name: school; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.school (
    "Id" integer NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL
);


ALTER TABLE tenanta.school OWNER TO root;

--
-- Name: school_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."school_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."school_Id_seq" OWNER TO root;

--
-- Name: school_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."school_Id_seq" OWNED BY tenanta.school."Id";


--
-- Name: schoolstandard; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.schoolstandard (
    "Id" integer NOT NULL,
    school integer NOT NULL,
    standard integer NOT NULL
);


ALTER TABLE tenanta.schoolstandard OWNER TO root;

--
-- Name: schoolstandard_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."schoolstandard_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."schoolstandard_Id_seq" OWNER TO root;

--
-- Name: schoolstandard_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."schoolstandard_Id_seq" OWNED BY tenanta.schoolstandard."Id";


--
-- Name: standard; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.standard (
    "Id" integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE tenanta.standard OWNER TO root;

--
-- Name: standard_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."standard_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."standard_Id_seq" OWNER TO root;

--
-- Name: standard_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."standard_Id_seq" OWNED BY tenanta.standard."Id";


--
-- Name: student; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.student (
    "Id" integer NOT NULL,
    name character varying(255) NOT NULL,
    adhaar character varying(255) NOT NULL,
    school integer NOT NULL,
    standard integer NOT NULL
);


ALTER TABLE tenanta.student OWNER TO root;

--
-- Name: student_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."student_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."student_Id_seq" OWNER TO root;

--
-- Name: student_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."student_Id_seq" OWNED BY tenanta.student."Id";


--
-- Name: subject; Type: TABLE; Schema: tenanta; Owner: root
--

CREATE TABLE tenanta.subject (
    "Id" integer NOT NULL,
    path character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE tenanta.subject OWNER TO root;

--
-- Name: subject_Id_seq; Type: SEQUENCE; Schema: tenanta; Owner: root
--

CREATE SEQUENCE tenanta."subject_Id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE tenanta."subject_Id_seq" OWNER TO root;

--
-- Name: subject_Id_seq; Type: SEQUENCE OWNED BY; Schema: tenanta; Owner: root
--

ALTER SEQUENCE tenanta."subject_Id_seq" OWNED BY tenanta.subject."Id";


--
-- Name: lesson Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lesson ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."lesson_Id_seq"'::regclass);


--
-- Name: lessonsection Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."lessonsection_Id_seq"'::regclass);


--
-- Name: lessonsection_fillblanks Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_fillblanks ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."lessonsection_fillblanks_Id_seq"'::regclass);


--
-- Name: lessonsection_lessoninfo Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_lessoninfo ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."lessonsection_lessoninfo_Id_seq"'::regclass);


--
-- Name: lessonsection_quiz Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_quiz ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."lessonsection_quiz_Id_seq"'::regclass);


--
-- Name: lessonsection_shortquestion Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_shortquestion ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."lessonsection_shortquestion_Id_seq"'::regclass);


--
-- Name: lessonsection_truefalse Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_truefalse ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."lessonsection_truefalse_Id_seq"'::regclass);


--
-- Name: logindetail Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.logindetail ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."logindetail_Id_seq"'::regclass);


--
-- Name: progress Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."progress_Id_seq"'::regclass);


--
-- Name: school Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.school ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."school_Id_seq"'::regclass);


--
-- Name: schoolstandard Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.schoolstandard ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."schoolstandard_Id_seq"'::regclass);


--
-- Name: standard Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.standard ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."standard_Id_seq"'::regclass);


--
-- Name: student Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.student ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."student_Id_seq"'::regclass);


--
-- Name: subject Id; Type: DEFAULT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.subject ALTER COLUMN "Id" SET DEFAULT nextval('tenanta."subject_Id_seq"'::regclass);


--
-- Name: lesson lesson_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lesson
    ADD CONSTRAINT lesson_pkey PRIMARY KEY ("Id");


--
-- Name: lessonsection_fillblanks lessonsection_fillblanks_path_key; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_fillblanks
    ADD CONSTRAINT lessonsection_fillblanks_path_key UNIQUE (path);


--
-- Name: lessonsection_fillblanks lessonsection_fillblanks_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_fillblanks
    ADD CONSTRAINT lessonsection_fillblanks_pkey PRIMARY KEY ("Id");


--
-- Name: lessonsection_lessoninfo lessonsection_lessoninfo_path_key; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_lessoninfo
    ADD CONSTRAINT lessonsection_lessoninfo_path_key UNIQUE (path);


--
-- Name: lessonsection_lessoninfo lessonsection_lessoninfo_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_lessoninfo
    ADD CONSTRAINT lessonsection_lessoninfo_pkey PRIMARY KEY ("Id");


--
-- Name: lessonsection lessonsection_path_key; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection
    ADD CONSTRAINT lessonsection_path_key UNIQUE (path);


--
-- Name: lessonsection lessonsection_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection
    ADD CONSTRAINT lessonsection_pkey PRIMARY KEY ("Id");


--
-- Name: lessonsection_quiz lessonsection_quiz_path_key; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_quiz
    ADD CONSTRAINT lessonsection_quiz_path_key UNIQUE (path);


--
-- Name: lessonsection_quiz lessonsection_quiz_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_quiz
    ADD CONSTRAINT lessonsection_quiz_pkey PRIMARY KEY ("Id");


--
-- Name: lessonsection_shortquestion lessonsection_shortquestion_path_key; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_shortquestion
    ADD CONSTRAINT lessonsection_shortquestion_path_key UNIQUE (path);


--
-- Name: lessonsection_shortquestion lessonsection_shortquestion_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_shortquestion
    ADD CONSTRAINT lessonsection_shortquestion_pkey PRIMARY KEY ("Id");


--
-- Name: lessonsection_truefalse lessonsection_truefalse_path_key; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_truefalse
    ADD CONSTRAINT lessonsection_truefalse_path_key UNIQUE (path);


--
-- Name: lessonsection_truefalse lessonsection_truefalse_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lessonsection_truefalse
    ADD CONSTRAINT lessonsection_truefalse_pkey PRIMARY KEY ("Id");


--
-- Name: logindetail logindetail_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.logindetail
    ADD CONSTRAINT logindetail_pkey PRIMARY KEY ("Id");


--
-- Name: progress progress_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress
    ADD CONSTRAINT progress_pkey PRIMARY KEY ("Id");


--
-- Name: school school_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.school
    ADD CONSTRAINT school_pkey PRIMARY KEY ("Id");


--
-- Name: schoolstandard schoolstandard_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.schoolstandard
    ADD CONSTRAINT schoolstandard_pkey PRIMARY KEY ("Id");


--
-- Name: standard standard_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.standard
    ADD CONSTRAINT standard_pkey PRIMARY KEY ("Id");


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.student
    ADD CONSTRAINT student_pkey PRIMARY KEY ("Id");


--
-- Name: subject subject_pkey; Type: CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.subject
    ADD CONSTRAINT subject_pkey PRIMARY KEY ("Id");


--
-- Name: lesson lesson_subject_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.lesson
    ADD CONSTRAINT lesson_subject_fkey FOREIGN KEY (subject) REFERENCES tenanta.subject("Id");


--
-- Name: progress progress_lesson_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress
    ADD CONSTRAINT progress_lesson_fkey FOREIGN KEY (lesson) REFERENCES tenanta.lesson("Id");


--
-- Name: progress progress_lessonsection_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress
    ADD CONSTRAINT progress_lessonsection_fkey FOREIGN KEY (lessonsection) REFERENCES tenanta.lessonsection("Id");


--
-- Name: progress progress_school_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress
    ADD CONSTRAINT progress_school_fkey FOREIGN KEY (school) REFERENCES tenanta.school("Id");


--
-- Name: progress progress_standard_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress
    ADD CONSTRAINT progress_standard_fkey FOREIGN KEY (standard) REFERENCES tenanta.standard("Id");


--
-- Name: progress progress_student_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress
    ADD CONSTRAINT progress_student_fkey FOREIGN KEY (student) REFERENCES tenanta.student("Id");


--
-- Name: progress progress_subject_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.progress
    ADD CONSTRAINT progress_subject_fkey FOREIGN KEY (subject) REFERENCES tenanta.subject("Id");


--
-- Name: schoolstandard schoolstandard_school_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.schoolstandard
    ADD CONSTRAINT schoolstandard_school_fkey FOREIGN KEY (school) REFERENCES tenanta.school("Id");


--
-- Name: schoolstandard schoolstandard_standard_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.schoolstandard
    ADD CONSTRAINT schoolstandard_standard_fkey FOREIGN KEY (standard) REFERENCES tenanta.standard("Id");


--
-- Name: student student_school_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.student
    ADD CONSTRAINT student_school_fkey FOREIGN KEY (school) REFERENCES tenanta.school("Id");


--
-- Name: student student_standard_fkey; Type: FK CONSTRAINT; Schema: tenanta; Owner: root
--

ALTER TABLE ONLY tenanta.student
    ADD CONSTRAINT student_standard_fkey FOREIGN KEY (standard) REFERENCES tenanta.standard("Id");


--
-- PostgreSQL database dump complete
--

\unrestrict 3gd8LtnGu0pVnZ83cUclpfK5voD0BTmSxmtbk5PXj1J0obzgzTbdBuQWjXiQUj3

