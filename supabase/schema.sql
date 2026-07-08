-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.grievances (
  id text NOT NULL,
  title text NOT NULL,
  description text,
  translated_description text,
  reporter text,
  sector text NOT NULL,
  urgency text NOT NULL,
  status text DEFAULT 'Pending'::text,
  coordinates jsonb,
  timestamp timestamp with time zone DEFAULT now(),
  impact text,
  resolved_date timestamp with time zone,
  quality_reports jsonb DEFAULT '[]'::jsonb,
  support_count integer DEFAULT 0,
  supporters jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT grievances_pkey PRIMARY KEY (id)
);
CREATE TABLE public.projects (
  id text NOT NULL,
  name text NOT NULL,
  description text,
  sector text NOT NULL,
  cost numeric NOT NULL,
  duration integer NOT NULL,
  status text DEFAULT 'Queued'::text,
  priority integer DEFAULT 99,
  created_at timestamp with time zone DEFAULT now(),
  materials text,
  is_maintenance boolean DEFAULT false,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  phone text UNIQUE,
  role text DEFAULT 'citizen'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);