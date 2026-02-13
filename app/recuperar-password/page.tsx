"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Envoi de l'email de réinitialisation
    // Note: En localhost, l'email n'est pas envoyé réellement sauf si tu as configuré un SMTP.
    // Tu devras récupérer le lien dans la console Supabase ou l'onglet "Inbucket" si tu utilises Supabase local.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/minha-conta/update-password`,
    });

    if (error) {
      setError("Erro ao enviar email. Tente novamente.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-green-100">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <CheckCircle size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">Email Enviado!</h1>
          <p className="text-slate-500 mb-6">
            Verifique a sua caixa de entrada (e spam). Enviámos um link para recuperar a sua palavra-passe.
          </p>
          <Link href="/login" className="text-primary font-bold hover:underline">
            Voltar ao Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-primary">Recuperar Conta</h1>
          <p className="text-slate-500 text-sm">Insira o seu email para definir uma nova palavra-passe.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Enviar Link <ArrowRight size={18}/></>}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Lembrou-se? <Link href="/login" className="text-secondary font-bold hover:underline">Voltar ao Login</Link>
        </p>
      </div>
    </div>
  );
}