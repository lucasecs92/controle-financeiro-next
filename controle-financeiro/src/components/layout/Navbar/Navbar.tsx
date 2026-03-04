"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import AccountSettingsModal from "@/features/account/components/AccountSettingsModal/AccountSettingsModal";
import styles from "./Navbar.module.scss";
import { RxExit } from "react-icons/rx";
import { PiGear } from "react-icons/pi";

type PublicNavbarProps = {
  readonly mode?: "public";
  readonly onOpenLogin: () => void;
};

type AuthenticatedNavbarProps = {
  readonly mode: "authenticated";
  readonly userName: string;
  readonly userEmail?: string;
  readonly onLogout: () => Promise<void> | void;
  readonly onLogoClick?: () => void;
  readonly variant?: "default" | "landing";
};

type NavbarProps = PublicNavbarProps | AuthenticatedNavbarProps;

export default function Navbar(props: NavbarProps) {
  const isAuthenticated = props.mode === "authenticated";
  const isLandingVariant =
    props.mode === "authenticated" && props.variant === "landing";
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isUserMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!isUserMenuOpen) {
        return;
      }

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
      className={`${styles.navbar} ${
        isAuthenticated && !isLandingVariant ? styles.navbarAuthenticated : ""
      }`}
    >
      <nav className={styles.navbarContent}>
        <Link
          href="/"
          className={`${styles.logo} ${
            isAuthenticated && !isLandingVariant ? styles.logoAuthenticated : ""
          }`}
          onClick={(event) => {
            if (isAuthenticated && props.onLogoClick) {
              event.preventDefault();
              setIsUserMenuOpen(false);
              props.onLogoClick();
            }
          }}
        >
          Controle Financeiro
        </Link>

        {isAuthenticated ? (
          <section className={styles.userMenu} ref={userMenuRef}>
            <button
              type="button"
              className={`${styles.userNameButton} ${
                isLandingVariant ? styles.userNameButtonLanding : ""
              }`}
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
                  className={styles.settingsDropdownButton}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                  role="menuitem"
                >
                  <PiGear />
                  Configurações
                </button>
                <button
                  type="button"
                  className={styles.logoutDropdownButton}
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await props.onLogout();
                  }}
                  role="menuitem"
                >
                  <RxExit />
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

      {isAuthenticated && isSettingsModalOpen && (
        <AccountSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          userName={props.userName}
          userEmail={props.userEmail}
        />
      )}
    </header>
  );
}
