-- fix_failed_jobs_rls.sql
-- Solução para o alerta: "Entidade empregadores_falhados_públicos / public.failed_jobs"
-- Revoga acesso de anon/public/authenticated e aplica RLS com política restritiva.

BEGIN;

ALTER TABLE IF EXISTS public.failed_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.failed_jobs FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.failed_jobs FROM public;
REVOKE ALL ON public.failed_jobs FROM anon;
REVOKE ALL ON public.failed_jobs FROM authenticated;

DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'failed_jobs'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.failed_jobs;', p.policyname);
  END LOOP;
END$$;

DROP POLICY IF EXISTS failed_jobs_restrictive ON public.failed_jobs;
CREATE POLICY failed_jobs_restrictive
  ON public.failed_jobs
  FOR ALL
  USING (false)
  WITH CHECK (false);

COMMIT;

-- Observação:
-- Esta tabela não deve ser visível para clientes anônimos nem autenticados via GraphQL.
-- Apenas a role service_role do Supabase deve continuar a acessá-la, pois ignora RLS.
