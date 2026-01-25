import { useState } from 'react';
import { Building2, CheckCircle, AlertCircle, Loader, Shield, TrendingUp } from 'lucide-react';
import { bankingApiService } from '../services/bankingApi';

interface BankingConnectionProps {
  onDataReceived?: (data: any) => void;
  onScoreCalculated?: (score: number) => void;
}

export default function BankingConnection({ onDataReceived, onScoreCalculated }: BankingConnectionProps) {
  const [iban, setIban] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [bankingData, setBankingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyIBAN = async () => {
    if (!iban || iban.length < 15) {
      setError('Veuillez entrer un IBAN valide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await bankingApiService.verifyIBAN(iban);
      
      if (result.valid) {
        setVerified(true);
        setError(null);
      } else {
        setError('IBAN invalide');
        setVerified(false);
      }
    } catch (err: any) {
      setError('Erreur lors de la vérification de l\'IBAN');
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = async () => {
    // Dans une vraie application, cela redirigerait vers Tink ou ouvrirait un widget
    // Pour l'instant, on simule la connexion
    setLoading(true);
    setError(null);

    try {
      // Simuler la récupération de données bancaires
      // En production, cela nécessiterait un token d'accès Tink
      const mockData = {
        accounts: [
          { id: '1', name: 'Compte Courant', balance: 5000 },
          { id: '2', name: 'Livret A', balance: 15000 }
        ],
        balance: 20000,
        monthlyIncome: 3500,
        monthlyExpenses: 1500
      };

      setBankingData(mockData);
      onDataReceived?.(mockData);

      // Calculer le score si on a les données de prêt
      if (onScoreCalculated) {
        const score = await calculateScore(mockData);
        onScoreCalculated(score);
      }
    } catch (err: any) {
      setError('Erreur lors de la connexion bancaire');
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = async (data: any) => {
    try {
      const scoreResult = await bankingApiService.getCreditScore(
        data,
        { montant: 200000, duree: 240, revenus: data.monthlyIncome }
      );
      return scoreResult.score;
    } catch (err) {
      // Score par défaut basé sur les données
      let score = 50;
      if (data.monthlyIncome > 3000) score += 15;
      if (data.balance > 10000) score += 10;
      if (data.monthlyExpenses < data.monthlyIncome * 0.5) score += 15;
      return score;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 rounded-full p-3 mr-4">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Connexion bancaire</h3>
          <p className="text-sm text-gray-600">Connectez votre compte pour une analyse précise</p>
        </div>
      </div>

      {/* Vérification IBAN */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vérifier votre IBAN
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={iban}
            onChange={(e) => {
              setIban(e.target.value.toUpperCase());
              setVerified(false);
            }}
            placeholder="FR76 3000 6000 0112 3456 7890 189"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={34}
          />
          <button
            onClick={handleVerifyIBAN}
            disabled={loading || !iban}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-all"
          >
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Vérifier'}
          </button>
        </div>
        
        {verified && (
          <div className="mt-3 flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">IBAN vérifié avec succès</span>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Connexion bancaire */}
      <div className="border-t pt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-1">100% sécurisé</p>
              <p>Vos données sont cryptées et protégées. Connexion via Tink (Open Banking PSD2).</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleConnectBank}
          disabled={loading}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold transition-all flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Connexion en cours...
            </>
          ) : (
            <>
              <Building2 className="w-5 h-5 mr-2" />
              Se connecter à ma banque
            </>
          )}
        </button>

        {bankingData && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-900">Données bancaires récupérées</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Solde total</div>
                <div className="font-bold text-gray-900">{bankingData.balance.toLocaleString('fr-FR')} €</div>
              </div>
              <div>
                <div className="text-gray-600">Revenus mensuels</div>
                <div className="font-bold text-gray-900">{bankingData.monthlyIncome.toLocaleString('fr-FR')} €</div>
              </div>
              <div>
                <div className="text-gray-600">Dépenses mensuelles</div>
                <div className="font-bold text-gray-900">{bankingData.monthlyExpenses.toLocaleString('fr-FR')} €</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
