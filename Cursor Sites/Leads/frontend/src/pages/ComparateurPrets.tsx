import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { comparateursApi } from '../services/comparateursApi';
import { ComparaisonRequest, ComparaisonResponse, OffrePret } from '../types/comparateurs';
import { QuestionnairePret } from '../types/questionnaire';
import QuestionnairePretComponent from '../components/QuestionnairePret';
import SimulateurTAEG from '../components/SimulateurTAEG';
import BankingConnection from '../components/BankingConnection';
import CreditScoreCard from '../components/CreditScoreCard';
import { TrendingDown, CheckCircle, Building2, FileText, Settings, ArrowLeft, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { bankingApiService } from '../services/bankingApi';

export default function ComparateurPrets() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnairePret | null>(null);
  
  const typeFromUrl = searchParams.get('type') || 'immobilier';
  
  const [formData, setFormData] = useState<ComparaisonRequest>({
    montant: 200000,
    duree: 240,
    typeCredit: typeFromUrl,
    apport: 20,
    revenus: 3000
  });

  const [resultats, setResultats] = useState<ComparaisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offresModifiees, setOffresModifiees] = useState<Record<string, OffrePret>>({});
  const [showSimulateur, setShowSimulateur] = useState<Record<string, boolean>>({});
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [scoreInterpretation, setScoreInterpretation] = useState<string>('');
  const [bankingData, setBankingData] = useState<any>(null);
  const [showBankingConnection, setShowBankingConnection] = useState(false);

  useEffect(() => {
    // Comparer automatiquement au chargement si on a les données minimales
    if (formData.montant && formData.duree && formData.typeCredit) {
      handleComparerAvecDonnees(formData);
    }
  }, []);

  const handleQuestionnaireComplete = (data: QuestionnairePret) => {
    setQuestionnaireData(data);
    setShowQuestionnaire(false);
    
    const revenusTotaux = (data.revenusMensuels || 0) + (data.revenusConjoint || 0) + (data.autresRevenus || 0);
    const dureeMois = (data.dureeSouhaitee || 20) * 12;
    
    const nouveauFormData = {
      montant: data.montantPret || data.prixBien || formData.montant,
      duree: dureeMois || formData.duree,
      typeCredit: data.typeCredit || formData.typeCredit,
      apport: data.apportPourcentage || ((data.apport || 0) / (data.prixBien || 1)) * 100 || formData.apport,
      revenus: revenusTotaux || formData.revenus,
      leadId: data.leadId
    };
    
    setFormData(nouveauFormData);
    
    if (nouveauFormData.montant && nouveauFormData.duree && nouveauFormData.typeCredit) {
      handleComparerAvecDonnees(nouveauFormData, data);
    }
  };

  const handleComparerAvecDonnees = async (donneesForm: ComparaisonRequest, donneesQuestionnaire?: QuestionnairePret) => {
    try {
      setLoading(true);
      setError(null);
      const requestData = {
        ...donneesForm,
        questionnaireData: donneesQuestionnaire || questionnaireData || undefined
      };
      const result = await comparateursApi.comparerPrets(requestData);
      
      if (Object.keys(offresModifiees).length > 0) {
        result.offres = result.offres.map(offre => {
          const offreModifiee = offresModifiees[offre.id];
          return offreModifiee || offre;
        });
        result.offres.sort((a, b) => {
          const scoreA = a.score || a.tauxEffectif;
          const scoreB = b.score || b.tauxEffectif;
          return scoreA - scoreB;
        });
        result.meilleureOffre = result.offres[0] || null;
      }
      
      setResultats(result);

      // Calculer le score de crédit si on a les données
      if (bankingData || donneesForm.revenus) {
        try {
          const scoreResult = await bankingApiService.getCreditScore(
            bankingData || {
              monthlyIncome: donneesForm.revenus || 0,
              monthlyExpenses: 0,
              balance: 0
            },
            {
              montant: donneesForm.montant,
              duree: donneesForm.duree,
              revenus: donneesForm.revenus
            }
          );
          setCreditScore(scoreResult.score);
          setScoreInterpretation(scoreResult.interpretation);
        } catch (err) {
          console.error('Error calculating credit score:', err);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la comparaison');
      console.error('Error comparing:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComparer = async () => {
    await handleComparerAvecDonnees(formData, questionnaireData || undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'montant' || name === 'duree' || name === 'apport' || name === 'revenus'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleUpdateOffre = (offreModifiee: OffrePret) => {
    setOffresModifiees(prev => ({
      ...prev,
      [offreModifiee.id]: offreModifiee
    }));
    
    if (resultats) {
      const nouvellesOffres = resultats.offres.map(offre =>
        offre.id === offreModifiee.id ? offreModifiee : offre
      );
      nouvellesOffres.sort((a, b) => {
        const scoreA = a.score || a.tauxEffectif;
        const scoreB = b.score || b.tauxEffectif;
        return scoreA - scoreB;
      });
      
      setResultats({
        ...resultats,
        offres: nouvellesOffres,
        meilleureOffre: nouvellesOffres[0] || null
      });
    }
  };

  const toggleSimulateur = (offreId: string) => {
    setShowSimulateur(prev => ({
      ...prev,
      [offreId]: !prev[offreId]
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (showQuestionnaire) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowQuestionnaire(false)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au comparateur
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Questionnaire de qualification (optionnel)</h3>
              <p className="text-sm text-blue-800">
                Remplissez ce questionnaire pour obtenir des offres encore plus adaptées à votre situation.
              </p>
            </div>
          </div>
        </div>
        <QuestionnairePretComponent onComplete={handleQuestionnaireComplete} initialData={questionnaireData || undefined} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <button
          onClick={() => navigate('/comparateur')}
          className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Comparateur de Prêts</h1>
            <p className="text-blue-100 text-lg">Comparez les meilleures offres en quelques clics</p>
          </div>
          <button
            onClick={() => setShowQuestionnaire(true)}
            className="hidden md:inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white hover:bg-white/30 font-semibold transition-all"
          >
            <FileText className="w-5 h-5 mr-2" />
            {questionnaireData ? 'Modifier le questionnaire' : 'Questionnaire détaillé'}
          </button>
        </div>
      </div>

      {questionnaireData && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="bg-green-500 rounded-full p-2 mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 mb-3 text-lg">Profil complété - Résultats optimisés</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-gray-600 text-xs mb-1">Montant</div>
                    <div className="font-bold text-gray-900">{formatCurrency(formData.montant)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-gray-600 text-xs mb-1">Durée</div>
                    <div className="font-bold text-gray-900">{Math.round(formData.duree / 12)} ans</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-gray-600 text-xs mb-1">Revenus</div>
                    <div className="font-bold text-gray-900">{formatCurrency(formData.revenus || 0)}/mois</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-gray-600 text-xs mb-1">Apport</div>
                    <div className="font-bold text-gray-900">{formData.apport?.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="text-sm text-green-700 hover:text-green-900 font-semibold px-4 py-2 hover:bg-green-100 rounded-lg transition-all"
            >
              Modifier
            </button>
          </div>
        </div>
      )}

      {/* Formulaire de recherche - Style Pretto */}
      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Simulation gratuite en 5 minutes</h2>
            <p className="text-gray-600">Comparez les offres de plus de 100 banques et obtenez un résultat instantané</p>
          </div>
          <div className="hidden md:flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Rapide et gratuit</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant du prêt (€)
            </label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="10000"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée (mois)
            </label>
            <input
              type="number"
              name="duree"
              value={formData.duree}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="12"
              max="360"
              step="12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de crédit
            </label>
            <select
              name="typeCredit"
              value={formData.typeCredit}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="immobilier">Crédit immobilier</option>
              <option value="consommation">Crédit consommation</option>
              <option value="professionnel">Crédit professionnel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apport (%)
            </label>
            <input
              type="number"
              name="apport"
              value={formData.apport || ''}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              max="100"
              step="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenus mensuels (€)
            </label>
            <input
              type="number"
              name="revenus"
              value={formData.revenus || ''}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="100"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={handleComparer}
            disabled={loading}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Comparaison en cours...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Comparer les offres maintenant
              </>
            )}
          </button>
          {!questionnaireData && (
            <button
              onClick={() => setShowQuestionnaire(true)}
              className="w-full md:w-auto px-6 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
            >
              💡 Questionnaire détaillé (optionnel)
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}

        {/* Connexion bancaire optionnelle */}
        <div className="mt-6">
          <button
            onClick={() => setShowBankingConnection(!showBankingConnection)}
            className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center"
          >
            <Building2 className="w-4 h-4 mr-2" />
            {showBankingConnection ? 'Masquer' : 'Connecter'} ma banque pour un score précis
          </button>
          
          {showBankingConnection && (
            <div className="mt-4">
              <BankingConnection
                onDataReceived={(data) => {
                  setBankingData(data);
                  setShowBankingConnection(false);
                }}
                onScoreCalculated={(score) => {
                  setCreditScore(score);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Score de crédit */}
      {creditScore !== null && (
        <div className="mb-8">
          <CreditScoreCard
            score={creditScore}
            interpretation={scoreInterpretation}
            showDetails={true}
          />
        </div>
      )}

      {/* Résultats - Style Meilleurtaux/Pretto */}
      {resultats && (
        <div className="space-y-8">
          {/* Meilleure offre - Style Meilleurtaux */}
          {resultats.meilleureOffre && (
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
              {/* Effet de brillance */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 mr-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-1">Meilleure offre sélectionnée</h2>
                      <p className="text-green-100">L'offre la plus avantageuse selon vos critères</p>
                    </div>
                  </div>
                  {Object.keys(offresModifiees).length > 0 && (
                    <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      * Modifiée manuellement
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm text-green-100 mb-2">Banque</div>
                    <div className="text-xl font-bold">
                      {offresModifiees[resultats.meilleureOffre.id]?.nomBanque || resultats.meilleureOffre.nomBanque}
                    </div>
                    <div className="text-xs text-green-100 mt-1">
                      {offresModifiees[resultats.meilleureOffre.id]?.nomProduit || resultats.meilleureOffre.nomProduit}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm text-green-100 mb-2">TAEG</div>
                    <div className="text-4xl font-bold">
                      {formatPercent(
                        offresModifiees[resultats.meilleureOffre.id]?.tauxEffectif || resultats.meilleureOffre.tauxEffectif
                      )}
                      {offresModifiees[resultats.meilleureOffre.id] && <span className="text-2xl">*</span>}
                    </div>
                    <div className="text-xs text-green-100 mt-1">
                      Taux nominal: {formatPercent(
                        offresModifiees[resultats.meilleureOffre.id]?.tauxNominal || resultats.meilleureOffre.tauxNominal
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm text-green-100 mb-2">Mensualité</div>
                    <div className="text-3xl font-bold">
                      {offresModifiees[resultats.meilleureOffre.id]?.mensualite || resultats.meilleureOffre.mensualite
                        ? formatCurrency(
                            offresModifiees[resultats.meilleureOffre.id]?.mensualite || resultats.meilleureOffre.mensualite!
                          )
                        : 'N/A'}
                    </div>
                    <div className="text-xs text-green-100 mt-1">
                      Sur {Math.round(formData.duree / 12)} ans
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-sm text-green-100 mb-2">Coût total</div>
                    <div className="text-2xl font-bold">
                      {offresModifiees[resultats.meilleureOffre.id]?.coutTotalAvecFrais || resultats.meilleureOffre.coutTotalAvecFrais
                        ? formatCurrency(
                            offresModifiees[resultats.meilleureOffre.id]?.coutTotalAvecFrais || resultats.meilleureOffre.coutTotalAvecFrais!
                          )
                        : offresModifiees[resultats.meilleureOffre.id]?.coutTotal || resultats.meilleureOffre.coutTotal
                        ? formatCurrency(
                            offresModifiees[resultats.meilleureOffre.id]?.coutTotal || resultats.meilleureOffre.coutTotal!
                          )
                        : 'N/A'}
                    </div>
                    <div className="text-xs text-green-100 mt-1">
                      Intérêts + frais
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button className="px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 font-bold transition-all flex-1">
                    Demander cette offre
                  </button>
                  <button
                    onClick={() => toggleSimulateur(resultats.meilleureOffre!.id)}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl hover:bg-white/30 font-semibold transition-all"
                  >
                    <Settings className="w-5 h-5 inline mr-2" />
                    Simuler le TAEG
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tableau comparatif - Style Meilleurtaux */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100">
            {Object.keys(offresModifiees).length > 0 && (
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
                <div className="flex items-center text-sm text-blue-800">
                  <Settings className="w-4 h-4 mr-2" />
                  Mode simulation actif - Les valeurs modifiées sont marquées avec *
                </div>
              </div>
            )}
            
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900">
                Comparaison des {resultats.offres.length} offre{resultats.offres.length > 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600 mt-1">Comparez toutes les offres disponibles selon vos critères</p>
            </div>
            
            {/* Tableau comparatif responsive */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                      Banque / Produit
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      TAEG
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Mensualité
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Coût total
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Frais
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Taux endett.
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resultats.offres.map((offre, index) => {
                    const offreAffichee = offresModifiees[offre.id] || offre;
                    const simulateurVisible = showSimulateur[offre.id];
                    const isBest = index === 0;
                    const isModified = !!offresModifiees[offre.id];
                    
                    return (
                      <React.Fragment key={offre.id}>
                        <tr className={`hover:bg-gray-50 transition-colors ${isBest ? 'bg-green-50' : ''}`}>
                          <td className="px-6 py-5 sticky left-0 bg-inherit z-10">
                            <div className="flex items-center">
                              {isBest && (
                                <div className="bg-green-500 text-white rounded-full p-1 mr-3">
                                  <CheckCircle className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-gray-900 flex items-center">
                                  <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                  {offreAffichee.nomBanque}
                                  {isModified && <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">*</span>}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">{offreAffichee.nomProduit}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {offreAffichee.comparateur?.nom || 'Interne'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className={`text-2xl font-bold ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                              {formatPercent(offreAffichee.tauxEffectif)}
                              {isModified && <span className="text-sm text-blue-600">*</span>}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Nominal: {formatPercent(offreAffichee.tauxNominal)}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className={`text-xl font-bold ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                              {offreAffichee.mensualite ? formatCurrency(offreAffichee.mensualite) : 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {Math.round(formData.duree / 12)} ans
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className={`font-semibold ${isModified ? 'text-blue-600' : 'text-gray-900'}`}>
                              {offreAffichee.coutTotalAvecFrais
                                ? formatCurrency(offreAffichee.coutTotalAvecFrais)
                                : offreAffichee.coutTotal
                                ? formatCurrency(offreAffichee.coutTotal)
                                : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="text-sm text-gray-600">
                              {offreAffichee.fraisDossier && (
                                <div>Dossier: {formatCurrency(offreAffichee.fraisDossier)}</div>
                              )}
                              {offreAffichee.fraisGarantie && (
                                <div>Garantie: {formatCurrency(offreAffichee.fraisGarantie)}</div>
                              )}
                              {!offreAffichee.fraisDossier && !offreAffichee.fraisGarantie && (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            {offreAffichee.tauxEndettement !== null ? (
                              <div className={`font-semibold ${
                                offreAffichee.tauxEndettement! < 33 ? 'text-green-600' :
                                offreAffichee.tauxEndettement! < 35 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {offreAffichee.tauxEndettement?.toFixed(1)}%
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => toggleSimulateur(offre.id)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-medium transition-all"
                                title="Simuler le TAEG"
                              >
                                <Settings className="w-4 h-4" />
                              </button>
                              <button
                                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-semibold transition-all"
                              >
                                Demander
                              </button>
                            </div>
                          </td>
                        </tr>
                        {simulateurVisible && (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 bg-gray-50">
                              <SimulateurTAEG
                                offre={offreAffichee}
                                montant={formData.montant}
                                duree={formData.duree}
                                onUpdate={handleUpdateOffre}
                              />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
