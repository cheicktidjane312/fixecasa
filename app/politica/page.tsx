"use client";

import { ShieldCheck, Lock, Eye, Cookie, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function PoliticaPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* EN-TÊTE BLEU */}
      <div className="bg-primary pt-20 pb-32 px-4 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShieldCheck size={48} className="mx-auto mb-6 text-secondary" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Política de Privacidade</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            A sua segurança e a proteção dos seus dados são a nossa prioridade absoluta.
          </p>
        </motion.div>
      </div>

      {/* CONTENU */}
      <div className="container mx-auto px-4 -mt-20 max-w-4xl space-y-6">
        
        {/* INTRO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-secondary"
        >
          <h2 className="text-xl font-bold text-primary mb-2">O nosso compromisso</h2>
          <p className="text-slate-600">
            No FixeCasa, respeitamos a sua privacidade. Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço (como enviar a sua encomenda). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
          </p>
        </motion.div>

        {/* SECTION 1 : DONNÉES RECOLTÉES */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold text-primary">1. Dados Recolhidos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">O que pedimos?</h3>
              <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
                <li>Nome completo</li>
                <li>Email e Telefone</li>
                <li>Morada de envio</li>
                <li>NIF (para faturação)</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">Para quê?</h3>
              <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
                <li>Processar a sua encomenda</li>
                <li>Enviar a fatura</li>
                <li>Contactar em caso de entrega</li>
                <li>Suporte ao cliente</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* SECTION 2 : SÉCURITÉ */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-green-600" size={28} />
            <h2 className="text-2xl font-bold text-primary">2. Segurança e Partilha</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            Apenas retemos as informações recolhidas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemo-los dentro de meios comercialmente aceitáveis para evitar perdas e roubos.
          </p>
          <p className="text-slate-600 leading-relaxed border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
            <strong>Importante:</strong> Não partilhamos as suas informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
          </p>
        </motion.section>

        {/* SECTION 3 : COOKIES */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <Cookie className="text-orange-500" size={28} />
            <h2 className="text-2xl font-bold text-primary">3. Cookies</h2>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Utilizamos cookies apenas para manter a sua sessão ativa (carrinho de compras) e melhorar a experiência de navegação. Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.
          </p>
        </motion.section>

        <p className="text-center text-slate-400 text-sm pt-8">
          Última atualização: {new Date().toLocaleDateString()}
        </p>

      </div>
    </div>
  );
}