-- Enable RLS (already enabled, but just in case)
ALTER TABLE public.grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "anon_select_grievances" ON public.grievances;
DROP POLICY IF EXISTS "anon_insert_grievances" ON public.grievances;
DROP POLICY IF EXISTS "anon_update_grievances" ON public.grievances;
DROP POLICY IF EXISTS "anon_select_projects" ON public.projects;
DROP POLICY IF EXISTS "anon_insert_projects" ON public.projects;
DROP POLICY IF EXISTS "anon_update_projects" ON public.projects;
DROP POLICY IF EXISTS "anon_delete_projects" ON public.projects;

-- Grievances: allow anon SELECT
CREATE POLICY "anon_select_grievances"
  ON public.grievances
  FOR SELECT
  USING (true);

-- Grievances: allow anon INSERT
CREATE POLICY "anon_insert_grievances"
  ON public.grievances
  FOR INSERT
  WITH CHECK (true);

-- Grievances: allow anon UPDATE (for status changes, support counts)
CREATE POLICY "anon_update_grievances"
  ON public.grievances
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Projects: allow anon SELECT
CREATE POLICY "anon_select_projects"
  ON public.projects
  FOR SELECT
  USING (true);

-- Projects: allow anon INSERT
CREATE POLICY "anon_insert_projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (true);

-- Projects: allow anon UPDATE (for status, reorder)
CREATE POLICY "anon_update_projects"
  ON public.projects
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Projects: allow anon DELETE
CREATE POLICY "anon_delete_projects"
  ON public.projects
  FOR DELETE
  USING (true);
