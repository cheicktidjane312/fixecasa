import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Définitions strictes des types
export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  old_price?: number | null;
  image_url: string;
  category: string;
  description: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

// L'INTERFACE CORRIGÉE (J'ai ajouté totalPrice ici)
interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number; // <--- C'EST CETTE LIGNE QUI MANQUAIT !
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ 
            items: [...currentItems, { ...product, quantity: 1 }] 
          });
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      // La fonction de calcul du prix total
      totalPrice: () => get().items.reduce((acc, item) => acc + item.quantity * item.price, 0),
    }),
    { name: 'fixecasa-cart' }
  )
);