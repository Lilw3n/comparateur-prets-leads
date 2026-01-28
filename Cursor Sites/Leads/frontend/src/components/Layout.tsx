import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  Home, Users, TrendingUp, Calculator, FileText, CreditCard, 
  Menu, X, Building2
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
    return location.pathname === path;
  };

  const menuItems = [
    {
      label: 'Accueil',
      path: '/',
      icon: Home
    },
    {
      label: 'Crédit immobilier',
      path: '/comparateur-prets?type=immobilier',
      icon: Home,
      submenu: [
        { label: 'Comparateur crédit immobilier', path: '/comparateur-prets?type=immobilier' },
        { label: 'Recherche de biens', path: '/recherche-biens' },
        { label: 'Simulation de prêt', path: '/simulateurs/mensualites' },
        { label: 'Capacité d\'emprunt', path: '/simulateurs/capacite-emprunt' },
        { label: 'Taux immobilier', path: '/comparateur?type=immobilier' }
      ]
    },
    {
      label: 'Crédit consommation',
      path: '/comparateur-prets?type=consommation',
      icon: CreditCard,
      submenu: [
        { label: 'Comparateur crédit conso', path: '/comparateur-prets?type=consommation' },
        { label: 'Crédit auto', path: '/comparateur-prets?type=consommation' },
        { label: 'Prêt personnel', path: '/comparateur-prets?type=consommation' }
      ]
    },
    {
      label: 'Simulateurs',
      path: '/simulateurs',
      icon: Calculator,
      submenu: [
        { label: 'Capacité d\'emprunt', path: '/simulateurs/capacite-emprunt' },
        { label: 'Calcul mensualités', path: '/simulateurs/mensualites' },
        { label: 'Taux d\'endettement', path: '/simulateurs/taux-endettement' },
        { label: 'Frais de notaire', path: '/simulateurs/frais-notaire' },
        { label: 'Comparateur de taux', path: '/comparateur-prets' }
      ]
    },
    {
      label: 'Articles',
      path: '/articles',
      icon: FileText
    },
    {
      label: 'Guides',
      path: '/guides',
      icon: FileText
    },
    {
      label: 'Actualités',
      path: '/actualites',
      icon: FileText
    },
    {
      label: 'Notre activité',
      path: '/presentation',
      icon: Building2
    },
    {
      label: 'Mon dossier',
      path: '/mon-dossier',
      icon: FileText
    },
    {
      label: 'Formulaire dossier',
      path: '/formulaire-dossier',
      icon: FileText
    },
    {
      label: 'Liste dossiers',
      path: '/dossiers',
      icon: FileText
    },
    {
      label: 'Leads',
      path: '/leads',
      icon: Users
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: TrendingUp
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
                      ComparateurPrêts
                    </h1>
                    <p className="text-xs text-gray-500">#1 en France</p>
                  </div>
                </Link>
              </div>
              
              {/* Menu desktop */}
              <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
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
                          className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                            isActive(item.path)
                              ? 'border-blue-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </button>
                        
                        {dropdownOpen === item.path && (
                          <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                            {item.submenu?.map((subitem) => (
                              <Link
                                key={subitem.path}
                                to={subitem.path}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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
                      className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                        isActive(item.path)
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Link>
                    {item.submenu && item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-6 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                      >
                        {subitem.label}
                      </Link>
                    ))}
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
                <h3 className="text-xl font-bold">ComparateurPrêts</h3>
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
              <h4 className="font-semibold mb-4">Crédit Immobilier</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/comparateur-prets?type=immobilier" className="hover:text-white">Comparateur</Link></li>
                <li><Link to="/simulateurs/mensualites" className="hover:text-white">Simulation</Link></li>
                <li><Link to="/simulateurs/capacite-emprunt" className="hover:text-white">Capacité d'emprunt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Simulateurs</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/simulateurs/capacite-emprunt" className="hover:text-white">Capacité d'emprunt</Link></li>
                <li><Link to="/simulateurs/mensualites" className="hover:text-white">Mensualités</Link></li>
                <li><Link to="/comparateur-prets" className="hover:text-white">Taux personnalisé</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Informations</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/leads" className="hover:text-white">Gestion Leads</Link></li>
                <li><Link to="/comparateur" className="hover:text-white">Accueil</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                <p>© 2026 ComparateurPrêts. Tous droits réservés.</p>
                <p className="mt-1">Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</p>
              </div>
              <div className="flex gap-6 text-sm">
                <Link to="/guides" className="text-gray-400 hover:text-white transition-colors">Mentions légales</Link>
                <Link to="/actualites" className="text-gray-400 hover:text-white transition-colors">CGU</Link>
                <Link to="/comparateur" className="text-gray-400 hover:text-white transition-colors">Confidentialité</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
