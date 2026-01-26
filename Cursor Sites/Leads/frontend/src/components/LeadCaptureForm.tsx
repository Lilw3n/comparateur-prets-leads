import { useState } from 'react';
import { X, Mail, User, Phone, CheckCircle } from 'lucide-react';

interface LeadCaptureFormProps {
  onCapture: (data: {
    nom?: string;
    prenom?: string;
    email: string;
    telephone?: string;
  }) => Promise<void>;
  onClose?: () => void;
  title?: string;
  description?: string;
  requirePhone?: boolean;
  showCloseButton?: boolean;
}

export default function LeadCaptureForm({
  onCapture,
  onClose,
  title = 'Recevez vos résultats par email',
  description = 'Remplissez vos coordonnées pour recevoir vos résultats et être contacté par un expert.',
  requirePhone = false,
  showCloseButton = true,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email) {
      setError('L\'email est requis');
      return;
    }

    if (requirePhone && !formData.telephone) {
      setError('Le téléphone est requis');
      return;
    }

    try {
      setLoading(true);
      await onCapture(formData);
      setSuccess(true);
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Merci !
        </h3>
        <p className="text-green-700">
          Vos informations ont été enregistrées. Vous recevrez vos résultats par email.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 relative">
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jean"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dupont"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="jean.dupont@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone {requirePhone && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="tel"
              required={requirePhone}
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="06 12 34 56 78"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Envoi en cours...' : 'Recevoir mes résultats'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          En soumettant ce formulaire, vous acceptez d'être contacté par nos conseillers.
        </p>
      </form>
    </div>
  );
}
