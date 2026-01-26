import { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

export default function CalculateurFraisNotaire() {
  const [prixBien, setPrixBien] = useState<number>(200000);
  const [typeBien, setTypeBien] = useState<'ancien' | 'neuf'>('ancien');
  const [region, setRegion] = useState<'idf' | 'province'>('province');

  const calculerFraisNotaire = () => {
    let fraisEmoluments = 0;
    let fraisDivers = 0;
    let tva = 0;
    let totalFrais = 0;

    // Frais d'émoluments du notaire (selon barème)
    if (prixBien <= 6500) {
      fraisEmoluments = prixBien * 0.03938;
    } else if (prixBien <= 17000) {
      fraisEmoluments = 255.85 + (prixBien - 6500) * 0.01619;
    } else if (prixBien <= 60000) {
      fraisEmoluments = 425.60 + (prixBien - 17000) * 0.01086;
    } else if (prixBien <= 200000) {
      fraisEmoluments = 892.27 + (prixBien - 60000) * 0.00716;
    } else if (prixBien <= 1000000) {
      fraisEmoluments = 1894.27 + (prixBien - 200000) * 0.00537;
    } else {
      fraisEmoluments = 6184.27 + (prixBien - 1000000) * 0.00429;
    }

    // Frais divers (selon région)
    if (region === 'idf') {
      fraisDivers = prixBien * 0.008; // ~0.8% en IDF
    } else {
      fraisDivers = prixBien * 0.006; // ~0.6% en province
    }

    // TVA sur les frais (20%)
    tva = (fraisEmoluments + fraisDivers) * 0.20;

    // Pour les biens neufs, TVA réduite sur le bien (5.5% ou 20%)
    if (typeBien === 'neuf') {
      // On considère que la TVA est déjà incluse dans le prix pour les biens neufs
      // Les frais de notaire sont réduits
      fraisEmoluments = fraisEmoluments * 0.8; // Réduction d'environ 20%
      tva = (fraisEmoluments + fraisDivers) * 0.20;
    }

    totalFrais = fraisEmoluments + fraisDivers + tva;

    return {
      fraisEmoluments: Math.round(fraisEmoluments),
      fraisDivers: Math.round(fraisDivers),
      tva: Math.round(tva),
      totalFrais: Math.round(totalFrais),
      pourcentage: (totalFrais / prixBien) * 100
    };
  };

  const resultats = calculerFraisNotaire();
  const montantTotal = prixBien + resultats.totalFrais;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Calculator className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Calculer les frais de notaire
        </h1>
        <p className="text-gray-600 text-lg">
          Estimez les frais de notaire pour votre acquisition immobilière
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Caractéristiques du bien</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix d'achat du bien (€)
                </label>
                <input
                  type="number"
                  value={prixBien}
                  onChange={(e) => setPrixBien(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bien
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTypeBien('ancien')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      typeBien === 'ancien'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Bien ancien
                  </button>
                  <button
                    onClick={() => setTypeBien('neuf')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      typeBien === 'neuf'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Bien neuf
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRegion('province')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      region === 'province'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Province
                  </button>
                  <button
                    onClick={() => setRegion('idf')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      region === 'idf'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    Île-de-France
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Informations */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-2">💡 Informations importantes</p>
                <ul className="space-y-1">
                  <li>• Les frais de notaire incluent les émoluments, les débours et la TVA</li>
                  <li>• Pour un bien ancien : environ 7-8% du prix d'achat</li>
                  <li>• Pour un bien neuf : environ 2-3% du prix d'achat</li>
                  <li>• Les frais peuvent varier selon la localisation et le type de bien</li>
                  <li>• Ce calcul est indicatif, seul le notaire peut donner un montant exact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-xl p-8 text-white sticky top-8">
            <h2 className="text-xl font-bold mb-6">Résultats du calcul</h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Frais de notaire</div>
                <div className="text-4xl font-bold">{resultats.totalFrais.toLocaleString('fr-FR')} €</div>
                <div className="text-sm opacity-90 mt-1">
                  ({resultats.pourcentage.toFixed(2)}% du prix)
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm opacity-90 mb-1">Montant total</div>
                <div className="text-2xl font-bold">{montantTotal.toLocaleString('fr-FR')} €</div>
              </div>

              <div className="pt-4 border-t border-white/20 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-90">Émoluments</span>
                  <span className="font-semibold">{resultats.fraisEmoluments.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-90">Frais divers</span>
                  <span className="font-semibold">{resultats.fraisDivers.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-90">TVA</span>
                  <span className="font-semibold">{resultats.tva.toLocaleString('fr-FR')} €</span>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/comparateur-prets'}
                className="w-full bg-white text-purple-600 font-semibold py-3 rounded-lg hover:bg-purple-50 transition-all mt-6"
              >
                Simuler mon crédit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
