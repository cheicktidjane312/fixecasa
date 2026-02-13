"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/store/useCart"; // Suppression de "Product" ici si non exporté, sinon ok
import { ArrowLeft, Check, Package, ShieldCheck, ShoppingCart, Truck, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

// Définition locale du type Product pour être sûr
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  old_price?: number;
  image_url: string;
  category: string;
  stock: number;
  slug: string;
}

export default function ProductPage() {
  const params = useParams();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1); // État pour la quantité

  const addItem = useCart((state) => state.addItem);

  useEffect(() => {
    async function fetchProduct() {
      if (!params?.slug) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', params.slug)
        .single();
      
      if (error) {
        console.error('Erreur Supabase:', error);
      } else if (data) {
        setProduct(data as Product);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [params.slug]);

  // Fonctions pour gérer la quantité
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-primary font-bold">
      Carregando...
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
      Produto não encontrado.
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* Navigation de retour */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/loja" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Catálogo
        </Link>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* IMAGE DU PRODUIT */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative"
          >
            <img 
              src={product.image_url || "/images/placeholder.png"} 
              alt={product.name} 
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          {/* DÉTAILS ET ACHAT */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-secondary font-bold uppercase tracking-widest text-xs mb-2 block">
              {product.category}
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">{product.price.toFixed(2)}€</span>
              {product.old_price && product.old_price > 0 && (
                <span className="text-xl text-slate-400 line-through">
                  {product.old_price.toFixed(2)}€
                </span>
              )}
            </div>

            <p className="text-slate-600 text-lg mb-8 leading-relaxed border-l-4 border-secondary pl-4">
              {product.description}
            </p>

            {/* Indicateur de Stock */}
            <div className="flex items-center gap-2 mb-8 p-3 bg-green-50 text-green-700 rounded-xl w-fit border border-green-100">
              <Package size={20} />
              <span className="font-bold">Stock disponível: {product.stock} unidades</span>
            </div>

            {/* SÉLECTEUR DE QUANTITÉ */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Quantidade</label>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
                    >
                        <Minus size={20} className="text-primary"/>
                    </button>
                    <span className="text-2xl font-bold text-primary w-12 text-center">{quantity}</span>
                    <button 
                        onClick={increaseQuantity}
                        disabled={quantity >= product.stock}
                        className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-colors"
                    >
                        <Plus size={20} className="text-primary"/>
                    </button>
                </div>
            </div>

            {/* BOUTON D'ACHAT */}
            <button 
              className="group w-full md:w-auto bg-secondary hover:bg-secondary-hover text-primary font-black text-xl py-5 px-10 rounded-2xl shadow-xl shadow-green-100 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              onClick={() => {
                // On appelle addItem autant de fois que la quantité choisie (ou modifie ton store pour accepter la quantité)
                // Pour faire simple et compatible avec ton store actuel :
                for(let i = 0; i < quantity; i++) {
                    addItem(product);
                }
                alert(`${quantity}x ${product.name} foi adicionado ao carrinho!`);
              }}
            >
              <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
              Adicionar ao Carrinho
            </button>

            {/* ÉLÉMENTS DE RÉASSURANCE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 border-t border-slate-100 pt-8">
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="p-2 bg-slate-100 rounded-lg text-primary"><Truck size={20} /></div>
                <span className="text-xs font-bold text-primary uppercase">Envio Grátis</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="p-2 bg-slate-100 rounded-lg text-primary"><ShieldCheck size={20} /></div>
                <span className="text-xs font-bold text-primary uppercase">Garantia Pro</span>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-2">
                <div className="p-2 bg-slate-100 rounded-lg text-primary"><Check size={20} /></div>
                <span className="text-xs font-bold text-primary uppercase">Pagamento Seguro</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}