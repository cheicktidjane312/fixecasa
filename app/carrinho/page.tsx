"use client";

import { useCart, CartItem } from "@/store/useCart"; // On importe CartItem pour le typage
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
  // TypeScript va maintenant reconnaître totalPrice car on l'a ajouté dans l'interface !
  const { items, removeItem, totalPrice } = useCart();
  
  // Plus de "any" ici, on utilise le vrai type
  const handleRemove = (item: CartItem) => {
    removeItem(item.id);
  };

  // Si le panier est vide
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 rounded-full shadow-lg mb-6">
            <ShoppingBag size={64} className="text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">O seu carrinho está vazio</h1>
        <p className="text-slate-500 mb-8 text-center max-w-md">Parece que ainda não adicionou ferramentas profissionais ao seu arsenal.</p>
        <Link 
          href="/loja" 
          className="bg-secondary hover:bg-secondary-hover text-primary font-bold py-3 px-8 rounded-full transition-all hover:scale-105"
        >
          Voltar à Loja
        </Link>
      </div>
    );
  }

  // Si le panier est plein
  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-24">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-3">
          <ShoppingBag /> O seu Carrinho
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LISTE DES PRODUITS (Gauche) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div 
                layout
                key={item.id} 
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-center"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Infos */}
                <div className="flex-grow">
                  <h3 className="font-bold text-primary line-clamp-1">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.category}</p>
                  <div className="text-secondary font-bold mt-1">
                    {item.price.toFixed(2)}€ x {item.quantity}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg w-8 text-center bg-slate-100 rounded">{item.quantity}</span>
                    <button 
                        onClick={() => handleRemove(item)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remover"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* RÉSUMÉ COMMANDE (Droite) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold text-primary mb-6">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{totalPrice().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envio</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="h-px bg-slate-100 my-2"></div>
                <div className="flex justify-between text-xl font-bold text-primary">
                  <span>Total</span>
                  <span>{totalPrice().toFixed(2)}€</span>
                </div>
              </div>

              <Link 
                href="/finalizar"
                className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
              >
                Encomendar <ArrowRight size={20} />
              </Link>
              
              <p className="text-xs text-center text-slate-400 mt-4">
                Pagamento seguro processado via email.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}