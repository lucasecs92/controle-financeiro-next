import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
        <section className={styles.footerWrapper}>
            <p>&copy; {new Date().getFullYear()} Controle Financeiro. Todos os direitos reservados.</p>
            <ul className={styles.footerLinks}>
                <li><a href="/terms">Termos de Uso</a></li>
                <li><a href="/privacy">Política de Privacidade</a></li>
            </ul>
        </section>
    </footer>
  );
}
