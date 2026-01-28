import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Home, Heart, Car, FileText, CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function Assurance() {
  const { type } = useParams<{ type?: string }>();
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>(type || 'habitation');

  useEffect(() => {
    if (type) {
      setSelectedType(type);
    }
  }, [type]);

  const typesAssurance = [
    {
      id: 'habitation',
      label: 'Assurance Habitation',
      icon: Home,
      description: 'Protégez votre logement et vos biens contre tous les risques',
      color: 'from-blue-500 to-blue-600',
      features: [
        'Protection contre l\'incendie',
        'Vol et vandalisme',
        'Dégâts des eaux',
        'Responsabilité civile',
        'Protection des biens mobiliers'
      ]
    },
    {
      id: 'pret',
      label: 'Assurance Prêt Immobilier',
      icon: Shield,
      description: 'Assurez votre crédit immobilier au meilleur prix',
      color: 'from-purple-500 to-purple-600',
      features: [
        'Délégation d\'assurance possible',
        'Économies jusqu\'à 77%',
        'Comparaison de plusieurs assureurs',
        'Garanties adaptées à votre profil',
        'Souscription rapide'
      ]
    },
    {
      id: 'vie',
      label: 'Assurance Vie',
      icon: Heart,
      description: 'Épargnez et protégez vos proches avec une assurance vie',
      color: 'from-green-500 to-green-600',
      features: [
        'Épargne sécurisée',
        'Transmission de patrimoine',
        'Fiscalité avantageuse',
        'Rachat partiel possible',
        'Multi-supports d\'investissement'
      ]
    },
    {
      id: 'auto',
      label: 'Assurance Auto',
      icon: Car,
      description: 'Assurez votre véhicule au meilleur tarif',
      color: 'from-orange-500 to-orange-600',
      features: [
        'Tous risques ou tiers',
        'Assistance 24/7',
        'Véhicule de remplacement',
        'Protection du conducteur',
        'Garantie conducteur tiers'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Assurance : Trouvez la meilleure protection
        </h1>
        <p className="text-gray-600 text-lg">
          Comparez et économisez sur vos assurances habitation, prêt immobilier, vie et auto
        </p>
      </div>

      {/* Types d'assurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {typesAssurance.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          return (
            <div
              key={type.id}
              className={`bg-gradient-to-br ${type.color} rounded-xl shadow-lg p-6 text-white cursor-pointer transform transition-all hover:scale-105 ${isSelected ? 'ring-4 ring-yellow-300 ring-opacity-75' : ''}`}
              onClick={() => {
                setSelectedType(type.id);
                setShowContactForm(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <Icon className="w-8 h-8" />
                </div>
                <ArrowRight className="w-6 h-6 opacity-75" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{type.label}</h3>
              <p className="text-blue-100 mb-4">{type.description}</p>
              <ul className="space-y-2">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Section avantages */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Pourquoi passer par un courtier en assurance ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comparaison gratuite</h3>
            <p className="text-gray-600">
              Comparez les offres de plusieurs assureurs en quelques minutes et trouvez la meilleure protection au meilleur prix.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Économies garanties</h3>
            <p className="text-gray-600">
              Économisez jusqu'à 77% sur votre assurance de prêt immobilier grâce à la délégation d'assurance.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Accompagnement personnalisé</h3>
            <p className="text-gray-600">
              Un expert vous accompagne dans le choix de votre assurance et vous conseille selon vos besoins spécifiques.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Contact */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Besoin d'un devis personnalisé ?</h2>
        <p className="text-xl text-blue-100 mb-6">
          Contactez-nous dès aujourd'hui pour obtenir les meilleures offres d'assurance
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowContactForm(true)}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2 text-lg"
          >
            <Mail className="w-6 h-6" />
            Demander un devis
          </button>
          <a
            href="mailto:courtier972@gmail.com"
            className="px-8 py-4 bg-blue-500 bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 font-semibold flex items-center gap-2 text-lg backdrop-blur-sm"
          >
            <Phone className="w-6 h-6" />
            Nous appeler
          </a>
        </div>
      </div>

      {/* Formulaire de contact */}
      {showContactForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Demande de devis assurance</h2>
            <button
              onClick={() => setShowContactForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <ContactForm
            typeDemande="ASSURANCE"
            prefillData={{
              typeAssurance: selectedType
            }}
            onSuccess={() => {
              setShowContactForm(false);
              alert('Votre demande a été envoyée avec succès !');
            }}
          />
        </div>
      )}
    </div>
  );
}
