<template>
  <section id="features" class="section bg-white">
    <div class="container-modern">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-display font-bold mb-4">
          <span class="gradient-text">Fonctionnalités</span> exceptionnelles
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Tout ce dont vous avez besoin pour créer un site web moderne et performant
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="card group hover:border-primary-200"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <component :is="feature.icon" class="text-white" :size="24" />
          </div>
          <h3 class="text-xl font-bold mb-2 text-gray-900">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Zap, Shield, Smartphone, Palette, Code, Rocket } from 'lucide-vue-next';

const features = [
  {
    icon: Zap,
    title: 'Performance Ultra-Rapide',
    description: 'Optimisé pour la vitesse avec lazy loading et code splitting automatique.'
  },
  {
    icon: Shield,
    title: 'Sécurisé & Stable',
    description: 'Architecture modulaire qui ne casse jamais WordPress. Facilement désactivable.'
  },
  {
    icon: Smartphone,
    title: '100% Responsive',
    description: 'Design parfaitement adapté à tous les appareils : mobile, tablette, desktop.'
  },
  {
    icon: Palette,
    title: 'Design Moderne',
    description: 'Interface utilisateur élégante avec animations fluides et transitions douces.'
  },
  {
    icon: Code,
    title: 'Technologies Avancées',
    description: 'React, Vue, Tailwind CSS et les dernières innovations front-end.'
  },
  {
    icon: Rocket,
    title: 'SEO Optimisé',
    description: 'Structure sémantique et performance optimale pour le référencement.'
  }
];
</script>

