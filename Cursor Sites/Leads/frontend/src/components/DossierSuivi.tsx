import { useState } from 'react';
import { FileText, CheckCircle, Clock, AlertCircle, Send, Download } from 'lucide-react';

interface EtapeDossier {
  id: string;
  label: string;
  statut: 'en_attente' | 'en_cours' | 'termine' | 'erreur';
  date?: string;
  documents?: string[];
}

interface DossierSuiviProps {
  dossierId?: string;
}

export default function DossierSuivi({ dossierId }: DossierSuiviProps) {
  const [etapes] = useState<EtapeDossier[]>([
    {
      id: '1',
      label: 'Demande de prêt soumise',
      statut: 'termine',
      date: '2026-01-20'
    },
    {
      id: '2',
      label: 'Analyse du dossier',
      statut: 'en_cours',
      date: '2026-01-21'
    },
    {
      id: '3',
      label: 'Vérification des documents',
      statut: 'en_attente'
    },
    {
      id: '4',
      label: 'Validation bancaire',
      statut: 'en_attente'
    },
    {
      id: '5',
      label: 'Offre de prêt reçue',
      statut: 'en_attente'
    },
    {
      id: '6',
      label: 'Signature du contrat',
      statut: 'en_attente'
    }
  ]);

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'termine':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'en_cours':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'erreur':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'termine':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'en_cours':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'erreur':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Suivi de votre dossier</h3>
            <p className="text-sm text-gray-600">
              {dossierId ? `Dossier #${dossierId}` : 'Aucun dossier en cours'}
            </p>
          </div>
        </div>
      </div>

      {dossierId ? (
        <div className="space-y-4">
          {/* Timeline */}
          <div className="relative">
            {etapes.map((etape, index) => (
              <div key={etape.id} className="relative flex items-start pb-6 last:pb-0">
                {/* Ligne verticale */}
                {index < etapes.length - 1 && (
                  <div className={`absolute left-5 top-10 w-0.5 h-full ${
                    etape.statut === 'termine' ? 'bg-green-300' :
                    etape.statut === 'en_cours' ? 'bg-blue-300' :
                    'bg-gray-200'
                  }`}></div>
                )}

                {/* Icône */}
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  etape.statut === 'termine' ? 'bg-green-100 border-green-500' :
                  etape.statut === 'en_cours' ? 'bg-blue-100 border-blue-500' :
                  etape.statut === 'erreur' ? 'bg-red-100 border-red-500' :
                  'bg-gray-100 border-gray-300'
                }`}>
                  {getStatutIcon(etape.statut)}
                </div>

                {/* Contenu */}
                <div className="ml-4 flex-1">
                  <div className={`rounded-lg p-4 border-2 ${getStatutColor(etape.statut)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{etape.label}</h4>
                      {etape.date && (
                        <span className="text-xs opacity-70">
                          {new Date(etape.date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                    {etape.statut === 'en_cours' && (
                      <p className="text-sm opacity-80 mt-2">
                        Votre dossier est en cours d'analyse par notre équipe.
                      </p>
                    )}
                    {etape.statut === 'termine' && (
                      <p className="text-sm opacity-80 mt-2">
                        Cette étape a été complétée avec succès.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all flex items-center justify-center">
              <Send className="w-4 h-4 mr-2" />
              Contacter mon conseiller
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-all flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Télécharger
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Aucun dossier de prêt en cours</p>
          <p className="text-sm text-gray-500">
            Une fois votre demande de prêt soumise, vous pourrez suivre son avancement ici.
          </p>
        </div>
      )}
    </div>
  );
}
