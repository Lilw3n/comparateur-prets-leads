import { ExternalLink, GraduationCap, Globe, ArrowRight, CheckCircle } from 'lucide-react';

export default function NosAutresSites() {
  const sites = [
    {
      id: 'formation-cgp',
      nom: 'Formation CGP',
      description: 'Organisme certifié Qualiopi - Préparation complète aux certifications professionnelles',
      url: 'https://formation-cgp.vercel.app/',
      icone: GraduationCap,
      couleur: 'from-purple-500 to-purple-600',
      fonctionnalites: [
        'Formations certifiantes (IAS, IOBSP, CIF, etc.)',
        'Quiz AMF gratuit interactif',
        'Cours supplémentaires',
        'Suivi de progression',
        'Certificats de complétion',
        'Organisme certifié Qualiopi'
      ],
      categories: ['IAS', 'IOBSP', 'CIF', 'Profession immobilière', 'AMF', 'Lutte contre le blanchiment']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
          <Globe className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Nos Autres Sites
        </h1>
        <p className="text-gray-600 text-lg">
          Découvrez nos autres plateformes et services complémentaires
        </p>
      </div>

      {/* Liste des sites */}
      <div className="grid grid-cols-1 gap-8">
        {sites.map((site) => {
          const Icon = site.icone;
          return (
            <div
              key={site.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all hover:shadow-xl"
            >
              <div className={`bg-gradient-to-r ${site.couleur} p-8 text-white`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                      <Icon className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{site.nom}</h2>
                      <p className="text-blue-100 text-lg">{site.description}</p>
                    </div>
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 flex-shrink-0"
                  >
                    <span>Visiter le site</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="p-8">
                {/* Catégories */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Formations disponibles</h3>
                  <div className="flex flex-wrap gap-2">
                    {site.categories.map((categorie, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                      >
                        {categorie}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Fonctionnalités principales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {site.fonctionnalites.map((fonctionnalite, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{fonctionnalite}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aperçu visuel */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu du site</h3>
                  <div className="relative bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-300">
                    {/* Barre du navigateur simulée */}
                    <div className="bg-gray-200 px-4 py-2 flex items-center gap-2 border-b border-gray-300">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 ml-4">
                        {site.url}
                      </div>
                    </div>
                    
                    {/* Contenu de l'aperçu */}
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"></div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-32 bg-purple-100 rounded-lg"></div>
                          <div className="h-32 bg-purple-100 rounded-lg"></div>
                          <div className="h-32 bg-purple-100 rounded-lg"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Accéder à {site.nom}</span>
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-md p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Des services complémentaires pour vos besoins
        </h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          Nos différents sites vous offrent une gamme complète de services : courtage en assurance et prêts immobiliers, 
          formations certifiantes, et bien plus encore. Chaque plateforme est conçue pour répondre à vos besoins spécifiques 
          avec des outils modernes et une interface intuitive.
        </p>
      </div>
    </div>
  );
}
