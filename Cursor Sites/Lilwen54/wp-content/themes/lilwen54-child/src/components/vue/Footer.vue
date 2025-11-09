<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="container-modern py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-2xl font-bold text-white mb-4">Lilwen54</h3>
          <p class="text-gray-400">
            Un thème WordPress moderne avec les dernières technologies front-end.
          </p>
        </div>
        
        <div>
          <h4 class="text-white font-semibold mb-4">Navigation</h4>
          <ul class="space-y-2">
            <li v-for="item in navItems" :key="item.href">
              <a :href="item.href" class="hover:text-primary-400 transition-colors">
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-white font-semibold mb-4">Technologies</h4>
          <ul class="space-y-2 text-gray-400">
            <li v-for="tech in technologies" :key="tech">{{ tech }}</li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-white font-semibold mb-4">Contact</h4>
          <ul class="space-y-2 text-gray-400">
            <li>Email: contact@lilwen54.fr</li>
            <li>Site: lilwen54.fr</li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} Lilwen54. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const navItems = [
  { href: '#home', label: 'Accueil' },
  { href: '#about', label: 'À propos' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' }
];

const technologies = ['React 18', 'Vue 3', 'Tailwind CSS', 'Vite'];

const currentYear = computed(() => new Date().getFullYear());
</script>

