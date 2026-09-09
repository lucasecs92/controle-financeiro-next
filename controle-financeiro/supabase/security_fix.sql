BEGIN;

REVOKE ALL ON SCHEMA public FROM public;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM public;

REVOKE ALL ON SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY;', r.tablename);
  END LOOP;
END $$;

DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT DISTINCT table_name AS table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'user_id'
      AND data_type = 'uuid'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS users_view_own ON public.%I;', t.table_name);
    EXECUTE format('CREATE POLICY users_view_own ON public.%I FOR SELECT TO authenticated USING (auth.uid() = user_id);', t.table_name);

    EXECUTE format('DROP POLICY IF EXISTS users_insert_own ON public.%I;', t.table_name);
    EXECUTE format('CREATE POLICY users_insert_own ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);', t.table_name);

    EXECUTE format('DROP POLICY IF EXISTS users_update_own ON public.%I;', t.table_name);
    EXECUTE format('CREATE POLICY users_update_own ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);', t.table_name);

    EXECUTE format('DROP POLICY IF EXISTS users_delete_own ON public.%I;', t.table_name);
    EXECUTE format('CREATE POLICY users_delete_own ON public.%I FOR DELETE TO authenticated USING (auth.uid() = user_id);', t.table_name);
  END LOOP;
END $$;

COMMIT;