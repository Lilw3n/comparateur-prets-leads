import { useState, useEffect } from 'react';
import { comparateursApi } from '../services/comparateursApi';
import { TauxMoyen } from '../types/comparateurs';
import TauxMoyenCard from '../components/TauxMoyenCard';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Shield, Users, Award, ArrowRight, Home, CreditCard, 
  Building2, RefreshCw, Calculator, FileText, Star, CheckCircle,
  Briefcase, Zap, DollarSign, BookOpen, Clock, 
  Sparkles, Target, Lock, ThumbsUp, Euro, Percent, Calendar
} from 'lucide-react';
import AlerteTaux from '../components/AlerteTaux';

export default function AccueilComparateur() {
  const navigate = useNavigate();
  const [tauxMoyens, setTauxMoyens] = useState<TauxMoyen[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le simulateur intégré
  const [simulationData, setSimulationData] = useState({
    montant: 200000,
    duree: 20,
    apport: 20,
    revenus: 3000,
    typeCredit: 'immobilier'
  });

  useEffect(() => {
    chargerTauxMoyens();
  }, []);

  const chargerTauxMoyens = async () => {
    try {
      setLoading(true);
      const taux = await comparateursApi.getTauxMoyens(15);
      setTauxMoyens(taux);
    } catch (error) {
      console.error('Error loading taux moyens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComparer = (typeCredit: string) => {
    navigate(`/comparateur-prets?type=${typeCredit}`);
  };

  const handleSimulationSubmit = () => {
    navigate(`/comparateur-prets?type=${simulationData.typeCredit}&montant=${simulationData.montant}&duree=${simulationData.duree}&apport=${simulationData.apport}&revenus=${simulationData.revenus}`);
  };

  const calculerMensualite = () => {
    const tauxAnnuel = 3.0 / 100; // Taux moyen approximatif
    const tauxMensuel = tauxAnnuel / 12;
    const nombreMois = simulationData.duree * 12;
    const montantEmprunte = simulationData.montant * (1 - simulationData.apport / 100);
    
    if (tauxMensuel === 0) {
      return montantEmprunte / nombreMois;
    }
    
    const mensualite = montantEmprunte * (tauxMensuel * Math.pow(1 + tauxMensuel, nombreMois)) / 
                       (Math.pow(1 + tauxMensuel, nombreMois) - 1);
    return mensualite;
  };

  const services = [
    {
      id: 'immobilier',
      label: 'Crédit immobilier',
      description: 'Comparez les meilleurs taux immobiliers',
      icon: Home,
      color: 'from-blue-500 to-blue-600',
      badge: '2,90%',
      badgeText: 'Taux moyen sur 15 ans',
      link: '/comparateur-prets?type=immobilier',
      highlight: true
    },
    {
      id: 'consommation',
      label: 'Crédit consommation',
      description: 'Comparez gratuitement les taux en 5 minutes',
      icon: CreditCard,
      color: 'from-purple-500 to-purple-600',
      badge: '0,80%',
      badgeText: 'TAEG minimum',
      link: '/comparateur-prets?type=consommation'
    },
    {
      id: 'rachat',
      label: 'Rachat de crédit',
      description: 'Jusqu\'à -60% sur vos mensualités',
      icon: RefreshCw,
      color: 'from-orange-500 to-orange-600',
      badge: '-60%',
      badgeText: 'Sur mensualités',
      link: '/comparateur-prets?type=rachat'
    },
    {
      id: 'professionnel',
      label: 'Financement Pro',
      description: 'Prêt professionnel adapté à votre besoin',
      icon: Briefcase,
      color: 'from-indigo-500 to-indigo-600',
      badge: 'Sur mesure',
      badgeText: 'Solutions adaptées',
      link: '/comparateur-prets?type=professionnel'
    }
  ];

  const avantages = [
    {
      icon: Zap,
      title: 'Rapide et gratuit',
      description: 'Simulation en 5 minutes, résultat instantané'
    },
    {
      icon: Target,
      title: 'Plus de 100 banques',
      description: 'Comparez les meilleures offres du marché'
    },
    {
      icon: Lock,
      title: '100% sécurisé',
      description: 'Vos données sont protégées et confidentielles'
    },
    {
      icon: ThumbsUp,
      title: 'Accompagnement personnalisé',
      description: 'Des conseillers à votre écoute'
    }
  ];

  const temoignages = [
    {
      nom: 'Laurent',
      date: '15/12/2025',
      texte: 'Bonjour très content de morgane et très agréable et très à l\'écoute quand j\'avais des documents...',
      note: 5,
      service: 'Crédit immobilier'
    },
    {
      nom: 'Nieto',
      date: '08/01/2026',
      texte: 'Conseiller répond rapidement, réactif et efficace, pour connaître un fournisseur d\'énergie....',
      note: 5,
      service: 'Assurance'
    },
    {
      nom: 'Marie-odile',
      date: '22/11/2025',
      texte: 'J\'ai demandé des devis: Réponse rapide et complète. Merci...',
      note: 5,
      service: 'Crédit consommation'
    },
    {
      nom: 'Bellet',
      date: '03/01/2026',
      texte: 'Personne à l\'écoute Rapidement disponible Trouve rapidement une solution au problème...',
      note: 5,
      service: 'Rachat de crédit'
    },
    {
      nom: 'Sophie M.',
      date: '28/12/2025',
      texte: 'Excellent accompagnement pour mon crédit immobilier. Le conseiller a été très professionnel et m\'a aidé à obtenir les meilleures conditions.',
      note: 5,
      service: 'Crédit immobilier'
    },
    {
      nom: 'Pierre D.',
      date: '10/12/2025',
      texte: 'Service rapide et efficace. J\'ai pu comparer plusieurs offres en quelques minutes et trouver celle qui me convenait le mieux.',
      note: 5,
      service: 'Crédit consommation'
    },
    {
      nom: 'Claire L.',
      date: '05/01/2026',
      texte: 'Très satisfaite de l\'accompagnement pour mon assurance de prêt. Économies importantes réalisées grâce aux conseils.',
      note: 5,
      service: 'Assurance'
    },
    {
      nom: 'Marc T.',
      date: '18/11/2025',
      texte: 'Rachat de crédit réussi ! L\'équipe m\'a aidé à regrouper mes crédits et réduire mes mensualités de manière significative.',
      note: 5,
      service: 'Rachat de crédit'
    }
  ];

  return (
    <div className="space-y-16" style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Section avec Simulateur Intégré - Style Meilleurtaux */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 md:p-16 text-white shadow-2xl overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        {/* Effet de fond animé */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <span className="text-blue-100 font-semibold">Plateforme #1 en France</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Votre crédit immobilier à<br />
            <span className="text-yellow-300">quelques clics...</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
            + de 100 partenaires bancaires pour trouver la meilleure offre
          </p>
          
          {/* Simulateur Intégré - Style Meilleurtaux */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Type de crédit */}
              <div>
                <label className="block text-white font-semibold mb-2">Type de crédit</label>
                <select
                  value={simulationData.typeCredit}
                  onChange={(e) => setSimulationData({...simulationData, typeCredit: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-yellow-300"
                >
                  <option value="immobilier">Crédit immobilier</option>
                  <option value="consommation">Crédit consommation</option>
                  <option value="rachat">Rachat de crédit</option>
                  <option value="professionnel">Financement Pro</option>
                </select>
              </div>

              {/* Montant */}
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <Euro className="w-4 h-4" />
                  Montant du prêt
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={simulationData.montant}
                    onChange={(e) => setSimulationData({...simulationData, montant: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-yellow-300"
                    placeholder="200 000"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                </div>
              </div>

              {/* Durée */}
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Durée
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={simulationData.duree}
                    onChange={(e) => setSimulationData({...simulationData, duree: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-yellow-300"
                    placeholder="20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">ans</span>
                </div>
              </div>

              {/* Apport */}
              <div>
                <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Apport personnel
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={simulationData.apport}
                    onChange={(e) => setSimulationData({...simulationData, apport: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 font-semibold focus:ring-2 focus:ring-yellow-300"
                    placeholder="20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Résultat de la simulation */}
            <div className="bg-yellow-400 text-gray-900 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-sm font-semibold mb-2">Votre mensualité estimée</div>
                <div className="text-4xl font-bold">{calculerMensualite().toFixed(0)} €/mois</div>
                <div className="text-sm mt-2 opacity-80">Sur {simulationData.duree} ans</div>
              </div>
            </div>

            {/* CTA Principal */}
            <button
              onClick={handleSimulationSubmit}
              className="w-full group px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300 font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Comparer les offres gratuitement
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Statistiques de confiance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Award, value: '4.9/5', label: 'Note moyenne', color: 'text-yellow-300' },
              { icon: Users, value: '3M+', label: 'Utilisateurs/an', color: 'text-blue-200' },
              { icon: Building2, value: '100+', label: 'Banques partenaires', color: 'text-blue-200' },
              { icon: Clock, value: '5 min', label: 'Simulation rapide', color: 'text-blue-200' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Icon className={`w-8 h-8 ${stat.color} mb-2`} />
                  <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Taux moyens avec Alerte - Style Meilleurtaux */}
      {tauxMoyens.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Taux moyens du marché
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez les taux moyens actualisés pour chaque type de crédit
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {tauxMoyens.map((taux, index) => (
                  <TauxMoyenCard
                    key={index}
                    typeCredit={taux.typeCredit}
                    tauxMoyen={taux.tauxMoyen}
                    duree={taux.duree}
                    dateMiseAJour={new Date(taux.dateMiseAJour)}
                    nombreOffres={taux.nombreOffres}
                    onClick={() => handleComparer(taux.typeCredit)}
                  />
                ))}
              </div>
              
              {/* Alerte taux intégrée */}
              <div className="mt-8">
                <AlerteTaux typeCredit="immobilier" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Services Principaux - Style Pretto Moderne */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Tous nos services en un clic
          </h2>
          <p className="text-xl text-gray-600">
            Plateforme complète pour tous vos projets financiers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => navigate(service.link)}
                className={`group relative bg-gradient-to-br ${service.color} rounded-2xl shadow-lg p-8 text-white cursor-pointer hover:shadow-2xl hover:scale-105 transition-all overflow-hidden ${
                  service.highlight ? 'ring-4 ring-yellow-300 ring-opacity-50' : ''
                }`}
              >
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-12 h-12" />
                    {service.highlight && (
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    )}
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-2xl font-bold mb-1">{service.label}</div>
                    <p className="text-sm opacity-90 mb-4">{service.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{service.badge}</div>
                      <div className="text-xs opacity-80">{service.badgeText}</div>
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Avantages - Style Meilleurtaux */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Pourquoi nous choisir ?
          </h2>
          <p className="text-xl text-gray-600">
            Les avantages qui font la différence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {avantages.map((avantage, index) => {
            const Icon = avantage.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{avantage.title}</h3>
                <p className="text-gray-600">{avantage.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulateurs et Outils */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Nos simulateurs et outils
          </h2>
          <p className="text-xl text-gray-600">
            Tous les outils dont vous avez besoin pour votre projet
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Calculator, title: 'Capacité d\'emprunt', link: '/simulateurs/capacite-emprunt', color: 'bg-blue-50 border-blue-200 text-blue-600' },
            { icon: FileText, title: 'Calcul mensualités', link: '/simulateurs/mensualites', color: 'bg-green-50 border-green-200 text-green-600' },
            { icon: Calculator, title: 'Taux d\'endettement', link: '/simulateurs/taux-endettement', color: 'bg-orange-50 border-orange-200 text-orange-600' },
            { icon: FileText, title: 'Frais de notaire', link: '/simulateurs/frais-notaire', color: 'bg-purple-50 border-purple-200 text-purple-600' },
            { icon: FileText, title: 'Attestation financement', link: '/attestation-financement', color: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
            { icon: TrendingUp, title: 'Comparateur de taux', link: '/comparateur-prets', color: 'bg-pink-50 border-pink-200 text-pink-600' }
          ].map((outil, index) => {
            const Icon = outil.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(outil.link)}
                className={`${outil.color} border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all group`}
              >
                <Icon className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{outil.title}</h3>
                <div className="flex items-center text-gray-700 font-semibold group-hover:text-gray-900">
                  Accéder <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Témoignages - Style Meilleurtaux */}
      <div className="bg-white rounded-2xl shadow-xl p-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Nos clients en parlent
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez pourquoi ils nous ont fait confiance
            </p>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <div className="text-4xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {temoignages.slice(0, 4).map((temoignage, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-4 italic line-clamp-3">"{temoignage.texte}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="font-semibold text-gray-900">{temoignage.nom}</div>
                  <div className="text-xs text-gray-500">{temoignage.date}</div>
                  <div className="text-xs text-blue-600 mt-1">{temoignage.service}</div>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guides et Actualités */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          onClick={() => navigate('/guides')}
          className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-10 text-white cursor-pointer hover:shadow-2xl transition-all"
        >
          <BookOpen className="w-16 h-16 mb-6" />
          <h3 className="text-3xl font-bold mb-3">Guides et conseils</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Retrouvez tous nos guides pour mieux comprendre le crédit immobilier, les assurances et faire les meilleurs choix
          </p>
          <div className="flex items-center font-semibold text-lg">
            Consulter les guides <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => navigate('/actualites')}
          className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-10 text-white cursor-pointer hover:shadow-2xl transition-all"
        >
          <TrendingUp className="w-16 h-16 mb-6" />
          <h3 className="text-3xl font-bold mb-3">Actualités</h3>
          <p className="text-purple-100 mb-6 text-lg">
            Restez informé des dernières actualités du marché immobilier, des crédits et des assurances
          </p>
          <div className="flex items-center font-semibold text-lg">
            Lire les actualités <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>

      {/* CTA Final Ultra Moderne */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-12 text-white shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <h3 className="text-4xl font-bold mb-4">
            Prêt à trouver votre meilleure offre ?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Simulation gratuite en 5 minutes • Comparaison de plus de 100 banques • Résultat instantané
          </p>
          <button
            onClick={() => navigate('/comparateur-prets')}
            className="inline-flex items-center px-10 py-5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 font-bold text-xl shadow-2xl hover:shadow-3xl transition-all"
          >
            <Zap className="w-6 h-6 mr-3" />
            Commencer ma simulation
            <ArrowRight className="w-6 h-6 ml-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
