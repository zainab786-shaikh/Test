--
-- PostgreSQL database dump
--

\restrict LkyZgCPlZizsoolOWPZ26RPJSrPOqtOMoXxj37NaTTckAg7YPdbhsKIsW3Li5mV

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
-- Data for Name: lessonsection; Type: TABLE DATA; Schema: tenanta; Owner: root
--

COPY tenanta.lessonsection ("Id", name, path, "lessoninfoId", "quizId", "fillblanksId", "truefalseId", "shortquestionId", subject, lesson) FROM stdin;
2	Threading Concepts and Execution	ZY.T01.L01.S02	\N	\N	\N	\N	\N	1	1
3	Process vs. Thread Comparison	ZY.T01.L01.S03	\N	\N	\N	\N	\N	1	2
4	Synchronization and Concurrency Challenges	ZY.T01.L01.S04	\N	\N	\N	\N	\N	1	3
5	Advanced Concurrency Techniques	ZY.T01.L01.S05	\N	\N	\N	\N	\N	1	4
1	Process Management Fundamentals	ZY.T01.L01.S01	1	1	1	1	1	1	1
\.


--
-- Data for Name: lessonsection_fillblanks; Type: TABLE DATA; Schema: tenanta; Owner: root
--

COPY tenanta.lessonsection_fillblanks ("Id", path, data) FROM stdin;
1	ZY.T01.L01.S01	[{"answer": "process management", "question": "The fundamentals of **_____** in operating systems revolve around the execution of independent programs.", "explanation": "Process management is the core concept that oversees how programs (processes) run independently on a system.", "answer_embedding": null}, {"answer": "memory space", "question": "A process is a program in execution, characterized by its own **_____**, file descriptors, and system resources.", "explanation": "Memory space ensures isolation and security by preventing interference between processes.", "answer_embedding": null}, {"answer": "process state transitions", "question": "Key concepts in process management include **_____**, where processes move between active, blocked, ready, and terminated states.", "explanation": "State transitions define how processes change phases (e.g., running, waiting) under OS control.", "answer_embedding": null}, {"answer": "process synchronization", "question": "To prevent race conditions, processes use mechanisms like **_____**, semaphores, and mutex locks.", "explanation": "Synchronization ensures coordinated execution by managing shared resources safely.", "answer_embedding": null}, {"answer": "sockets", "question": "Advanced IPC techniques, such as pipes, shared memory, and **_____**, enable data exchange between processes.", "explanation": "Sockets allow inter-process communication over networks, enabling distributed systems.", "answer_embedding": null}]
\.


--
-- Data for Name: lessonsection_lessoninfo; Type: TABLE DATA; Schema: tenanta; Owner: root
--

COPY tenanta.lessonsection_lessoninfo ("Id", path, data) FROM stdin;
1	ZY.T01.L01.S01	{"summary": ["Process management is how computers handle different tasks running at the same time, like each task getting its own space and resources.", "When a task starts, the computer assigns things like memory and CPU time, and it can pause or stop if needed."], "examples": ["When you’re playing a video game and your mom opens her email on the same computer, both games are like different chefs cooking at the same time—each needs its own space to run smoothly.", "Think of a busy restaurant where servers (processes) take orders (tasks) from different tables (memory). If two servers try to serve the same dish at once, they use a system where only one can serve at a time (like a lock) to avoid chaos."], "paragraph": null, "explanation": "Imagine your computer is like a big kitchen where chefs (tasks) are cooking different dishes (programs). Each chef has their own table (memory), oven (CPU), and pots (resources). When one chef finishes, the kitchen manager (computer) decides who gets to cook next or if they need to wait. To keep things fair, they use rules like taking turns (Round Robin) or giving priority to important dishes. If two chefs try to cook the same food at the same time, they use special tools (like locks) to avoid messes (conflicts)."}
\.


--
-- Data for Name: lessonsection_quiz; Type: TABLE DATA; Schema: tenanta; Owner: root
--

COPY tenanta.lessonsection_quiz ("Id", path, data) FROM stdin;
1	ZY.T01.L01.S01	[{"answer": "Distinct memory space and isolation", "options": ["Shared memory space", "Static execution", "Distinct memory space and isolation", "Same CPU allocation"], "question": "What is the primary characteristic that distinguishes a process from a program?", "explanation": "A process is an instance of a program in execution with its own memory space, ensuring isolation and security from other processes.", "answer_embedding": null}, {"answer": "Blocked", "options": ["Ready", "Running", "Blocked", "Terminated"], "question": "Which process state represents a process waiting for an I/O operation to complete?", "explanation": "The blocked state indicates a process is waiting for an external event, such as I/O completion, before resuming execution.", "answer_embedding": null}, {"answer": "Semaphores", "options": ["Shared memory", "Semaphores", "Priority scheduling", "Pipes"], "question": "What mechanism is used to synchronize processes and prevent race conditions?", "explanation": "Semaphores are synchronization tools that control access to shared resources, ensuring orderly execution and avoiding race conditions.", "answer_embedding": null}, {"answer": "Round Robin", "options": ["Priority-based", "FCFS (First-Come-First-Served)", "Round Robin", "Multilevel Feedback Queue"], "question": "Which scheduling algorithm assigns CPU time in a round-robin fashion?", "explanation": "Round Robin allocates CPU time in fixed time slices, ensuring fair and cyclic process execution.", "answer_embedding": null}, {"answer": "To enable data exchange between processes", "options": ["To share CPU time", "To enable data exchange between processes", "To manage process termination", "To allocate memory dynamically"], "question": "What is the primary purpose of inter-process communication (IPC) techniques like pipes?", "explanation": "IPC mechanisms like pipes allow processes to communicate and share data efficiently, facilitating collaboration in multi-tasking systems.", "answer_embedding": null}]
\.


