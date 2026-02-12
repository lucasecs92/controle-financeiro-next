import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerContainer}>
      <section className={styles.footerWrapper}>
        <p>
          &copy; {currentYear} Controle Financeiro. Todos os direitos reservados.
        </p>

        <ul className={styles.footerLinks}>
          <li>
            <Link href="/terms">Termos de Uso</Link>
          </li>
          <li>
            <Link href="/privacy">Política de Privacidade</Link>
          </li>
        </ul>
      </section>
    </footer>
  );
}
