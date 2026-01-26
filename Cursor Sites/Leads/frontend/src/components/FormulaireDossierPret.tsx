import { useState } from 'react';
import { CheckCircle, User, Home, FileText, Calendar, Mail, Phone, Building2, Users, X } from 'lucide-react';

interface FormulaireDossierPretProps {
  onSave?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export default function FormulaireDossierPret({ onSave, onCancel, initialData }: FormulaireDossierPretProps) {
  const [hasCoEmprunteur, setHasCoEmprunteur] = useState(false);
  const [delegationActive, setDelegationActive] = useState(false);
  
  const [formData, setFormData] = useState({
    // Gestion déléguée
    delegation: false,
    
    // Responsable du dossier
    responsableNom: '',
    responsableEmail: '',
    responsableTel: '',
    
    // Emprunteur
    emprunteurCivilite: 'M.',
    emprunteurNom: '',
    emprunteurPrenom: '',
    emprunteurDateNaissance: '',
    emprunteurLieuNaissance: '',
    emprunteurTel: '',
    emprunteurEmail: '',
    emprunteurProfession: '',
    emprunteurSituationPro: '',
    emprunteurAnciennete: '',
    emprunteurSituationFamille: '',
    emprunteurNombreEnfants: '',
    
    // Co-emprunteur
    coEmprunteurCivilite: 'M.',
    coEmprunteurNom: '',
    coEmprunteurPrenom: '',
    coEmprunteurDateNaissance: '',
    coEmprunteurLieuNaissance: '',
    coEmprunteurTel: '',
    coEmprunteurEmail: '',
    coEmprunteurProfession: '',
    coEmprunteurAnciennete: '',
    coEmprunteurCodePostal: '',
    coEmprunteurVille: '',
    coEmprunteurLogement: '',
    coEmprunteurDepuis: '',
    
    // Logement
    logementAdresse: '',
    
    // Informations complémentaires
    informationsComplementaires: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Transmission de coordonnées</h1>
        <p className="text-blue-100">Formulaire de dossier de prêt</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gestion déléguée du client */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-blue-600" />
            Gestion déléguée du client
          </h2>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-3">
              En tant qu'indicateur d'affaires conforme CMF, vous pouvez déléguer la gestion complète du dossier à notre équipe.
            </p>
            <div className="space-y-2 mb-4">
              <p className="font-semibold text-gray-900">Nous nous engageons à :</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li>Contacter votre client dans les 4 heures</li>
                <li>Gérer votre client comme notre propre client</li>
                <li>Vous tenir informé de l'avancement du dossier</li>
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Rémunération :</strong> La rémunération sur un dossier d'indicateur d'affaires est de 30% des honoraires client.
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={delegationActive}
                onChange={(e) => {
                  setDelegationActive(e.target.checked);
                  setFormData(prev => ({ ...prev, delegation: e.target.checked }));
                }}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-900 font-medium">
                Je délègue la gestion du dossier
              </span>
            </label>
          </div>
        </div>

        {/* Informations générales */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rubrique</label>
              <select
                name="rubrique"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="credit_immobilier">Crédit immobilier</option>
                <option value="credit_consommation">Crédit consommation</option>
                <option value="credit_professionnel">Crédit professionnel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apporteur</label>
              <input
                type="text"
                name="apporteur"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100 POUR 100 FINANCES"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
              <input
                type="text"
                name="utilisateur"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Responsable du dossier */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Responsable du dossier
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="responsableNom"
                value={formData.responsableNom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                name="responsableEmail"
                value={formData.responsableEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tél</label>
              <input
                type="tel"
                name="responsableTel"
                value={formData.responsableTel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Emprunteur */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Emprunteur
            </h2>
          </div>

          {/* Informations personnelles */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="emprunteurCivilite"
                    value="M."
                    checked={formData.emprunteurCivilite === 'M.'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">M.</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="emprunteurCivilite"
                    value="Mme"
                    checked={formData.emprunteurCivilite === 'Mme'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Mme</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="emprunteurNom"
                  value={formData.emprunteurNom}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="emprunteurPrenom"
                  value={formData.emprunteurPrenom}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de naissance <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="emprunteurDateNaissance"
                    value={formData.emprunteurDateNaissance}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                <input
                  type="text"
                  name="emprunteurLieuNaissance"
                  value={formData.emprunteurLieuNaissance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tél. portable <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="emprunteurTel"
                  value={formData.emprunteurTel}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="emprunteurEmail"
                  value={formData.emprunteurEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations professionnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                <input
                  type="text"
                  name="emprunteurProfession"
                  value={formData.emprunteurProfession}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Situation pro</label>
                <select
                  name="emprunteurSituationPro"
                  value={formData.emprunteurSituationPro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="cdi">CDI</option>
                  <option value="cdd">CDD</option>
                  <option value="fonctionnaire">Fonctionnaire</option>
                  <option value="liberal">Profession libérale</option>
                  <option value="retraite">Retraité</option>
                  <option value="chomage">Chômage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ancienneté</label>
                <input
                  type="text"
                  name="emprunteurAnciennete"
                  value={formData.emprunteurAnciennete}
                  onChange={handleChange}
                  placeholder="Ex: 5 ans"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Informations familiales */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations familiales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Situation de famille</label>
                <select
                  name="emprunteurSituationFamille"
                  value={formData.emprunteurSituationFamille}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner</option>
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="pacs">PACS</option>
                  <option value="concubinage">Concubinage</option>
                  <option value="divorce">Divorcé(e)</option>
                  <option value="veuf">Veuf(ve)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants</label>
                <input
                  type="number"
                  name="emprunteurNombreEnfants"
                  value={formData.emprunteurNombreEnfants}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Co-emprunteur */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Co-emprunteur
            </h2>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={hasCoEmprunteur}
                onChange={(e) => setHasCoEmprunteur(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Activer le co-emprunteur</span>
            </label>
          </div>

          {hasCoEmprunteur && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="coEmprunteurCivilite"
                      value="M."
                      checked={formData.coEmprunteurCivilite === 'M.'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">M.</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="coEmprunteurCivilite"
                      value="Mme"
                      checked={formData.coEmprunteurCivilite === 'Mme'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Mme</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="coEmprunteurNom"
                    value={formData.coEmprunteurNom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="coEmprunteurPrenom"
                    value={formData.coEmprunteurPrenom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="coEmprunteurDateNaissance"
                      value={formData.coEmprunteurDateNaissance}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    name="coEmprunteurLieuNaissance"
                    value={formData.coEmprunteurLieuNaissance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tél</label>
                  <input
                    type="tel"
                    name="coEmprunteurTel"
                    value={formData.coEmprunteurTel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    name="coEmprunteurEmail"
                    value={formData.coEmprunteurEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <input
                    type="text"
                    name="coEmprunteurProfession"
                    value={formData.coEmprunteurProfession}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ancienneté</label>
                  <input
                    type="text"
                    name="coEmprunteurAnciennete"
                    value={formData.coEmprunteurAnciennete}
                    onChange={handleChange}
                    placeholder="Ex: 3 ans"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    name="coEmprunteurCodePostal"
                    value={formData.coEmprunteurCodePostal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    name="coEmprunteurVille"
                    value={formData.coEmprunteurVille}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logement</label>
                  <select
                    name="coEmprunteurLogement"
                    value={formData.coEmprunteurLogement}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="proprietaire">Propriétaire</option>
                    <option value="locataire">Locataire</option>
                    <option value="heberge">Hébergé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depuis</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="coEmprunteurDepuis"
                      value={formData.coEmprunteurDepuis}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logement */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              <Home className="w-5 h-5 mr-2 text-blue-600" />
              Logement
            </h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              name="logementAdresse"
              value={formData.logementAdresse}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Adresse complète du logement"
            />
          </div>
        </div>

        {/* Informations complémentaires */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Informations complémentaires
            </h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes et commentaires</label>
            <textarea
              name="informationsComplementaires"
              value={formData.informationsComplementaires}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Toute information complémentaire utile pour le traitement du dossier..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pb-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors shadow-lg"
          >
            Enregistrer le dossier
          </button>
        </div>
      </form>
    </div>
  );
}
