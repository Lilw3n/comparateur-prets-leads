import { useEffect, useState } from 'react';
import { Lead } from '../types';
import { leadsApi } from '../services/api';
import LeadList from '../components/LeadList';
import LeadForm from '../components/LeadForm';
import { Plus } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadsApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      setLeads(response.leads);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading leads:', error);
      alert('Erreur lors du chargement des leads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleSave = async (leadData: Partial<Lead>) => {
    try {
      if (editingLead) {
        await leadsApi.update(editingLead.id, leadData);
      } else {
        await leadsApi.create(leadData);
      }
      setShowForm(false);
      setEditingLead(null);
      loadLeads();
    } catch (error) {
      console.error('Error saving lead:', error);
      alert('Erreur lors de la sauvegarde du lead');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await leadsApi.delete(id);
      loadLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Erreur lors de la suppression du lead');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Leads</h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau Lead
        </button>
      </div>

      <LeadList
        leads={leads}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={loadLeads}
      />

      {showForm && (
        <LeadForm
          lead={editingLead}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
