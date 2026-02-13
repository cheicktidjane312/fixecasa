"use client";

import { Hammer } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      
      {/* Animation du Logo */}
      <div className="relative">
        {/* Cercle qui pulse derrière */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -inset-4 bg-secondary rounded-full blur-xl"
        />
        
        {/* Le Marteau qui tape */}
        <motion.div
          animate={{ rotate: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
          className="bg-primary p-6 rounded-2xl shadow-xl relative z-10"
        >
          <Hammer size={48} className="text-secondary" />
        </motion.div>
      </div>

      {/* Texte de chargement */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-black text-primary tracking-tight">
          Fixe<span className="text-secondary">Casa</span>
        </h2>
        <div className="flex gap-1">
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }} 
            transition={{ repeat: Infinity, duration: 1, delay: 0 }}
            className="w-2 h-2 bg-slate-300 rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }} 
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
            className="w-2 h-2 bg-slate-300 rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }} 
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
            className="w-2 h-2 bg-slate-300 rounded-full" 
          />
        </div>
      </div>
      
    </div>
  );
}