--
-- Data for Name: lessonsection_shortquestion; Type: TABLE DATA; Schema: tenanta; Owner: root
--

COPY tenanta.lessonsection_shortquestion ("Id", path, data) FROM stdin;
1	ZY.T01.L01.S01	[{"answer": "A process is a running instance of a program with its own memory space, file descriptors, and allocated system resources, ensuring isolation and security.", "question": "What are the key characteristics that define a process as distinct from a program?", "answer_embedding": null}, {"answer": "The OS manages a process’s lifecycle through stages like creation, execution, suspension, and termination, allocating resources dynamically during these phases.", "question": "How does the operating system manage the lifecycle of a process?", "answer_embedding": null}, {"answer": "Processes transition between active (running), blocked (waiting), ready (queued), and terminated states; scheduling algorithms like Round Robin or Priority-based are used to manage these transitions.", "question": "What are the primary process state transitions, and which scheduling algorithm is commonly used to govern them?", "answer_embedding": null}, {"answer": "Process synchronization relies on mechanisms such as semaphores, mutex locks, and message passing to coordinate execution and avoid conflicts.", "question": "What mechanisms are used for process synchronization to prevent race conditions and deadlocks?", "answer_embedding": null}, {"answer": "IPC techniques like pipes and shared memory allow processes to share data securely and efficiently, enabling seamless communication in multi-tasking systems.", "question": "How do inter-process communication (IPC) techniques like pipes and shared memory enable data exchange between independent processes?", "answer_embedding": null}]
\.


--
-- Data for Name: lessonsection_truefalse; Type: TABLE DATA; Schema: tenanta; Owner: root
--

COPY tenanta.lessonsection_truefalse ("Id", path, data) FROM stdin;
1	ZY.T01.L01.S01	[{"answer": "False", "options": ["True", "False"], "question": "A process is the same as a program in its static form."}, {"answer": "True", "options": ["True", "False"], "question": "Each process has its own separate memory space for isolation and security."}, {"answer": "False", "options": ["True", "False"], "question": "Processes transition between states like active, blocked, and terminated without the involvement of scheduling algorithms."}, {"answer": "True", "options": ["True", "False"], "question": "Semaphores are a mechanism used to prevent race conditions in process synchronization."}, {"answer": "True", "options": ["True", "False"], "question": "Pipes are an example of inter-process communication (IPC) that allows data exchange between processes without shared memory."}]
\.


--
-- Data for Name: subject; Type: TABLE DATA; Schema: tenanta; Owner: root
--

COPY tenanta.subject ("Id", path, name) FROM stdin;
1	ZY.T01	Operating Systems
\.


--
-- Name: lessonsection_Id_seq; Type: SEQUENCE SET; Schema: tenanta; Owner: root
--

SELECT pg_catalog.setval('tenanta."lessonsection_Id_seq"', 5, true);


--
-- Name: lessonsection_fillblanks_Id_seq; Type: SEQUENCE SET; Schema: tenanta; Owner: root
--

SELECT pg_catalog.setval('tenanta."lessonsection_fillblanks_Id_seq"', 1, true);


--
-- Name: lessonsection_lessoninfo_Id_seq; Type: SEQUENCE SET; Schema: tenanta; Owner: root
--

SELECT pg_catalog.setval('tenanta."lessonsection_lessoninfo_Id_seq"', 1, true);


--
-- Name: lessonsection_quiz_Id_seq; Type: SEQUENCE SET; Schema: tenanta; Owner: root
--

SELECT pg_catalog.setval('tenanta."lessonsection_quiz_Id_seq"', 1, true);


--
-- Name: lessonsection_shortquestion_Id_seq; Type: SEQUENCE SET; Schema: tenanta; Owner: root
--

SELECT pg_catalog.setval('tenanta."lessonsection_shortquestion_Id_seq"', 1, true);


--
-- Name: lessonsection_truefalse_Id_seq; Type: SEQUENCE SET; Schema: tenanta; Owner: root
--

SELECT pg_catalog.setval('tenanta."lessonsection_truefalse_Id_seq"', 1, true);


--
-- Name: subject_Id_seq; Type: SEQUENCE SET; Schema: tenanta; Owner: root
--

SELECT pg_catalog.setval('tenanta."subject_Id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict LkyZgCPlZizsoolOWPZ26RPJSrPOqtOMoXxj37NaTTckAg7YPdbhsKIsW3Li5mV

