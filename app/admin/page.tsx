"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  CheckCircle, Package, Truck, Loader2, 
  Trash2, Plus, X, Settings, Save, MapPin, Phone, Mail, Globe, Lock, Hammer, UploadCloud, Eye, EyeOff, Clock, Box 
} from "lucide-react";
import { motion } from "framer-motion";

const CustomSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  >
    <Hammer size={18} className="text-white" />
  </motion.div>
);

// --- CONSTANTES STATUS ---
const ORDER_STATUSES = [
  { value: 'pending', label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'preparing', label: 'Em Preparação', color: 'bg-blue-100 text-blue-800' },
  { value: 'ready', label: 'Pronto p/ Envio', color: 'bg-purple-100 text-purple-800' },
  { value: 'sent', label: 'Enviado', color: 'bg-green-100 text-green-800' },
];

// --- TYPES ---
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  slug: string;
}

interface SiteSettings {
  id: string;
  address: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
  admin_password?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "", category: "", price: "", stock: "", description: ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Sécurité Admin
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [showPassToggle, setShowPassToggle] = useState(false);

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingLogin(true);

    const { data, error } = await supabase
      .from('site_settings')
      .select('admin_password')
      .single();

    if (error || !data) {
      alert("Erro de conexão com o servidor.");
      setLoadingLogin(false);
      return;
    }

