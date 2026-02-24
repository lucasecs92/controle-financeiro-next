import Image from "next/image";
import styles from "./Hero.module.scss";

interface HeroProps {
  readonly onPrimaryAction: () => void;
  readonly primaryActionLabel?: string;
  readonly showScreenshot?: boolean;
  readonly actionVariant?: "filled" | "light";
}

export default function Hero({
  onPrimaryAction,
  primaryActionLabel = "Começar agora",
  showScreenshot = true,
  actionVariant = "filled",
}: HeroProps) {
  return (
    <section className={styles.pageContainer}>
      <main className={styles.mainContainer}>
        <h1 className={styles.heroTitle}>
          <span className={styles.accentWord}>Controle</span> suas finanças
          <br />e <span className={styles.accentWord}>ganhe tempo</span> para o
          <br />
          que importa
        </h1>

        <p className={styles.heroDescription}>
          Organize suas entradas e saídas de forma simples e intuitiva.
          <br />
          Tenha uma visão clara do seu fluxo de caixa e tome decisões mais
          <br />
          inteligentes para o seu negócio ou vida pessoal.
        </p>

        <button
          className={`${styles.btnSecondary} ${
            actionVariant === "light" ? styles.btnSecondaryLight : ""
          }`}
          id="btnCadastrarHome"
          onClick={onPrimaryAction}
        >
          {primaryActionLabel}
        </button>
      </main>

      {showScreenshot && (
        <section className={styles.screenContainer}>
          <Image
            src="/images/screenshot.png"
            alt="Screenshot da aplicação Controle Financeiro"
            width={800}
            height={600}
            className={styles.dashboardScreenshot}
            priority
          />
        </section>
      )}
    </section>
  );
}
