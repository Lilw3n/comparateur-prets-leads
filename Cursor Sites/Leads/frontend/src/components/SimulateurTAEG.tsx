import { useState } from 'react';
import { OffrePret } from '../types/comparateurs';
import { Calculator, Save, X, TrendingDown } from 'lucide-react';

interface SimulateurTAEGProps {
  offre: OffrePret;
  montant: number;
  duree: number;
  onUpdate?: (offre: OffrePret) => void;
}

export default function SimulateurTAEG({ offre, montant, duree, onUpdate }: SimulateurTAEGProps) {
  const [tauxEffectifModifie, setTauxEffectifModifie] = useState(offre.tauxEffectif);
  const [tauxNominalModifie, setTauxNominalModifie] = useState(offre.tauxNominal);
  const [fraisDossierModifie, setFraisDossierModifie] = useState(offre.fraisDossier || 0);
  const [fraisGarantieModifie, setFraisGarantieModifie] = useState(offre.fraisGarantie || 0);
  const [montantAssuranceModifie, setMontantAssuranceModifie] = useState(offre.montantAssurance || 0);
  const [isEditing, setIsEditing] = useState(false);

  const calculerMensualite = (taux: number) => {
    const tauxMensuel = taux / 100 / 12;
    const nombreMois = duree;
    if (tauxMensuel === 0) return montant / nombreMois;
    
    const mensualite = (montant * tauxMensuel * Math.pow(1 + tauxMensuel, nombreMois)) /
      (Math.pow(1 + tauxMensuel, nombreMois) - 1);
    return mensualite;
  };

  const calculerCoutTotal = (mensualite: number, fraisDossier: number, fraisGarantie: number, assurance: number) => {
    const coutInterets = (mensualite * duree) - montant;
    const coutTotal = coutInterets + fraisDossier + fraisGarantie + (assurance * duree);
    return coutTotal;
  };

  const mensualiteActuelle = calculerMensualite(tauxEffectifModifie);
  const coutTotalActuel = calculerCoutTotal(
    mensualiteActuelle,
    fraisDossierModifie,
    fraisGarantieModifie,
    montantAssuranceModifie
  );

  const mensualiteOriginale = offre.mensualite || calculerMensualite(offre.tauxEffectif);
  const coutTotalOriginal = offre.coutTotalAvecFrais || 
    calculerCoutTotal(
      mensualiteOriginale,
      offre.fraisDossier || 0,
      offre.fraisGarantie || 0,
      offre.montantAssurance || 0
    );

  const differenceMensualite = mensualiteActuelle - mensualiteOriginale;
  const differenceCoutTotal = coutTotalActuel - coutTotalOriginal;

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...offre,
        tauxEffectif: tauxEffectifModifie,
        tauxNominal: tauxNominalModifie,
        fraisDossier: fraisDossierModifie,
        fraisGarantie: fraisGarantieModifie,
        montantAssurance: montantAssuranceModifie,
        mensualite: mensualiteActuelle,
        coutTotal: (mensualiteActuelle * duree) - montant,
        coutTotalAvecFrais: coutTotalActuel
      });
    }
    setIsEditing(false);
  };

  const handleReset = () => {
    setTauxEffectifModifie(offre.tauxEffectif);
    setTauxNominalModifie(offre.tauxNominal);
    setFraisDossierModifie(offre.fraisDossier || 0);
    setFraisGarantieModifie(offre.fraisGarantie || 0);
    setMontantAssuranceModifie(offre.montantAssurance || 0);
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="border-2 border-blue-200 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calculator className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">Simulateur TAEG</h3>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
          >
            Modifier
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center px-3 py-1 rounded-md hover:bg-green-50"
            >
              <Save className="w-4 h-4 mr-1" />
              Enregistrer
            </button>
            <button
              onClick={handleReset}
              className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center px-3 py-1 rounded-md hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-1" />
              Annuler
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taux nominal (%)
              </label>
              <input
                type="number"
                value={tauxNominalModifie}
                onChange={(e) => setTauxNominalModifie(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                max="20"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TAEG (%)
              </label>
              <input
                type="number"
                value={tauxEffectifModifie}
                onChange={(e) => setTauxEffectifModifie(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0"
                max="20"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais de dossier (€)
              </label>
              <input
                type="number"
                value={fraisDossierModifie}
                onChange={(e) => setFraisDossierModifie(parseFloat(e.target.value) || 0)}
                step="50"
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frais de garantie (€)
              </label>
              <input
                type="number"
                value={fraisGarantieModifie}
                onChange={(e) => setFraisGarantieModifie(parseFloat(e.target.value) || 0)}
                step="50"
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assurance mensuelle (€)
              </label>
              <input
                type="number"
                value={montantAssuranceModifie}
                onChange={(e) => setMontantAssuranceModifie(parseFloat(e.target.value) || 0)}
                step="5"
                min="0"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Taux nominal:</span>
              <span className="ml-2 font-semibold">{tauxNominalModifie.toFixed(2)}%</span>
            </div>
            <div>
              <span className="text-gray-600">TAEG:</span>
              <span className="ml-2 font-semibold text-blue-600">{tauxEffectifModifie.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Résultats de simulation */}
      <div className="mt-5 pt-5 border-t-2 border-blue-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Mensualité</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(mensualiteActuelle)}
            </div>
            {differenceMensualite !== 0 && (
              <div className={`text-xs mt-2 font-medium ${
                differenceMensualite < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {differenceMensualite < 0 ? '↓' : '↑'} {formatCurrency(Math.abs(differenceMensualite))}
                {' '}vs original
              </div>
            )}
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Coût total</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(coutTotalActuel)}
            </div>
            {differenceCoutTotal !== 0 && (
              <div className={`text-xs mt-2 font-medium ${
                differenceCoutTotal < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {differenceCoutTotal < 0 ? '↓' : '↑'} {formatCurrency(Math.abs(differenceCoutTotal))}
                {' '}vs original
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
