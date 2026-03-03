"use client";

import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import type { Session } from "@supabase/supabase-js";
import styles from "./ResetPasswordPage.module.scss";
import {
  getSupabaseClient,
  SUPABASE_ENV_ERROR,
} from "@/lib/supabase/client";
import { getFriendlyAuthErrorMessage } from "@/features/auth/utils/authErrorMessage";

export default function ResetPasswordPage() {
  const supabase = getSupabaseClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emailFromQuery = useMemo(
    () => searchParams.get("email")?.trim() ?? "",
    [searchParams],
  );

  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(() => supabase === null);
  const [email, setEmail] = useState(emailFromQuery);
  const [isEmailReadonly, setIsEmailReadonly] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setErrorMessage(SUPABASE_ENV_ERROR);
      return;
    }

    let isMounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsAuthReady(true);

      const recoveredEmail = data.session?.user.email ?? emailFromQuery;
      if (recoveredEmail) {
        setEmail(recoveredEmail);
      }
    };

    loadSession().catch((error: unknown) => {
      if (!isMounted) {
        return;
      }

      setIsAuthReady(true);
      setErrorMessage(
        getFriendlyAuthErrorMessage(
          error instanceof Error ? error.message : "Não foi possível validar o link de recuperação.",
        ),
      );
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);

      if (nextSession?.user.email) {
        setEmail(nextSession.user.email);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [emailFromQuery, supabase]);

  useEffect(() => {
    if (!session?.user.email && emailFromQuery) {
      setEmail((currentEmail) => currentEmail || emailFromQuery);
    }
  }, [emailFromQuery, session?.user.email]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      setErrorMessage(SUPABASE_ENV_ERROR);
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Confirme seu e-mail.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    if (!session) {
      setErrorMessage("Link de recuperação inválido ou expirado. Solicite um novo link.");
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(getFriendlyAuthErrorMessage(error.message));
      return;
    }

    setInfoMessage("Senha alterada com sucesso. Redirecionando para o login...");
    setPassword("");
    setPasswordConfirmation("");

    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    redirectTimeoutRef.current = globalThis.setTimeout(() => {
      router.push("/");
    }, 1800);
  };

  return (
    <section className={styles.resetContainer}>
      <section className={`${styles.resetCard} ${styles.loginFormContainer}`}>
        <h2 className={styles.welcomeText}>Redefinir Senha</h2>

        {errorMessage && (
          <p className={`${styles.alertMessage} ${styles.errorMessage}`}>{errorMessage}</p>
        )}

        {infoMessage && (
          <p className={`${styles.alertMessage} ${styles.infoMessage}`}>{infoMessage}</p>
        )}

        {isAuthReady && !session && !infoMessage && (
          <p className={`${styles.alertMessage} ${styles.warningMessage}`}>
            Abra esta página pelo link recebido no e-mail de recuperação de senha.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <section className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              required
              autoFocus
              placeholder="Confirme seu e-mail"
              readOnly={isEmailReadonly}
              onFocus={() => setIsEmailReadonly(false)}
              onChange={(event) => setEmail(event.target.value)}
            />
          </section>

          <section className={styles.formGroup}>
            <label htmlFor="password">Nova Senha</label>
            <section className={styles.passwordInputWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Nova senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <VscEyeClosed /> : <VscEye />}
              </button>
            </section>
          </section>

          <section className={styles.formGroup}>
            <label htmlFor="password-confirm">Confirmar Senha</label>
            <section className={styles.passwordInputWrapper}>
              <input
                id="password-confirm"
                type={showPasswordConfirmation ? "text" : "password"}
                name="password_confirmation"
                required
                placeholder="Repita a senha"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
              />

              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPasswordConfirmation((current) => !current)}
                aria-label={
                  showPasswordConfirmation ? "Esconder confirmacao de senha" : "Mostrar senha"
                }
              >
                {showPasswordConfirmation ? <VscEyeClosed /> : <VscEye />}
              </button>
            </section>
          </section>

          <button
            type="submit"
            className={styles.btnLogin}
            style={{ marginTop: "20px" }}
            disabled={isSubmitting || !isAuthReady || !session}
          >
            Alterar Senha
          </button>
        </form>
      </section>
    </section>
  );
}
