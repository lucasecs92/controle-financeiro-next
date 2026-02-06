import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarContent}>
        <Link href="/" className={styles.logo}>
          Controle Financeiro
        </Link>

        <Link href="/login" className={styles.btnEntrar}>
          Entrar
        </Link>
      </nav>
    </header>
  );
}
