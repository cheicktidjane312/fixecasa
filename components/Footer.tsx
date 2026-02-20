"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface SiteSettings {
  address: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    address: 'Lisboa, Portugal',
    email: 'suporte@fixecasa.com',
    phone: '+351 912 345 678',
    facebook_url: '#',
    instagram_url: '#'
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('address, email, phone, facebook_url, instagram_url')
        .single();
      
      if (!error && data) setSettings(data as SiteSettings);
    }
    fetchSettings();
  }, []);

  return (
    // CORRECTION CHARTE : Utilisation de 'bg-primary' (Ton Bleu Nuit) au lieu du gris
    <footer className="bg-primary text-slate-300 pt-16 pb-10 border-t border-white/10 font-sans">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* COLONNE 1 : COORDONNÉES */}
          <div>
            {/* Ligne décorative (couleur secondaire pour le contraste sur le bleu) */}
            <div className="w-8 h-0.5 bg-secondary mb-6"></div> 
            
            <h3 className="text-white font-bold text-lg mb-6">As nossas coordenadas</h3>
            
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p className="font-bold text-white text-base">Fixe e Casa</p>
              
              {/* Téléphone Cliquable (Nettoyage des espaces pour le lien tel:) */}
              <p>
                <a 
                  href={`tel:${settings.phone.replace(/\s/g, '')}`} 
                  className="hover:text-secondary transition-colors flex items-center gap-2"
                >
                   {settings.phone}
                </a>
              </p>

              {/* Email Cliquable */}
              <p>
                <a 
                  href={`mailto:${settings.email}`} 
                  className="hover:text-secondary transition-colors flex items-center gap-2"
                >
                   {settings.email}
                </a>
              </p>

              <p className="max-w-xs">{settings.address}</p>
            </div>
          </div>

          {/* COLONNE 2 : LIENS UTILES */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 border-b border-white/10 pb-2 inline-block">
              LIGAÇÕES ÚTEIS
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/historia" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">Nossa história</Link></li>
              <li><Link href="/mentions" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">Informações legais</Link></li>
              <li><Link href="/politica" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* COLONNE 3 : LIENS RAPIDES */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 border-b border-white/10 pb-2 inline-block">
              LIGAÇÕES RÁPIDAS
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/minha-conta" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">A minha conta</Link></li>
              <li><Link href="/contacto" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">Contactar-nos</Link></li>
              <li><Link href="/loja" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">Loja</Link></li>
              <li><Link href="/finalizar" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">Finalizar compras</Link></li>
              <li><Link href="/loja" className="hover:text-secondary transition-colors block py-1 border-b border-white/5 hover:border-white/20">Lista de desejos</Link></li>
            </ul>
          </div>

        </div>

        {/* SIGNATURE */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>Fixe e Casa © {new Date().getFullYear()}. Todos os direitos reservados.</p>
          
          <p className="flex items-center gap-1">
            Desenvolvido por 
            <a 
              href="https://fierlah-agency.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white font-bold hover:text-secondary transition-colors uppercase tracking-wide"
            >
              FIERLAH AGENCY
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}