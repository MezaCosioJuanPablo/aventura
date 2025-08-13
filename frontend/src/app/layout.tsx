import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aventura - Descubre las mejores aventuras en Acapulco",
  description:
    "Plataforma para compartir y descubrir aventuras increíbles en Acapulco y sus alrededores. Conecta con aventureros, comparte experiencias y encuentra tu próxima aventura.",
  keywords: "aventura, acapulco, turismo, actividades, experiencias, viajes",
  authors: [{ name: "Antonio Salinas" }],
  openGraph: {
    title: "Aventura - Descubre las mejores aventuras en Acapulco",
    description:
      "Plataforma para compartir y descubrir aventuras increíbles en Acapulco y sus alrededores.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
