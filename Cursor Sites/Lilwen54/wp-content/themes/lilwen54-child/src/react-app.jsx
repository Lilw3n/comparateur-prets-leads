/**
 * Application React principale
 * Composants interactifs modernes
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/react/Header';
import { Hero } from './components/react/Hero';
import { Features } from './components/react/Features';
import { Footer } from './components/react/Footer';

// Initialiser React sur les éléments avec data-react-app
document.addEventListener('DOMContentLoaded', () => {
  const reactContainers = document.querySelectorAll('[data-react-app]');
  
  reactContainers.forEach(container => {
    const root = createRoot(container);
    
    // Déterminer quel composant charger selon l'attribut
    const componentType = container.dataset.reactApp;
    
    switch(componentType) {
      case 'header':
        root.render(<Header />);
        break;
      case 'hero':
        root.render(<Hero />);
        break;
      case 'features':
        root.render(<Features />);
        break;
      case 'footer':
        root.render(<Footer />);
        break;
      default:
        // App complète
        root.render(
          <React.StrictMode>
            <div className="modern-app">
              <Header />
              <Hero />
              <Features />
              <Footer />
            </div>
          </React.StrictMode>
        );
    }
  });
});

