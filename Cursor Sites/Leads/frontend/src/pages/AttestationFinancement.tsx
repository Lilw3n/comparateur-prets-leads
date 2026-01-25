import { useState } from 'react';
import { FileText, Download, Printer } from 'lucide-react';

export default function AttestationFinancement() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    codePostal: '',
    ville: '',
    montantPret: '',
    duree: '',
    taux: '',
    mensualite: '',
    banque: '',
    dateOffre: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const genererAttestation = () => {
    const date = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const contenu = `
ATTESTATION DE FINANCEMENT

Je soussigné(e), ${formData.nom.toUpperCase()} ${formData.prenom}, né(e) le ${formData.dateNaissance}, 
demeurant au ${formData.adresse}, ${formData.codePostal} ${formData.ville},

ATTESTE avoir obtenu une offre de prêt immobilier auprès de ${formData.banque} pour un montant de 
${formData.montantPret} € sur une durée de ${formData.duree} ans, à un taux de ${formData.taux}%, 
représentant une mensualité de ${formData.mensualite} €.

Cette offre a été émise le ${formData.dateOffre}.

Cette attestation est délivrée pour servir et valoir ce que de droit.

Fait à ${formData.ville}, le ${date}

Signature :

_________________________
${formData.prenom} ${formData.nom}
    `.trim();

    return contenu;
  };

  const handleDownload = () => {
    const contenu = genererAttestation();
    const blob = new Blob([contenu], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attestation-financement-${formData.nom}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const contenu = genererAttestation();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Attestation de Financement</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { text-align: center; margin-bottom: 30px; }
              .content { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>ATTESTATION DE FINANCEMENT</h1>
            <div class="content">${contenu.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Générateur d'attestation de financement
        </h1>
        <p className="text-gray-600 text-lg">
          Générez votre attestation de financement pour votre projet immobilier
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informations personnelles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  type="text"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Détails du financement</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant du prêt (€) *
                </label>
                <input
                  type="number"
                  name="montantPret"
                  value={formData.montantPret}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (années) *
                </label>
                <input
                  type="number"
                  name="duree"
                  value={formData.duree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="taux"
                  value={formData.taux}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensualité (€) *
                </label>
                <input
                  type="number"
                  name="mensualite"
                  value={formData.mensualite}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banque / Organisme *
                </label>
                <input
                  type="text"
                  name="banque"
                  value={formData.banque}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de l'offre *
                </label>
                <input
                  type="date"
                  name="dateOffre"
                  value={formData.dateOffre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Aperçu */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-gray-200 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Aperçu</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 min-h-[400px]">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">
                {formData.nom && formData.prenom ? genererAttestation() : 'Remplissez le formulaire pour voir l\'aperçu...'}
              </pre>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownload}
                disabled={!formData.nom || !formData.prenom || !formData.montantPret}
                className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                Télécharger
              </button>

              <button
                onClick={handlePrint}
                disabled={!formData.nom || !formData.prenom || !formData.montantPret}
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
