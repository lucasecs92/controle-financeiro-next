"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import LoginModal from "@/features/auth/components/LoginModal/LoginModal";
import RegisterModal from "@/features/auth/components/RegisterModal/RegisterModal";

type AuthModalType = "login" | "register" | null;

export default function Navbar() {
  const [authModal, setAuthModal] = useState<AuthModalType>(null);

  return (
    <>
      <header className={styles.navbar}>
        <nav className={styles.navbarContent}>
          <Link href="/" className={styles.logo}>
            Controle Financeiro
          </Link>

          <button
            className={styles.btnEntrar}
            onClick={() => setAuthModal("login")}
          >
            Entrar
          </button>
        </nav>
      </header>

      {authModal === "login" && (
        <LoginModal
          onClose={() => setAuthModal(null)}
          onOpenRegister={() => setAuthModal("register")}
        />
      )}

      {authModal === "register" && (
        <RegisterModal
          onClose={() => setAuthModal(null)}
          onOpenLogin={() => setAuthModal("login")}
        />
      )}
    </>
  );
}
