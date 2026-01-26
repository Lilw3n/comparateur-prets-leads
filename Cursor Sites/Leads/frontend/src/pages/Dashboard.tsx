import { useEffect, useState } from 'react';
import { StatsResponse } from '../types';
import { leadsApi } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, TrendingUp, CheckCircle, Target, Clock, ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await leadsApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">Erreur lors du chargement des statistiques</div>
      </div>
    );
  }

  const secteurData = Object.entries(stats.bySecteur).map(([secteur, count]) => ({
    secteur: secteur.replace('_', ' '),
    count,
  }));

  const statutData = Object.entries(stats.byStatut).map(([statut, count]) => ({
    statut: statut,
    count,
  }));

  // Données simulées pour évolution temporelle
  const evolutionData = [
    { mois: 'Oct', leads: 45, conversions: 12 },
    { mois: 'Nov', leads: 52, conversions: 15 },
    { mois: 'Déc', leads: 48, conversions: 14 },
    { mois: 'Jan', leads: stats.total, conversions: stats.byStatut.CONVERTI || 0 },
  ];

  const kpiCards = [
    {
      title: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Taux de conversion',
      value: `${stats.tauxConversion.toFixed(1)}%`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+2.3%',
      trendUp: true
    },
    {
      title: 'Convertis',
      value: stats.byStatut.CONVERTI || 0,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '+8',
      trendUp: true
    },
    {
      title: 'En attente',
      value: stats.byStatut.NOUVEAU || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      trend: '-5',
      trendUp: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de votre activité</p>
        </div>
      </div>

      {/* KPI Cards améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`${kpi.bgColor} rounded-lg p-3`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-sm font-semibold ${
                  kpi.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpi.trendUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                <div className="text-sm text-gray-600">{kpi.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques améliorés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution temporelle */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Évolution des leads
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={evolutionData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mois" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorLeads)" 
                name="Leads"
              />
              <Area 
                type="monotone" 
                dataKey="conversions" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorConversions)" 
                name="Conversions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par secteur */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Répartition par secteur
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={secteurData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="secteur" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {secteurData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Répartition par statut
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statutData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ statut, percent }) => `${statut}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {statutData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tableau des leads récents amélioré */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Leads récents
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Secteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{lead.prenom} {lead.nom}</div>
                      {lead.email && (
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {lead.secteur.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        lead.statut === 'CONVERTI' ? 'bg-green-100 text-green-800' :
                        lead.statut === 'CONTACTE' ? 'bg-blue-100 text-blue-800' :
                        lead.statut === 'PERDU' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lead.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
