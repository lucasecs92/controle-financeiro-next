import Navbar from "@/components/layout/Navbar/Navbar";
import Image from "next/image";
import styles from "../styles/page.module.scss";
import Footer from "@/components/layout/Footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className={styles.pageContainer}>
        <main className={styles.mainContainer}>
          <h1 className={styles.heroTitle}>
            <span className={styles.accentWord}>Controle</span> suas finanças
            <br />e <span className={styles.accentWord}>ganhe tempo</span> para
            o
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

          <button className={styles.btnSecondary} id="btnCadastrarHome">
            Começar agora
          </button>
        </main>

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
      </section>
      <Footer />
    </>
  );
}
