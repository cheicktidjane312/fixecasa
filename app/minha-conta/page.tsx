"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, Clock, CheckCircle, Truck, LogOut, 
  ShoppingBag, User, Loader2, Lock, Copy, Check, Box 
} from "lucide-react";
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
  total_amount: number;
  status: string; // pending, preparing, ready, sent
  items: OrderItem[];
  customer_name: string;
  customer_email: string;
}

export default function MyAccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // État pour l'effet visuel de copie
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. PROTECTION
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // 2. CHARGEMENT COMMANDES
  useEffect(() => {
    async function fetchMyOrders() {
      if (!user?.email) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

      if (!error) {
        setOrders(data as Order[] || []);
      }
      setLoadingOrders(false);
    }

    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // FONCTION POUR COPIER L'ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- HELPER STATUS BADGE ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            <Clock size={14} /> Pendente
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
            <Box size={14} /> Em Preparação
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
            <CheckCircle size={14} /> Pronto p/ Envio
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <Truck size={14} /> Enviado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
            Desconhecido
          </span>
        );
    }
  };

  if (authLoading || (!user && loadingOrders)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* EN-TÊTE DU PROFIL */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-white p-4 rounded-full">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary">Minha Conta</h1>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link 
              href="/minha-conta/update-password"
              className="flex items-center gap-2 bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
            >
              <Lock size={18} /> <span className="hidden sm:inline">Segurança</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} /> <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* LISTE DES COMMANDES */}
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Package className="text-secondary" /> Histórico de Encomendas
        </h2>

        {loadingOrders ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto text-slate-400" />
            <p className="text-slate-400 mt-2">A carregar encomendas...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Ainda não fez encomendas</h3>
            <p className="text-slate-500 mb-6">Explore o nosso catálogo e encontre as melhores ferramentas.</p>
            <Link href="/loja" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-2">
              Ver Loja <ShoppingBag size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-slate-50 p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Data</p>
                    <p className="font-medium text-slate-800">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total</p>
                    <p className="font-black text-primary text-lg">{order.total_amount.toFixed(2)}€</p>
                  </div>
                  
                  {/* ZONE STATUS DYNAMIQUE */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Estado</p>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  {/* ZONE IDENTIFIANT AVEC COPIE */}
                  <div className="md:text-right flex flex-col md:items-end">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">ID ENCOMENDA</p>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-slate-200">
                        <code className="text-xs font-mono text-slate-600">
                            {order.id.slice(0, 8)}...
                        </code>
                        <button 
                            onClick={() => handleCopyId(order.id)}
                            className="text-slate-400 hover:text-primary transition-colors focus:outline-none"
                            title="Copiar ID completo"
                        >
                            {copiedId === order.id ? (
                                <Check size={14} className="text-green-500 animate-in zoom-in" />
                            ) : (
                                <Copy size={14} />
                            )}
                        </button>
                    </div>
                  </div>

                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-xs">x{item.quantity}</span>
                          <span className="text-slate-700 font-medium">{item.name}</span>
                        </div>
                        <span className="text-slate-900 font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                      <button onClick={() => router.push(`/rastreio?id=${order.id}`)} className="text-secondary font-bold text-sm hover:underline flex items-center gap-1">
                        Rastrear Encomenda →
                      </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}