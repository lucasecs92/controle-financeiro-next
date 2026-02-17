"use client";

import styles from "./RegisterModal.module.scss";
import { useEffect, useState } from "react";
import Image from "next/image";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";

interface RegisterModalProps {
  readonly onClose: () => void;
  readonly onOpenLogin?: () => void;
}

export default function RegisterModal({
  onClose,
  onOpenLogin,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

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

        {/* CONTAINER 2 COLUNAS */}
        <section className={styles.modalContent}>
          {/* COLUNA ESQUERDA – ILUSTRAÇÃO */}
          <section className={styles.imageSide}>
            <Image
              src="/images/register-illustration.png"
              alt="Ilustração de registro"
              width={400}
              height={500}
              priority
            />
          </section>

          {/* COLUNA DIREITA – FORM */}
          <section className={styles.formSide}>
            <h2 className={styles.welcomeText}>Registre-se</h2>

            <form className={styles.form}>
              <input
                type="text"
                placeholder="Nome"
                className={styles.input}
                required
              />

              <input
                type="email"
                placeholder="E-mail"
                className={styles.input}
                required
              />

              <section className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  className={styles.input}
                  required
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

              <label className={styles.terms}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>
                  Li e aceito os <a href="/termos">Termos de Uso</a>.
                </span>
              </label>

              <button
                type="submit"
                className={styles.btnRegister}
                disabled={!termsAccepted}
              >
                Criar uma conta
              </button>
            </form>

            <span className={styles.divider}>Ou</span>

            <button type="button" className={styles.btnGoogle}>
              <FcGoogle />
              Registre-se com o Google
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
