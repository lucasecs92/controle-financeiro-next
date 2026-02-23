"use client";

import styles from "./RegisterModal.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";
import {
  getSupabaseClient,
  SUPABASE_ENV_ERROR,
} from "@/lib/supabase/client";
import { getFriendlyAuthErrorMessage } from "@/features/auth/utils/authErrorMessage";

interface RegisterModalProps {
  readonly onClose: () => void;
  readonly onOpenLogin?: () => void;
}

export default function RegisterModal({
  onClose,
  onOpenLogin,
}: RegisterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  const handleRegisterSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      setErrorMessage(SUPABASE_ENV_ERROR);
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      onClose();
      return;
    }

    setInfoMessage("Cadastro criado. Confirme seu e-mail para concluir o acesso.");
  };

  const handleGoogleRegister = async () => {
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
        redirectTo: `${window.location.origin}/`,
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

        <section className={styles.modalContent}>
          {/* LADO ESQUERDO */}
          <section className={styles.imageSide}>
            <Image
              src="/images/register-illustration.png"
              alt="Ilustração de registro"
              width={450}
              height={400}
              priority
            />
          </section>

          {/* LADO DIREITO */}
          <section className={styles.formSide}>
            <h2 className={styles.welcomeText}>Registre-se</h2>

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

            <form className={styles.form} onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Nome"
                className={styles.input}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <input
                type="email"
                placeholder="E-mail"
                className={styles.input}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <section className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  className={styles.input}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Mostrar ou esconder senha"
                >
                  {showPassword ? <VscEyeClosed /> : <VscEye />}
                </button>
              </section>

              <section className={styles.passwordInputWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme a Senha"
                  className={styles.input}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label="Mostrar ou esconder confirmação de senha"
                >
                  {showConfirmPassword ? <VscEyeClosed /> : <VscEye />}
                </button>
              </section>

              <section className={styles.terms}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>
                  Li e aceito os <a href="/termos">Termos de Uso</a>.
                </span>
              </section>

              <button
                type="submit"
                className={styles.btnRegister}
                disabled={!termsAccepted || isSubmitting}
              >
                Criar uma conta
              </button>
            </form>

            <section className={styles.divider}>Ou</section>

            <button
              type="button"
              className={styles.btnGoogle}
              onClick={handleGoogleRegister}
              disabled={isSubmitting}
            >
              <FcGoogle />
              <span>Registre-se com o Google</span>
            </button>

            <p className={styles.loginPrompt}>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin?.();
                }}
              >
                Faça login
              </button>
            </p>
          </section>
        </section>
      </section>
    </section>
  );
}
