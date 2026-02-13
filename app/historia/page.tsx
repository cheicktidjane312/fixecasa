"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Hammer, Users, Heart, Target, ShieldCheck } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Hero */}
      <div className="bg-slate-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-black mb-6"
          >
            A Nossa História
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto"
          >
            De uma pequena oficina para a sua casa. Conheça a jornada da FixeCasa.
          </motion.p>
        </div>
        
        {/* Élément décoratif en fond */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex justify-center items-center">
            <Hammer size={400} />
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        {/* Bouton Retour */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-bold">
                <ArrowLeft size={18} className="mr-2"/> Voltar ao Início
            </Link>
        </div>

        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-12"
        >
            
            {/* Section 1: Le Début */}
            <section>
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Hammer size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">O Início</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                    A FixeCasa nasceu em 2020, com uma missão simples: tornar ferramentas de qualidade profissional acessíveis a todos. Começámos numa pequena garagem, frustrados com a falta de opções que combinassem durabilidade e preço justo. Hoje, somos uma referência para quem gosta de construir e reparar.
                </p>
            </section>

            {/* Section 2: Mission */}
            <section>
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <Target size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">A Nossa Missão</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                    Queremos capacitar criadores, construtores e entusiastas de bricolage. Acreditamos que, com a ferramenta certa, qualquer projeto é possível. Selecionamos rigorosamente cada produto do nosso catálogo para garantir que resiste ao teste do tempo.
                </p>
            </section>

            {/* Section 3: Valeurs */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-red-100 p-3 rounded-full text-red-600">
                        <Heart size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Os Nossos Valores</h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="flex items-start gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <Users className="text-secondary shrink-0" size={24}/>
                        <div>
                            <span className="font-bold block text-primary text-lg mb-1">Cliente em Primeiro Lugar</span>
                            <span className="text-sm text-slate-500">O seu sucesso é o nosso sucesso. Estamos aqui para ajudar em cada etapa.</span>
                        </div>
                    </li>
                    <li className="flex items-start gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <ShieldCheck className="text-secondary shrink-0" size={24}/>
                        <div>
                            <span className="font-bold block text-primary text-lg mb-1">Qualidade Garantida</span>
                            <span className="text-sm text-slate-500">Não vendemos o que não usaríamos. Qualidade acima de tudo.</span>
                        </div>
                    </li>
                </ul>
            </section>

        </motion.div>
      </div>
    </div>
  );
}