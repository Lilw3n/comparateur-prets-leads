<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
    <!-- Background decorations -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>

    <div class="container-modern relative z-10">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles :size="16" />
          <span>Nouveau design moderne</span>
        </div>

        <!-- Main heading -->
        <h1 class="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
          <span class="gradient-text">Créons quelque chose</span>
          <br />
          <span class="text-gray-900">d'extraordinaire</span>
        </h1>

        <!-- Description -->
        <p class="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200">
          Un site web moderne, rapide et magnifique. 
          Construit avec les dernières technologies pour une expérience utilisateur exceptionnelle.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
          <button class="btn btn-primary text-lg group">
            Commencer maintenant
            <ArrowRight class="ml-2 group-hover:translate-x-1 transition-transform" :size="20" />
          </button>
          <button class="btn btn-outline text-lg">
            En savoir plus
          </button>
        </div>

        <!-- Stats -->
        <div class="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl font-bold gradient-text">{{ stat.value }}</div>
            <div class="text-gray-600 mt-2">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
        <div class="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Sparkles, ArrowRight } from 'lucide-vue-next';

const stats = [
  { value: '100%', label: 'Responsive' },
  { value: '⚡', label: 'Rapide' },
  { value: '🎨', label: 'Moderne' }
];
</script>

