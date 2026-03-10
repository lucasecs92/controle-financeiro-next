import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer/Footer";
import styles from "@/styles/LegalPage.module.scss";

export const metadata: Metadata = {
  title: "Politica de Privacidade | Controle Financeiro",
  description: "Politica de Privacidade do projeto Controle Financeiro.",
};

export default function PrivacyPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          Voltar para a pagina inicial
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>Politica de Privacidade</h1>
          <p className={styles.subtitle}>Ultima atualizacao: 10 de marco de 2026</p>
        </header>

        <section className={styles.section}>
          <p className={styles.paragraph}>
            A Politica de Privacidade oficial esta disponivel abaixo. Caso tenha
            duvidas, entre em contato pelo e-mail informado no site.
          </p>
          <div className={styles.embedContainer}>
            <a
              href="https://www.iubenda.com/privacy-policy/32595477"
              className="iubenda-white iubenda-noiframe iubenda-embed"
              title="Politica de Privacidade"
            >
              Abrir Politica de Privacidade
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
