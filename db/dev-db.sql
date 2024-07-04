--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.3 (Ubuntu 16.3-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: resource_actions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_actions (
    id integer NOT NULL,
    local_resource_id integer NOT NULL,
    action text NOT NULL,
    user_id integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.resource_actions OWNER TO admin;

--
-- Name: resource_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resource_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_actions_id_seq OWNER TO admin;

--
-- Name: resource_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resource_actions_id_seq OWNED BY public.resource_actions.id;


--
-- Name: resource_types; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_types (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(255) NOT NULL
);


ALTER TABLE public.resource_types OWNER TO admin;

--
-- Name: resource_types_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resource_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_types_id_seq OWNER TO admin;

--
-- Name: resource_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resource_types_id_seq OWNED BY public.resource_types.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    type integer NOT NULL,
    name character varying(300) NOT NULL,
    aws_resource_id character varying(300) NOT NULL,
    tags text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by integer NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.resources OWNER TO admin;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_id_seq OWNER TO admin;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role character varying(30) NOT NULL
);


ALTER TABLE public.roles OWNER TO admin;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO admin;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: ssh_keys; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ssh_keys (
    id integer NOT NULL,
    name character varying(300) NOT NULL,
    key_pair_type character varying(20) NOT NULL,
    private_key_file_format character varying(20) NOT NULL,
    key_access_type character varying(20) NOT NULL,
    private_key_value text NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ssh_keys OWNER TO admin;

--
-- Name: ssh_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ssh_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ssh_keys_id_seq OWNER TO admin;

--
-- Name: ssh_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ssh_keys_id_seq OWNED BY public.ssh_keys.id;


--
-- Name: user_invites; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_invites (
    id integer NOT NULL,
    uuid text NOT NULL,
    role integer NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false
);


ALTER TABLE public.user_invites OWNER TO admin;

--
-- Name: user_invites_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_invites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_invites_id_seq OWNER TO admin;

--
-- Name: user_invites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_invites_id_seq OWNED BY public.user_invites.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: resource_actions id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_actions ALTER COLUMN id SET DEFAULT nextval('public.resource_actions_id_seq'::regclass);


--
-- Name: resource_types id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_types ALTER COLUMN id SET DEFAULT nextval('public.resource_types_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: ssh_keys id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ssh_keys ALTER COLUMN id SET DEFAULT nextval('public.ssh_keys_id_seq'::regclass);


--
-- Name: user_invites id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_invites ALTER COLUMN id SET DEFAULT nextval('public.user_invites_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: resource_actions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_actions (id, local_resource_id, action, user_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: resource_types; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resource_types (id, name, description, category) FROM stdin;
1	Amazon EC2	Amazon Elastic Compute Cloud (Amazon EC2) is a cloud service that provides resizable virtual servers to run applications. It allows users to configure capacity with minimal friction and provides control of computing resources.	Compute
2	Amazon RDS	Amazon Relational Database Service (Amazon RDS) is a managed service that makes it easier to set up, operate, and scale a relational database in the cloud. It automates time-consuming tasks such as hardware provisioning, database setup, patching, and backups.	Database
3	Amazon S3	Amazon Simple Storage Service (Amazon S3) is a scalable storage service that allows users to store and retrieve any amount of data, at any time, from anywhere on the web. It offers a simple web interface for storing and managing data with high durability and availability.	Storage
4	AWS Lambda	AWS Lambda is a serverless computing service that runs code in response to events and automatically manages the computing resources required by that code. It allows users to run code for virtually any type of application or backend service with zero administration.	Compute
5	Amazon ECS	Amazon Elastic Container Service (Amazon ECS) is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications. It allows you to run and maintain a specified number of instances of a containerized application across a cluster of Amazon EC2 instances.	Containers
6	Amazon EBS	Amazon Elastic Block Store (Amazon EBS) provides persistent block storage volumes for use with Amazon EC2 instances. These volumes can be attached to any running EC2 instance, making it easier to scale storage capacity and preserve data beyond the life of a single EC2 instance.	Storage
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.resources (id, type, name, aws_resource_id, tags, created_at, created_by, active) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.roles (id, role) FROM stdin;
1	root
2	admin
3	user
\.


--
-- Data for Name: ssh_keys; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ssh_keys (id, name, key_pair_type, private_key_file_format, key_access_type, private_key_value, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: user_invites; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_invites (id, uuid, role, created_by, created_at, expires_at, used) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.users (id, username, password_hash, email, role, created_at) FROM stdin;
1	root	$2a$10$DBEM4vsmKCmT9JC1TsZMe.VNDg.iTsEL1NP7Z9xyO6xKSalnwFpxW	root@deisi25.tfc	1	2024-01-09 06:58:56.152767
2	test	$2a$10$F14lHBQeLpTWkR/.UtKcZuMJP4wIoDqOGpGqjyLVLDSt0vpOPPA86	test@deisi25.tfc	2	2024-01-09 06:59:25.233209
3	john	$2a$10$ioCMXlqSUHkhpDgni8VdPO1tXAc2hBrhYrh/QseecFANLgjUin3sK	john@deisi25.tfc	3	2024-01-09 06:59:52.815116
\.


--
-- Name: resource_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.resource_actions_id_seq', 1, false);


--
-- Name: resource_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.resource_types_id_seq', 6, true);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.resources_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: ssh_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ssh_keys_id_seq', 1, false);


--
-- Name: user_invites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_invites_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: resource_actions resource_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_actions
    ADD CONSTRAINT resource_actions_pkey PRIMARY KEY (id);


--
-- Name: resource_types resource_types_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_types
    ADD CONSTRAINT resource_types_name_key UNIQUE (name);


--
-- Name: resource_types resource_types_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_types
    ADD CONSTRAINT resource_types_pkey PRIMARY KEY (id);


--
-- Name: resources resources_aws_resource_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_aws_resource_id_key UNIQUE (aws_resource_id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: ssh_keys ssh_keys_name_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ssh_keys
    ADD CONSTRAINT ssh_keys_name_key UNIQUE (name);


--
-- Name: ssh_keys ssh_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ssh_keys
    ADD CONSTRAINT ssh_keys_pkey PRIMARY KEY (id);


--
-- Name: user_invites user_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_invites
    ADD CONSTRAINT user_invites_pkey PRIMARY KEY (id);


--
-- Name: user_invites user_invites_uuid_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_invites
    ADD CONSTRAINT user_invites_uuid_key UNIQUE (uuid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: user_invites fk_created_by; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_invites
    ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: user_invites fk_role; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_invites
    ADD CONSTRAINT fk_role FOREIGN KEY (role) REFERENCES public.roles(id);


--
-- Name: ssh_keys fk_user; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ssh_keys
    ADD CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: resource_actions resource_actions_local_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_actions
    ADD CONSTRAINT resource_actions_local_resource_id_fkey FOREIGN KEY (local_resource_id) REFERENCES public.resources(id);


--
-- Name: resource_actions resource_actions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_actions
    ADD CONSTRAINT resource_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: resources resources_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: resources resources_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_type_fkey FOREIGN KEY (type) REFERENCES public.resource_types(id);


--
-- Name: users users_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--