    if (passwordInput === data.admin_password) { 
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert("Palavra-passe incorreta.");
    }
    setLoadingLogin(false);
  };

  // --- FETCHERS ---
  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error) setOrders(data as Order[] || []);
    setLoading(false);
  }

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data as Product[] || []);
    setLoading(false);
  }

  async function fetchSettings() {
    setLoading(true);
    const { data, error } = await supabase.from('site_settings').select('*').single();
    if (!error) setSettings(data as SiteSettings);
    setLoading(false);
  }

  // --- ACTIONS ---
  
  // 1. MISE A JOUR DU STATUT (CORRIGÉE & BLINDÉE)
  async function updateStatus(id: string, newStatus: string) {
    // On garde une copie de l'ancien état au cas où ça plante
    const previousOrders = [...orders];

    // Mise à jour visuelle immédiate (Optimiste)
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', id)
            .select(); // IMPORTANT: On demande à Supabase de renvoyer la donnée modifiée

        if (error) throw error;

        // Si data est vide, cela veut dire que la ligne n'a pas été trouvée ou modifiée (souvent problème de droits RLS)
        if (!data || data.length === 0) {
            throw new Error("Permissão negada ou encomenda não encontrada (Verifique RLS no Supabase).");
        }

    } catch (err: any) {
        console.error("Erreur update:", err);
        alert("Erro ao guardar: " + (err.message || "Erro desconhecido"));
        // On remet l'ancien état si ça a échoué
        setOrders(previousOrders); 
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm("Tem a certeza que deseja eliminar este produto?")) return;
    setProducts(products.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = "";

    if (imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9]/g, '')}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Erro no upload da imagem: " + uploadError.message);
        setLoading(false);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
      
      finalImageUrl = urlData.publicUrl;
      setUploading(false);
    } else {
      alert("Por favor, selecione uma imagem.");
      setLoading(false);
      return;
    }

    const slug = newProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const productToSave = {
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      image_url: finalImageUrl,
      description: newProduct.description,
      slug: slug,
      is_featured: true
    };
    
    const { error } = await supabase.from('products').insert([productToSave]);
    if (!error) {
      setIsAddingProduct(false);
      setNewProduct({ name: "", category: "", price: "", stock: "", description: "" });
      setImageFile(null);
      fetchProducts();
    } else {
      alert("Erro ao criar produto: " + error.message);
    }
    setLoading(false);
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);

    const updates: Partial<SiteSettings> = {
        address: settings.address,
        email: settings.email,
        phone: settings.phone,
        facebook_url: settings.facebook_url,
        instagram_url: settings.instagram_url,
    };

    if (showPasswordForm) {
        if (!oldPass || !newPass || !confPass) {
            alert("Por favor, preencha todos os campos de palavra-passe.");
            setLoading(false);
            return;
        }
        if (oldPass !== settings.admin_password) {
            alert("A palavra-passe ATUAL está incorreta.");
            setLoading(false);
            return;
        }
        if (newPass !== confPass) {
            alert("As novas palavras-passe não correspondem.");
            setLoading(false);
            return;
        }
        if (newPass.length < 4) {
             alert("A nova palavra-passe é demasiado curta (min 4).");
             setLoading(false);
             return;
        }
        updates.admin_password = newPass;
    }

    const { error } = await supabase
      .from('site_settings')
      .update(updates)
      .eq('id', settings.id);
    
    if (error) {
        alert("Erro ao guardar: " + error.message);
    } else {
        alert("Configurações atualizadas com sucesso!");
        if (showPasswordForm) {
            setShowPasswordForm(false);
            setOldPass(""); setNewPass(""); setConfPass("");
            if (updates.admin_password) {
                setSettings({ ...settings, admin_password: updates.admin_password });
            }
        }
    }
    setLoading(false);
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-slate-100 rounded-full"><Package size={40} className="text-slate-800" /></div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Painel Admin FixeCasa</h1>
          <input 
            type="password" 
            value={passwordInput} 
            onChange={(e) => setPasswordInput(e.target.value)} 
            className="w-full border p-3 rounded-lg mb-4 outline-none focus:border-blue-500 transition-colors" 
            placeholder="Palavra-passe..." 
          />
          <button disabled={loadingLogin} className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-slate-800 transition-all">
            {loadingLogin ? <CustomSpinner /> : "Entrar"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Package className="text-blue-600" /> Administração
          </h1>
          
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
            <button onClick={() => { setActiveTab('orders'); fetchOrders(); }} className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Encomendas</button>
            <button onClick={() => { setActiveTab('products'); fetchProducts(); }} className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${activeTab === 'products' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>Produtos</button>
            <button onClick={() => { setActiveTab('settings'); fetchSettings(); }} className={`px-4 py-2 rounded-md font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === 'settings' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Settings size={16}/> Configurações
            </button>
          </div>
        </div>

        {/* --- ONGLET 1 : COMMANDES --- */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Cliente</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                      <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-4 font-medium">{order.customer_name}</td>
                        <td className="p-4 font-bold">{order.total_amount.toFixed(2)}€</td>
                        
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            ORDER_STATUSES.find(s => s.value === order.status)?.color || 'bg-gray-100 text-gray-600'
                          }`}>
                            {ORDER_STATUSES.find(s => s.value === order.status)?.label || order.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                           <select 
                             value={order.status} 
                             onChange={(e) => updateStatus(order.id, e.target.value)}
                             className="bg-white border border-slate-300 text-slate-700 text-xs rounded-lg p-2 outline-none focus:border-blue-500 cursor-pointer shadow-sm font-medium"
                           >
                             {ORDER_STATUSES.map(status => (
                               <option key={status.value} value={status.value}>
                                 {status.label}
                               </option>
                             ))}
                           </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {/* --- ONGLET 2 : PRODUITS --- */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-6">
              <button onClick={() => setIsAddingProduct(!isAddingProduct)} className="bg-secondary hover:bg-secondary-hover text-primary font-bold py-3 px-6 rounded-lg flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                {isAddingProduct ? <X /> : <Plus />} {isAddingProduct ? "Cancelar" : "Adicionar"}
              </button>
            </div>
            
            {isAddingProduct && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8 animate-in slide-in-from-top-4">
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Nome do produto" className="border p-3 rounded-lg outline-none focus:border-blue-500" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input required placeholder="Categoria" className="border p-3 rounded-lg outline-none focus:border-blue-500" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                  <input required type="number" placeholder="Preço" className="border p-3 rounded-lg outline-none focus:border-blue-500" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                  <input required type="number" placeholder="Stock" className="border p-3 rounded-lg outline-none focus:border-blue-500" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                  
                  <div className="md:col-span-2 border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud size={32} className="text-slate-400 mb-2"/>
                    <p className="text-sm text-slate-500 font-medium">
                      {imageFile ? `Imagem selecionada: ${imageFile.name}` : "Clique ou arraste uma imagem aqui"}
                    </p>
                  </div>

                  <textarea required placeholder="Descrição" className="border p-3 rounded-lg md:col-span-2 h-24 outline-none focus:border-blue-500" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                  
                  <button type="submit" disabled={loading || uploading} className="bg-primary text-white font-bold py-3 rounded-lg md:col-span-2 flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors">
                    {uploading ? "A enviar imagem..." : loading ? <CustomSpinner /> : "Guardar Produto"}
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-primary line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-500 mb-1">{product.category}</p>
                    <p className="font-bold text-secondary">{product.price}€</p>
                  </div>
                  <button onClick={() => handleDeleteProduct(product.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ONGLET 3 : SETTINGS --- */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <Settings className="text-secondary" /> Editar Rodapé e Segurança
              </h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* SECTION SÉCURITÉ */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Lock size={18}/> Segurança (Admin)
                    </h3>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(!showPasswordForm);
                        setOldPass(""); setNewPass(""); setConfPass("");
                      }}
                      className="text-xs border border-slate-300 bg-white px-3 py-2 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                    >
                      {showPasswordForm ? "Cancelar" : "Alterar Palavra-Passe"}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in slide-in-from-top-2">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Palavra-passe Atual</label>
                            <div className="relative">
                                <input 
                                    type={showPassToggle ? "text" : "password"}
                                    value={oldPass}
                                    onChange={e => setOldPass(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary outline-none"
                                    placeholder="Digite a senha atual..."
                                />
                                <button type="button" onClick={() => setShowPassToggle(!showPassToggle)} className="absolute right-3 top-2.5 text-slate-400">
                                    {showPassToggle ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nova Palavra-passe</label>
                            <input 
                                type={showPassToggle ? "text" : "password"}
                                value={newPass}
                                onChange={e => setNewPass(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-500 outline-none"
                                placeholder="Nova senha..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirmar Nova Palavra-passe</label>
                            <input 
                                type={showPassToggle ? "text" : "password"}
                                value={confPass}
                                onChange={e => setConfPass(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-red-200 focus:border-red-500 outline-none"
                                placeholder="Repita a nova senha..."
                            />
                        </div>
                        <p className="text-xs text-red-500 font-bold bg-red-50 p-2 rounded">
                            ⚠️ Cuidado: Ao clicar em "Guardar", a palavra-passe muda imediatamente.
                        </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <MapPin size={16}/> Morada (Adresse)
                  </label>
                  <input 
                    type="text" 
                    value={settings.address}
                    onChange={e => setSettings({...settings, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Mail size={16}/> Email Suporte
                    </label>
                    <input 
                      type="email" 
                      value={settings.email}
                      onChange={e => setSettings({...settings, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Phone size={16}/> Telefone
                    </label>
                    <input 
                      type="text" 
                      value={settings.phone}
                      onChange={e => setSettings({...settings, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-bold text-sm text-slate-500 uppercase mb-4">Redes Sociais</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Globe size={16}/> Facebook URL
                      </label>
                      <input 
                        type="text" 
                        value={settings.facebook_url}
                        onChange={e => setSettings({...settings, facebook_url: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Globe size={16}/> Instagram URL
                      </label>
                      <input 
                        type="text" 
                        value={settings.instagram_url}
                        onChange={e => setSettings({...settings, instagram_url: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-secondary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <CustomSpinner /> : <><Save size={20} /> Guardar Alterações</>}
                </button>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}