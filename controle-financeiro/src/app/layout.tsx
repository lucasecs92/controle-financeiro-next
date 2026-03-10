import { Afacad } from "next/font/google";
import "../styles/globals.scss";
import type { Metadata } from "next";
import Script from "next/script";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-afacad",
});

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "Sistema de gestão financeira pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={afacad.variable}>
      <body>
        {children}
        <Script
          src="https://cdn.iubenda.com/iubenda.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
