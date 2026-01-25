import { useState } from 'react';
import DossierSuivi from '../components/DossierSuivi';
import CreditScoreCard from '../components/CreditScoreCard';
import { FileText, Download, Mail, Phone } from 'lucide-react';

export default function MonDossier() {
  const [dossierId] = useState('PRT-2026-001234'); // En production, récupérer depuis l'API
  const [creditScore] = useState(78); // En production, récupérer depuis l'API

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Mon dossier de prêt</h1>
        <p className="text-blue-100 text-lg">
          Suivez l'avancement de votre demande de prêt en temps réel
        </p>
      </div>

      {/* Score de crédit */}
      <CreditScoreCard
        score={creditScore}
        interpretation="Excellent profil, très bonnes chances d'obtenir un crédit aux meilleures conditions."
        showDetails={true}
      />

      {/* Suivi du dossier */}
      <DossierSuivi dossierId={dossierId} />

      {/* Documents et actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Documents du dossier
          </h3>
          
          <div className="space-y-3">
            {[
              { name: 'Pièce d\'identité', status: 'validé', date: '2026-01-20' },
              { name: 'Justificatif de revenus', status: 'validé', date: '2026-01-20' },
              { name: 'Avis d\'imposition', status: 'en_attente', date: null },
              { name: 'Justificatif de domicile', status: 'en_attente', date: null }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">{doc.name}</div>
                    {doc.date && (
                      <div className="text-xs text-gray-500">
                        Reçu le {new Date(doc.date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  doc.status === 'validé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status === 'validé' ? 'Validé' : 'En attente'}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all flex items-center justify-center">
            <Download className="w-4 h-4 mr-2" />
            Télécharger tous les documents
          </button>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Phone className="w-6 h-6 mr-2 text-blue-600" />
            Votre conseiller
          </h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                MC
              </div>
              <div>
                <div className="font-bold text-gray-900">Marie Dupont</div>
                <div className="text-sm text-gray-600">Conseillère en crédit immobilier</div>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p className="mb-1">📧 marie.dupont@comparateurprets.fr</p>
              <p>📞 01 23 45 67 89</p>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-all flex items-center justify-center">
              <Phone className="w-4 h-4 mr-2" />
              Appeler maintenant
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-all flex items-center justify-center">
              <Mail className="w-4 h-4 mr-2" />
              Envoyer un message
            </button>
          </div>
        </div>
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-3">💡 Informations importantes</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Votre dossier est traité dans les meilleurs délais par notre équipe</li>
          <li>• Vous recevrez une notification à chaque étape importante</li>
          <li>• N'hésitez pas à contacter votre conseiller pour toute question</li>
          <li>• Les documents manquants peuvent ralentir le traitement de votre dossier</li>
        </ul>
      </div>
    </div>
  );
}
