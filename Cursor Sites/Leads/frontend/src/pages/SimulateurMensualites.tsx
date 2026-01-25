import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface Echeance {
  mois: number;
  capital: number;
  interets: number;
  assurance: number;
  mensualite: number;
  capitalRestant: number;
}

export default function SimulateurMensualites() {
  const [montant, setMontant] = useState<number>(200000);
  const [tauxPret, setTauxPret] = useState<number>(3.5);
  const [duree, setDuree] = useState<number>(20);
  const [assurance, setAssurance] = useState<number>(0.3);
  const [apport, setApport] = useState<number>(20000);
  const [showTableau, setShowTableau] = useState<boolean>(false);

  const calculerMensualite = () => {
    const montantEmprunte = montant - apport;
    const tauxMensuel = tauxPret / 100 / 12;
    const tauxAssuranceMensuel = assurance / 100 / 12;
    const nombreMois = duree * 12;
    
    if (tauxMensuel === 0) {
      return montantEmprunte / nombreMois;
    }
    
    const mensualiteCapital = montantEmprunte * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -nombreMois)));
    const mensualiteAssurance = montantEmprunte * tauxAssuranceMensuel;
    
    return mensualiteCapital + mensualiteAssurance;
  };

  const calculerTableauAmortissement = (): Echeance[] => {
    const montantEmprunte = montant - apport;
    const tauxMensuel = tauxPret / 100 / 12;
    const tauxAssuranceMensuel = assurance / 100 / 12;
    const nombreMois = duree * 12;
    
    const tableau: Echeance[] = [];
    let capitalRestant = montantEmprunte;
    
    let mensualiteCapital: number;
    if (tauxMensuel === 0) {
      mensualiteCapital = montantEmprunte / nombreMois;
    } else {
      mensualiteCapital = montantEmprunte * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -nombreMois)));
    }
    
    for (let mois = 1; mois <= nombreMois; mois++) {
      const interets = capitalRestant * tauxMensuel;
      const capital = mensualiteCapital - interets;
      const mensualiteAssurance = montantEmprunte * tauxAssuranceMensuel;
      const mensualiteTotale = mensualiteCapital + mensualiteAssurance;
      
      capitalRestant -= capital;
      
      tableau.push({
        mois,
        capital: Math.max(0, capital),
        interets: Math.max(0, interets),
        assurance: mensualiteAssurance,
        mensualite: mensualiteTotale,
        capitalRestant: Math.max(0, capitalRestant)
      });
    }
    
    return tableau;
  };

  const mensualite = calculerMensualite();
  const montantEmprunte = montant - apport;
  const coutTotal = mensualite * duree * 12;
  const coutCredit = coutTotal - montantEmprunte;
  const tableau = showTableau ? calculerTableauAmortissement() : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Calculez vos mensualités
        </h1>
        <p className="text-gray-600 text-lg">
          Simulez votre prêt et découvrez le montant de vos mensualités
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Caractéristiques du prêt</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant du bien (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apport personnel (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={apport}
                    onChange={(e) => setApport(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Apport : {apport > 0 ? ((apport / montant) * 100).toFixed(1) : 0}% du montant
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux du prêt (%)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={tauxPret}
                    onChange={(e) => setTauxPret(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée du prêt (années)
                </label>
                <input
                  type="range"
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  className="w-full"
                  min="5"
                  max="30"
                  step="1"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5 ans</span>
                  <span className="font-semibold text-green-600">{duree} ans</span>
                  <span>30 ans</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux d'assurance (%)
                </label>
                <input
                  type="number"
                  value={assurance}
                  onChange={(e) => setAssurance(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="2"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-xl p-8 text-white sticky top-8">
            <h2 className="text-xl font-bold mb-6">Résultats de la simulation</h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Mensualité</div>
                <div className="text-4xl font-bold">{Math.round(mensualite).toLocaleString('fr-FR')} €</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Montant emprunté</div>
                <div className="text-2xl font-bold">{montantEmprunte.toLocaleString('fr-FR')} €</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Coût total du crédit</div>
                <div className="text-2xl font-bold">{Math.round(coutCredit).toLocaleString('fr-FR')} €</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Coût total</div>
                <div className="text-xl font-bold">{Math.round(coutTotal).toLocaleString('fr-FR')} €</div>
              </div>

              <button
                onClick={() => setShowTableau(!showTableau)}
                className="w-full bg-white text-green-600 font-semibold py-3 rounded-lg hover:bg-green-50 transition-all mt-6"
              >
                {showTableau ? 'Masquer' : 'Voir'} le tableau d'amortissement
              </button>

              <button
                onClick={() => window.location.href = '/comparateur-prets'}
                className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-all"
              >
                Comparer les offres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau d'amortissement */}
      {showTableau && tableau.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tableau d'amortissement</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Mois</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Capital</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Intérêts</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Assurance</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Mensualité</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Capital restant</th>
                </tr>
              </thead>
              <tbody>
                {tableau.slice(0, 12).map((echeance) => (
                  <tr key={echeance.mois} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{echeance.mois}</td>
                    <td className="text-right py-3 px-4">{Math.round(echeance.capital).toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4">{Math.round(echeance.interets).toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4">{Math.round(echeance.assurance).toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4 font-semibold">{Math.round(echeance.mensualite).toLocaleString('fr-FR')} €</td>
                    <td className="text-right py-3 px-4">{Math.round(echeance.capitalRestant).toLocaleString('fr-FR')} €</td>
                  </tr>
                ))}
                {tableau.length > 12 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      ... et {tableau.length - 12} autres échéances
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Informations complémentaires */}
      <div className="bg-green-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">💡 Informations importantes</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Les mensualités incluent le capital, les intérêts et l'assurance</li>
          <li>• Le taux d'assurance peut varier selon votre profil et votre âge</li>
          <li>• N'oubliez pas d'ajouter les frais de notaire (environ 7-8% du prix d'achat)</li>
          <li>• Les frais de dossier peuvent s'ajouter au montant emprunté</li>
        </ul>
      </div>
    </div>
  );
}
