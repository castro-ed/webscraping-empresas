import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Suporgi | Prospecção Inteligente",
  description:
    "Prospecte empresas de forma inteligente. Busque empresas no Google Maps, extraia informações e exporte para CSV ou XLSX.",
  keywords: [
    "prospecção",
    "empresas",
    "materiais de construção",
    "Goiânia",
    "web scraping",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
