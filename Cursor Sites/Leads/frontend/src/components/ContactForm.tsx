import { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';

// @ts-ignore
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

interface ContactFormProps {
  typeDemande: 'BIEN' | 'PRET' | 'ASSURANCE' | 'CONTACT_GENERAL';
  prefillData?: {
    montant?: number;
    duree?: number;
    typeBien?: string;
    typeAssurance?: string;
    [key: string]: any;
  };
  onSuccess?: () => void;
  className?: string;
}

export default function ContactForm({ typeDemande, prefillData = {}, onSuccess, className = '' }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: '',
    ...prefillData,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, {
        ...formData,
        typeDemande,
      });

      if (response.data.success) {
        setSuccess(true);
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          message: '',
        });
        
        if (onSuccess) {
          onSuccess();
        }
        
        // Masquer le message de succès après 5 secondes
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Erreur lors de l\'envoi de votre demande. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    const titles = {
      BIEN: 'Demander un bien immobilier',
      PRET: 'Demander un prêt immobilier',
      ASSURANCE: 'Demander une assurance',
    };
    return titles[typeDemande];
  };

  const getDescription = () => {
    const descriptions = {
      BIEN: 'Remplissez ce formulaire et notre courtier vous contactera rapidement pour vous aider à trouver le bien de vos rêves.',
      PRET: 'Remplissez ce formulaire et notre courtier vous contactera rapidement pour vous proposer les meilleures offres de prêt.',
      ASSURANCE: 'Remplissez ce formulaire et notre courtier vous contactera rapidement pour vous proposer les meilleures assurances.',
    };
    return descriptions[typeDemande];
  };

  if (success) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-1">Demande envoyée avec succès !</h3>
            <p className="text-green-700">
              Notre courtier vous contactera rapidement à l'adresse <strong>{formData.email}</strong>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getTitle()}</h2>
        <p className="text-gray-600">{getDescription()}</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Prénom *
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre prénom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Nom *
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Téléphone
            </label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>

        {prefillData.montant && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant souhaité
            </label>
            <input
              type="number"
              name="montant"
              value={formData.montant || ''}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        )}

        {prefillData.duree && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée souhaitée (années)
            </label>
            <input
              type="number"
              name="duree"
              value={formData.duree || ''}
              onChange={handleChange}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MessageSquare className="w-4 h-4 inline mr-1" />
            Message (optionnel)
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Décrivez votre projet ou vos besoins..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold transition-all"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Envoyer ma demande
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          En cliquant sur "Envoyer ma demande", vous acceptez d'être contacté par notre courtier.
          <br />
          Vos données seront utilisées uniquement pour répondre à votre demande.
        </p>
      </form>
    </div>
  );
}
