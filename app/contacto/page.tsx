"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle } from "lucide-react"; // J'ai ajouté CheckCircle ici
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

  // --- NOUVEAUX ÉTATS POUR FORMSPREE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  // --- FONCTION D'ENVOI FORMSPREE ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/maqdpepl", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSuccess(true);
        form.reset(); // On vide les champs du formulaire
        // Fait disparaître le message de succès après 5 secondes
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Ocorreu um erro ao enviar. Por favor, tente novamente.");
      }
    } catch (error) {
      alert("Erro de conexão. Verifique a sua internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-black text-center text-primary mb-2">Fale Connosco</h1>
        <p className="text-center text-slate-500 mb-12">Estamos aqui para ajudar. Resposta em menos de 24h.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* INFOS (Gauche) - DYNAMIQUES */}
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
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
            <h2 className="text-xl font-bold text-primary mb-6">Envie uma mensagem</h2>
            
            {/* MESSAGE DE SUCCÈS */}
            {isSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 border border-green-200">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-medium">Mensagem enviada com sucesso! Entraremos em contacto brevemente.</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nome</label>
                  <input type="text" name="Nome" className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-secondary transition-colors disabled:opacity-50" placeholder="Seu nome" required disabled={isSubmitting} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                  <input type="email" name="Email" className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-secondary transition-colors disabled:opacity-50" placeholder="email@exemplo.com" required disabled={isSubmitting} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Assunto</label>
                <input type="text" name="Assunto" className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:border-secondary transition-colors disabled:opacity-50" placeholder="Dúvida sobre..." required disabled={isSubmitting} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem</label>
                <textarea name="Mensagem" className="w-full border border-slate-200 rounded-lg p-3 h-32 outline-none focus:border-secondary transition-colors disabled:opacity-50" placeholder="Como podemos ajudar?" required disabled={isSubmitting}></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary-hover text-primary font-bold py-3 px-8 rounded-lg w-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> A enviar...</>
                ) : (
                  <><Send size={18} /> Enviar Mensagem</>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}