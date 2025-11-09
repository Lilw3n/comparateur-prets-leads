/**
 * Point d'entrée principal du thème moderne
 * Charge les styles et initialise les composants
 */

import '../styles/main.css';

// Import conditionnel des composants React/Vue
if (document.querySelector('[data-react-app]')) {
  import('./react-app.jsx').then(module => {
    console.log('React app chargée');
  });
}

if (document.querySelector('[data-vue-app]')) {
  import('./vue-app.js').then(module => {
    console.log('Vue app chargée');
  });
}

// Initialisation des composants vanilla JS
document.addEventListener('DOMContentLoaded', () => {
  initModernComponents();
});

function initModernComponents() {
  // Lazy loading des images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

