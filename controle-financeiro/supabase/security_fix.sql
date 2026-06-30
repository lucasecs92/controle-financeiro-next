-- security_fix.sql
-- Script para aplicar no SQL Editor do Supabase (ou via supabase CLI).
-- Objetivo: habilitar Row Level Security (RLS) em todas as tabelas, revogar privilégios públicos,
-- remover policies que concedem acesso a "public" e criar policies padrão para tabelas com coluna user_id.

BEGIN;

-- 1) Revogar privilégios amplos de PUBLIC (esquema, tabelas, sequências e funções)
REVOKE ALL ON SCHEMA public FROM public;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM public;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM public;

-- 2) Revogar privilégios do papel anon (Supabase) como precaução
REVOKE ALL ON SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- 3) Habilitar RLS para todas as tabelas do schema public
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
  END LOOP;
END$$;

-- 4) Dropar políticas que explicitamente concedem acesso a public (quando possível)
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public' AND (roles::text ILIKE '%public%' OR roles::text ILIKE '%anon%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', p.policyname, p.tablename);
  END LOOP;
END$$;

-- 5) Para todas as tabelas que têm coluna `user_id`, criar policies básicas que restringem
-- operações ao usuário proprietário (auth.uid() = user_id). Se já existirem, será feito DROP/CREATE.
DO $$
DECLARE
  t RECORD;
BEGIN
  FOR t IN
    SELECT DISTINCT table_name FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'user_id'
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
END$$;

-- 6) Proteção específica para public.users, se estiver presente.
DO $$
DECLARE
  u_exists boolean;
  p RECORD;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) INTO u_exists;

  IF u_exists THEN
    EXECUTE 'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.users FORCE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON public.users FROM public';
    EXECUTE 'REVOKE ALL ON public.users FROM anon';
    EXECUTE 'REVOKE ALL ON public.users FROM authenticated';

    FOR p IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'users'
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.users;', p.policyname);
    END LOOP;

    EXECUTE 'CREATE POLICY users_select_self ON public.users FOR SELECT TO authenticated USING (id = auth.uid())';
    EXECUTE 'CREATE POLICY users_update_self ON public.users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid())';
    EXECUTE 'CREATE POLICY users_insert_self ON public.users FOR INSERT TO authenticated WITH CHECK (id = auth.uid())';
    EXECUTE 'CREATE POLICY users_delete_self ON public.users FOR DELETE TO authenticated USING (id = auth.uid())';
  END IF;
END$$;

COMMIT;

-- Observações:
-- - Execute este script no SQL Editor do Supabase (Database -> Query Editor) conectado ao projeto correto.
-- - Analise o resultado e, se alguma tabela exigir políticas mais específicas, ajuste manualmente.
-- - Após aplicar, verifique em "Database > Policies" se as regras ficaram corretas.
-- - Não remove automaticamente colunas sensíveis; remova exposição nas queries do backend/frontend.
