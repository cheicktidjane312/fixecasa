"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Save, Loader2 } from "lucide-react";

export default function RedefinePasswordPage() {
  const router = useRouter();
  
  // 1. PROTECTION ANTI-CRASH
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleRedefine = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMessage("");

    try {
      // 1. Validação simples
      if (!newPassword || !confirmPassword) {
        throw new Error("Por favor preencha todos os campos.");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("A nova palavra-passe e a confirmação não correspondem.");
      }
      if (newPassword.length < 6) {
        throw new Error("A nova palavra-passe deve ter 6+ caracteres.");
      }

      // 2. Atualização direta (Sem precisar da senha antiga, pois o utilizador vem do email)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      } else {
        setStatus('success');
        // Redireciona para a conta ou login
        setTimeout(() => {
           router.push('/minha-conta');
           router.refresh(); 
        }, 2000);
      }
    } catch (error: unknown) {
      console.error(error);
      setStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro inesperado.");
      }
      setLoading(false); 
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-primary">Definir Nova Palavra-passe</h1>
          <p className="text-slate-500 text-sm">Crie uma nova palavra-passe segura para a sua conta.</p>
        </div>

        {status === 'error' && (
          <div className="p-3 rounded-lg text-sm mb-6 border bg-red-50 text-red-700 border-red-100 font-medium">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="p-3 rounded-lg text-sm mb-6 border bg-green-50 text-green-700 border-green-100 font-medium">
            Palavra-passe alterada com sucesso! A entrar...
          </div>
        )}

        <form onSubmit={handleRedefine} className="space-y-4">
          
          {/* CAMPO 1: NOVA PALAVRA-PASSE */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nova Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type={showNew ? "text" : "password"} 
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                placeholder="Nova senha..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* CAMPO 2: CONFIRMAÇÃO */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Confirmar Nova Palavra-passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type={showConfirm ? "text" : "password"} 
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                placeholder="Repita a nova senha..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            disabled={loading || status === 'success'}
            className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Guardar Nova Senha</>}
          </button>
        </form>
      </div>
    </div>
  );
}