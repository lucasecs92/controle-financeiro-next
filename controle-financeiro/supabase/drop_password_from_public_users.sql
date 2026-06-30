-- drop_password_from_public_users.sql
-- Script opcional para remover a coluna `password` da tabela public.users.
-- Use apenas se você tiver confirmado que a senha não é necessária na tabela
-- e que sua autenticação depende do Supabase Auth (auth.users).

BEGIN;

ALTER TABLE IF EXISTS public.users DROP COLUMN IF EXISTS password;

COMMIT;

-- Observação:
-- - Este script não remove dados em outras tabelas que possam referenciar public.users.password.
-- - Se houver dependências de constraints ou views, revise antes de rodar.
-- - Sempre execute primeiro em um ambiente de teste ou backup antes de aplicar em produção.
