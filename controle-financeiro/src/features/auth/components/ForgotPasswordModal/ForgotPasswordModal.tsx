"use client";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import styles from "./ForgotPasswordModal.module.scss";
import {
  getSupabaseClient,
  SUPABASE_ENV_ERROR,
} from "@/lib/supabase/client";
import { getFriendlyAuthErrorMessage } from "@/features/auth/utils/authErrorMessage";

interface ForgotPasswordModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly initialEmail?: string;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = "",
}: ForgotPasswordModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setEmail(initialEmail.trim());
    setErrorMessage(null);
    setInfoMessage(null);
  }, [initialEmail, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialogElement = dialogRef.current;

    if (!dialogElement) {
      return;
    }

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === dialogElement) {
        onClose();
      }
    };

    dialogElement.addEventListener("click", handleBackdropClick);

    return () => {
      dialogElement.removeEventListener("click", handleBackdropClick);
    };
  }, [isOpen, onClose]);

  const handleForgotPassword = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

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
      redirectTo: `${globalThis.location.origin}/reset-password`,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(getFriendlyAuthErrorMessage(error.message));
      return;
    }

    setInfoMessage("Verifique seu e-mail para redefinir sua senha.");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      id="forgotPasswordModal"
      className={styles.modal}
      open
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <section
        className={styles.forgotPasswordFormContainer}
        aria-labelledby="forgot-password-title"
        aria-describedby="forgot-password-description"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar recuperação de senha"
        >
          <IoClose />
        </button>

        <h2 id="forgot-password-title" className={styles.recoveryTitle}>
          Recuperar Senha
        </h2>

        <p id="forgot-password-description" className={styles.recoveryDescription}>
          Digite o endereço de e-mail associado à sua conta. Enviaremos um link para
          redefinir sua senha.
        </p>

        <form onSubmit={handleForgotPassword}>
          <section className={styles.formGroup}>
            <label htmlFor="recovery-email">Email</label>
            <input
              type="email"
              id="recovery-email"
              name="email"
              placeholder="nome@email.com"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            {errorMessage && (
              <section className={styles.errorMessageWrap}>
                <span className={styles.errorMessage}>{errorMessage}</span>
              </section>
            )}
          </section>

          {infoMessage && (
            <section className={styles.infoMessageWrap}>
              <p className={styles.infoMessage}>{infoMessage}</p>
            </section>
          )}

          <button
            type="submit"
            className={styles.btnSendRecoveryLink}
            disabled={isSubmitting}
          >
            Enviar Link de Recuperação
          </button>
        </form>
      </section>
    </dialog>
  );
}
