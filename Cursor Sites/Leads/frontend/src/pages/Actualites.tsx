import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, TrendingUp } from 'lucide-react';

export default function Actualites() {
  const actualites = [
    {
      date: '24 janvier 2026',
      category: 'Marché immobilier',
      title: 'La reprise du marché immobilier entamée en 2025 reste fragile selon les notaires',
      excerpt: 'Le bilan 2025 du marché immobilier d\'Immonot décrit un équilibre précaire après un redémarrage encourageant en début d\'année. Les taux d\'intérêt restent élevés mais la demande reprend progressivement.',
      image: '🏠',
      link: '/comparateur-prets?type=immobilier'
    },
    {
      date: '23 janvier 2026',
      category: 'Investissement',
      title: 'L\'investissement locatif, un marché sous tension',
      excerpt: 'L\'environnement normatif entourant l\'investissement immobilier connaît une phase de flottement qui influence déjà les comportements des bailleurs privés. Faute de lignes directrices claires, les investisseurs adoptent une attitude prudente.',
      image: '💼',
      link: '/comparateur-prets?type=immobilier'
    },
    {
      date: '22 janvier 2026',
      category: 'Économie',
      title: 'Le surendettement gagne silencieusement du terrain en France',
      excerpt: 'Les récents déséquilibres économiques nationaux exercent une pression continue sur le budget des ménages. Longtemps cantonné à des situations extrêmes, le surendettement concerne désormais un nombre croissant de foyers.',
      image: '📊',
      link: '/comparateur-prets?type=rachat'
    },
    {
      date: '21 janvier 2026',
      category: 'Taux',
      title: 'Stabilisation des taux immobiliers en début d\'année 2026',
      excerpt: 'Après plusieurs mois de hausse, les taux immobiliers semblent se stabiliser autour de 3,5% pour les prêts sur 20 ans. Cette stabilisation pourrait encourager les projets d\'achat immobilier.',
      image: '📈',
      link: '/comparateur-prets?type=immobilier'
    },
    {
      date: '20 janvier 2026',
      category: 'Assurance',
      title: 'Nouvelles règles pour l\'assurance de prêt en 2026',
      excerpt: 'Les nouvelles réglementations sur l\'assurance de prêt entrent en vigueur cette année, offrant plus de transparence et de flexibilité aux emprunteurs dans le choix de leur assurance.',
      image: '🛡️',
      link: '/comparateur-prets'
    },
    {
      date: '19 janvier 2026',
      category: 'Crédit consommation',
      title: 'Hausse de la demande de crédit consommation',
      excerpt: 'La demande de crédit à la consommation repart à la hausse, notamment pour le financement de véhicules et de travaux. Les taux restent compétitifs malgré l\'inflation.',
      image: '💳',
      link: '/comparateur-prets?type=consommation'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Actualités
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Restez informé des dernières actualités du marché immobilier, 
          des crédits et des assurances
        </p>
      </div>

      {/* Grille d'actualités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actualites.map((actualite, index) => (
          <Link
            key={index}
            to={actualite.link}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all group"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                  {actualite.category}
                </span>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {actualite.date}
                </div>
              </div>
              
              <div className="text-4xl mb-4">{actualite.image}</div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {actualite.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {actualite.excerpt}
              </p>
              
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                Lire la suite
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Restez informé
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Recevez nos dernières actualités et conseils directement dans votre boîte mail
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Votre adresse email"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-all">
            S'abonner
          </button>
        </div>
      </div>
    </div>
  );
}
