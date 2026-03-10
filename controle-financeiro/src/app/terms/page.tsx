import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer/Footer";
import styles from "@/styles/LegalPage.module.scss";

export const metadata: Metadata = {
  title: "Termos de Uso | Controle Financeiro",
  description: "Termos de Uso do projeto Controle Financeiro.",
};

export default function TermsPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Link href="/" className={styles.backLink}>
          Voltar para a pagina inicial
        </Link>

        <header className={styles.header}>
          <h1 className={styles.title}>
            Termos de Uso e Servico de Controle Financeiro
          </h1>
          <p className={styles.subtitle}>Ultima atualizacao: 10 de marco de 2026</p>
        </header>

        <section className={styles.section}>
          <p className={styles.paragraph}>
            Seja Bem-Vindo ao site do Controle Financeiro. Antes de explorar tudo o
            que temos a oferecer, e importante que voce entenda e concorde com
            algumas regras basicas que regem o uso do nosso site
            {" "}
            <a href="http://ctrlfinanceiro.vercel.app/">
              http://ctrlfinanceiro.vercel.app/
            </a>
            , e qualquer outro servico digital que nos oferecemos, como lojas e
            plataformas de e-commerce.
          </p>
          <p className={styles.paragraph}>
            Ao usar nosso site e servicos, voce automaticamente concorda em seguir
            as regras que estabelecemos aqui. Caso nao concorde com algo, por
            favor, considere nao usar nossos servicos. E muito importante para
            nos que voce se sinta seguro e informado a todo momento.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Aceitando os Termos</h2>
          <p className={styles.paragraph}>
            Ao navegar e usar o site da Controle Financeiro, voce concorda
            automaticamente com nossas regras e condicoes. Estamos sempre
            procurando melhorar, entao esses termos podem mudar de vez em quando.
            Se fizermos alteracoes significativas, vamos postar as atualizacoes
            aqui no site. Continuar usando o site apos essas mudancas significa
            que voce aceita os novos termos.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Como Usar o Nosso Site</h2>
          <p className={styles.paragraph}>
            A maior parte do nosso site esta aberta para voce sem a necessidade de
            cadastro. No entanto, algumas secoes especiais podem exigir que voce
            crie uma conta. Pedimos que voce seja honesto ao fornecer suas
            informacoes e que mantenha sua senha e login seguros. Se decidir
            compartilhar algum conteudo conosco, como comentarios, por favor,
            faca-o de maneira respeitosa e dentro da lei.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Sua Privacidade</h2>
          <p className={styles.paragraph}>
            Na Controle Financeiro, a privacidade e um valor essencial. Ao
            interagir com nosso site, voce aceita nossa Politica de Privacidade,
            que detalha nossa abordagem responsavel e conforme as leis para o
            manejo dos seus dados pessoais. Nosso compromisso e com a
            transparencia e a seguranca: explicamos como coletamos, usamos e
            protegemos suas informacoes, garantindo sua privacidade e oferecendo
            controle sobre seus dados.
          </p>
          <p className={styles.paragraph}>
            Adotamos praticas de seguranca para proteger suas informacoes contra
            acesso nao autorizado e compartilhamento indevido, assegurando que
            qualquer cooperacao com terceiros ocorra apenas com base na sua
            aprovacao ou exigencias legais claras, reafirmando nosso
            comprometimento com a sua confianca e seguranca digital.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Direitos de Conteudo</h2>
          <p className={styles.paragraph}>
            O conteudo disponivel no site da Controle Financeiro, incluindo, mas
            nao se limitando a, textos, imagens, ilustracoes, designs, icones,
            fotografias, programas de computador, videoclipes e audios, constitui
            propriedade intelectual protegida tanto pela legislacao nacional
            quanto por tratados internacionais sobre direitos autorais e
            propriedade industrial. Essa propriedade engloba nao apenas materiais
            diretamente produzidos e publicados por nos, mas tambem conteudos que
            sao utilizados sob licenca ou permissao de terceiros, garantindo que
            todos os direitos sejam respeitados conforme as normativas vigentes.
          </p>
          <p className={styles.paragraph}>
            Ao acessar nosso site, voce recebe uma licenca limitada, nao exclusiva
            e revogavel para visualizar e usar o conteudo para fins pessoais e
            nao comerciais. Isso implica que qualquer reproducao, distribuicao,
            transmissao ou modificacao do conteudo, sem a devida autorizacao
            escrita da Controle Financeiro, e estritamente proibida. Tal
            restricao visa proteger os direitos de propriedade intelectual
            associados aos materiais disponibilizados, assegurando que sua
            utilizacao nao infrinja os direitos dos criadores ou detentores desses
            direitos, alem de promover um ambiente de respeito e valorizacao da
            criatividade e inovacao.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Cookies e Mais</h2>
          <p className={styles.paragraph}>
            Utilizamos cookies para melhorar sua experiencia, coletando
            informacoes anonimas durante sua visita, como suas preferencias de
            idioma, duracao da visita, paginas acessadas, e outras estatisticas
            de uso. Esses dados nos ajudam a personalizar seu conteudo, otimizar
            a navegacao, melhorar continuamente o site em design e
            funcionalidade, e garantir sua seguranca online. Esta pratica e
            essencial para nos permitir oferecer um servico mais ajustado as suas
            necessidades e resolver qualquer problema que possa surgir mais
            rapidamente.
          </p>
          <p className={styles.paragraph}>
            Se voce preferir limitar ou recusar o uso de cookies, a configuracao
            pode ser ajustada atraves do seu navegador. Isso pode afetar a sua
            experiencia no site, pois algumas funcionalidades dependem dos
            cookies para funcionar corretamente. Entendemos a importancia do
            controle sobre suas informacoes e queremos que voce saiba que, ao
            ajustar as configuracoes para bloquear cookies, algumas partes do
            nosso site podem nao oferecer a experiencia completa pretendida.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Explorando Links Externos</h2>
          <p className={styles.paragraph}>
            Nosso site pode incluir links para sites externos que achamos que
            podem ser do seu interesse. Note que nao temos controle sobre esses
            sites externos e, portanto, nao somos responsaveis pelo seu conteudo
            ou politicas.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Mudancas e Atualizacoes</h2>
          <p className={styles.paragraph}>
            A evolucao e parte de como operamos, o que significa que estes Termos
            de Uso podem passar por atualizacoes para refletir melhor as mudancas
            em nossos servicos ou na legislacao. Sempre que isso acontecer, voce
            encontrara a versao mais recente disponivel aqui. Se as mudancas
            forem significativas, faremos o possivel para notifica-lo atraves dos
            meios de contato que voce nos forneceu.
          </p>
          <p className={styles.paragraph}>
            Continuar a acessar o site apos essas mudancas indica que voce
            concorda com os novos termos. Se, por qualquer motivo, voce nao
            concordar com as atualizacoes, pedimos que nao continue utilizando
            nosso site e servicos.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Duvidas ou Comentarios?</h2>
          <p className={styles.paragraph}>
            Se tiver duvidas sobre estes termos, nao hesite em nos contatar
            atraves do e-mail projetoscontato99@gmail.com.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
