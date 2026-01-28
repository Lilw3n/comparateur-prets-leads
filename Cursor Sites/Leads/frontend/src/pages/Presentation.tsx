import { Building2, Home, Key, TrendingUp, Users, Award, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import VisiteVirtuelle from '../components/VisiteVirtuelle';

export default function Presentation() {
  const services = [
    {
      icon: Home,
      title: 'Recherche de biens immobiliers',
      description: 'Accompagnement personnalisé pour trouver le bien qui correspond à vos critères et à votre budget.',
      color: 'text-blue-600'
    },
    {
      icon: Key,
      title: 'Achat et vente',
      description: 'Expertise complète pour vos transactions immobilières, de la recherche à la signature.',
      color: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Investissement locatif',
      description: 'Conseils stratégiques pour optimiser vos investissements immobiliers et maximiser votre rendement.',
      color: 'text-green-600'
    },
    {
      icon: Building2,
      title: 'Gestion de patrimoine',
      description: 'Accompagnement dans la gestion et l\'optimisation de votre patrimoine immobilier.',
      color: 'text-orange-600'
    },
  ];

  const valeurs = [
    'Expertise et connaissance du marché local',
    'Accompagnement personnalisé et sur-mesure',
    'Transparence totale dans nos démarches',
    'Réseau de partenaires de confiance',
    'Suivi personnalisé jusqu\'à la finalisation',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative px-8 py-16 md:py-24 text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Votre Expert Immobilier en France
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Accompagnement professionnel pour tous vos projets immobiliers
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="mailto:courtier972@gmail.com" className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Nous contacter
            </a>
            <a href="tel:+596696123456" className="px-6 py-3 bg-blue-500 bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 font-semibold flex items-center gap-2 backdrop-blur-sm">
              <Phone className="w-5 h-5" />
              Appeler maintenant
            </a>
          </div>
        </div>
      </div>

      {/* À propos */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              À propos de notre activité
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Spécialisé dans l'immobilier en France, je vous accompagne dans tous vos projets immobiliers 
                avec expertise et professionnalisme. Que vous souhaitiez acheter, vendre, investir ou simplement 
                obtenir des conseils, je mets mon expérience et mon réseau à votre service.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Ma connaissance approfondie du marché français et mon approche personnalisée garantissent 
                un accompagnement sur-mesure adapté à vos besoins spécifiques. Je travaille avec un réseau 
                de partenaires de confiance (notaires, banques, assureurs) pour vous offrir un service complet 
                et sécurisé.
              </p>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
              <img 
                src="/images/portrait-professionnel.png" 
                alt="Portrait professionnel - Courtier Multi-Activités"
                className="relative w-64 h-80 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visite virtuelle - Exemple */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Visites Virtuelles 360°</h2>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Découvrez nos biens immobiliers en visite virtuelle interactive. Explorez chaque pièce, 
          chaque détail comme si vous y étiez, depuis votre écran.
        </p>
        
        {/* Équipements professionnels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-md border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <img 
                  src="/images/matterport-pro2.png" 
                  alt="Matterport Pro 2"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    // Fallback si l'image n'existe pas encore
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-blue-600 font-bold text-xs">Matterport<br/>Pro 2</div>';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Matterport Pro 2</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Caméra professionnelle 3D pour visites virtuelles de qualité supérieure
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>✓ Résolution 134 mégapixels</li>
                  <li>✓ Photos 4K HDR</li>
                  <li>✓ Précision 99% jusqu'à 4,5m</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 shadow-md border border-green-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-24 h-24 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <img 
                  src="/images/fujifilm-xt2.png" 
                  alt="Fujifilm X-T2"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    // Fallback si l'image n'existe pas encore
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-green-600 font-bold text-xs">Fujifilm<br/>X-T2</div>';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fujifilm X-T2</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Appareil photo professionnel pour des clichés immobiliers de qualité
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>✓ Capteur 24 MP APS-C</li>
                  <li>✓ 325 points d'autofocus</li>
                  <li>✓ Résistant aux intempéries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <VisiteVirtuelle
          matterportId="RsKKA9cRJnj"
          titre="Exemple de visite virtuelle"
          description="Découvrez un exemple de visite virtuelle Matterport 360°"
          className="max-w-4xl mx-auto"
        />
      </div>

      {/* Services */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 ${service.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nos valeurs */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Award className="w-8 h-8 text-purple-600" />
          Nos Engagements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {valeurs.map((valeur, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-lg">{valeur}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Zone d'intervention */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <MapPin className="w-8 h-8 text-red-600" />
          Zone d'intervention
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">France Métropolitaine</h3>
            <p className="text-gray-600">Tout le territoire</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Île-de-France</h3>
            <p className="text-gray-600">Paris et région parisienne</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">Régions</h3>
            <p className="text-gray-600">Toutes les régions</p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à concrétiser votre projet ?</h2>
        <p className="text-xl text-blue-100 mb-8">
          Contactez-moi dès aujourd'hui pour un accompagnement personnalisé
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="mailto:courtier972@gmail.com" 
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2 text-lg"
          >
            <Mail className="w-6 h-6" />
            Envoyer un email
          </a>
          <a 
            href="/formulaire-dossier" 
            className="px-8 py-4 bg-blue-500 bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 font-semibold flex items-center gap-2 text-lg backdrop-blur-sm"
          >
            <Home className="w-6 h-6" />
            Demander un devis
          </a>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-400 border-opacity-30">
          <p className="text-blue-100 mb-2">
            <strong>Email :</strong> courtier972@gmail.com
          </p>
          <p className="text-blue-100">
            <strong>Disponibilité :</strong> Du lundi au vendredi, 9h - 18h
          </p>
        </div>
      </div>
    </div>
  );
}
