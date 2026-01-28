import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  Home, Users, TrendingUp, Calculator, FileText, CreditCard, 
  Menu, X, Building2, Shield, DollarSign
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import DevBanner from './DevBanner';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === '/comparateur') {
      return location.pathname === '/comparateur' || location.pathname === '/comparateur-prets';
    }
    if (path === '/simulateurs') {
      return location.pathname.startsWith('/simulateurs');
    }
    if (path === '/recherche-biens' || path === '/presentation') {
      return location.pathname === '/recherche-biens' || location.pathname === '/presentation';
    }
    if (path === '/assurance') {
      return location.pathname.startsWith('/assurance');
    }
    if (path === '/comparateur-prets') {
      return location.pathname === '/comparateur-prets' || location.pathname.startsWith('/comparateur-prets');
    }
    if (path === '/articles' || path === '/guides' || path === '/actualites') {
      return location.pathname === '/articles' || location.pathname === '/guides' || location.pathname === '/actualites';
    }
    if (path === '/mon-dossier' || path === '/dossiers' || path === '/dashboard' || path === '/leads') {
      return location.pathname === '/mon-dossier' || location.pathname === '/dossiers' || location.pathname === '/dashboard' || location.pathname === '/leads';
    }
    return location.pathname === path;
  };

  const menuItems = [
    {
      label: 'Accueil',
      path: '/',
      icon: Home
    },
    {
      label: 'Immobilier',
      path: '/recherche-biens',
      icon: Building2,
      submenu: [
        { label: 'Recherche de biens', path: '/recherche-biens' },
        { label: 'Notre activité immobilière', path: '/presentation' },
        { label: 'Visites virtuelles', path: '/presentation' }
      ]
    },
    {
      label: 'Prêt Immobilier',
      path: '/comparateur-prets?type=immobilier',
      icon: Home,
      submenu: [
        { label: 'Comparateur crédit immobilier', path: '/comparateur-prets?type=immobilier' },
        { label: 'Simulation de prêt', path: '/simulateurs/mensualites' },
        { label: 'Capacité d\'emprunt', path: '/simulateurs/capacite-emprunt' },
        { label: 'Taux d\'endettement', path: '/simulateurs/taux-endettement' },
        { label: 'Frais de notaire', path: '/simulateurs/frais-notaire' },
        { label: 'Formulaire dossier', path: '/formulaire-dossier' },
        { label: 'Mes dossiers', path: '/dossiers' }
      ]
    },
    {
      label: 'Assurance',
      path: '/assurance',
      icon: Shield,
      submenu: [
        { label: 'Toutes les assurances', path: '/assurance' },
        { label: 'Assurance habitation', path: '/assurance/habitation' },
        { label: 'Assurance prêt immobilier', path: '/assurance/pret' },
        { label: 'Assurance vie', path: '/assurance/vie' },
        { label: 'Assurance auto', path: '/assurance/auto' }
      ]
    },
    {
      label: 'Finance',
      path: '/comparateur-prets',
      icon: DollarSign,
      submenu: [
        { label: 'Comparateur de prêts', path: '/comparateur-prets' },
        { label: 'Crédit consommation', path: '/comparateur-prets?type=consommation' },
        { label: 'Crédit auto', path: '/comparateur-prets?type=consommation' },
        { label: 'Prêt personnel', path: '/comparateur-prets?type=consommation' },
        { label: 'Attestation financement', path: '/attestation-financement' }
      ]
    },
    {
      label: 'Ressources',
      path: '/articles',
      icon: FileText,
      submenu: [
        { label: 'Articles', path: '/articles' },
        { label: 'Guides', path: '/guides' },
        { label: 'Actualités', path: '/actualites' }
      ]
    },
    {
      label: 'Mon espace',
      path: '/mon-dossier',
      icon: Users,
      submenu: [
        { label: 'Mon dossier', path: '/mon-dossier' },
        { label: 'Mes dossiers', path: '/dossiers' },
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Gestion Leads', path: '/leads' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DevBanner />
      {/* Navigation principale - Style Premium */}
      <nav className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <TrendingUp className="relative w-10 h-10 text-white p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Courtier Multi-Activités
                    </h1>
                    <p className="text-xs text-gray-500">Immobilier • Prêts • Assurance</p>
                  </div>
                </Link>
              </div>
              
              {/* Menu desktop */}
              <div className="hidden lg:ml-8 lg:flex lg:items-center lg:space-x-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  
                  if (hasSubmenu) {
                    return (
                      <div
                        key={item.path}
                        className="relative"
                        onMouseEnter={() => setDropdownOpen(item.path)}
                        onMouseLeave={() => setDropdownOpen(null)}
                      >
                        <button
                          className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                            isActive(item.path)
                              ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </button>
                        
                        {dropdownOpen === item.path && (
                          <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border-2 border-gray-200 py-2 z-50">
                            <div className="px-3 py-2 border-b border-gray-200">
                              <span className="text-xs font-semibold text-gray-500 uppercase">{item.label}</span>
                            </div>
                            {item.submenu?.map((subitem) => (
                              <Link
                                key={subitem.path}
                                to={subitem.path}
                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                onClick={() => setDropdownOpen(null)}
                              >
                                {subitem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side - Notifications and mobile menu */}
            <div className="flex items-center gap-4">
              {/* Notification Center */}
              <div className="hidden md:block">
                <NotificationCenter />
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-[80vh] overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.path} className="mb-2">
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-md text-base font-semibold ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                    {item.submenu && (
                      <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-200">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.path}
                            to={subitem.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer Premium */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-400 mr-2" />
                <h3 className="text-xl font-bold">Courtier Multi-Activités</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Plateforme #1 pour comparer les meilleurs taux immobiliers, crédits et assurances en quelques clics.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-400">4.9/5</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Immobilier</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/recherche-biens" className="hover:text-white">Recherche de biens</Link></li>
                <li><Link to="/presentation" className="hover:text-white">Notre activité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Prêt Immobilier</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/comparateur-prets?type=immobilier" className="hover:text-white">Comparateur</Link></li>
                <li><Link to="/simulateurs/mensualites" className="hover:text-white">Simulation</Link></li>
                <li><Link to="/simulateurs/capacite-emprunt" className="hover:text-white">Capacité d'emprunt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Assurance</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/assurance" className="hover:text-white">Toutes les assurances</Link></li>
                <li><Link to="/assurance/habitation" className="hover:text-white">Assurance habitation</Link></li>
                <li><Link to="/assurance/pret" className="hover:text-white">Assurance prêt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Finance</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/comparateur-prets" className="hover:text-white">Comparateur prêts</Link></li>
                <li><Link to="/comparateur-prets?type=consommation" className="hover:text-white">Crédit consommation</Link></li>
                <li><Link to="/attestation-financement" className="hover:text-white">Attestation</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                <p>© 2026 Courtier Multi-Activités. Tous droits réservés.</p>
                <p className="mt-1">Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</p>
              </div>
              <div className="flex gap-6 text-sm">
                <Link to="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">Mentions légales</Link>
                <Link to="/cgu" className="text-gray-400 hover:text-white transition-colors">CGU</Link>
                <Link to="/confidentialite" className="text-gray-400 hover:text-white transition-colors">Confidentialité</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
