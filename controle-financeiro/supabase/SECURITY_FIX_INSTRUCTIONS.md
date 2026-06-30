Passos para corrigir os problemas apontados pelo Supabase

1) Contexto rápido
- O aviso do Supabase indica que há tabelas/colunas acessíveis publicamente.
- Este repositório contém `supabase/schema.sql` e um novo script `supabase/security_fix.sql` que automatiza medidas básicas de hardening.

2) Como aplicar (Painel Supabase)
- Acesse: https://app.supabase.com -> selecione o projeto (ex.: Financeiro / amvqvmyllsfnwhkfikwj)
- Vá em `Database` -> `Query Editor`.
- Cole o conteúdo de `supabase/security_fix.sql` e execute.
- Execute também `supabase/fix_public_users_rls.sql` se sua tabela `public.users` existir e você quiser aplicar políticas específicas de usuários.
- Se a coluna `password` existir na tabela `public.users` e não for necessária, execute também `supabase/drop_password_from_public_users.sql`.
- Verifique `Database` -> `Tables` e `Policies` para confirmar alterações.

3) O que o script faz
- Revoga privilégios amplos (PUBLIC / anon) sobre o schema/tabelas/sequences/funções.
- Habilita RLS (Row Level Security) para todas as tabelas do schema `public`.
- Remove policies que explicitamente concedem acesso a `public` ou `anon`.
- Cria policies padrão para tabelas que possuam coluna `user_id`, restringindo SELECT/INSERT/UPDATE/DELETE ao dono (`auth.uid() = user_id`).

4) Recomendações adicionais
- Revise manualmente políticas específicas que precisem de regras diferentes da padrão.
- Verifique se há tabelas com colunas sensíveis (ex.: `password`, `ssn`, `cpf`, `email`) e evite expô-las em endpoints públicos. Prefira criar views/api endpoints que filtrem colunas ou usar funções RPC com validação.
- Se a chave `anon` (NEXT_PUBLIC_SUPABASE_ANON_KEY) foi publicada em algum lugar (logs, commits, CI, gist), rotacione-a no Dashboard: `Settings -> API -> Project API keys` e atualize suas variáveis de ambiente.

5) Sobre o arquivo `.env`
- Este repositório já possui `.gitignore` que ignora `.env*`.
- Confirme que você não comitou a chave em histórico (se tiver, é preciso remover com `git filter-repo` ou `bfg` e rotacionar a chave).

6) Verificação final
- No Dashboard do Supabase: `Database -> Advisories` (Security advisors) para confirmar que os avisos foram resolvidos.
- Teste o fluxo da aplicação autenticada e não autenticada para garantir que regras autorizaram o comportamento desejado.

Se quiser, aplico o script automaticamente via `supabase` CLI (se você tiver o `service_role` ou estiver logado) ou preparo comandos e checks adicionais para auditar políticas atuais no banco.