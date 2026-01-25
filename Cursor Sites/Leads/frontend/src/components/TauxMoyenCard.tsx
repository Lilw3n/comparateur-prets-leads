import { TrendingDown, Calendar, ArrowRight } from 'lucide-react';

interface TauxMoyenCardProps {
  typeCredit: string;
  tauxMoyen: number;
  duree: number;
  dateMiseAJour: Date;
  nombreOffres?: number;
  onClick?: () => void;
}

export default function TauxMoyenCard({
  typeCredit,
  tauxMoyen,
  duree,
  dateMiseAJour,
  nombreOffres,
  onClick
}: TauxMoyenCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).format(date);
  };

  const getTypeCreditLabel = (type: string) => {
    const labels: Record<string, string> = {
      'immobilier': 'Crédit immobilier',
      'consommation': 'Crédit consommation',
      'professionnel': 'Financement Pro'
    };
    return labels[type] || type;
  };

  const getTypeCreditColor = (type: string) => {
    const colors: Record<string, string> = {
      'immobilier': 'bg-blue-50 border-blue-200',
      'consommation': 'bg-green-50 border-green-200',
      'professionnel': 'bg-purple-50 border-purple-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all cursor-pointer hover:shadow-xl hover:scale-105 ${
        onClick ? getTypeCreditColor(typeCredit) : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {getTypeCreditLabel(typeCredit)}
          </h3>
          {nombreOffres && (
            <p className="text-sm text-gray-600">
              {nombreOffres} offre{nombreOffres > 1 ? 's' : ''} disponible{nombreOffres > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="bg-green-100 rounded-full p-2">
          <TrendingDown className="w-6 h-6 text-green-600" />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline mb-2">
          <span className="text-4xl font-bold text-gray-900">
            {tauxMoyen.toFixed(2)}%
          </span>
          <span className="text-sm text-gray-600 ml-2">Taux moyen</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          <span>au {formatDate(dateMiseAJour)} sur {duree} ans</span>
        </div>
      </div>

      {onClick && (
        <button className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors flex items-center justify-center">
          Comparer les offres
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      )}
    </div>
  );
}
