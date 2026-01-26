import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types/articles';
import { articlesService } from '../services/articlesApi';
import { FileText, Eye, Calendar, Loader } from 'lucide-react';

interface ArticlesRecommandesProps {
  categorie?: string;
  searchTerms?: string;
  limit?: number;
}

export default function ArticlesRecommandes({ 
  categorie, 
  searchTerms, 
  limit = 3 
}: ArticlesRecommandesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [categorie, searchTerms]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesService.getAll({
        limit,
        categorie,
        search: searchTerms,
        published: true,
      });
      setArticles(response.articles.slice(0, limit));
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Articles recommandés</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Découvrez nos guides et articles pour approfondir votre recherche
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.slug}`}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-2 mb-2">
              {article.source === 'AUTO_GENERATED' && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  Auto-généré
                </span>
              )}
              <span className="text-xs text-gray-500">
                {article.categorie.replace(/_/g, ' ')}
              </span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.titre}
            </h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {article.resume}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{article.vue}</span>
              </div>
              {article.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          to="/articles"
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
        >
          Voir tous les articles →
        </Link>
      </div>
    </div>
  );
}
