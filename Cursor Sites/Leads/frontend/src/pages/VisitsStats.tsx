import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Calendar, Globe, Monitor, Smartphone, Tablet } from 'lucide-react';
import { visitsApi, VisitStats, DailyStat } from '../services/visitsApi';

export default function VisitsStats() {
  const [period, setPeriod] = useState<'all' | 'day' | 'week' | 'month' | 'year'>('all');
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadStats();
  }, [period]);

  useEffect(() => {
    loadDailyStats();
  }, [days]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await visitsApi.getStats(period);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDailyStats = async () => {
    try {
      const data = await visitsApi.getDailyStats(days);
      setDailyStats(data);
    } catch (error) {
      console.error('Error loading daily stats:', error);
    }
  };

  const getPeriodLabel = () => {
    const labels = {
      all: 'Toutes périodes',
      day: 'Aujourd\'hui',
      week: '7 derniers jours',
      month: 'Ce mois',
      year: 'Cette année'
    };
    return labels[period];
  };

  const maxDailyCount = dailyStats.length > 0 
    ? Math.max(...dailyStats.map(d => d.total))
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Statistiques de Visites</h1>
        <p className="text-gray-600">Analysez les performances de votre site</p>
      </div>

      {/* Filtres de période */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['all', 'day', 'week', 'month', 'year'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {p === 'all' ? 'Toutes périodes' : 
             p === 'day' ? 'Aujourd\'hui' :
             p === 'week' ? '7 jours' :
             p === 'month' ? 'Mois' : 'Année'}
          </button>
        ))}
      </div>

      {/* Cartes de statistiques principales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Visites</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVisits.toLocaleString()}</p>
              </div>
              <Eye className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Visiteurs Uniques</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniqueVisits.toLocaleString()}</p>
              </div>
              <Users className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pages Visitées</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.topPages.length}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Taux de Rebond</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalVisits > 0 
                    ? ((1 - stats.uniqueVisits / stats.totalVisits) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Graphique des visites par jour */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Visites par Jour</h2>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value={7}>7 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
            <option value={365}>1 an</option>
          </select>
        </div>
        
        {dailyStats.length > 0 ? (
          <div className="space-y-4">
            {dailyStats.map((day) => {
              const barWidth = maxDailyCount > 0 ? (day.total / maxDailyCount) * 100 : 0;
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-700 flex-shrink-0">
                    {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${barWidth}%` }}
                        >
                          {barWidth > 10 && (
                            <span className="text-white text-xs font-semibold">{day.total}</span>
                          )}
                        </div>
                      </div>
                      {barWidth <= 10 && (
                        <span className="text-gray-700 text-sm font-semibold w-12 text-right">{day.total}</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {day.unique} unique{day.unique > 1 ? 's' : ''} • {day.pages.length} page{day.pages.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
        )}
      </div>

      {/* Pages les plus visitées */}
      {stats && stats.topPages.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pages les Plus Visitées</h2>
          <div className="space-y-3">
            {stats.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{page.page}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{page.count.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">visite{page.count > 1 ? 's' : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques par appareil */}
      {stats && stats.deviceStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Monitor className="w-6 h-6 text-blue-600" />
              Appareils
            </h2>
            <div className="space-y-3">
              {stats.deviceStats.map((device) => {
                const percentage = stats.totalVisits > 0 
                  ? (device.count / stats.totalVisits) * 100 
                  : 0;
                const Icon = device.device === 'mobile' ? Smartphone :
                            device.device === 'tablet' ? Tablet : Monitor;
                return (
                  <div key={device.device} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">{device.device}</span>
                        <span className="text-sm font-semibold text-gray-900">{device.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6 text-green-600" />
              Navigateurs
            </h2>
            <div className="space-y-3">
              {stats.browserStats.map((browser) => {
                const percentage = stats.totalVisits > 0 
                  ? (browser.count / stats.totalVisits) * 100 
                  : 0;
                return (
                  <div key={browser.browser} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{browser.browser}</span>
                        <span className="text-sm font-semibold text-gray-900">{browser.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
