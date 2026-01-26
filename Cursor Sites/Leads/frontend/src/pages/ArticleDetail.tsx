import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Article } from '../types/articles';
import { articlesService } from '../services/articlesApi';
import { Eye, Heart, Calendar, Tag, ArrowLeft, Share2, Loader, FileText } from 'lucide-react';
import LeadCaptureForm from '../components/LeadCaptureForm';
import LeadCaptureService from '../services/leadCapture';
import { Secteur } from '../types';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCaptureForm, setShowCaptureForm] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  const loadArticle = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      const [articleData, related] = await Promise.all([
        articlesService.getBySlug(slug),
        articlesService.getRelated(slug),
      ]);
      setArticle(articleData);
      setRelatedArticles(related);
      
      // Increment views
      await articlesService.incrementViews(slug);
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!slug || liked) return;
    
    try {
      await articlesService.likeArticle(slug);
      setLiked(true);
      if (article) {
        setArticle({ ...article, likes: article.likes + 1 });
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleCaptureLead = async (data: {
    nom?: string;
    prenom?: string;
    email: string;
    telephone?: string;
  }) => {
    await LeadCaptureService.captureFromArticle(data.email, {
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      secteur: Secteur.IMMOBILIER,
      articleTitle: article?.titre || '',
      articleCategory: article?.categorie || '',
      source: `Article: ${article?.titre}`,
    });
    setShowCaptureForm(false);
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

  // Convert markdown-like content to HTML (simple version)
  const renderContent = (content: string) => {
    // Simple markdown to HTML conversion
    let html = content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br />');

    return { __html: `<p class="mb-4">${html}</p>` };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Article non trouvé</h2>
        <p className="text-gray-500 mb-4">L'article que vous recherchez n'existe pas.</p>
        <Link
          to="/articles"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retour aux articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </button>

      {/* Article Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {article.imageUrl && (
          <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 relative">
            <img
              src={article.imageUrl}
              alt={article.titre}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {!article.imageUrl && (
          <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="w-24 h-24 text-white opacity-50" />
          </div>
        )}

        <div className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {article.categorie.replace(/_/g, ' ')}
            </span>
            {article.source === 'AUTO_GENERATED' && (
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                Généré automatiquement
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.titre}</h1>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{article.vue} vues</span>
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span>{article.likes}</span>
            </button>
          </div>

          {parseTags(article.tags).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {parseTags(article.tags).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-xl text-gray-700 leading-relaxed">{article.resume}</p>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-xl shadow-md p-8">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={renderContent(article.contenu)}
        />
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Besoin d'aide pour votre projet ?</h2>
        <p className="text-blue-100 mb-6">
          Recevez des conseils personnalisés et les meilleures offres par email
        </p>
        <button
          onClick={() => setShowCaptureForm(true)}
          className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition-colors"
        >
          Recevoir des conseils personnalisés
        </button>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                to={`/articles/${related.slug}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{related.titre}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{related.resume}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>{related.vue} vues</span>
                  <span>{related.likes} likes</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lead Capture Form Modal */}
      {showCaptureForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCaptureForm(false)}
          style={{ zIndex: 9999 }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <LeadCaptureForm
              onCapture={handleCaptureLead}
              onClose={() => setShowCaptureForm(false)}
              title="Recevez des conseils personnalisés"
              description="Laissez-nous vos coordonnées pour recevoir des conseils adaptés à votre projet et les meilleures offres par email."
              showCloseButton={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
