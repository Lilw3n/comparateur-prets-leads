import { Link } from 'react-router-dom';
import { FileText, Home, CreditCard, Shield, RefreshCw, ArrowRight, BookOpen } from 'lucide-react';

export default function Guides() {
  const guides = [
    {
      category: 'Crédit Immobilier',
      icon: Home,
      color: 'bg-blue-100 text-blue-600',
      items: [
        {
          title: 'Montant emprunt',
          description: 'Comment déterminer le montant que vous pouvez emprunter',
          link: '/simulateurs/capacite-emprunt'
        },
        {
          title: 'Capacité d\'emprunt',
          description: 'Comprendre et calculer votre capacité d\'emprunt',
          link: '/simulateurs/capacite-emprunt'
        },
        {
          title: 'Renégocier son prêt',
          description: 'Les étapes pour renégocier votre crédit immobilier',
          link: '/comparateur-prets'
        },
        {
          title: 'Simulation crédit',
          description: 'Comment bien simuler votre prêt immobilier',
          link: '/simulateurs/mensualites'
        },
        {
          title: 'Taux d\'endettement',
          description: 'Tout savoir sur le taux d\'endettement maximum',
          link: '/simulateurs/capacite-emprunt'
        },
        {
          title: 'Remboursement anticipé',
          description: 'Les conditions et avantages du remboursement anticipé',
          link: '/comparateur-prets'
        }
      ]
    },
    {
      category: 'Crédit Consommation',
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-600',
      items: [
        {
          title: 'Prêt vert',
          description: 'Financer vos travaux écologiques',
          link: '/comparateur-prets?type=consommation'
        },
        {
          title: 'Taux crédit auto',
          description: 'Comprendre les taux pour l\'achat d\'un véhicule',
          link: '/comparateur-prets?type=consommation'
        },
        {
          title: 'Crédit travaux',
          description: 'Financer vos travaux de rénovation',
          link: '/comparateur-prets?type=consommation'
        },
        {
          title: 'Simulation crédit conso',
          description: 'Simuler votre crédit à la consommation',
          link: '/simulateurs/mensualites'
        },
        {
          title: 'Crédit sans justificatif',
          description: 'Les options de crédit sans justificatifs',
          link: '/comparateur-prets?type=consommation'
        }
      ]
    },
    {
      category: 'Assurance de prêt',
      icon: Shield,
      color: 'bg-green-100 text-green-600',
      items: [
        {
          title: 'Loi Lemoine',
          description: 'Comprendre la loi Lemoine sur l\'assurance de prêt',
          link: '/comparateur-prets'
        },
        {
          title: 'Souscription assurance de prêt',
          description: 'Comment souscrire une assurance de prêt',
          link: '/comparateur-prets'
        },
        {
          title: 'Calcul assurance de prêt immobilier',
          description: 'Estimer le coût de votre assurance',
          link: '/simulateurs/mensualites'
        },
        {
          title: 'Renégocier assurance emprunteur',
          description: 'Réduire le coût de votre assurance',
          link: '/comparateur-prets'
        },
        {
          title: 'Délégation d\'assurance',
          description: 'Changer d\'assurance de prêt',
          link: '/comparateur-prets'
        }
      ]
    },
    {
      category: 'Rachat de crédits',
      icon: RefreshCw,
      color: 'bg-orange-100 text-orange-600',
      items: [
        {
          title: 'Le guide du rachat de crédit',
          description: 'Tout savoir sur le rachat de crédit',
          link: '/comparateur-prets?type=rachat'
        },
        {
          title: 'Rachat de crédit immobilier',
          description: 'Regrouper vos crédits immobiliers',
          link: '/comparateur-prets?type=rachat'
        },
        {
          title: 'Simulation de rachat de crédit',
          description: 'Simuler votre rachat de crédit',
          link: '/comparateur-prets?type=rachat'
        },
        {
          title: 'Rachat de prêt hypothécaire',
          description: 'Les spécificités du rachat hypothécaire',
          link: '/comparateur-prets?type=rachat'
        },
        {
          title: 'Les avantages du rachat de crédit',
          description: 'Pourquoi faire un rachat de crédit',
          link: '/comparateur-prets?type=rachat'
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Guides et conseils
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Retrouvez tous nos guides pour mieux comprendre le crédit immobilier, 
          les assurances et faire les meilleurs choix pour vos projets
        </p>
      </div>

      {/* Guides par catégorie */}
      <div className="space-y-12">
        {guides.map((category, categoryIndex) => {
          const Icon = category.icon;
          return (
            <div key={categoryIndex} className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((guide, guideIndex) => (
                  <Link
                    key={guideIndex}
                    to={guide.link}
                    className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-gray-600">{guide.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Besoin d'aide personnalisée ?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Utilisez nos simulateurs pour obtenir des résultats adaptés à votre situation
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/simulateurs/capacite-emprunt"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Capacité d'emprunt
          </Link>
          <Link
            to="/simulateurs/mensualites"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Calcul mensualités
          </Link>
          <Link
            to="/comparateur-prets"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Comparer les offres
          </Link>
        </div>
      </div>
    </div>
  );
}
