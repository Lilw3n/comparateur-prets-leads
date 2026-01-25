import { useState } from 'react';
import { Lead, Secteur, Statut } from '../types';
import { Edit, Trash2, Download, Search, Filter } from 'lucide-react';
import { leadsApi } from '../services/api';

interface LeadListProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function LeadList({ leads, onEdit, onDelete, onRefresh }: LeadListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [secteurFilter, setSecteurFilter] = useState<string>('');
  const [statutFilter, setStatutFilter] = useState<string>('');

  const handleExport = async () => {
    try {
      const blob = await leadsApi.export({
        secteur: secteurFilter || undefined,
        statut: statutFilter || undefined,
        format: 'csv',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting leads:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const getSecteurLabel = (secteur: Secteur) => {
    const labels: Record<Secteur, string> = {
      [Secteur.IMMOBILIER]: 'Immobilier',
      [Secteur.ASSURANCE]: 'Assurance',
      [Secteur.BANQUE_PRET]: 'Banque - Prêts',
      [Secteur.MARCHE_FINANCIER]: 'Marché financier',
    };
    return labels[secteur];
  };

  const getStatutColor = (statut: Statut) => {
    const colors: Record<Statut, string> = {
      [Statut.NOUVEAU]: 'bg-blue-100 text-blue-800',
      [Statut.CONTACTE]: 'bg-yellow-100 text-yellow-800',
      [Statut.CONVERTI]: 'bg-green-100 text-green-800',
      [Statut.PERDU]: 'bg-red-100 text-red-800',
    };
    return colors[statut];
  };

  const getStatutLabel = (statut: Statut) => {
    const labels: Record<Statut, string> = {
      [Statut.NOUVEAU]: 'Nouveau',
      [Statut.CONTACTE]: 'Contacté',
      [Statut.CONVERTI]: 'Converti',
      [Statut.PERDU]: 'Perdu',
    };
    return labels[statut];
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="w-4 h-4 inline mr-1" />
              Recherche
            </label>
            <input
              type="text"
              placeholder="Nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Secteur
            </label>
            <select
              value={secteurFilter}
              onChange={(e) => setSecteurFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value={Secteur.IMMOBILIER}>Immobilier</option>
              <option value={Secteur.ASSURANCE}>Assurance</option>
              <option value={Secteur.BANQUE_PRET}>Banque - Prêts</option>
              <option value={Secteur.MARCHE_FINANCIER}>Marché financier</option>
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value={Statut.NOUVEAU}>Nouveau</option>
              <option value={Statut.CONTACTE}>Contacté</option>
              <option value={Statut.CONVERTI}>Converti</option>
              <option value={Statut.PERDU}>Perdu</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Secteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads
                .filter((lead) => {
                  const matchesSearch =
                    !searchTerm ||
                    lead.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.telephone?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesSecteur = !secteurFilter || lead.secteur === secteurFilter;
                  const matchesStatut = !statutFilter || lead.statut === statutFilter;
                  return matchesSearch && matchesSecteur && matchesStatut;
                })
                .map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.prenom} {lead.nom}
                      </div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                      {lead.telephone && (
                        <div className="text-sm text-gray-500">{lead.telephone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getSecteurLabel(lead.secteur)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(
                          lead.statut
                        )}`}
                      >
                        {getStatutLabel(lead.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.source || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onEdit(lead)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) {
                            onDelete(lead.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun lead trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
