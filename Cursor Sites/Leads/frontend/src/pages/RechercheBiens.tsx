import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, MapPin, Euro, Ruler, Bed, Bath, Car, Heart, Share2, Mail, Video, Plus, X, ExternalLink, AlertCircle } from 'lucide-react';
import LeadCaptureForm from '../components/LeadCaptureForm';
import LeadCaptureService from '../services/leadCapture';
import ArticlesRecommandes from '../components/ArticlesRecommandes';
import ContactForm from '../components/ContactForm';
import VisiteVirtuelle from '../components/VisiteVirtuelle';
import { Secteur } from '../types';

interface BienImmobilier {
  id: string;
  titre: string;
  type: string;
  prix: number;
  surface: number;
  pieces: number;
  chambres: number;
  sallesDeBain: number;
  localisation: string;
  codePostal: string;
  ville: string;
  description: string;
  images: string[];
  parking: boolean;
  balcon: boolean;
  jardin: boolean;
  ascenseur: boolean;
  dpe: string;
  ges: string;
  visiteVirtuelleId?: string; // ID Matterport pour la visite virtuelle
  isExemple?: boolean; // Indique si c'est un bien d'exemple
  lienExterne?: string; // Lien vers leboncoin, seloger, les portes, etc.
}

export default function RechercheBiens() {
  const [showCaptureForm, setShowCaptureForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [favoris, setFavoris] = useState<Set<string>>(new Set());
  
  const [filtres, setFiltres] = useState({
    typeBien: '',
    budgetMin: '',
    budgetMax: '',
    localisation: '',
    surfaceMin: '',
    nombrePieces: '',
    chambres: '',
  });

  // Biens immobiliers (exemples + biens ajoutés manuellement)
  const [biens, setBiens] = useState<BienImmobilier[]>([
    {
      id: '1',
      titre: 'Appartement T3 lumineux avec balcon',
      type: 'Appartement',
      prix: 250000,
      surface: 65,
      pieces: 3,
      chambres: 2,
      sallesDeBain: 1,
      localisation: 'Paris 15ème',
      codePostal: '75015',
      ville: 'Paris',
      description: 'Magnifique appartement de 65m² avec balcon, proche métro et commerces.',
      images: ['/api/placeholder/400/300'],
      parking: false,
      balcon: true,
      jardin: false,
      ascenseur: true,
      dpe: 'C',
      ges: 'B',
      visiteVirtuelleId: 'RsKKA9cRJnj',
      isExemple: true,
    },
    {
      id: '2',
      titre: 'Maison T4 avec jardin',
      type: 'Maison',
      prix: 450000,
      surface: 120,
      pieces: 4,
      chambres: 3,
      sallesDeBain: 2,
      localisation: 'Versailles',
      codePostal: '78000',
      ville: 'Versailles',
      description: 'Belle maison avec jardin de 200m², garage et proche des écoles.',
      images: ['/api/placeholder/400/300'],
      parking: true,
      balcon: false,
      jardin: true,
      ascenseur: false,
      dpe: 'B',
      ges: 'A',
      isExemple: true,
    },
    {
      id: '3',
      titre: 'Studio moderne centre-ville',
      type: 'Studio',
      prix: 180000,
      surface: 25,
      pieces: 1,
      chambres: 0,
      sallesDeBain: 1,
      localisation: 'Lyon 1er',
      codePostal: '69001',
      ville: 'Lyon',
      description: 'Studio rénové de 25m², idéal investissement locatif.',
      images: ['/api/placeholder/400/300'],
      parking: false,
      balcon: false,
      jardin: false,
      ascenseur: true,
      dpe: 'A',
      ges: 'A',
      isExemple: true,
    },
    {
      id: '4',
      titre: 'Appartement T2 rénové',
      type: 'Appartement',
      prix: 195000,
      surface: 45,
      pieces: 2,
      chambres: 1,
      sallesDeBain: 1,
      localisation: 'Marseille 8ème',
      codePostal: '13008',
      ville: 'Marseille',
      description: 'Appartement T2 rénové avec vue mer, proche plages.',
      images: ['/api/placeholder/400/300'],
      parking: false,
      balcon: true,
      jardin: false,
      ascenseur: false,
      dpe: 'B',
      ges: 'B',
      isExemple: true,
    },
    {
      id: '5',
      titre: 'Villa T5 avec piscine',
      type: 'Villa',
      prix: 650000,
      surface: 180,
      pieces: 5,
      chambres: 4,
      sallesDeBain: 3,
      localisation: 'Nice',
      codePostal: '06000',
      ville: 'Nice',
      description: 'Superbe villa avec piscine, vue panoramique sur la mer.',
      images: ['/api/placeholder/400/300'],
      parking: true,
      balcon: true,
      jardin: true,
      ascenseur: false,
      dpe: 'C',
      ges: 'B',
      isExemple: true,
    },
    {
      id: '6',
      titre: 'Loft industriel T3',
      type: 'Loft',
      prix: 320000,
      surface: 85,
      pieces: 3,
      chambres: 2,
      sallesDeBain: 1,
      localisation: 'Paris 11ème',
      codePostal: '75011',
      ville: 'Paris',
      description: 'Loft industriel rénové, hauteur sous plafond 4m, proche République.',
      images: ['/api/placeholder/400/300'],
      parking: false,
      balcon: false,
      jardin: false,
      ascenseur: true,
      dpe: 'D',
      ges: 'C',
      isExemple: true,
    },
    {
      id: '7',
      titre: 'Appartement T4 familial',
      type: 'Appartement',
      prix: 380000,
      surface: 95,
      pieces: 4,
      chambres: 3,
      sallesDeBain: 2,
      localisation: 'Bordeaux',
      codePostal: '33000',
      ville: 'Bordeaux',
      description: 'Appartement familial T4, proche centre-ville et écoles.',
      images: ['/api/placeholder/400/300'],
      parking: true,
      balcon: true,
      jardin: false,
      ascenseur: true,
      dpe: 'B',
      ges: 'A',
      isExemple: true,
    },
    {
      id: '8',
      titre: 'Maison T3 avec terrasse',
      type: 'Maison',
      prix: 295000,
      surface: 90,
      pieces: 3,
      chambres: 2,
      sallesDeBain: 2,
      localisation: 'Toulouse',
      codePostal: '31000',
      ville: 'Toulouse',
      description: 'Maison avec grande terrasse, proche universités.',
      images: ['/api/placeholder/400/300'],
      parking: true,
      balcon: false,
      jardin: true,
      ascenseur: false,
      dpe: 'C',
      ges: 'B',
      isExemple: true,
    },
    {
      id: '9',
      titre: 'Appartement T2 neuf',
      type: 'Appartement',
      prix: 220000,
      surface: 50,
      pieces: 2,
      chambres: 1,
      sallesDeBain: 1,
      localisation: 'Nantes',
      codePostal: '44000',
      ville: 'Nantes',
      description: 'Appartement neuf T2, résidence sécurisée avec parking.',
      images: ['/api/placeholder/400/300'],
      parking: true,
      balcon: true,
      jardin: false,
      ascenseur: true,
      dpe: 'A',
      ges: 'A',
      isExemple: true,
    },
    {
      id: '10',
      titre: 'Maison T5 de caractère',
      type: 'Maison',
      prix: 520000,
      surface: 150,
      pieces: 5,
      chambres: 4,
      sallesDeBain: 2,
      localisation: 'Strasbourg',
      codePostal: '67000',
      ville: 'Strasbourg',
      description: 'Maison de caractère rénovée, proche centre historique.',
      images: ['/api/placeholder/400/300'],
      parking: true,
      balcon: false,
      jardin: true,
      ascenseur: false,
      dpe: 'D',
      ges: 'C',
      isExemple: true,
    },
  ]);

  const [biensFiltres, setBiensFiltres] = useState<BienImmobilier[]>(biens);

  const handleRecherche = () => {
    let resultats = [...biens];

    if (filtres.typeBien) {
      resultats = resultats.filter(b => b.type === filtres.typeBien);
    }
    if (filtres.budgetMin) {
      resultats = resultats.filter(b => b.prix >= parseInt(filtres.budgetMin));
    }
    if (filtres.budgetMax) {
      resultats = resultats.filter(b => b.prix <= parseInt(filtres.budgetMax));
    }
    if (filtres.localisation) {
      resultats = resultats.filter(b => 
        b.localisation.toLowerCase().includes(filtres.localisation.toLowerCase()) ||
        b.ville.toLowerCase().includes(filtres.localisation.toLowerCase())
      );
    }
    if (filtres.surfaceMin) {
      resultats = resultats.filter(b => b.surface >= parseInt(filtres.surfaceMin));
    }
    if (filtres.nombrePieces) {
      resultats = resultats.filter(b => b.pieces >= parseInt(filtres.nombrePieces));
    }

    setBiensFiltres(resultats);
    
    // Afficher le formulaire de capture après recherche
    if (resultats.length > 0) {
      setShowCaptureForm(true);
    }
  };

  const handleCaptureLead = async (data: {
    nom?: string;
    prenom?: string;
    email: string;
    telephone?: string;
  }) => {
    await LeadCaptureService.captureFromBienSearch(data.email, {
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      rechercheData: {
        typeBien: filtres.typeBien || 'Tous',
        budgetMin: filtres.budgetMin ? parseInt(filtres.budgetMin) : undefined,
        budgetMax: filtres.budgetMax ? parseInt(filtres.budgetMax) : undefined,
        localisation: filtres.localisation,
        surfaceMin: filtres.surfaceMin ? parseInt(filtres.surfaceMin) : undefined,
        nombrePieces: filtres.nombrePieces ? parseInt(filtres.nombrePieces) : undefined,
      },
      source: 'Recherche de bien immobilier',
    });
  };

  const toggleFavori = (id: string) => {
    const nouveauxFavoris = new Set(favoris);
    if (nouveauxFavoris.has(id)) {
      nouveauxFavoris.delete(id);
    } else {
      nouveauxFavoris.add(id);
    }
    setFavoris(nouveauxFavoris);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Home className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Recherchez votre bien immobilier
        </h1>
        <p className="text-gray-600 text-lg">
          Trouvez le bien qui correspond à vos critères parmi nos milliers d'annonces
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <Link 
            to="/presentation" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <Video className="w-5 h-5" />
            Découvrez nos visites virtuelles 360°
          </Link>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Ajouter un bien
          </button>
        </div>
      </div>

      {/* Formulaire de recherche */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de bien
            </label>
            <select
              value={filtres.typeBien}
              onChange={(e) => setFiltres({ ...filtres, typeBien: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Tous</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison">Maison</option>
              <option value="Studio">Studio</option>
              <option value="Villa">Villa</option>
              <option value="Loft">Loft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget min (€)
            </label>
            <input
              type="number"
              value={filtres.budgetMin}
              onChange={(e) => setFiltres({ ...filtres, budgetMin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget max (€)
            </label>
            <input
              type="number"
              value={filtres.budgetMax}
              onChange={(e) => setFiltres({ ...filtres, budgetMax: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="500000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <input
              type="text"
              value={filtres.localisation}
              onChange={(e) => setFiltres({ ...filtres, localisation: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="Ville, quartier..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surface min (m²)
            </label>
            <input
              type="number"
              value={filtres.surfaceMin}
              onChange={(e) => setFiltres({ ...filtres, surfaceMin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de pièces
            </label>
            <input
              type="number"
              value={filtres.nombrePieces}
              onChange={(e) => setFiltres({ ...filtres, nombrePieces: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              placeholder="3"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleRecherche}
            className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 flex items-center justify-center space-x-2 font-semibold"
          >
            <Search className="w-5 h-5" />
            <span>Rechercher</span>
          </button>
          <button
            onClick={() => {
              setFiltres({
                typeBien: '',
                budgetMin: '',
                budgetMax: '',
                localisation: '',
                surfaceMin: '',
                nombrePieces: '',
                chambres: '',
              });
              setBiensFiltres(biens);
            }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Formulaire de capture - Modal */}
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
              title="Recevez les meilleures offres par email"
              description={`Nous avons trouvé ${biensFiltres.length} bien${biensFiltres.length > 1 ? 's' : ''} correspondant à votre recherche. Laissez-nous vos coordonnées pour recevoir les détails et être contacté par un conseiller.`}
              showCloseButton={true}
            />
          </div>
        </div>
      )}

      {/* Résultats */}
      {biensFiltres.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 font-semibold">
            🎉 {biensFiltres.length} bien{biensFiltres.length > 1 ? 's' : ''} trouvé{biensFiltres.length > 1 ? 's' : ''} correspondant à votre recherche
          </p>
        </div>
      )}

      {/* Bouton pour contacter le courtier */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-md p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Besoin d'aide pour trouver votre bien ?</h2>
            <p className="text-purple-100">Notre courtier vous accompagne dans votre recherche et vous propose les meilleures offres</p>
          </div>
          <button
            onClick={() => setShowContactForm(!showContactForm)}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2 whitespace-nowrap"
          >
            <Mail className="w-5 h-5" />
            {showContactForm ? 'Masquer le formulaire' : 'Contacter le courtier'}
          </button>
        </div>
      </div>

      {/* Formulaire de contact */}
      {showContactForm && (
        <ContactForm
          typeDemande="BIEN"
          prefillData={{
            typeBien: filtres.typeBien || undefined,
            montant: filtres.budgetMax ? parseInt(filtres.budgetMax) : filtres.budgetMin ? parseInt(filtres.budgetMin) : undefined,
          }}
          onSuccess={() => {
            setShowContactForm(false);
          }}
        />
      )}

      {/* Formulaire d'ajout de bien */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Ajouter un bien immobilier</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const nouveauBien: BienImmobilier = {
                  id: Date.now().toString(),
                  titre: formData.get('titre') as string,
                  type: formData.get('type') as string,
                  prix: parseInt(formData.get('prix') as string),
                  surface: parseInt(formData.get('surface') as string),
                  pieces: parseInt(formData.get('pieces') as string),
                  chambres: parseInt(formData.get('chambres') as string),
                  sallesDeBain: parseInt(formData.get('sallesDeBain') as string),
                  localisation: formData.get('localisation') as string,
                  codePostal: formData.get('codePostal') as string,
                  ville: formData.get('ville') as string,
                  description: formData.get('description') as string,
                  images: ['/api/placeholder/400/300'],
                  parking: formData.get('parking') === 'on',
                  balcon: formData.get('balcon') === 'on',
                  jardin: formData.get('jardin') === 'on',
                  ascenseur: formData.get('ascenseur') === 'on',
                  dpe: formData.get('dpe') as string,
                  ges: formData.get('ges') as string,
                  lienExterne: formData.get('lienExterne') as string || undefined,
                  isExemple: false,
                };
                setBiens([...biens, nouveauBien]);
                setBiensFiltres([...biensFiltres, nouveauBien]);
                setShowAddForm(false);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input type="text" name="titre" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select name="type" required className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option value="Appartement">Appartement</option>
                    <option value="Maison">Maison</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Loft">Loft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
                  <input type="number" name="prix" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²) *</label>
                  <input type="number" name="surface" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pièces *</label>
                  <input type="number" name="pieces" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chambres *</label>
                  <input type="number" name="chambres" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain *</label>
                  <input type="number" name="sallesDeBain" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input type="text" name="ville" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal *</label>
                  <input type="text" name="codePostal" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation *</label>
                  <input type="text" name="localisation" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DPE *</label>
                  <select name="dpe" required className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GES *</label>
                  <select name="ges" required className="w-full px-4 py-2 border border-gray-300 rounded-md">
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea name="description" required rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lien externe (LeBonCoin, SeLoger, Les Portes, etc.)
                </label>
                <input 
                  type="url" 
                  name="lienExterne" 
                  placeholder="https://www.leboncoin.fr/..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md" 
                />
                <p className="text-xs text-gray-500 mt-1">Optionnel : Ajoutez un lien vers l'annonce originale</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center">
                  <input type="checkbox" name="parking" className="mr-2" />
                  <span className="text-sm">Parking</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="balcon" className="mr-2" />
                  <span className="text-sm">Balcon</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="jardin" className="mr-2" />
                  <span className="text-sm">Jardin</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" name="ascenseur" className="mr-2" />
                  <span className="text-sm">Ascenseur</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Ajouter le bien
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles recommandés */}
      {biensFiltres.length > 0 && (
        <ArticlesRecommandes
          categorie="IMMOBILIER"
          searchTerms={`${filtres.typeBien || 'bien'} ${filtres.localisation || ''} ${filtres.budgetMax || filtres.budgetMin || ''}€`}
          limit={3}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {biensFiltres.map((bien) => (
          <div key={bien.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Home className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => toggleFavori(bien.id)}
                  className={`p-2 rounded-full ${
                    favoris.has(bien.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full bg-white text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {bien.prix.toLocaleString('fr-FR')} €
              </div>
              {bien.visiteVirtuelleId && (
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Visite 360°
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 flex-1">{bien.titre}</h3>
                {bien.lienExterne && (
                  <a
                    href={bien.lienExterne}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{bien.localisation}</span>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Ruler className="w-4 h-4 mr-1" />
                  <span>{bien.surface} m²</span>
                </div>
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{bien.chambres} ch.</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{bien.sallesDeBain} SdB</span>
                </div>
                {bien.parking && (
                  <div className="flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    <span>Parking</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{bien.description}</p>

              {/* Visite virtuelle si disponible */}
              {bien.visiteVirtuelleId && (
                <div className="mb-4">
                  <VisiteVirtuelle
                    matterportId={bien.visiteVirtuelleId}
                    titre={`Visite virtuelle - ${bien.titre}`}
                    description={`Explorez ce ${bien.type.toLowerCase()} en visite virtuelle 360°`}
                    className="rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  DPE: <span className="font-semibold">{bien.dpe}</span> | GES: <span className="font-semibold">{bien.ges}</span>
                </div>
                <button
                  onClick={() => {
                    setShowCaptureForm(true);
                    handleCaptureLead({ email: '' });
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
                >
                  En savoir plus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {biensFiltres.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Aucun bien trouvé avec ces critères</p>
          <p className="text-gray-500 text-sm mt-2">Essayez de modifier vos filtres</p>
        </div>
      )}
    </div>
  );
}
