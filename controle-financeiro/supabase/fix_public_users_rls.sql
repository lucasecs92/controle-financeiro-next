BEGIN;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.users FROM public;
REVOKE ALL ON public.users FROM anon;
REVOKE ALL ON public.users FROM authenticated;

DROP POLICY IF EXISTS users_block_all ON public.users;
CREATE POLICY users_block_all
ON public.users
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);

COMMIT;