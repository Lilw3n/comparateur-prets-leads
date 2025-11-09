import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container-modern">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold gradient-text">
              Lilwen54
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-primary-600 transition-colors">Accueil</a>
            <a href="#about" className="text-gray-700 hover:text-primary-600 transition-colors">À propos</a>
            <a href="#services" className="text-gray-700 hover:text-primary-600 transition-colors">Services</a>
            <a href="#contact" className="text-gray-700 hover:text-primary-600 transition-colors">Contact</a>
            <button className="btn btn-primary">Commencer</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-down">
            <a href="#home" className="block text-gray-700 hover:text-primary-600">Accueil</a>
            <a href="#about" className="block text-gray-700 hover:text-primary-600">À propos</a>
            <a href="#services" className="block text-gray-700 hover:text-primary-600">Services</a>
            <a href="#contact" className="block text-gray-700 hover:text-primary-600">Contact</a>
            <button className="btn btn-primary w-full">Commencer</button>
          </div>
        )}
      </nav>
    </header>
  );
}

