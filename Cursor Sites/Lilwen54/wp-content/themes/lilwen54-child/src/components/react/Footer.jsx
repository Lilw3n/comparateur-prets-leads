import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-modern py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Lilwen54</h3>
            <p className="text-gray-400">
              Un thème WordPress moderne avec les dernières technologies front-end.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-primary-400 transition-colors">Accueil</a></li>
              <li><a href="#about" className="hover:text-primary-400 transition-colors">À propos</a></li>
              <li><a href="#services" className="hover:text-primary-400 transition-colors">Services</a></li>
              <li><a href="#contact" className="hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Technologies</h4>
            <ul className="space-y-2 text-gray-400">
              <li>React 18</li>
              <li>Vue 3</li>
              <li>Tailwind CSS</li>
              <li>Vite</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contact@lilwen54.fr</li>
              <li>Site: lilwen54.fr</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Lilwen54. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

