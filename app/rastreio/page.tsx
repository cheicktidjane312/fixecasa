"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Package, CheckCircle, Truck, Clock, AlertCircle, Box, Send } from "lucide-react";
import { motion } from "framer-motion";

// --- TYPES ---
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string; // pending, preparing, ready, sent
  total_amount: number;
  items: OrderItem[]; 
}

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper pour la barre de progression (0 à 100%)
  const getProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'preparing': return 40;
      case 'ready': return 70;
      case 'sent': return 100;
      default: return 5;
    }
  };

  // Helper pour le label textuel
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return "Pedido Recebido";
      case 'preparing': return "Em Preparação";
      case 'ready': return "Pronto para Envio";
      case 'sent': return "Enviado";
      default: return "Desconhecido";
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    const cleanId = orderId.trim();

    if (!cleanId) {
      setError("Por favor, insira um ID válido.");
      setLoading(false);
      return;
    }

    try {
      // Petite pause pour la stabilité de l'UI
      await new Promise(resolve => setTimeout(resolve, 300));

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', cleanId)
        .single();

      if (error) throw error;

      if (data) {
        setOrder(data as Order);
      }
    } catch (err) {
      console.error(err);
      setError("Encomenda não encontrada. Verifique o ID e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Package size={32} className="text-secondary" /> <span>Rastrear Encomenda</span>
          </h1>
          <p className="text-slate-500">
            <span>Insira o ID da sua encomenda para ver o estado atual.</span>
          </p>
        </div>

        {/* BARRE DE RECHERCHE */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-12 shadow-lg rounded-full bg-white p-2 border border-slate-100">
          <input 
            type="text" 
            placeholder="Ex: Cole o seu ID aqui..." 
            className="flex-grow px-6 py-3 rounded-full outline-none text-slate-700"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-primary hover:bg-slate-800 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <span>...</span> : <><Search size={18} /> <span>Procurar</span></>}
          </button>
        </form>

        {/* MESSAGE D'ERREUR */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-100"
          >
            <AlertCircle /> <span>{error}</span>
          </motion.div>
        )}

        {/* RÉSULTAT */}
        {order && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
          >
            {/* Header du résultat */}
            <div className="bg-slate-900 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider"><span>Encomenda ID</span></p>
                <p className="font-mono text-sm opacity-80 break-all"><span>{order.id}</span></p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-slate-400 text-xs uppercase tracking-wider"><span>Data do Pedido</span></p>
                <p className="font-bold"><span>{new Date(order.created_at).toLocaleDateString()}</span></p>
              </div>
            </div>

            {/* Corps du résultat */}
            <div className="p-8">
              
              {/* --- BARRE DE PROGRESSION --- */}
              <div className="mb-10">
                <h3 className="font-bold text-primary mb-6 flex justify-between items-end">
                    <span>Estado Atual:</span>
                    <span className="text-secondary uppercase text-sm font-black">
                        <span>{getStatusLabel(order.status)}</span>
                    </span>
                </h3>
                
                {/* Barre visuelle */}
                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
                  <motion.div 
                    className="h-full bg-green-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${getProgress(order.status)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                {/* Étapes avec icônes (Grille responsive) */}
                <div className="grid grid-cols-4 text-center text-xs sm:text-sm gap-2">
                    {/* Etape 1 : Pendente */}
                    <div className={`flex flex-col items-center gap-2 transition-colors ${
                        ['pending', 'preparing', 'ready', 'sent'].includes(order.status) ? 'text-green-600 font-bold' : 'text-slate-300'
                    }`}>
                        <Clock size={24} className="mb-1"/> <span>Recebido</span>
                    </div>

                    {/* Etape 2 : Preparing */}
                    <div className={`flex flex-col items-center gap-2 transition-colors ${
                        ['preparing', 'ready', 'sent'].includes(order.status) ? 'text-green-600 font-bold' : 'text-slate-300'
                    }`}>
                        <Box size={24} className="mb-1"/> <span>A preparar</span>
                    </div>

                    {/* Etape 3 : Ready */}
                    <div className={`flex flex-col items-center gap-2 transition-colors ${
                        ['ready', 'sent'].includes(order.status) ? 'text-green-600 font-bold' : 'text-slate-300'
                    }`}>
                        <CheckCircle size={24} className="mb-1"/> <span>Pronto</span>
                    </div>

                    {/* Etape 4 : Sent */}
                    <div className={`flex flex-col items-center gap-2 transition-colors ${
                        ['sent'].includes(order.status) ? 'text-green-600 font-bold' : 'text-slate-300'
                    }`}>
                        <Truck size={24} className="mb-1"/> <span>Enviado</span>
                    </div>
                </div>
              </div>

              {/* DÉTAILS DE LA COMMANDE (Blindé contre Google Translate) */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-primary mb-4"><span>Detalhes da Compra</span></h3>
                <ul className="space-y-3">
                  {order.items && order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                      <span className="text-slate-600 flex items-center gap-2">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                            <span>{item.quantity}</span>x
                        </span> 
                        <span>{item.name}</span>
                      </span>
                      <span className="font-medium text-slate-900">
                        <span>{(item.price * item.quantity).toFixed(2)}</span><span>€</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100 font-black text-xl text-primary">
                  <span>Total</span>
                  <span>
                    <span>{order.total_amount.toFixed(2)}</span><span>€</span>
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}