"use client";

import styles from "./LoginModal.module.scss";
import { useEffect, useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import { IoClose } from "react-icons/io5";

interface LoginModalProps {
  readonly onClose: () => void;
  readonly onOpenRegister: () => void;
}

export default function LoginModal({
  onClose,
  onOpenRegister,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);

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

        <section className={styles.loginFormContainer}>
          <h2 id="login-title" className={styles.welcomeText}>
            Bem-vindo(a)
          </h2>

          <form>
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
              <button type="button" className={styles.forgotPassword}>
                Esqueceu a senha?
              </button>
            </section>

            <button type="submit" className={styles.btnLogin}>
              Fazer login
            </button>
          </form>

          <section className={styles.divider}>Ou</section>

          <button type="button" className={styles.btnGoogle}>
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
