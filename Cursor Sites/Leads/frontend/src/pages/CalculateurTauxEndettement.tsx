import { useState } from 'react';
import { Calculator, AlertCircle, CheckCircle } from 'lucide-react';

export default function CalculateurTauxEndettement() {
  const [revenus, setRevenus] = useState<number>(3000);
  const [revenusConjoint, setRevenusConjoint] = useState<number>(0);
  const [autresRevenus, setAutresRevenus] = useState<number>(0);
  const [charges, setCharges] = useState<number>(500);
  const [mensualiteCredit, setMensualiteCredit] = useState<number>(800);

  const calculerTauxEndettement = () => {
    const revenusTotaux = revenus + revenusConjoint + autresRevenus;
    const chargesTotales = charges + mensualiteCredit;
    const tauxEndettement = revenusTotaux > 0 ? (chargesTotales / revenusTotaux) * 100 : 0;
    const resteAVivre = revenusTotaux - chargesTotales;

    return {
      tauxEndettement: Math.round(tauxEndettement * 10) / 10,
      resteAVivre: Math.round(resteAVivre),
      revenusTotaux: Math.round(revenusTotaux),
      chargesTotales: Math.round(chargesTotales),
      statut: tauxEndettement < 33 ? 'bon' : tauxEndettement < 35 ? 'acceptable' : 'eleve'
    };
  };

  const resultats = calculerTauxEndettement();

  const getStatutColor = () => {
    switch (resultats.statut) {
      case 'bon':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'acceptable':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getStatutIcon = () => {
    switch (resultats.statut) {
      case 'bon':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'acceptable':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-red-600" />;
    }
  };

  const getStatutMessage = () => {
    switch (resultats.statut) {
      case 'bon':
        return 'Votre taux d\'endettement est excellent. Les banques apprécieront votre profil.';
      case 'acceptable':
        return 'Votre taux d\'endettement est acceptable mais proche de la limite recommandée.';
      default:
        return 'Votre taux d\'endettement est élevé. Il sera difficile d\'obtenir un crédit dans ces conditions.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Calculette du taux d'endettement
        </h1>
        <p className="text-gray-600 text-lg">
          Évaluez votre capacité d'endettement et votre reste à vivre
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vos revenus</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenus mensuels nets (€)
                </label>
                <input
                  type="number"
                  value={revenus}
                  onChange={(e) => setRevenus(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenus conjoint (€)
                </label>
                <input
                  type="number"
                  value={revenusConjoint}
                  onChange={(e) => setRevenusConjoint(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autres revenus (pensions, loyers, etc.) (€)
                </label>
                <input
                  type="number"
                  value={autresRevenus}
                  onChange={(e) => setAutresRevenus(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  step="50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vos charges</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charges mensuelles (loyer, crédits en cours, etc.) (€)
                </label>
                <input
                  type="number"
                  value={charges}
                  onChange={(e) => setCharges(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  step="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensualité du nouveau crédit (€)
                </label>
                <input
                  type="number"
                  value={mensualiteCredit}
                  onChange={(e) => setMensualiteCredit(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="0"
                  step="50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl shadow-xl p-8 text-white sticky top-8">
            <h2 className="text-xl font-bold mb-6">Résultats</h2>
            
            <div className="space-y-6">
              <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border-2 ${getStatutColor()}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm opacity-90">Taux d'endettement</div>
                  {getStatutIcon()}
                </div>
                <div className="text-4xl font-bold text-white">{resultats.tauxEndettement}%</div>
                <div className="text-xs opacity-90 mt-2">{getStatutMessage()}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Revenus totaux</div>
                <div className="text-2xl font-bold">{resultats.revenusTotaux.toLocaleString('fr-FR')} €</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Charges totales</div>
                <div className="text-2xl font-bold">{resultats.chargesTotales.toLocaleString('fr-FR')} €</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Reste à vivre</div>
                <div className={`text-2xl font-bold ${resultats.resteAVivre > 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {resultats.resteAVivre.toLocaleString('fr-FR')} €
                </div>
              </div>

              {/* Barre de progression */}
              <div className="pt-4 border-t border-white/20">
                <div className="flex justify-between text-xs mb-2">
                  <span>0%</span>
                  <span className="font-semibold">33% (recommandé)</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      resultats.tauxEndettement < 33 ? 'bg-green-400' :
                      resultats.tauxEndettement < 35 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${Math.min(resultats.tauxEndettement, 100)}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/simulateurs/capacite-emprunt'}
                className="w-full bg-white text-orange-600 font-semibold py-3 rounded-lg hover:bg-orange-50 transition-all mt-6"
              >
                Calculer ma capacité d'emprunt
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informations */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">💡 Informations importantes</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Le taux d'endettement maximum recommandé est de 33%</li>
          <li>• Certaines banques acceptent jusqu'à 35% dans certains cas</li>
          <li>• Le reste à vivre doit être suffisant pour couvrir vos dépenses courantes</li>
          <li>• Les revenus pris en compte peuvent varier selon les établissements</li>
          <li>• Un taux d'endettement élevé réduit vos chances d'obtenir un crédit</li>
        </ul>
      </div>
    </div>
  );
}
