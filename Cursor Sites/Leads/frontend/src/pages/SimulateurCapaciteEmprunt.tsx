import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Home } from 'lucide-react';

export default function SimulateurCapaciteEmprunt() {
  const [revenus, setRevenus] = useState<number>(3000);
  const [charges, setCharges] = useState<number>(500);
  const [tauxEndettement, setTauxEndettement] = useState<number>(33);
  const [tauxPret, setTauxPret] = useState<number>(3.5);
  const [duree, setDuree] = useState<number>(20);
  const [assurance, setAssurance] = useState<number>(0.3);

  const calculerCapacite = () => {
    const revenusDisponibles = revenus - charges;
    const mensualiteMax = (revenusDisponibles * tauxEndettement) / 100;
    const tauxMensuel = tauxPret / 100 / 12;
    const tauxAssuranceMensuel = assurance / 100 / 12;
    const tauxTotalMensuel = tauxMensuel + tauxAssuranceMensuel;
    
    if (tauxTotalMensuel === 0) return 0;
    
    const nombreMois = duree * 12;
    const capacite = mensualiteMax * ((1 - Math.pow(1 + tauxTotalMensuel, -nombreMois)) / tauxTotalMensuel);
    
    return Math.round(capacite);
  };

  const capaciteEmprunt = calculerCapacite();
  const mensualiteMax = Math.round((revenus - charges) * tauxEndettement / 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Évaluez votre capacité d'emprunt
        </h1>
        <p className="text-gray-600 text-lg">
          Calculez le montant maximum que vous pouvez emprunter selon votre situation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vos revenus et charges</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenus mensuels nets (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={revenus}
                    onChange={(e) => setRevenus(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Charges mensuelles (crédits en cours, loyer, etc.) (€)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={charges}
                    onChange={(e) => setCharges(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux d'endettement maximum (%)
                </label>
                <input
                  type="range"
                  value={tauxEndettement}
                  onChange={(e) => setTauxEndettement(Number(e.target.value))}
                  className="w-full"
                  min="25"
                  max="40"
                  step="1"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>25%</span>
                  <span className="font-semibold text-blue-600">{tauxEndettement}%</span>
                  <span>40%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Caractéristiques du prêt</h2>
            
            <div className="space-y-4">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <span className="font-semibold text-blue-600">{duree} ans</span>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-xl p-8 text-white sticky top-8">
            <h2 className="text-xl font-bold mb-6">Votre capacité d'emprunt</h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Montant maximum</div>
                <div className="text-4xl font-bold">{capaciteEmprunt.toLocaleString('fr-FR')} €</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Mensualité maximale</div>
                <div className="text-3xl font-bold">{mensualiteMax.toLocaleString('fr-FR')} €</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Revenus disponibles</div>
                <div className="text-2xl font-bold">{(revenus - charges).toLocaleString('fr-FR')} €</div>
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Taux d'endettement</span>
                  <span className="font-semibold">{tauxEndettement}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${(tauxEndettement / 40) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/comparateur-prets'}
                className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-all mt-6"
              >
                Comparer les offres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Informations complémentaires */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">💡 Informations importantes</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Le taux d'endettement maximum recommandé est de 33%</li>
          <li>• Ce calcul est indicatif et peut varier selon votre profil et les conditions des banques</li>
          <li>• N'oubliez pas d'inclure les frais de notaire et les frais de dossier dans votre budget</li>
          <li>• Les revenus pris en compte peuvent varier selon les établissements</li>
        </ul>
      </div>
    </div>
  );
}
