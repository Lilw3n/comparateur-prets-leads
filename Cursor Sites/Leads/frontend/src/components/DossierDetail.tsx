import { useState } from 'react';
import { Send, FileText, User, BarChart, MessageSquare, CheckCircle, Plus, Calendar, UserCircle, Building2, Users, Mail, Phone } from 'lucide-react';

interface DossierDetailProps {
  dossierId: string;
  dossier?: any;
}

export default function DossierDetail({ dossierId, dossier }: DossierDetailProps) {
  const [activeTab, setActiveTab] = useState('commentaires');
  const [showNewComment, setShowNewComment] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Données simulées du dossier
  const dossierData = dossier || {
    typeCredit: 'RAC - Propriétaire',
    reference: '26741',
    referenceBanque: '35564980761',
    produit: 'Proprio Hypo LS2',
    position: 'Paiement',
    montant: 433487,
    emprunteur: {
      civilite: 'M.',
      nom: 'REMOUE',
      prenom: 'Franck',
      tel: '06 66 32 03 15',
      email: 'franck.remoue@ird.fr',
      age: 55
    },
    coEmprunteur: {
      civilite: 'Mme',
      nom: 'REMOUE',
      prenom: 'Diane',
      tel: '06 62 06 09 97',
      email: 'diane.remouebouda@gmail.cc',
      age: 36
    },
    apporteur: {
      nom: 'CLP',
      tel: '06 46 23 33 44',
      email: 'lefebvrejean-charles@neuf.fr',
      reseau: 'IMMOFINANCES',
      position: ''
    },
    utilisateur: {
      nom: 'LEFEBVRE Jean Charles',
      tel: '06 46 23 33 44',
      email: 'lefebvrejean-charles@neuf.fr',
      statut: 'Miob',
      singularite: ''
    },
    cibFinance: {
      analyste: 'Meriem',
      gestionnaire: 'Sylvie',
      banque: 'Mymoneybank',
      notaire1: 'M. NEUMAN Sacha',
      notaire2: '',
      assurance: 'Cardif'
    },
    commentaires: [
      {
        id: 1,
        date: '20/11/2025 11:32',
        auteur: 'Sylvie',
        texte: 'honoraires reçus le 18/11 rentrés sur INCWO',
        type: 'system'
      },
      {
        id: 2,
        date: '20/11/2025 09:36',
        auteur: 'Jean Charles',
        texte: 'Le notaire reclame la MRH pour régulariser le dossier j\'en fait la demande au client.',
        type: 'comment'
      }
    ]
  };

  const tabs = [
    { id: 'synthese', label: 'Synthèse' },
    { id: 'apporteur', label: 'Apporteur' },
    { id: 'dossier', label: 'Dossier' },
    { id: 'qualification', label: 'Qualification' },
    { id: 'etude', label: 'Etude dossier' },
    { id: 'banque', label: 'Banque' },
    { id: 'offre', label: 'Offre de prêt' },
    { id: 'notaire', label: 'Notaire' },
    { id: 'assurance', label: 'Assurance' },
    { id: 'commissionnement', label: 'Commissionnement' },
    { id: 'commentaires', label: 'Commentaires' }
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Ici, vous appelleriez l'API pour ajouter le commentaire
      console.log('Nouveau commentaire:', newComment);
      setNewComment('');
      setShowNewComment(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec informations du dossier */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
        {/* Première ligne : Dossier et Participants */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
          {/* Section Dossier */}
          <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Dossier</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Type crédit:</span>
                <div className="font-semibold text-gray-900">{dossierData.typeCredit}</div>
              </div>
              <div>
                <span className="text-gray-600">Réf.:</span>
                <div className="font-semibold text-gray-900">{dossierData.reference}</div>
              </div>
              <div>
                <span className="text-gray-600">Réf. banque:</span>
                <div className="font-semibold text-gray-900">{dossierData.referenceBanque}</div>
              </div>
              <div>
                <span className="text-gray-600">Produit:</span>
                <div className="font-semibold text-gray-900">{dossierData.produit}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Position:</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                  {dossierData.position}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Montant:</span>
                <div className="font-bold text-lg text-blue-600">
                  {dossierData.montant.toLocaleString('fr-FR')} €
                </div>
              </div>
            </div>
          </div>

          {/* Emprunteur */}
          <div className="lg:col-span-1 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Emprunteur</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center">
                  <input type="radio" checked={dossierData.emprunteur.civilite === 'Mme'} className="mr-1" disabled />
                  <span className="text-xs">Mme</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" checked={dossierData.emprunteur.civilite === 'M.'} className="mr-1" disabled />
                  <span className="text-xs">M.</span>
                </label>
              </div>
              <div>
                <span className="text-gray-600">Nom:</span>
                <div className="font-semibold text-gray-900">{dossierData.emprunteur.nom}</div>
              </div>
              <div>
                <span className="text-gray-600">Prénom:</span>
                <div className="font-semibold text-gray-900">{dossierData.emprunteur.prenom}</div>
              </div>
              <div>
                <span className="text-gray-600">Tél.:</span>
                <div className="font-semibold text-gray-900">{dossierData.emprunteur.tel}</div>
              </div>
              <div>
                <span className="text-gray-600">E-mail:</span>
                <div className="font-semibold text-gray-900 text-xs break-all">{dossierData.emprunteur.email}</div>
              </div>
              <div>
                <span className="text-gray-600">Âge:</span>
                <div className="font-semibold text-gray-900">{dossierData.emprunteur.age} ans</div>
              </div>
            </div>
          </div>

          {/* Co-emprunteur */}
          <div className="lg:col-span-1 bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Co-emprunteur</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center">
                  <input type="radio" checked={dossierData.coEmprunteur.civilite === 'Mme'} className="mr-1" disabled />
                  <span className="text-xs">Mme</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" checked={dossierData.coEmprunteur.civilite === 'M.'} className="mr-1" disabled />
                  <span className="text-xs">M.</span>
                </label>
              </div>
              <div>
                <span className="text-gray-600">Nom:</span>
                <div className="font-semibold text-gray-900">{dossierData.coEmprunteur.nom}</div>
              </div>
              <div>
                <span className="text-gray-600">Prénom:</span>
                <div className="font-semibold text-gray-900">{dossierData.coEmprunteur.prenom}</div>
              </div>
              <div>
                <span className="text-gray-600">Tél.:</span>
                <div className="font-semibold text-gray-900">{dossierData.coEmprunteur.tel}</div>
              </div>
              <div>
                <span className="text-gray-600">E-mail:</span>
                <div className="font-semibold text-gray-900 text-xs break-all">{dossierData.coEmprunteur.email}</div>
              </div>
              <div>
                <span className="text-gray-600">Âge:</span>
                <div className="font-semibold text-gray-900">{dossierData.coEmprunteur.age} ans</div>
              </div>
            </div>
          </div>

          {/* Apporteur */}
          <div className="lg:col-span-1 bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Apporteur</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Nom:</span>
                <div className="font-semibold text-gray-900">{dossierData.apporteur.nom}</div>
              </div>
              <div>
                <span className="text-gray-600">Tél.:</span>
                <div className="font-semibold text-gray-900">{dossierData.apporteur.tel}</div>
              </div>
              <div>
                <span className="text-gray-600">E-mail:</span>
                <div className="font-semibold text-gray-900 text-xs break-all">{dossierData.apporteur.email}</div>
              </div>
              <div>
                <span className="text-gray-600">Réseau:</span>
                <div className="font-semibold text-gray-900">{dossierData.apporteur.reseau}</div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">IMMOFINANCES.NET</span>
              </div>
            </div>
          </div>

          {/* Utilisateur */}
          <div className="lg:col-span-1 bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Utilisateur</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Nom:</span>
                <div className="font-semibold text-gray-900">{dossierData.utilisateur.nom}</div>
              </div>
              <div>
                <span className="text-gray-600">Tél.:</span>
                <div className="font-semibold text-gray-900">{dossierData.utilisateur.tel}</div>
              </div>
              <div>
                <span className="text-gray-600">E-mail:</span>
                <div className="font-semibold text-gray-900 text-xs break-all">{dossierData.utilisateur.email}</div>
              </div>
              <div>
                <span className="text-gray-600">Statut:</span>
                <div className="font-semibold text-gray-900">{dossierData.utilisateur.statut}</div>
              </div>
            </div>
          </div>

          {/* Responsable */}
          <div className="lg:col-span-1 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Responsable</h3>
            <div className="text-sm text-gray-500 italic">
              Non assigné
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors flex items-center gap-2">
            <Send className="w-4 h-4" />
            Transmission
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center gap-2">
            <User className="w-4 h-4" />
            Données Client
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            Simulation
          </button>
        </div>
      </div>

      {/* Navigation par onglets et contenu principal */}
      <div className="flex gap-6">
        {/* Contenu principal */}
        <div className="flex-1 bg-white rounded-xl shadow-lg border-2 border-gray-200">
          {/* Onglets */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-1 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu de l'onglet actif */}
          <div className="p-6">
            {activeTab === 'commentaires' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Commentaires</h2>
                  <button
                    onClick={() => setShowNewComment(!showNewComment)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Nouveau commentaire
                  </button>
                </div>

                {/* Filtres */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Tous</option>
                      <option>Commentaire</option>
                      <option>Système</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                    <input type="text" placeholder="Rechercher..." className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                    <input type="text" placeholder="Rechercher..." className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>

                {/* Formulaire nouveau commentaire */}
                {showNewComment && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Écrire un commentaire..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setShowNewComment(false);
                          setNewComment('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleAddComment}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                )}

                {/* Liste des commentaires */}
                <div className="space-y-4">
                  {dossierData.commentaires.map((comment: any) => (
                    <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {comment.auteur.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{comment.auteur}</div>
                          <div className="text-xs text-gray-500">{comment.date}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-11">{comment.texte}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'commentaires' && (
              <div className="text-center py-12 text-gray-500">
                Contenu de l'onglet "{tabs.find(t => t.id === activeTab)?.label}" à venir
              </div>
            )}
          </div>
        </div>

        {/* Sidebar droite */}
        <div className="w-80 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cib Finance</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Analyste</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>{dossierData.cibFinance.analyste}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gestionnaire</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>{dossierData.cibFinance.gestionnaire}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banque</label>
              <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                {dossierData.cibFinance.banque}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notaire 1</label>
              <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                {dossierData.cibFinance.notaire1}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notaire 2</label>
              <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400">
                {dossierData.cibFinance.notaire2 || 'Non défini'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assurance</label>
              <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                {dossierData.cibFinance.assurance}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Action</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-left flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Commentaires
                <Plus className="w-4 h-4 ml-auto" />
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-left flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Tâches
                <Plus className="w-4 h-4 ml-auto" />
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-left flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mails
                <Plus className="w-4 h-4 ml-auto" />
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-left flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Historique
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-left flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Accès client
                <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-left">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
