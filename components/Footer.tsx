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
          
          {/* COLONNE 1 : COORDONNÉES & RÉSEAUX SOCIAUX */}
          <div>
            {/* Ligne décorative (couleur secondaire pour le contraste sur le bleu) */}
            <div className="w-8 h-0.5 bg-secondary mb-6"></div> 
            
            <h3 className="text-white font-bold text-lg mb-6">As nossas coordenadas</h3>
            
            <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
              <p className="font-bold text-white text-base">Fixe e Casa</p>
              
              {/* Téléphone Cliquable */}
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

            {/* NOUVEAU : Réseaux Sociaux */}
            <div className="flex gap-4 mt-6">
              <a 
                href={settings.facebook_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a 
                href={settings.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
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

        {/* SIGNATURE & PAIEMENTS */}
        <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row justify-between items-center text-xs text-slate-400 gap-6">
          
          {/* Copyright */}
          <p>Fixe e Casa © {new Date().getFullYear()}. Todos os direitos reservados.</p>
          
          {/* NOUVEAU : Badges de paiement (Fictifs) */}
          <div className="flex gap-2 items-center opacity-80 cursor-default">
            {/* Visa */}
            <div className="h-7 w-11 bg-white rounded flex items-center justify-center text-[10px] font-bold text-blue-900 shadow-sm">
              VISA
            </div>
            {/* Mastercard */}
            <div className="h-7 w-11 bg-white rounded flex items-center justify-center gap-[1px] shadow-sm">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-orange-500 opacity-90 -ml-2"></div>
            </div>
            {/* PayPal */}
            <div className="h-7 w-11 bg-white rounded flex items-center justify-center text-[10px] font-bold text-blue-800 italic shadow-sm">
              PayPal
            </div>
            {/* MB Way (Très important au Portugal) */}
            <div className="h-7 w-11 bg-white rounded flex items-center justify-center text-[8px] font-black text-slate-900 shadow-sm leading-none text-center">
              MB<br/>WAY
            </div>
          </div>

          {/* Crédit Agence */}
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