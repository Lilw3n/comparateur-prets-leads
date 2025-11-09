<template>
  <header 
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    ]"
  >
    <nav class="container-modern">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="/" class="text-2xl font-bold gradient-text">
            Lilwen54
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            v-for="item in menuItems" 
            :key="item.href"
            :href="item.href" 
            class="text-gray-700 hover:text-primary-600 transition-colors"
          >
            {{ item.label }}
          </a>
          <button class="btn btn-primary">Commencer</button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="md:hidden p-2 text-gray-700"
          @click="toggleMenu"
          aria-label="Toggle menu"
        >
          <Menu v-if="!isMenuOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition name="slide-down">
        <div v-if="isMenuOpen" class="md:hidden py-4 space-y-4">
          <a 
            v-for="item in menuItems" 
            :key="item.href"
            :href="item.href" 
            class="block text-gray-700 hover:text-primary-600"
            @click="closeMenu"
          >
            {{ item.label }}
          </a>
          <button class="btn btn-primary w-full">Commencer</button>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, X } from 'lucide-vue-next';

const isMenuOpen = ref(false);
const isScrolled = ref(false);

const menuItems = [
  { href: '#home', label: 'Accueil' },
  { href: '#about', label: 'À propos' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

