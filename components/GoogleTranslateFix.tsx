"use client";
import { useEffect } from "react";

export default function GoogleTranslateFix() {
  useEffect(() => {
    // 1. Création d'un style tag dynamique pour forcer le masquage
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame { display: none !important; }
      .goog-te-gadget-icon { display: none !important; }
      body { top: 0px !important; }
      html { margin-top: 0px !important; height: 100% !important; }
    `;
    document.head.appendChild(style);

    // 2. Fonction de nettoyage manuel
    const forceCleanup = () => {
      const banner = document.querySelector('.goog-te-banner-frame') as HTMLElement;
      if (banner) {
        banner.style.display = 'none';
      }

      document.body.style.top = '0px';
      document.body.style.position = 'static';
      if (document.documentElement) {
          document.documentElement.style.marginTop = '0px';
      }
    };

    // On lance le nettoyage immédiatement
    forceCleanup();

    // 3. Observer pour surveiller le retour de la barre
    const observer = new MutationObserver(() => {
        forceCleanup();
    });
    
    // On observe le body pour voir si des attributs (comme 'style') changent
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, []);

  return null;
}