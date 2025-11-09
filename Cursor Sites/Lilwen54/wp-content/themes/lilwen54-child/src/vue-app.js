/**
 * Application Vue principale
 * Composants interactifs avec Vue 3
 */

import { createApp } from 'vue';
import Header from './components/vue/Header.vue';
import Hero from './components/vue/Hero.vue';
import Features from './components/vue/Features.vue';
import Footer from './components/vue/Footer.vue';

// Initialiser Vue sur les éléments avec data-vue-app
document.addEventListener('DOMContentLoaded', () => {
  const vueContainers = document.querySelectorAll('[data-vue-app]');
  
  vueContainers.forEach(container => {
    const componentType = container.dataset.vueApp;
    let component;
    
    switch(componentType) {
      case 'header':
        component = Header;
        break;
      case 'hero':
        component = Hero;
        break;
      case 'features':
        component = Features;
        break;
      case 'footer':
        component = Footer;
        break;
      default:
        // App complète
        component = {
          components: { Header, Hero, Features, Footer },
          template: `
            <div class="modern-app">
              <Header />
              <Hero />
              <Features />
              <Footer />
            </div>
          `
        };
    }
    
    createApp(component).mount(container);
  });
});

