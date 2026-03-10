import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer/Footer";
import styles from "@/styles/LegalPage.module.scss";

export const metadata: Metadata = {
  title: "Política de Cookies | Controle Financeiro",
  description: "Política de Cookies do projeto Controle Financeiro.",
};

export default function CookiesPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          Voltar para a página inicial
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Política de Cookies</h1>
          <p className={styles.subtitle}>Última atualizacao: 10 de marco de 2026</p>
        </header>

        <section className={styles.section}>
          <p className={styles.paragraph}>
            A Política de Cookies oficial esta disponível abaixo. Caso tenha
            dúvidas, entre em contato pelo e-mail informado no site.
          </p>
          <div className={styles.embedContainer}>
            <a
              href="https://www.iubenda.com/privacy-policy/32595477/cookie-policy"
              className="iubenda-white iubenda-noiframe iubenda-embed"
              title="Política de Cookies"
            >
              Abrir Política de Cookies
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
