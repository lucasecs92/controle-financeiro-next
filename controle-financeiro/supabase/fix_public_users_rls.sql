-- fix_public_users_rls.sql
-- Script para proteger a tabela public.users no Supabase.
-- Aplica RLS, força RLS e remove acesso direto público/anon/authenticated.

BEGIN;

-- 1) Habilitar RLS e forçar RLS na tabela public.users
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users FORCE ROW LEVEL SECURITY;

-- 2) Revogar privilégios amplos na tabela de usuários
REVOKE ALL ON public.users FROM public;
REVOKE ALL ON public.users FROM anon;
REVOKE ALL ON public.users FROM authenticated;

-- 3) Remover quaisquer políticas existentes da tabela users
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.users;', p.policyname);
  END LOOP;
END$$;

-- 4) Criar políticas restritas de acesso à própria linha do usuário
CREATE POLICY IF NOT EXISTS users_select_self
  ON public.users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS users_update_self
  ON public.users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY IF NOT EXISTS users_insert_self
  ON public.users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY IF NOT EXISTS users_delete_self
  ON public.users FOR DELETE
  TO authenticated
  USING (id = auth.uid());

COMMIT;

-- Observação:
-- Este script corrige a exposição de public.users via API de dados do Supabase.
-- Se a coluna `password` existir e não for necessária, remova-a manualmente com:
-- ALTER TABLE public.users DROP COLUMN IF EXISTS password;
-- Se precisar expor dados de perfil públicos, crie uma view que exclua colunas sensíveis.
