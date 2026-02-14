"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Save, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const router = useRouter();
  
  // 1. PROTECTION ANTI-CRASH (Hydratação)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Campos para a antiga e nova palavra-passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Gestão da visibilidade
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setErrorMessage("");

    try {
      // 1. Validação básica dos campos
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Por favor preencha todos os campos.");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("A nova palavra-passe e a confirmação não correspondem.");
      }
      if (newPassword.length < 6) {
        throw new Error("A nova palavra-passe deve ter 6+ caracteres.");
      }

      // 2. Verificação da antiga palavra-passe
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error("Sessão inválida. Faça login novamente.");

      // Tentamos fazer login com a palavra-passe antiga para verificar se está correta
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error("A palavra-passe ATUAL está incorreta.");
      }

      // 3. Se a antiga palavra-passe estiver correta, atualizamos para a nova
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      } else {
        setStatus('success');
        // FIX: Usar router.push para evitar o erro "Client-side exception"
        setTimeout(() => {
           router.push('/minha-conta');
           router.refresh(); 
        }, 1500);
      }
    } catch (error: unknown) {
      // CORREÇÃO DE TIPAGEM: Gerimos o erro sem usar 'any'
      console.error(error);
      setStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro inesperado.");
      }
      // Paramos o carregamento apenas se houver erro (se sucesso, redirecionamos)
      setLoading(false); 
    }
  };

  // Se o cliente não estiver montado, não renderiza nada
  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        
        <Link href="/minha-conta" className="text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-6 text-sm font-bold">
          <ArrowLeft size={16} /> Voltar
        </Link>

        <h1 className="text-2xl font-black text-slate-800 mb-2">Alterar Palavra-passe</h1>
        <p className="text-slate-500 text-sm mb-6">Por segurança, confirme a sua senha atual antes de definir uma nova.</p>

        {status === 'error' && (
          <div className="p-3 rounded-lg text-sm mb-6 border bg-red-50 text-red-700 border-red-100 font-medium">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="p-3 rounded-lg text-sm mb-6 border bg-green-50 text-green-700 border-green-100 font-medium">
            Palavra-passe atualizada com sucesso! A redirecionar...
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          
          {/* CAMPO 1: PALAVRA-PASSE ATUAL */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Palavra-passe Atual</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type={showCurrent ? "text" : "password"} 
                required
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                placeholder="Sua senha atual..."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 my-2"></div>

          {/* CAMPO 2: NOVA PALAVRA-PASSE */}
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

          {/* CAMPO 3: CONFIRMAÇÃO */}
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
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Atualizar Segurança</>}
          </button>
        </form>
      </div>
    </div>
  );
}