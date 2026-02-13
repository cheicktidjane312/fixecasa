import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 
import AuthProvider from "@/components/AuthProvider"; // <--- IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FixeCasa | Ferramentas e Bricolage Profissional",
  description: "A melhor loja de ferramentas e bricolage da Europa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        
        {/* LOGIQUE GOOGLE TRANSLATE */}
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'pt', 
                includedLanguages: 'es,de,it,fr,en', 
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        
        {/* ON ENTOURE TOUT LE SITE AVEC LE GESTIONNAIRE DE COMPTE */}
        <AuthProvider>
            
            {/* HEADER (Pour afficher "Mon Compte" ou "Connexion") */}
            <Header />

            {/* CONTENU PRINCIPAL */}
            <main className="min-h-screen">
                {children}
            </main>

            {/* FOOTER */}
            <Footer />

        </AuthProvider>
        
      </body>
    </html>
  );
}