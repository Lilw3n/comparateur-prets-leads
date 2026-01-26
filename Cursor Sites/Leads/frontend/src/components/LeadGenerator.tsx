import { useState, useEffect } from 'react';
import { Zap, CheckCircle, AlertCircle, Loader, X } from 'lucide-react';
import { leadGeneratorService, SecteursResponse } from '../services/leadGeneratorApi';
import { Secteur } from '../types';

interface LeadGeneratorProps {
  onLeadsGenerated?: () => void;
}

// Groupes de secteurs pour faciliter la sélection
const GROUPES_SECTEURS = {
  'Vos secteurs principaux': [
    'IMMOBILIER',
    'ASSURANCE',
    'BANQUE_PRET',
    'MARCHE_FINANCIER',
    'GESTION_PATRIMOINE',
    'INVESTISSEMENT_FINANCIER',
    'COURTAGE_ASSURANCE',
    'CONSEIL_FINANCIER',
  ],
  'Prêts': [
    'CREDIT_CONSOMMATION',
    'CREDIT_IMMOBILIER',
    'CREDIT_PROFESSIONNEL',
  ],
  'Assurances': [
    'ASSURANCE_VIE',
    'ASSURANCE_HABITATION',
    'ASSURANCE_AUTO',
    'ASSURANCE_SANTE',
    'ASSURANCE_VL',
  ],
  'Investissements': [
    'SCPI',
    'PERP',
    'PEA',
    'INVESTISSEMENT_LOCATIF',
  ],
  'Fiscalité': [
    'DEFISCALISATION',
    'FISCALITE',
    'SUCCESSION',
    'DONATION',
  ],
  'Immobilier détaillé': [
    'LMNP',
    'PINEL',
    'DEFICIT_FONCIER',
    'SCI',
  ],
  'Autres': [
    'RETRAITE',
    'EPARGNE',
    'TRADING',
    'CRYPTO',
    'ENTREPRENEURIAT',
    'FORMATION_FINANCIERE',
    'CONSEIL_EN_PATRIMOINE',
    'MANDAT_MANAGEMENT',
    'AUTRE',
  ],
};

