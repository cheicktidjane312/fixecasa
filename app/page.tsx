"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Clock, RefreshCcw, MessageSquare, Star, ChevronRight, ChevronLeft, Hammer } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      // MODIFICATION ICI : On trie par date pour avoir les NOUVEAUTÉS
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }) // Du plus récent au plus vieux
        .limit(4); // On prend les 4 premiers
        
      if (data) setFeaturedProducts(data as Product[]);
    }
    loadFeatured();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50"> 
      
      {/* --- HERO SECTION (Avec Image Jardin) --- */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        
        {/* IMAGE D'ARRIÈRE-PLAN (JARDIN) */}
        <div className="absolute inset-0">
           <img 
            src="https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&q=80" 
            alt="Jardin et Bricolage" 
            className="w-full h-full object-cover"
           />
           {/* Filtre sombre pour que le texte reste lisible */}
           <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        <div className="container relative z-10 px-6 text-center text-white max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-widest mb-6 font-bold text-secondary backdrop-blur-sm"
          >
            Qualidade Profissional
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          >
            Ferramentas e Acessórios <br/> para a sua Casa
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl mx-auto"
          >
            Da construção à renovação, oferecemos soluções práticas e resistentes. Produtos selecionados para quem exige durabilidade e preço justo.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              href="/loja" 
              className="inline-flex items-center gap-2 bg-secondary hover:bg-white text-primary font-bold py-4 px-10 rounded-full transition-all text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Ver Catálogo <ArrowRight size={20}/>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- SECTION AVANTAGES --- */}
      <section className="py-16 px-4 bg-white relative -mt-10 z-20">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-slate-50 hover:bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            <div className="mb-4 p-3 bg-blue-100 text-primary rounded-2xl w-fit group-hover:bg-primary group-hover:text-white transition-colors">
               <Truck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">Envio gratuito</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Aproveite o envio gratuito em todas as encomendas, sem valor mínimo. Entregamos com segurança.
            </p>
          </div>

          <div className="bg-slate-50 hover:bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-2xl w-fit group-hover:bg-green-600 group-hover:text-white transition-colors">
               <Clock size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">Entrega Rápida</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Expedição em até 3 a 4 dias úteis. Acompanhe o seu pedido em tempo real até à sua porta.
            </p>
          </div>

          <div className="bg-slate-50 hover:bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            <div className="mb-4 p-3 bg-orange-100 text-orange-600 rounded-2xl w-fit group-hover:bg-orange-500 group-hover:text-white transition-colors">
               <RefreshCcw size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">Devolução fácil</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Mudou de ideias? Tem 14 dias para devolver o seu pedido. Satisfação ou reembolso garantido.
            </p>
          </div>

          <div className="bg-slate-50 hover:bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
            <div className="mb-4 p-3 bg-purple-100 text-purple-600 rounded-2xl w-fit group-hover:bg-purple-600 group-hover:text-white transition-colors">
               <MessageSquare size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-primary">Apoio ao cliente</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Equipa disponível por e-mail ou chat. Respostas rápidas e claras, sempre ao seu dispor.
            </p>
          </div>

        </div>
      </section>

      {/* --- SECTION: "Os clientes recomendam" (Mis à jour pour afficher les Nouveautés) --- */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
               <h2 className="text-3xl md:text-4xl font-black text-primary mb-2">
                 Os clientes recomendam <br/> estes produtos
               </h2>
            </div>
            <div className="flex gap-2">
                <button className="p-3 bg-white rounded-full border border-slate-200 hover:bg-primary hover:text-white text-slate-600 transition-colors"><ChevronLeft size={20}/></button>
                <button className="p-3 bg-white rounded-full border border-slate-200 hover:bg-primary hover:text-white text-slate-600 transition-colors"><ChevronRight size={20}/></button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link href={`/loja/${product.slug}`} key={product.id} className="group block bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all border border-slate-100 relative overflow-hidden">
                <div className="relative h-48 mb-4 overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-2 min-h-[3rem] text-sm group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                   {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-secondary text-secondary"/>)}
                   <span className="text-xs text-slate-400 ml-1">(12)</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-primary font-black text-lg">{product.price.toFixed(2)} €</p>
                    <span className="bg-primary text-white p-2 rounded-lg group-hover:bg-secondary group-hover:text-primary transition-colors">
                        <ArrowRight size={16}/>
                    </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION FINALE (Bloc Bleu Nuit Abstrait) --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-primary mb-10 text-center">
             Produtos da mais alta <br/> qualidade para a sua casa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-50 rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100">
             <div className="order-2 md:order-1">
                <div className="flex items-center gap-2 mb-4 text-secondary font-bold uppercase tracking-widest text-xs">
                    <Hammer size={16}/> Professional
                </div>
                <h3 className="text-3xl font-black mb-4 text-primary">Kit de Ferramentas Premium</h3>
                <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                   Descubra a nossa seleção de ferramentas essenciais para todos os seus projetos. Qualidade profissional garantida para durar uma vida inteira.
                </p>
                <Link href="/loja" className="bg-primary hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl inline-flex items-center gap-2 transition-all shadow-lg hover:shadow-slate-300">
                   Ver coleção completa <ArrowRight size={18}/>
                </Link>
             </div>
             
             {/* --- BLOC ABSTRAIT BLEU NUIT --- */}
             <div className="order-1 md:order-2 h-80 rounded-[24px] overflow-hidden relative shadow-inner">
                {/* Fond dégradé Bleu Nuit */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-primary to-slate-900 flex items-center justify-center">
                    
                    {/* Cercles décoratifs abstraits */}
                    <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-secondary rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-400 rounded-full opacity-10 blur-2xl"></div>
                    
                    {/* Contenu central subtil */}
                    <div className="text-center p-6 relative z-10">
                        <div className="inline-flex p-4 bg-white/10 rounded-full mb-4 backdrop-blur-md border border-white/20">
                            <Star size={40} className="text-secondary fill-secondary animate-pulse" />
                        </div>
                        <h4 className="text-white font-bold text-xl">Top Quality</h4>
                        <p className="text-slate-300 text-sm mt-2">Certified Tools</p>
                    </div>
                </div>
             </div>

          </div>
        </div>
      </section>

    </main>
  );
}