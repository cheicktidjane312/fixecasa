"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Loader2, Filter, SlidersHorizontal, X, Heart } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Définition stricte du type Produit
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  old_price?: number;
  image_url: string;
  category: string;
}

export default function ShopPage() {
  // Données
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États des filtres
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [priceFilter, setPriceFilter] = useState(1000);
  
  // --- C'EST ICI LA CORRECTION CRUCIALE ---
  // On doit dire explicitement <string[]> sinon TypeScript bloque tout ajout
  const [favorites, setFavorites] = useState<string[]>([]); 
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // 1. Chargement initial (Produits + Favoris)
  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        console.error('Erro ao carregar produtos:', error);
      } else if (data) {
        const loadedProducts = data as Product[];
        setProducts(loadedProducts);

        if (loadedProducts.length > 0) {
            const highestPrice = Math.max(...loadedProducts.map(p => p.price));
            const ceilPrice = Math.ceil(highestPrice + 10);
            setMaxPrice(ceilPrice);
            setPriceFilter(ceilPrice);
        }
      }
      setLoading(false);
    }

    fetchProducts();

    // Chargement des favoris sécurisé (SANS ANY)
    const savedFavs = localStorage.getItem('fixecasa_favorites');
    if (savedFavs) {
      try {
        const parsed = JSON.parse(savedFavs);
        // On vérifie que c'est un tableau. Si oui, TypeScript acceptera le cast "as string[]"
        if (Array.isArray(parsed)) {
            setFavorites(parsed as string[]);
        }
      } catch (e) {
        console.error("Erro ao ler favoritos", e);
      }
    }
  }, []);

  // Fonction pour liker/disliker
  const toggleFavorite = (productId: string) => {
    let newFavs: string[];
    if (favorites.includes(productId)) {
      newFavs = favorites.filter(id => id !== productId); // Retirer
    } else {
      newFavs = [...favorites, productId]; // Ajouter
    }
    setFavorites(newFavs);
    localStorage.setItem('fixecasa_favorites', JSON.stringify(newFavs));
  };

  // 2. Calcul des Catégories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    return ["Todos", ...uniqueCategories];
  }, [products]);

  // 3. Logique de Filtrage
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filtre Catégorie
    if (selectedCategory !== "Todos") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filtre Prix
    result = result.filter(product => product.price <= priceFilter);

    // Filtre Favoris
    if (showFavoritesOnly) {
      result = result.filter(product => favorites.includes(product.id));
    }

    return result;
  }, [products, selectedCategory, priceFilter, showFavoritesOnly, favorites]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* En-tête */}
      <div className="bg-primary py-16 text-center text-white mb-10 shadow-md">
        <h1 className="text-4xl font-bold mb-2">Catálogo Profissional</h1>
        <p className="text-slate-300">As melhores ferramentas ao melhor preço.</p>
      </div>

      <div className="container mx-auto px-4">
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- SIDEBAR FILTRES --- */}
            <aside className="w-full lg:w-1/4 space-y-6">
              
              {/* BOUTON FAVORIS */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl font-bold transition-all ${
                    showFavoritesOnly 
                      ? "bg-red-50 text-red-600 border border-red-200" 
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-2"><Heart className={showFavoritesOnly ? "fill-current" : ""} size={18}/> Meus Favoritos</span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm text-slate-900">{favorites.length}</span>
                </button>
              </div>

              {/* Filtre Catégories */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Filter size={18} className="text-secondary"/> Categorias
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === cat 
                          ? "bg-primary text-white shadow-md" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre Prix */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-secondary"/> Preço Máximo
                </h3>
                <div className="mb-4">
                  <input 
                    type="range" min="0" max={maxPrice} value={priceFilter}
                    onChange={(e) => setPriceFilter(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                  <span>0€</span>
                  <span className="text-primary bg-blue-50 px-2 py-1 rounded">{priceFilter}€</span>
                </div>
              </div>

              {/* Bouton Reset */}
              {(selectedCategory !== "Todos" || priceFilter !== maxPrice || showFavoritesOnly) && (
                <button 
                  onClick={() => { setSelectedCategory("Todos"); setPriceFilter(maxPrice); setShowFavoritesOnly(false); }}
                  className="w-full flex items-center justify-center gap-2 text-red-500 text-sm font-bold hover:bg-red-50 py-3 rounded-xl transition-colors"
                >
                  <X size={16}/> Limpar Filtros
                </button>
              )}
            </aside>

            {/* --- GRILLE PRODUITS --- */}
            <div className="w-full lg:w-3/4">
              
              <div className="mb-6 text-slate-500 text-sm font-medium flex justify-between items-center">
                <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</span>
                {showFavoritesOnly && <span className="text-red-500 font-bold text-xs bg-red-50 px-3 py-1 rounded-full">❤️ A ver Favoritos</span>}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-lg">
                    {showFavoritesOnly ? "Ainda não tem favoritos." : "Nenhum produto corresponde aos filtros."}
                  </p>
                  <button 
                    onClick={() => { setSelectedCategory("Todos"); setPriceFilter(maxPrice); setShowFavoritesOnly(false); }}
                    className="mt-4 text-secondary font-bold underline"
                  >
                    Ver todos os produtos
                  </button>
                </div>
              ) : (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.div 
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 group flex flex-col relative"
                      >
                        {/* COEUR FAVORIS */}
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                          className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all hover:scale-110"
                        >
                          <Heart 
                            size={20} 
                            className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-slate-400"}
                          />
                        </button>

                        {/* Image */}
                        <div className="relative h-56 overflow-hidden bg-slate-100 p-4 flex items-center justify-center">
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.old_price && product.old_price > 0 && (
                            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">
                              OFERTA
                            </span>
                          )}
                        </div>

                        {/* Contenu */}
                        <div className="p-5 flex-grow flex flex-col">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                            {product.category}
                          </span>
                          <h3 className="text-base font-bold text-primary mb-2 line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h3>
                          
                          <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex flex-col">
                              {product.old_price && product.old_price > 0 && (
                                <span className="text-xs text-slate-400 line-through">
                                  {product.old_price.toFixed(2)}€
                                </span>
                              )}
                              <span className="text-xl font-black text-slate-800">
                                {product.price.toFixed(2)}€
                              </span>
                            </div>

                            <Link 
                              href={`/loja/${product.slug}`}
                              className="bg-slate-900 text-white p-2.5 rounded-lg hover:bg-secondary hover:text-primary transition-colors shadow-lg shadow-slate-200"
                            >
                              <ShoppingCart size={18} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}