export default function LeadGenerator({ onLeadsGenerated }: LeadGeneratorProps) {
  const [secteurs, setSecteurs] = useState<string[]>([]);
  const [secteursDisponibles, setSecteursDisponibles] = useState<string[]>([]);
  const [nombreParSecteur, setNombreParSecteur] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingSecteurs, setLoadingSecteurs] = useState(true);
  const [resultat, setResultat] = useState<{ success: boolean; message: string; total?: number } | null>(null);
  const [mode, setMode] = useState<'secteur' | 'multiples' | 'tous'>('multiples');

  useEffect(() => {
    chargerSecteurs();
  }, []);

  const chargerSecteurs = async () => {
    try {
      setLoadingSecteurs(true);
      const response = await leadGeneratorService.listerSecteurs();
      setSecteursDisponibles(response.secteurs);
    } catch (error) {
      console.error('Erreur lors du chargement des secteurs:', error);
    } finally {
      setLoadingSecteurs(false);
    }
  };

  const handleGenerer = async () => {
    try {
      setLoading(true);
      setResultat(null);

      let response;
      if (mode === 'tous') {
        response = await leadGeneratorService.genererPourTous(nombreParSecteur);
      } else if (mode === 'secteur' && secteurs.length === 1) {
        response = await leadGeneratorService.genererPourSecteur(secteurs[0], nombreParSecteur);
      } else {
        if (secteurs.length === 0) {
          setResultat({
            success: false,
            message: 'Veuillez sélectionner au moins un secteur',
          });
          setLoading(false);
          return;
        }
        response = await leadGeneratorService.genererPourSecteurs(secteurs, nombreParSecteur);
      }

      setResultat({
        success: response.success,
        message: response.message,
        total: response.total || response.generes,
      });

      if (response.success && onLeadsGenerated) {
        setTimeout(() => {
          onLeadsGenerated();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Erreur lors de la génération:', error);
      setResultat({
        success: false,
        message: error.response?.data?.error || 'Erreur lors de la génération des leads',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSecteur = (secteur: string) => {
    if (secteurs.includes(secteur)) {
      setSecteurs(secteurs.filter(s => s !== secteur));
    } else {
      setSecteurs([...secteurs, secteur]);
    }
  };

  const selectGroupe = (groupeSecteurs: string[]) => {
    const nouveauxSecteurs = [...new Set([...secteurs, ...groupeSecteurs])];
    setSecteurs(nouveauxSecteurs);
  };

  const selectTous = () => {
    setSecteurs([...secteursDisponibles]);
  };

  const deselectTous = () => {
    setSecteurs([]);
  };

  const formaterSecteur = (secteur: string): string => {
    return secteur
      .split('_')
      .map(mot => mot.charAt(0) + mot.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Générateur de Leads</h2>
        </div>
        {resultat && (
          <button
            onClick={() => setResultat(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode de génération */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mode de génération
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setMode('secteur');
              setSecteurs(secteurs.slice(0, 1));
            }}
            className={`px-4 py-2 rounded-md ${
              mode === 'secteur'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Un secteur
          </button>
          <button
            onClick={() => setMode('multiples')}
            className={`px-4 py-2 rounded-md ${
              mode === 'multiples'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Plusieurs secteurs
          </button>
          <button
            onClick={() => setMode('tous')}
            className={`px-4 py-2 rounded-md ${
              mode === 'tous'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous les secteurs
          </button>
        </div>
      </div>

      {/* Sélection des secteurs */}
      {mode !== 'tous' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Secteurs sélectionnés ({secteurs.length})
            </label>
            <div className="flex space-x-2">
              <button
                onClick={selectTous}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Tout sélectionner
              </button>
              <button
                onClick={deselectTous}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Tout désélectionner
              </button>
            </div>
          </div>

          {loadingSecteurs ? (
            <div className="text-center py-4">
              <Loader className="w-5 h-5 animate-spin mx-auto text-gray-400" />
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(GROUPES_SECTEURS).map(([groupe, groupeSecteurs]) => (
                <div key={groupe} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">{groupe}</h3>
                    <button
                      onClick={() => selectGroupe(groupeSecteurs)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Sélectionner tout
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {groupeSecteurs.map(secteur => (
                      <label
                        key={secteur}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={secteurs.includes(secteur)}
                          onChange={() => toggleSecteur(secteur)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {formaterSecteur(secteur)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Nombre de leads par secteur */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de leads par secteur
        </label>
        <input
          type="number"
          min="1"
          max="1000"
          value={nombreParSecteur}
          onChange={(e) => setNombreParSecteur(parseInt(e.target.value) || 10)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          {mode === 'tous'
            ? `Générera ${nombreParSecteur} leads × ${secteursDisponibles.length} secteurs = ${nombreParSecteur * secteursDisponibles.length} leads au total`
            : mode === 'secteur'
            ? `Générera ${nombreParSecteur} leads`
            : `Générera ${nombreParSecteur} leads × ${secteurs.length} secteurs = ${nombreParSecteur * secteurs.length} leads au total`}
        </p>
      </div>

      {/* Résultat */}
      {resultat && (
        <div
          className={`mb-6 p-4 rounded-md flex items-center space-x-3 ${
            resultat.success
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {resultat.success ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <div>
            <p className="font-medium">{resultat.message}</p>
            {resultat.total !== undefined && (
              <p className="text-sm mt-1">
                {resultat.total} leads générés avec succès
              </p>
            )}
          </div>
        </div>
      )}

      {/* Bouton de génération */}
      <button
        onClick={handleGenerer}
        disabled={loading || (mode !== 'tous' && secteurs.length === 0)}
        className={`w-full py-3 px-4 rounded-md font-medium text-white ${
          loading || (mode !== 'tous' && secteurs.length === 0)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } flex items-center justify-center space-x-2`}
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Génération en cours...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>
              {mode === 'tous'
                ? `Générer pour tous les secteurs (${nombreParSecteur * secteursDisponibles.length} leads)`
                : mode === 'secteur'
                ? `Générer ${nombreParSecteur} leads`
                : `Générer ${nombreParSecteur * secteurs.length} leads`}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
