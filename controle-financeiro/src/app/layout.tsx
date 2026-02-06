import "../styles/globals.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Controle Financeiro",
  description: "Gerencie suas finanças de forma simples e eficiente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
