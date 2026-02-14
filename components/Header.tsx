"use client";

import Link from "next/link";
import { useCart } from "@/store/useCart";
import { ShoppingCart, Menu, X, PackageSearch, Lock, Mail, Globe, User, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Header() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  // 1. CORRECTION ERREUR "SETSTATE"
  // On utilise un petit délai pour que React ne râle pas sur la mise à jour synchrone.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    // 2. AJOUT DU MARGIN-TOP (mt-12)
    // Cela décolle le menu du haut de page pour laisser la place à la barre Google Translate
    <header className="sticky top-0 z-50 w-full mt-12 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 shadow-sm">
      
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGO IMAGE */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.png" alt="FixeCasa Logo" className="h-10 w-auto object-contain" />
        </Link>

        {/* NAVIGATION BUREAU */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-slate-600">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <Link href="/loja" className="hover:text-primary transition-colors">Catálogo</Link>
          
          {/* Note: J'utilise 'span' à l'intérieur des Link pour éviter l'erreur "Hydration failed: div inside a" */}
          <Link href="/rastreio" className="group flex items-center gap-1 hover:text-primary transition-colors">
            <PackageSearch size={16} /> <span>Rastrear</span>
          </Link>
          <Link href="/contacto" className="group flex items-center gap-1 hover:text-primary transition-colors">
            <Mail size={16} /> <span>Contacto</span>
          </Link>

          {/* AUTHENTIFICATION */}
          {user ? (
            <div className="flex items-center gap-4 border-l border-slate-200 pl-4 ml-2">
              <Link href="/minha-conta" className="flex items-center gap-1 text-primary font-bold hover:text-secondary transition-colors">
                <User size={16} /> <span>Minha Conta</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-slate-400 hover:text-red-500 transition-colors" 
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-1 hover:text-primary transition-colors border-l border-slate-200 pl-4 ml-2">
              <LogIn size={16} /> <span>Entrar</span>
            </Link>
          )}

          <Link href="/admin" className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors font-bold bg-red-50 px-3 py-1 rounded-full">
            <Lock size={14} /> <span>Admin</span>
          </Link>
        </nav>

        {/* ACTIONS DROITE */}
        <div className="flex items-center gap-3">
          
          {/* 3. GOOGLE TRANSLATE (CORRIGÉ) */}
          {/* J'ai enlevé 'overflow-hidden' et agrandi la largeur pour que le menu déroulant s'affiche ! */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-3 py-1 gap-2 h-9 min-w-[120px]">
            <Globe size={14} className="text-slate-500 flex-shrink-0"/>
            <div className="relative w-full h-full flex items-center">
               {/* L'ID magique que Google cherche */}
               <div id="google_translate_element"></div>
            </div>
          </div>

          {/* PANIER (CORRIGÉ : Pas de div, uniquement des span) */}
          <Link href="/carrinho" className="relative group ml-2 flex items-center justify-center">
            <span className="block p-2 bg-slate-100 rounded-full group-hover:bg-secondary transition-colors text-slate-700 group-hover:text-primary">
              <ShoppingCart size={20} />
            </span>
            {/* On affiche le badge seulement une fois monté pour éviter l'erreur rouge */}
            {isMounted && totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems()}
              </span>
            )}
          </Link>

          {/* BOUTON MOBILE */}
          <button className="lg:hidden p-2 text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-4 font-medium text-slate-600">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>Início</Link>
              <Link href="/loja" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
              <Link href="/rastreio" onClick={() => setIsMenuOpen(false)}>Rastrear Encomenda</Link>
              
              {user ? (
                <>
                  <Link href="/minha-conta" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-primary font-bold">
                    <User size={16} /> <span>Minha Conta</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 text-slate-500 hover:text-red-500 text-left">
                    <LogOut size={16} /> <span>Sair</span>
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-primary font-bold">
                  <LogIn size={16} /> <span>Entrar / Registar</span>
                </Link>
              )}
              
              <div className="border-t border-slate-100 my-2"></div>
              
              <Link href="/contacto" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
              
              {/* TRADUCTEUR MOBILE : ID SPÉCIFIQUE */}
              <div className="flex items-center gap-2 py-2">
                <Globe size={16} />
                <div id="google_translate_element_mobile"></div> 
                <span className="text-xs text-slate-400">(Tradutor)</span>
              </div>

              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="text-red-500 font-bold flex items-center gap-2">
                <Lock size={16} /> <span>Admin Panel</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}