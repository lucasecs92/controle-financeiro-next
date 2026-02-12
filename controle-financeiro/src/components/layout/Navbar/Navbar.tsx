"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import LoginModal from "@/features/auth/components/LoginModal/LoginModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className={styles.navbar}>
        <nav className={styles.navbarContent}>
          <Link href="/" className={styles.logo}>
            Controle Financeiro
          </Link>

          <button
            className={styles.btnEntrar}
            onClick={() => setIsOpen(true)}
          >
            Entrar
          </button>
        </nav>
      </header>

      {isOpen && <LoginModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
