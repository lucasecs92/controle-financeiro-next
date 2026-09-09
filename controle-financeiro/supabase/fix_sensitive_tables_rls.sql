-- fix_sensitive_tables_rls.sql
-- Corrige os avisos de colunas sensíveis e protege tabelas internas do Supabase.
-- Executar no SQL Editor do projeto correto.

BEGIN;

-- 1) Revogar acesso público e anon para as tabelas sensíveis e para o schema auth
REVOKE ALL ON public.users FROM public;
REVOKE ALL ON public.users FROM anon;
REVOKE ALL ON public.users FROM authenticated;

REVOKE ALL ON public.transactions FROM public;
REVOKE ALL ON public.transactions FROM anon;
REVOKE ALL ON public.transactions FROM authenticated;

REVOKE ALL ON public.sessions FROM public;
REVOKE ALL ON public.sessions FROM anon;
REVOKE ALL ON public.sessions FROM authenticated;

REVOKE ALL ON public.password_reset_tokens FROM public;
REVOKE ALL ON public.password_reset_tokens FROM anon;
REVOKE ALL ON public.password_reset_tokens FROM authenticated;

REVOKE ALL ON public.personal_access_tokens FROM public;
REVOKE ALL ON public.personal_access_tokens FROM anon;
REVOKE ALL ON public.personal_access_tokens FROM authenticated;

REVOKE ALL ON SCHEMA auth FROM public;
REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM public;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM public;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA auth FROM public;

REVOKE ALL ON SCHEMA auth FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA auth FROM anon;

REVOKE ALL ON SCHEMA auth FROM authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA auth FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA auth FROM authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA auth FROM authenticated;

-- 2) Habilitar RLS em tabelas sensíveis
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.transactions FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sessions FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.password_reset_tokens FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.personal_access_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.personal_access_tokens FORCE ROW LEVEL SECURITY;

-- 3) Remover colunas sensíveis da tabela users, se existirem
-- Atenção: estas colunas normalmente não devem ficar em public.users.
ALTER TABLE IF EXISTS public.users DROP COLUMN IF EXISTS password;
ALTER TABLE IF EXISTS public.users DROP COLUMN IF EXISTS remember_token;

-- 4) Remover policies antigas das tabelas sensíveis
DO $$
DECLARE
  p RECORD;
BEGIN
  FOR p IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('users', 'transactions', 'sessions', 'password_reset_tokens', 'personal_access_tokens')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', p.policyname, p.tablename);
  END LOOP;
END $$;

-- 5) Política de usuários e transações: usa auth.uid() somente se a coluna for UUID.
DO $$
DECLARE
  has_uuid_id boolean;
  has_uuid_user_id boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'id'
      AND data_type = 'uuid'
  ) INTO has_uuid_id;

  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'transactions'
      AND column_name = 'user_id'
      AND data_type = 'uuid'
  ) INTO has_uuid_user_id;

  IF has_uuid_id THEN
    DROP POLICY IF EXISTS users_select_own ON public.users;
    CREATE POLICY users_select_own
      ON public.users
      FOR SELECT TO authenticated
      USING (id = auth.uid());

    DROP POLICY IF EXISTS users_update_own ON public.users;
    CREATE POLICY users_update_own
      ON public.users
      FOR UPDATE TO authenticated
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());

    DROP POLICY IF EXISTS users_insert_own ON public.users;
    CREATE POLICY users_insert_own
      ON public.users
      FOR INSERT TO authenticated
      WITH CHECK (id = auth.uid());

    DROP POLICY IF EXISTS users_delete_own ON public.users;
    CREATE POLICY users_delete_own
      ON public.users
      FOR DELETE TO authenticated
      USING (id = auth.uid());
  ELSE
    DROP POLICY IF EXISTS users_block_all ON public.users;
    CREATE POLICY users_block_all
      ON public.users
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);
  END IF;

  IF has_uuid_user_id THEN
    DROP POLICY IF EXISTS transactions_select_own ON public.transactions;
    CREATE POLICY transactions_select_own
      ON public.transactions
      FOR SELECT TO authenticated
      USING (user_id = auth.uid());

    DROP POLICY IF EXISTS transactions_insert_own ON public.transactions;
    CREATE POLICY transactions_insert_own
      ON public.transactions
      FOR INSERT TO authenticated
      WITH CHECK (user_id = auth.uid());

    DROP POLICY IF EXISTS transactions_update_own ON public.transactions;
    CREATE POLICY transactions_update_own
      ON public.transactions
      FOR UPDATE TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());

    DROP POLICY IF EXISTS transactions_delete_own ON public.transactions;
    CREATE POLICY transactions_delete_own
      ON public.transactions
      FOR DELETE TO authenticated
      USING (user_id = auth.uid());
  ELSE
    DROP POLICY IF EXISTS transactions_block_all ON public.transactions;
    CREATE POLICY transactions_block_all
      ON public.transactions
      FOR ALL TO authenticated
      USING (false)
      WITH CHECK (false);
  END IF;
END $$;

-- 6) Sessões: bloqueia acesso direto até o schema de sessão ficar consistente
DROP POLICY IF EXISTS sessions_block_all ON public.sessions;
CREATE POLICY sessions_block_all
  ON public.sessions
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

-- 7) Proteger tabelas de tokens e reset de senha
DROP POLICY IF EXISTS password_reset_tokens_block_all ON public.password_reset_tokens;
CREATE POLICY password_reset_tokens_block_all
  ON public.password_reset_tokens
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS personal_access_tokens_block_all ON public.personal_access_tokens;
CREATE POLICY personal_access_tokens_block_all
  ON public.personal_access_tokens
  FOR ALL TO authenticated
  USING (false)
  WITH CHECK (false);

COMMIT;

-- Observações:
-- - Se a sua aplicação realmente precisa expor dados públicos de perfil, prefira criar uma view
--   segura em vez de expor a tabela users inteira.
-- - O recurso de leaked password protection do Supabase depende do plano Pro e não pode ser
--   habilitado em planos menores.
-- - Após aplicar, valide em Dashboard do Supabase: Database -> Policies e Database -> Advisories.
