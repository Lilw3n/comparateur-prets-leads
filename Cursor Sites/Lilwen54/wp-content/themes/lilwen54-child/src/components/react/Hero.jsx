import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container-modern relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles size={16} />
            <span>Nouveau design moderne</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
            <span className="gradient-text">Créons quelque chose</span>
            <br />
            <span className="text-gray-900">d'extraordinaire</span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-200">
            Un site web moderne, rapide et magnifique. 
            Construit avec les dernières technologies pour une expérience utilisateur exceptionnelle.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
            <button className="btn btn-primary text-lg group">
              Commencer maintenant
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="btn btn-outline text-lg">
              En savoir plus
            </button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">100%</div>
              <div className="text-gray-600 mt-2">Responsive</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">⚡</div>
              <div className="text-gray-600 mt-2">Rapide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text">🎨</div>
              <div className="text-gray-600 mt-2">Moderne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}

