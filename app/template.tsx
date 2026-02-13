"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Départ : invisible et un peu plus bas
      animate={{ opacity: 1, y: 0 }}  // Arrivée : visible et à sa place
      transition={{ 
        ease: "easeOut", 
        duration: 0.5 // Durée d'une demi-seconde (fluide)
      }}
    >
      {children}
    </motion.div>
  );
}