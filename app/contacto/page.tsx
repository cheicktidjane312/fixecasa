"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

// On définit le type pour les données
interface SiteSettings {
  address: string;
  email: string;
  phone: string;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({
    address: 'Lisboa, Portugal',
    email: 'suporte@fixecasa.com',
    phone: '+351 912 345 678'
  });

  // On va chercher les infos dans la base de données
  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (!error && data) {
        setSettings(data as SiteSettings);
      }
      setLoading(false);
    }

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-black text-center text-primary mb-2">Fale Connosco</h1>
        <p className="text-center text-slate-500 mb-12">Estamos aqui para ajudar. Resposta em menos de 24h.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* INFOS (Gauche) - MAINTENANT DYNAMIQUES */}
          <div className="space-y-6">
            
            {/* TÉLÉPHONE */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Phone />
              </div>
              <h3 className="font-bold text-slate-800">Telefone</h3>
              <p className="text-slate-500 text-sm mt-1">
                {loading ? "..." : settings.phone}
              </p>
            </div>

            {/* EMAIL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                <Mail />
              </div>
              <h3 className="font-bold text-slate-800">Email</h3>
              <p className="text-slate-500 text-sm mt-1 break-all">
                {loading ? "..." : settings.email}
              </p>
            </div>

            {/* ADRESSE */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600">
                <MapPin />
              </div>
              <h3 className="font-bold text-slate-800">Sede</h3>
              <p className="text-slate-500 text-sm mt-1">
                {loading ? "..." : settings.address}
              </p>
            </div>
          </div>

          {/* FORMULAIRE (Droite) */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold text-primary mb-6">Envie uma mensagem</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada com sucesso!'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-secondary transition-colors" placeholder="Seu nome" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input type="email" className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-secondary transition-colors" placeholder="email@exemplo.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assunto</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-secondary transition-colors" placeholder="Dúvida sobre..." required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem</label>
                <textarea className="w-full border border-slate-200 rounded-lg p-3 h-32 outline-none focus:border-secondary transition-colors" placeholder="Como podemos ajudar?" required></textarea>
              </div>
              <button className="bg-secondary hover:bg-secondary-hover text-primary font-bold py-3 px-8 rounded-lg w-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                <Send size={18} /> Enviar Mensagem
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}