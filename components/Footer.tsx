"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
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
      const { data, error } = await supabase.from('site_settings').select('address, email, phone, facebook_url, instagram_url').single();
      if (!error && data) setSettings(data as SiteSettings);
    }
    fetchSettings();
  }, []);

  return (
    <footer className="bg-primary text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* COLONNE 1 : LOGO & DESCRIPTION */}
          <div className="space-y-6">
            <Link href="/" className="block">
              {/* Logo en blanc ou adapté pour fond sombre si possible, sinon le png standard */}
              <img src="/logo.png" alt="FixeCasa" className="h-12 w-auto object-contain bg-white/10 rounded-lg p-2" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              O parceiro número 1 em ferramentas profissionais na Europa. Qualidade, rapidez e confiança.
            </p>
          </div>

          {/* COLONNE 2 : NAVEGAÇÃO */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/loja" className="hover:text-secondary transition-colors">Catálogo</Link></li>
              <li><Link href="/rastreio" className="hover:text-secondary transition-colors">Rastrear Encomenda</Link></li>
              <li><Link href="/contacto" className="hover:text-secondary transition-colors">Contactos</Link></li>
              <li><Link href="/admin" className="hover:text-red-400 transition-colors">Área Admin</Link></li>
            </ul>
          </div>

          {/* COLONNE 3 : LEGAL (Nouveau) */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mentions" className="hover:text-secondary transition-colors">Menções Legais</Link></li>
              <li><Link href="/politica" className="hover:text-secondary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>

          {/* COLONNE 4 : CONTACTOS DYNAMIQUES */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Sede Administrativa</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-secondary flex-shrink-0" /> <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-secondary flex-shrink-0" /> {settings.email}
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-secondary flex-shrink-0" /> {settings.phone}
              </li>
            </ul>
            <div className="flex gap-4 mt-6">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" className="p-2 bg-slate-800 rounded-full hover:bg-secondary hover:text-primary transition-all"><Facebook size={20} /></a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" className="p-2 bg-slate-800 rounded-full hover:bg-secondary hover:text-primary transition-all"><Instagram size={20} /></a>
              )}
            </div>
          </div>
        </div>

        {/* SIGNATURE FIERLAH AGENCY */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FixeCasa. Todos os direitos reservados.</p>
          
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