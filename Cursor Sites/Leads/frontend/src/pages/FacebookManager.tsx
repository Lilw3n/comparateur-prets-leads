import { useState, useEffect } from 'react';
import { Facebook, Plus, Send, BarChart3, Users, Calendar, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { facebookApi, FacebookPage, FacebookPost, FacebookLead } from '../services/facebookApi';
import { articlesApi } from '../services/api';

export default function FacebookManager() {
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [leads, setLeads] = useState<FacebookLead[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  
  // Formulaire de connexion
  const [connectForm, setConnectForm] = useState({
    pageId: '',
    pageName: '',
    accessToken: '',
    category: ''
  });

  // Formulaire de publication
  const [postForm, setPostForm] = useState({
    pageId: '',
    message: '',
    link: '',
    imageUrl: '',
    articleId: '',
    scheduledAt: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, leadsData, articlesData] = await Promise.all([
        facebookApi.getPosts(),
        facebookApi.getLeads({ imported: false }),
        articlesApi.getAll()
      ]);
      setPosts(postsData.posts || []);
      setLeads(leadsData.leads || []);
      setArticles(articlesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await facebookApi.connectPage(connectForm);
      setShowConnectModal(false);
      setConnectForm({ pageId: '', pageName: '', accessToken: '', category: '' });
      alert('Page Facebook connectée avec succès !');
      loadData();
    } catch (error: any) {
      alert('Erreur lors de la connexion: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await facebookApi.publishPost({
        ...postForm,
        scheduledAt: postForm.scheduledAt || undefined
      });
      setShowPostModal(false);
      setPostForm({ pageId: '', message: '', link: '', imageUrl: '', articleId: '', scheduledAt: '' });
      alert('Post publié avec succès !');
      loadData();
    } catch (error: any) {
      alert('Erreur lors de la publication: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleImportLead = async (leadId: string) => {
    try {
      await facebookApi.importLead(leadId);
      alert('Lead importé avec succès !');
      loadData();
    } catch (error: any) {
      alert('Erreur lors de l\'import: ' + (error.response?.data?.error || error.message));
    }
  };

  const selectArticle = (article: any) => {
    setPostForm({
      ...postForm,
      articleId: article.id,
      link: `${window.location.origin}/articles/${article.slug}`,
      message: `${article.titre}\n\n${article.resume || ''}`
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Facebook className="w-8 h-8 text-blue-600" />
            Gestion Facebook
          </h1>
          <p className="text-gray-600">Publiez des articles et gérez vos leads Facebook</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Connecter une Page
          </button>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Nouveau Post
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Posts Publiés</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{posts.filter(p => p.published).length}</p>
            </div>
            <Send className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Interactions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {posts.reduce((sum, p) => sum + p.likes + p.comments + p.shares, 0).toLocaleString()}
              </p>
            </div>
            <BarChart3 className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Leads Facebook</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{leads.length}</p>
            </div>
            <Users className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Portée Totale</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {posts.reduce((sum, p) => sum + p.reach, 0).toLocaleString()}
              </p>
            </div>
            <Facebook className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts Publiés</h2>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun post publié</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold mb-2">{post.message.substring(0, 100)}...</p>
                    {post.link && (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        {post.link}
                      </a>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span>👍 {post.likes}</span>
                      <span>💬 {post.comments}</span>
                      <span>🔗 {post.shares}</span>
                      <span>👁️ {post.reach}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Publié' : 'Programmé'}
                    </span>
                    {post.publishedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Leads Facebook */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Leads Facebook</h2>
        <div className="space-y-3">
          {leads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun lead Facebook</p>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {lead.prenom} {lead.nom}
                  </p>
                  <p className="text-sm text-gray-600">{lead.email}</p>
                  {lead.telephone && <p className="text-sm text-gray-600">{lead.telephone}</p>}
                  {lead.formName && <p className="text-xs text-gray-500 mt-1">Formulaire: {lead.formName}</p>}
                </div>
                <button
                  onClick={() => handleImportLead(lead.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Importer
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de connexion */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connecter une Page Facebook</h2>
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID de la Page</label>
                <input
                  type="text"
                  value={connectForm.pageId}
                  onChange={(e) => setConnectForm({ ...connectForm, pageId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la Page</label>
                <input
                  type="text"
                  value={connectForm.pageName}
                  onChange={(e) => setConnectForm({ ...connectForm, pageName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Token d'Accès</label>
                <input
                  type="text"
                  value={connectForm.accessToken}
                  onChange={(e) => setConnectForm({ ...connectForm, accessToken: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtenez votre token depuis le Graph API Explorer de Facebook
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie (optionnel)</label>
                <input
                  type="text"
                  value={connectForm.category}
                  onChange={(e) => setConnectForm({ ...connectForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Connecter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de publication */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Publier un Post</h2>
            
            {/* Sélection d'article */}
            {articles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Articles disponibles</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {articles.map((article) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => selectArticle(article)}
                      className="text-left p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50"
                    >
                      <p className="font-semibold text-sm">{article.titre}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID de la Page</label>
                <input
                  type="text"
                  value={postForm.pageId}
                  onChange={(e) => setPostForm({ ...postForm, pageId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={postForm.message}
                  onChange={(e) => setPostForm({ ...postForm, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien (optionnel)</label>
                <input
                  type="url"
                  value={postForm.link}
                  onChange={(e) => setPostForm({ ...postForm, link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optionnel)</label>
                <input
                  type="url"
                  value={postForm.imageUrl}
                  onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de publication programmée (optionnel)</label>
                <input
                  type="datetime-local"
                  value={postForm.scheduledAt}
                  onChange={(e) => setPostForm({ ...postForm, scheduledAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
