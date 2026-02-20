"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/store/useCart";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ArrowRight, User, Copy, PackageSearch } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newOrderId, setNewOrderId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  // --- 1. PRÉ-REMPLISSAGE INTELLIGENT ---
  useEffect(() => {
    async function loadUserData() {
      if (!user?.email) return;

      setFormData(prev => ({ ...prev, email: user.email! }));

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('customer_name, phone, address, city')
          .eq('customer_email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setFormData(prev => ({
            ...prev,
            name: data.customer_name || "",
            phone: data.phone || "",
            address: data.address || "",
            city: data.city || ""
          }));
        }
      } catch (err) {
        console.log("Nenhum dado anterior encontrado.");
      }
    }

    if (!authLoading) {
        loadUserData();
    }
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("A iniciar a encomenda..."); // LOG

    const orderData = {
      customer_name: formData.name,
      customer_email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      total_amount: totalPrice(),
      items: items,
      status: 'pending'
    };

    try {
      // 1. CRÉATION DE LA COMMANDE
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select() 
        .single();

      if (error) throw error;

      let createdId = "";
      if (data) {
        setNewOrderId(data.id);
        createdId = data.id; 
      }

      console.log("Encomenda criada com sucesso ID:", createdId); // LOG

      // 2. GESTION DES STOCKS
      for (const item of items) {
        const { data: success, error: rpcError } = await supabase
          .rpc('decrement_stock', { 
            row_id: item.id, 
            quantity: item.quantity 
          });

        if (rpcError || success === false) {
          throw new Error(`Stock insuficiente para: ${item.name}`);
        }
      }

      // 3. ENVOI DES EMAILS
      console.log("Tentativa de envio de email..."); // LOG
      try {
        const emailRes = await fetch('/api/send-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: createdId,
                customerName: formData.name,
                customerEmail: formData.email,
                items: items,
                total: totalPrice(),
                address: `${formData.address}, ${formData.city}`
            }),
        });
        
        if (!emailRes.ok) {
            const errorText = await emailRes.text();
            console.error("Erro na API de Email:", errorText);
        } else {
            console.log("Email enviado com sucesso!");
        }

      } catch (emailError: unknown) {
          console.error("Erro de rede no Email:", emailError);
      }

      // 4. SUCCÈS
      setSuccess(true);
      clearCart();

    } catch (error: unknown) {
      console.error("Erro na encomenda:", error);
      
      let message = "Ocorreu um erro ao processar a encomenda.";
      if (error instanceof Error) {
        message = error.message;
      }
      
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 md:p-10 rounded-3xl shadow-xl text-center max-w-lg border border-green-100 w-full"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black text-primary mb-2">Pedido Confirmado!</h1>
          <p className="text-slate-600 mb-2">
            Obrigado, <strong>{formData.name}</strong>.
          </p>
          <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg mb-8">
            📩 Um email de confirmação foi enviado para <strong>{formData.email}</strong>.
          </p>

          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 mb-8 relative">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-2">O seu código de Rastreio</p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-xl md:text-2xl font-mono font-bold text-primary select-all">
                {newOrderId}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(newOrderId)}
                className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500"
                title="Copiar ID"
              >
                <Copy size={18}/>
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Guarde este código para seguir a sua encomenda.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push(user ? '/minha-conta' : '/rastreio')}
              className="bg-secondary hover:bg-secondary-hover text-primary font-bold py-4 px-8 rounded-xl transition-all w-full flex items-center justify-center gap-2"
            >
              <PackageSearch size={20} />
              {user ? "Ver na Minha Conta" : "Rastrear Agora"}
            </button>
            
            <button onClick={() => router.push('/')} className="text-slate-500 font-medium py-3 hover:text-primary transition-colors">
              Voltar à Loja
            </button>
          </div>

        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-xl font-bold mb-4">O seu carrinho está vazio.</h2>
            <button onClick={() => router.push('/loja')} className="text-secondary font-bold underline">Voltar à loja</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-primary mb-8 text-center">Encomendar</h1>
        
        {!user && !authLoading && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-8 flex items-center justify-between max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-full text-blue-600"><User size={20}/></div>
              <p className="text-sm text-blue-900">Já tem conta? <span className="hidden sm:inline">Entre para preencher os dados automaticamente.</span></p>
            </div>
            <Link href="/login?redirect=/finalizar" className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Entrar
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* COLONNE GAUCHE : FORMULAIRE */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
              <User className="text-secondary"/> Seus Dados
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input 
                  type="text" name="name" required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-secondary transition-all"
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    type="email" name="email" required
                    readOnly={!!user}
                    className={`w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-secondary transition-all ${user ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                    placeholder="joao@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                  <input 
                    type="tel" name="phone" required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-secondary transition-all"
                    placeholder="+351..."
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Morada de Entrega</label>
                <input 
                  type="text" name="address" required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-secondary transition-all"
                  placeholder="Rua..."
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cidade / Código Postal</label>
                <input 
                  type="text" name="city" required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-secondary transition-all"
                  placeholder="Lisboa..."
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {/* PROTECTION CONTRE GOOGLE TRANSLATE : On isole le texte dans un span */}
                  {loading ? <Loader2 className="animate-spin" /> : <><span>Confirmar Encomenda</span> <ArrowRight /></>}
                </button>
                <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                  <CheckCircle size={12}/> <span>Pagamento 100% Seguro via Fatura</span>
                </p>
              </div>

            </form>
          </motion.div>

          {/* COLONNE DROITE : RÉCAPITULATIF */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-primary mb-4">Resumo do Pedido</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center border-b border-slate-50 pb-4 last:border-0">
                    <div className="w-16 h-16 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-sm text-primary">{item.name}</p>
                      <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-secondary">{(item.price * item.quantity).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{totalPrice().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Envio (Europa)</span>
                  <span>GRÁTIS</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-primary pt-2">
                  <span>Total</span>
                  <span>{totalPrice().toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}