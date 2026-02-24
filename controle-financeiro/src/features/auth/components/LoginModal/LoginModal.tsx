"use client";

import styles from "./LoginModal.module.scss";
import { useEffect, useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import {
  getSupabaseClient,
  SUPABASE_ENV_ERROR,
} from "@/lib/supabase/client";
import { getFriendlyAuthErrorMessage } from "@/features/auth/utils/authErrorMessage";

interface LoginModalProps {
  readonly onClose: () => void;
  readonly onOpenRegister: () => void;
}

export default function LoginModal({
  onClose,
  onOpenRegister,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleLoginSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabase = getSupabaseClient();

    if (!supabase) {
      setErrorMessage(SUPABASE_ENV_ERROR);
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    onClose();
  };

  const handleForgotPassword = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setErrorMessage(SUPABASE_ENV_ERROR);
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Informe seu e-mail para recuperar a senha.");
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${globalThis.location.origin}/`,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setInfoMessage("Verifique seu e-mail para redefinir sua senha.");
  };

  const handleGoogleLogin = async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      setErrorMessage(SUPABASE_ENV_ERROR);
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}/`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setIsSubmitting(false);
      setErrorMessage(getFriendlyAuthErrorMessage(error.message));
    }
  };

  return (
    <section className={styles.modal}>
      <section className={styles.modalWrap}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <IoClose />
        </button>

        <section className={styles.loginFormContainer}>
          <h2 id="login-title" className={styles.welcomeText}>
            Bem-vindo(a)
          </h2>

          {errorMessage && (
            <section className={styles.errorMessageWrap}>
              <p className={styles.errorMessage}>{errorMessage}</p>
            </section>
          )}

          {infoMessage && (
            <section className={styles.infoMessageWrap}>
              <p className={styles.infoMessage}>{infoMessage}</p>
            </section>
          )}

          <form onSubmit={handleLoginSubmit}>
            {/* EMAIL */}
            <section className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="nome@email.com"
                required
                className={styles.passwordInput}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </section>

            {/* SENHA */}
            <section className={styles.formGroup}>
              <label htmlFor="password">Senha</label>

              <section className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Senha"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <VscEyeClosed /> : <VscEye />}
                </button>
              </section>
            </section>

            <section className={styles.forgotPasswordWrap}>
              <button
                type="button"
                className={styles.forgotPassword}
                onClick={handleForgotPassword}
                disabled={isSubmitting}
              >
                Esqueceu a senha?
              </button>
            </section>

            <button type="submit" className={styles.btnLogin} disabled={isSubmitting}>
              Fazer login
            </button>
          </form>

          <section className={styles.divider}>Ou</section>

          <button
            type="button"
            className={styles.btnGoogle}
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <FcGoogle />
            <span>Fazer login com o Google</span>
          </button>

          <p className={styles.registerPrompt}>
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
            >
              Cadastre-se
            </button>
          </p>
        </section>
      </section>
    </section>
  );
}
