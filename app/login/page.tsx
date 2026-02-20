"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // .trim() enlève les espaces avant/après (très important sur mobile !)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(), 
      password: password,
    });

    if (error) {
      console.error("Erro no Login Supabase:", error); // Traduit
      
      // On affiche le vrai message pour comprendre le bug
      if (error.message === "Invalid login credentials") {
        setError("Email ou palavra-passe incorretos."); // Traduit
      } else if (error.message.includes("Email not confirmed")) {
        setError("Por favor, confirme o seu email (verifique o spam)."); // Traduit
      } else {
        setError(error.message); // Affiche l'erreur technique exacte
      }
    } else {
      router.push("/minha-conta");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <LogIn size={32} />
          </div>
          <h1 className="text-2xl font-black text-primary">Bom ver você de novo</h1>
          <p className="text-slate-500 text-sm">Entre na sua conta FixeCasa</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-colors"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-slate-700">Palavra-passe</label>
              <Link href="/recuperar-password" className="text-xs text-secondary font-bold hover:underline">
                Esqueceu-se?
              </Link>
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-colors"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Novo por aqui? <Link href="/registar" className="text-secondary font-bold hover:underline">Criar Conta</Link>
        </p>
      </div>
    </div>
  );
}