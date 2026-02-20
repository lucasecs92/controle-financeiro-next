"use client";

import Link from "next/link";
import styles from "./Navbar.module.scss";

interface NavbarProps {
  readonly onOpenLogin: () => void;
}

export default function Navbar({ onOpenLogin }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarContent}>
        <Link href="/" className={styles.logo}>
          Controle Financeiro
        </Link>

        <button className={styles.btnEntrar} onClick={onOpenLogin}>
          Entrar
        </button>
      </nav>
    </header>
  );
}
