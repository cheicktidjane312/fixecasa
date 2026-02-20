"use client";

import { Scale, Building2, Server, FileText, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function MentionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* EN-TÊTE BLEU */}
      <div className="bg-primary pt-20 pb-32 px-4 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Scale size={48} className="mx-auto mb-6 text-secondary" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">Menções Legais</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            Transparência e conformidade são a base da nossa relação de confiança.
          </p>
        </motion.div>
      </div>

      {/* CONTENU EN CARTES */}
      <div className="container mx-auto px-4 -mt-20 max-w-4xl">
        
        {/* SECTION 1 : ÉDITEUR */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-xl text-primary">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">1. Editor do Site</h2>
              <div className="space-y-2 text-slate-600 leading-relaxed">
                <p>O site <strong>FixeCasa</strong> é editado por:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <li><strong>Empresa:</strong> FIERLAH AGENCY</li>
                  <li><strong>Sede Social:</strong> Abidjan, Côte d'Ivoire</li>
                  <li><strong>NIF:</strong> N/A</li>
                  <li><strong>Email:</strong> ouessogo@fierlah-agency.com</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 2 : HÉBERGEMENT */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-green-600">
              <Server size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">2. Alojamento Web</h2>
              <p className="text-slate-600 leading-relaxed">
                O nosso site é alojado em infraestruturas de alta segurança na Europa e EUA.
              </p>
              <div className="mt-4 p-4 bg-slate-50 rounded-xl text-sm text-slate-500 border border-slate-100">
                <strong>Fornecedor:</strong> Vercel Inc.<br/>
                <strong>Endereço:</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA.
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 3 : PROPRIÉTÉ INTELLECTUELLE */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="flex items-start gap-4">
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">3. Propriedade Intelectual</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Todos os elementos deste site (textos, fotografias, logótipos, ícones, software) são protegidos pelas leis de direitos de autor e propriedade intelectual.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Qualquer reprodução, representação, modificação, publicação, adaptação de todo ou parte dos elementos do site, qualquer que seja o meio ou o processo utilizado, é proibida, salvo autorização prévia por escrito.
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}