# Controle Financeiro

Aplicação Next.js com autenticação via Supabase (e-mail/senha e Google OAuth) e dashboard de transações.

## 1. Configuração local

1. Instale as dependências:
```bash
npm install
```
2. Crie `.env.local` com base em `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```
3. No Supabase, execute o SQL em `supabase/schema.sql`.
4. Rode o projeto:
```bash
npm run dev
```

## 2. Habilitar cadastro/login com Google

Para o botão "Registre-se com o Google" funcionar, configure o provider no Supabase:

1. Abra `Supabase > Authentication > Providers > Google`.
2. Ative o provider Google.
3. Crie as credenciais OAuth no Google Cloud e informe `Client ID` e `Client Secret` no Supabase.
4. Em URLs de redirecionamento autorizadas no Google Cloud, inclua:
```text
https://<SEU_PROJECT_REF>.supabase.co/auth/v1/callback
```
5. Em `Supabase > Authentication > URL Configuration`, adicione os redirect URLs do app:
```text
http://localhost:3000/
https://seu-dominio.com/
```

Observação: com Supabase, `signInWithOAuth` cria usuário novo automaticamente quando o e-mail Google ainda não existe no projeto. Se o e-mail já existir, o fluxo faz login.

## 3. Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de produção
- `npm run start`: iniciar build de produção
- `npm run lint`: lint do projeto
