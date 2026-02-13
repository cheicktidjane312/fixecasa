"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Hammer, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      
      {/* HERO SECTION (L'effet Wow) */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-primary text-white">
        
        {/* Fond animé abstrait (optionnel, pour donner du style) */}
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary rounded-full blur-[100px]" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          
          {/* Logo / Badge animé */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 border rounded-full border-secondary/30 bg-primary-light/50 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="text-sm font-medium text-secondary tracking-wide">NOVO NA EUROPA</span>
          </motion.div>

          {/* Titre Principal (H1) */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-extrabold tracking-tight md:text-7xl mb-6"
          >
            Construa o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-green-400">Futuro</span> <br />
            com Ferramentas Reais.
          </motion.h1>

          {/* Sous-titre */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto mb-10 text-lg text-slate-300 md:text-xl"
          >
            Qualidade profissional para quem exige o melhor. 
            Envio gratuito para toda a Europa. Satisfação garantida ou devolução imediata.
          </motion.p>

          {/* Boutons d'Action (CTA) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col gap-4 sm:flex-row justify-center items-center"
          >
            <Link 
              href="/loja" 
              className="group relative px-8 py-4 font-bold text-primary bg-secondary rounded-full overflow-hidden hover:bg-white transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver Catálogo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/historia" 
              className="px-8 py-4 font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition-colors"
            >
              Nossa História
            </Link>
          </motion.div>

        </div>
      </section>

      {/* SECTION CONFIANCE (Trust Badges) */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="container grid grid-cols-1 gap-8 md:grid-cols-3 text-center">
          
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-blue-50 text-primary rounded-full">
              <Truck size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary">Envio Grátis Europa</h3>
            <p className="text-sm text-slate-500">Em todas as encomendas acima de 50€</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-green-50 text-secondary rounded-full">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary">Garantia de 2 Anos</h3>
            <p className="text-sm text-slate-500">Material profissional certificado</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
              <Hammer size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary">Suporte Técnico</h3>
            <p className="text-sm text-slate-500">Equipa especializada disponível</p>
          </div>

        </div>
      </section>

    </main>
  );
}