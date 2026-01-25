import { useState, useEffect } from 'react';
import { Lead, Secteur, Statut } from '../types';
import { X } from 'lucide-react';

interface LeadFormProps {
  lead?: Lead | null;
  onSave: (lead: Partial<Lead>) => void;
  onCancel: () => void;
}

export default function LeadForm({ lead, onSave, onCancel }: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    secteur: Secteur.IMMOBILIER,
    statut: Statut.NOUVEAU,
    source: '',
    entreprise: '',
    notes: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData(lead);
    }
  }, [lead]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderSectorFields = () => {
    switch (formData.secteur) {
      case Secteur.IMMOBILIER:
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget (€)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de bien
              </label>
              <select
                name="typeBien"
                value={formData.typeBien || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="terrain">Terrain</option>
                <option value="local_commercial">Local commercial</option>
              </select>
            </div>
          </>
        );
      case Secteur.BANQUE_PRET:
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de crédit
              </label>
              <select
                name="typeCredit"
                value={formData.typeCredit || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="immobilier">Crédit immobilier</option>
                <option value="consommation">Crédit consommation</option>
                <option value="professionnel">Crédit professionnel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Montant du crédit (€)
              </label>
              <input
                type="number"
                name="montantCredit"
                value={formData.montantCredit || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case Secteur.ASSURANCE:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type d'assurance
            </label>
            <select
              name="typeAssurance"
              value={formData.typeAssurance || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner</option>
              <option value="vie">Assurance vie</option>
              <option value="habitation">Assurance habitation</option>
              <option value="auto">Assurance auto</option>
              <option value="sante">Assurance santé</option>
            </select>
          </div>
        );
      case Secteur.MARCHE_FINANCIER:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Produit financier
            </label>
            <select
              name="produitFinancier"
              value={formData.produitFinancier || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner</option>
              <option value="actions">Actions</option>
              <option value="obligations">Obligations</option>
              <option value="fonds">Fonds d'investissement</option>
              <option value="crypto">Cryptomonnaies</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            {lead ? 'Modifier le lead' : 'Nouveau lead'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom *
              </label>
              <input
                type="text"
                name="nom"
                required
                value={formData.nom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                type="text"
                name="prenom"
                required
                value={formData.prenom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Secteur *
              </label>
              <select
                name="secteur"
                required
                value={formData.secteur}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={Secteur.IMMOBILIER}>Immobilier</option>
                <option value={Secteur.ASSURANCE}>Assurance</option>
                <option value={Secteur.BANQUE_PRET}>Banque - Prêts</option>
                <option value={Secteur.MARCHE_FINANCIER}>Marché financier</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut *
              </label>
              <select
                name="statut"
                required
                value={formData.statut}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={Statut.NOUVEAU}>Nouveau</option>
                <option value={Statut.CONTACTE}>Contacté</option>
                <option value={Statut.CONVERTI}>Converti</option>
                <option value={Statut.PERDU}>Perdu</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Source
              </label>
              <input
                type="text"
                name="source"
                value={formData.source || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Entreprise
              </label>
              <input
                type="text"
                name="entreprise"
                value={formData.entreprise || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {renderSectorFields()}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {lead ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
