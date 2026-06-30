-- fix_migrations_rls.sql
-- Solução para o alerta: "RLS Desativado em Entidade Pública: public.migrations"
-- Revoga acesso a public.migrations para anon e authenticated (Solução A recomendada)

BEGIN;

-- Revogar privilégios de anon e authenticated na tabela public.migrations
REVOKE ALL ON public.migrations FROM anon;
REVOKE ALL ON public.migrations FROM authenticated;

-- Garantir que RLS está habilitado também para esta tabela como precaução
ALTER TABLE public.migrations ENABLE ROW LEVEL SECURITY;

-- Remover qualquer policy que permita acesso público a migrations
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'migrations'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.migrations;', p.policyname);
  END LOOP;
END$$;

-- Criar políticas RLS restritivas para evitar alerta de "RLS ativado, mas sem políticas"
-- Permite apenas usuários com claim JWT is_admin = 'true' (clientes sem esse claim não terão acesso)
DROP POLICY IF EXISTS migrations_select_admin ON public.migrations;
CREATE POLICY migrations_select_admin ON public.migrations FOR SELECT USING ( (auth.jwt() ->> 'is_admin') = 'true' );
DROP POLICY IF EXISTS migrations_insert_admin ON public.migrations;
CREATE POLICY migrations_insert_admin ON public.migrations FOR INSERT WITH CHECK ( (auth.jwt() ->> 'is_admin') = 'true' );
DROP POLICY IF EXISTS migrations_update_admin ON public.migrations;
CREATE POLICY migrations_update_admin ON public.migrations FOR UPDATE USING ( (auth.jwt() ->> 'is_admin') = 'true' ) WITH CHECK ( (auth.jwt() ->> 'is_admin') = 'true' );
DROP POLICY IF EXISTS migrations_delete_admin ON public.migrations;
CREATE POLICY migrations_delete_admin ON public.migrations FOR DELETE USING ( (auth.jwt() ->> 'is_admin') = 'true' );

COMMIT;

-- Explicação:
-- - public.migrations é uma tabela interna do Supabase para rastrear migrações do banco.
-- - Não há razão para clientes (anon/authenticated) acessarem esta tabela.
-- - Apenas o serviço backend (service_role) precisa acessar.
-- - Após isso, o alerta deve desaparecer em 5-15 minutos.
