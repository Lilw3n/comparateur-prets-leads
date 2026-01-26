import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article, ArticlesResponse } from '../types/articles';
import { articlesService } from '../services/articlesApi';
import { Search, Filter, Eye, Heart, Calendar, Tag, Loader, FileText } from 'lucide-react';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    categorie: '',
    source: '',
    published: true,
  });

  useEffect(() => {
    loadArticles();
  }, [pagination.page, filters]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response: ArticlesResponse = await articlesService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setArticles(response.articles);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    loadArticles();
  };

  const parseTags = (tags: string): string[] => {
    try {
      return JSON.parse(tags);
    } catch {
      return [];
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8">
        <h1 className="text-4xl font-bold mb-2">Articles et Guides</h1>
        <p className="text-blue-100">
          Découvrez nos articles générés automatiquement pour vous aider dans vos projets
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filters.categorie}
              onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              <option value="CREDIT_IMMOBILIER">Crédit immobilier</option>
              <option value="CREDIT_CONSOMMATION">Crédit consommation</option>
              <option value="IMMOBILIER">Immobilier</option>
              <option value="ASSURANCE">Assurance</option>
              <option value="BANQUE_PRET">Banque - Prêts</option>
            </select>

            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les sources</option>
              <option value="AUTO_GENERATED">Généré automatiquement</option>
              <option value="USER_DATA">Données utilisateur</option>
              <option value="MANUAL">Manuel</option>
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Rechercher
            </button>
          </div>
        </form>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun article trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group"
              >
                {article.imageUrl && (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {article.source === 'AUTO_GENERATED' && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Auto-généré
                      </span>
                    )}
                  </div>
                )}
                {!article.imageUrl && (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white opacity-50" />
                    {article.source === 'AUTO_GENERATED' && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Auto-généré
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600 font-medium">
                      {article.categorie.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.titre}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.resume}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{article.vue}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                    {article.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    )}
                  </div>

                  {parseTags(article.tags).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {parseTags(article.tags).slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {pagination.page} sur {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
