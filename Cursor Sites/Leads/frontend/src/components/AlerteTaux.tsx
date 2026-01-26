import { useState } from 'react';
import { Bell, Mail, CheckCircle } from 'lucide-react';

interface AlerteTauxProps {
  typeCredit?: string;
}

export default function AlerteTaux({ typeCredit = 'immobilier' }: AlerteTauxProps) {
  const [email, setEmail] = useState('');
  const [tauxSouhaite, setTauxSouhaite] = useState<number>(3.0);
  const [duree, setDuree] = useState<number>(20);
  const [inscrit, setInscrit] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'inscription (dans une vraie app, cela appellerait l'API)
    setTimeout(() => {
      setInscrit(true);
      setLoading(false);
      // Sauvegarder dans localStorage
      const alertes = JSON.parse(localStorage.getItem('alertesTaux') || '[]');
      alertes.push({
        email,
        typeCredit,
        tauxSouhaite,
        duree,
        date: new Date().toISOString()
      });
      localStorage.setItem('alertesTaux', JSON.stringify(alertes));
    }, 1000);
  };

  if (inscrit) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
        <div className="flex items-start">
          <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-2">Alerte créée avec succès !</h3>
            <p className="text-sm text-green-800 mb-4">
              Vous recevrez un email dès qu'une offre correspondant à vos critères sera disponible.
            </p>
            <button
              onClick={() => {
                setInscrit(false);
                setEmail('');
              }}
              className="text-sm text-green-700 hover:text-green-900 font-semibold"
            >
              Créer une autre alerte
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border-2 border-blue-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <Bell className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Alerte taux</h3>
            <p className="text-sm text-gray-600">Soyez informé quand le taux souhaité est disponible</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleInscription} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Votre email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux souhaité (%)
            </label>
            <input
              type="number"
              value={tauxSouhaite}
              onChange={(e) => setTauxSouhaite(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="0.1"
              min="0"
              max="10"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée (ans)
            </label>
            <input
              type="number"
              value={duree}
              onChange={(e) => setDuree(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="5"
              max="30"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {loading ? (
            'Création en cours...'
          ) : (
            <>
              <Bell className="w-5 h-5 mr-2" />
              Créer l'alerte
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Vous pourrez vous désabonner à tout moment depuis le lien présent dans chaque email.
        </p>
      </form>
    </div>
  );
}
