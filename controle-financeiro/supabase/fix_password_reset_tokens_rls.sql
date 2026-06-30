-- fix_password_reset_tokens_rls.sql
-- Solução para o alerta: "password_reset_tokens públicos" com RLS desativado.
-- Habilita RLS e aplica uma política restritiva para garantir que apenas service_role possa acessar diretamente.

BEGIN;

ALTER TABLE IF EXISTS public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.password_reset_tokens FORCE ROW LEVEL SECURITY;

-- Revogar privilégios amplos do schema/tabela para roles públicos ou anon.
REVOKE ALL ON public.password_reset_tokens FROM public;
REVOKE ALL ON public.password_reset_tokens FROM anon;
REVOKE ALL ON public.password_reset_tokens FROM authenticated;

-- Remover políticas que possam estar dando acesso amplo.
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'password_reset_tokens'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.password_reset_tokens;', p.policyname);
  END LOOP;
END$$;

-- Criar uma política que nega todas as operações para roles sujeitos a RLS.
-- service_role ignora RLS e continua acessando a tabela normalmente.
DROP POLICY IF EXISTS password_reset_tokens_restrictive ON public.password_reset_tokens;
CREATE POLICY password_reset_tokens_restrictive
  ON public.password_reset_tokens
  FOR ALL
  USING (false)
  WITH CHECK (false);

COMMIT;

-- Observação:
-- Se seu app precisar de acesso direto à tabela via authenticated/anon, ajuste esta política
-- para permitir apenas operações específicas e apenas para registros pertencentes ao usuário.
