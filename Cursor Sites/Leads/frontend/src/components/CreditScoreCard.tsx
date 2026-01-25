import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface CreditScoreCardProps {
  score: number;
  interpretation?: string;
  showDetails?: boolean;
}

export default function CreditScoreCard({ score, interpretation, showDetails = true }: CreditScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 65) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = () => {
    if (score >= 80) return <CheckCircle className="w-6 h-6 text-green-600" />;
    if (score >= 65) return <TrendingUp className="w-6 h-6 text-blue-600" />;
    if (score >= 50) return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    return <TrendingDown className="w-6 h-6 text-red-600" />;
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Bon';
    if (score >= 50) return 'Acceptable';
    return 'À améliorer';
  };

  return (
    <div className={`rounded-xl p-6 border-2 ${getScoreColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getScoreIcon()}
          <h3 className="text-lg font-bold ml-3">Score de crédit</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{score}/100</div>
          <div className="text-sm opacity-80">{getScoreLabel()}</div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              score >= 80 ? 'bg-green-500' :
              score >= 65 ? 'bg-blue-500' :
              score >= 50 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {interpretation && showDetails && (
        <div className="mt-4 pt-4 border-t border-current/20">
          <p className="text-sm">{interpretation}</p>
        </div>
      )}

      {showDetails && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white/50 rounded-lg p-2">
            <div className="opacity-70">Chances d'obtention</div>
            <div className="font-bold">
              {score >= 80 ? 'Très élevées' :
               score >= 65 ? 'Élevées' :
               score >= 50 ? 'Modérées' :
               'Faibles'}
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-2">
            <div className="opacity-70">Recommandation</div>
            <div className="font-bold">
              {score >= 80 ? 'Prêt recommandé' :
               score >= 65 ? 'Prêt possible' :
               score >= 50 ? 'À négocier' :
               'Améliorer le profil'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
