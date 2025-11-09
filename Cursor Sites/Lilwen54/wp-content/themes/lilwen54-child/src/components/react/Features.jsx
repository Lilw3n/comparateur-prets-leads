import React from 'react';
import { Zap, Shield, Smartphone, Palette, Code, Rocket } from 'lucide-react';

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

export function Features() {
  return (
    <section id="features" className="section bg-white">
      <div className="container-modern">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Fonctionnalités</span> exceptionnelles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour créer un site web moderne et performant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="card group hover:border-primary-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

