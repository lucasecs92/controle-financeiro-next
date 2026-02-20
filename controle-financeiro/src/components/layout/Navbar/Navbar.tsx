"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import styles from "./Navbar.module.scss";

type PublicNavbarProps = {
  readonly mode?: "public";
  readonly onOpenLogin: () => void;
};

type AuthenticatedNavbarProps = {
  readonly mode: "authenticated";
  readonly userName: string;
  readonly onLogout: () => Promise<void> | void;
};

type NavbarProps = PublicNavbarProps | AuthenticatedNavbarProps;

export default function Navbar(props: NavbarProps) {
  const isAuthenticated = props.mode === "authenticated";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isUserMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) {
        return;
      }

      if (!userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isAuthenticated, isUserMenuOpen]);

  return (
    <header
      className={`${styles.navbar} ${isAuthenticated ? styles.navbarAuthenticated : ""}`}
    >
      <nav className={styles.navbarContent}>
        <Link
          href="/"
          className={`${styles.logo} ${isAuthenticated ? styles.logoAuthenticated : ""}`}
        >
          Controle Financeiro
        </Link>

        {isAuthenticated ? (
          <section className={styles.userMenu} ref={userMenuRef}>
            <button
              type="button"
              className={styles.userNameButton}
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              {props.userName}
              <FiChevronDown
                aria-hidden="true"
                className={isUserMenuOpen ? styles.chevronOpen : undefined}
              />
            </button>

            {isUserMenuOpen && (
              <section className={styles.userDropdown} role="menu">
                <button
                  type="button"
                  className={styles.logoutDropdownButton}
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await props.onLogout();
                  }}
                  role="menuitem"
                >
                  Sair
                </button>
              </section>
            )}
          </section>
        ) : (
          <button
            type="button"
            className={styles.btnEntrar}
            onClick={props.onOpenLogin}
          >
            Entrar
          </button>
        )}
      </nav>
    </header>
  );
}
