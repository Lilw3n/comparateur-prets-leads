import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Eye, Edit, Trash2, Search, Filter, Download, Send } from 'lucide-react';
import { dossiersService, DossierPret } from '../services/dossiersApi';

export default function ListeDossiers() {
  const [dossiers, setDossiers] = useState<DossierPret[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('');

  useEffect(() => {
    loadDossiers();
  }, [statutFilter]);

  const loadDossiers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statutFilter) params.statut = statutFilter;
      const data = await dossiersService.getAll(params);
      setDossiers(data);
    } catch (error) {
      console.error('Error loading dossiers:', error);
      alert('Erreur lors du chargement des dossiers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      return;
    }
    try {
      await dossiersService.delete(id);
      loadDossiers();
    } catch (error) {
      console.error('Error deleting dossier:', error);
      alert('Erreur lors de la suppression du dossier');
    }
  };

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      BROUILLON: 'bg-gray-100 text-gray-800',
      EN_COURS: 'bg-blue-100 text-blue-800',
      VALIDE: 'bg-green-100 text-green-800',
      REFUSE: 'bg-red-100 text-red-800',
      ACCEPTE: 'bg-purple-100 text-purple-800',
    };
    return colors[statut] || 'bg-gray-100 text-gray-800';
  };

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      BROUILLON: 'Brouillon',
      EN_COURS: 'En cours',
      VALIDE: 'Validé',
      REFUSE: 'Refusé',
      ACCEPTE: 'Accepté',
    };
    return labels[statut] || statut;
  };

  const filteredDossiers = dossiers.filter((dossier) => {
    const matchesSearch =
      !searchTerm ||
      dossier.identifiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.emprunteurNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.emprunteurPrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dossier.emprunteurEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const generateShareLink = (dossierId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/formulaire-dossier/${dossierId}`;
  };

  const copyShareLink = (dossierId: string) => {
    const link = generateShareLink(dossierId);
    navigator.clipboard.writeText(link);
    alert(`Lien copié ! Vous pouvez l'envoyer à votre client.\n\n${link}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des dossiers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossiers de Prêt</h1>
            <p className="text-gray-600 mt-1">Gérez tous vos dossiers de prêt</p>
          </div>
          <Link
            to="/formulaire-dossier"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau dossier
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Search className="w-4 h-4 inline mr-1" />
              Recherche
            </label>
            <input
              type="text"
              placeholder="Identifiant, nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Filter className="w-4 h-4 inline mr-1" />
              Statut
            </label>
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous</option>
              <option value="BROUILLON">Brouillon</option>
              <option value="EN_COURS">En cours</option>
              <option value="VALIDE">Validé</option>
              <option value="REFUSE">Refusé</option>
              <option value="ACCEPTE">Accepté</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dossiers List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        {filteredDossiers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Aucun dossier trouvé</p>
            <Link
              to="/formulaire-dossier"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Créer votre premier dossier
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identifiant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emprunteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type de prêt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
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
                {filteredDossiers.map((dossier) => (
                  <tr key={dossier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dossier.identifiant}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {dossier.emprunteurPrenom} {dossier.emprunteurNom}
                      </div>
                      <div className="text-sm text-gray-500">{dossier.emprunteurEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dossier.typePret}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(dossier.montantSouhaite)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{dossier.dureeSouhaitee} ans</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatutColor(
                          dossier.statut
                        )}`}
                      >
                        {getStatutLabel(dossier.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(dossier.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyShareLink(dossier.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Copier le lien de partage"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <Link
                          to={`/formulaire-dossier/${dossier.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir/Modifier"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(dossier.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
