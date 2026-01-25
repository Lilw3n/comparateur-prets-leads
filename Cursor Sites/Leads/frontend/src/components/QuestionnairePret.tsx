import { useState, useEffect } from 'react';
import { QuestionnairePret as QuestionnairePretType, EtapeQuestionnaire, ChampQuestionnaire } from '../types/questionnaire';
import { etapesQuestionnaire } from '../data/questionnaireSteps';
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react';

interface QuestionnairePretProps {
  onComplete: (data: QuestionnairePretType) => void;
  initialData?: QuestionnairePretType;
}

export default function QuestionnairePret({ onComplete, initialData }: QuestionnairePretProps) {
  const [etapeActuelle, setEtapeActuelle] = useState(0);
  const [formData, setFormData] = useState<QuestionnairePretType>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const etape = etapesQuestionnaire[etapeActuelle];
  const estDerniereEtape = etapeActuelle === etapesQuestionnaire.length - 1;
  const estPremiereEtape = etapeActuelle === 0;

  useEffect(() => {
    if (formData.prixBien && formData.apport) {
      const pourcentage = (formData.apport / formData.prixBien) * 100;
      setFormData(prev => ({ ...prev, apportPourcentage: Math.round(pourcentage * 10) / 10 }));
    }
    
    if (formData.prixBien && formData.apport && !formData.montantPret) {
      const montant = formData.prixBien - formData.apport;
      if (montant > 0) {
        setFormData(prev => ({ ...prev, montantPret: montant }));
      }
    }
  }, [formData.prixBien, formData.apport]);

  const handleChange = (name: keyof QuestionnairePretType, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validerEtape = (): boolean => {
    const nouvellesErreurs: Record<string, string> = {};
    
    etape.champs.forEach(champ => {
      if (champ.dependsOn) {
        const valeurDependante = formData[champ.dependsOn.field];
        if (Array.isArray(champ.dependsOn.value)) {
          if (!champ.dependsOn.value.includes(valeurDependante)) {
            return;
          }
        } else if (valeurDependante !== champ.dependsOn.value) {
          return;
        }
      }

      if (champ.required) {
        const valeur = formData[champ.name as keyof QuestionnairePretType];
        if (valeur === undefined || valeur === null || valeur === '' || valeur === false) {
          nouvellesErreurs[champ.name] = `${champ.label} est requis`;
        }
      }

      if (champ.validation) {
        const valeur = formData[champ.name as keyof QuestionnairePretType];
        const erreur = champ.validation(valeur);
        if (erreur) {
          nouvellesErreurs[champ.name] = erreur;
        }
      }

      if (champ.type === 'number' && formData[champ.name as keyof QuestionnairePretType] !== undefined) {
        const valeur = formData[champ.name as keyof QuestionnairePretType] as number;
        if (champ.min !== undefined && valeur < champ.min) {
          nouvellesErreurs[champ.name] = `La valeur minimale est ${champ.min}`;
        }
        if (champ.max !== undefined && valeur > champ.max) {
          nouvellesErreurs[champ.name] = `La valeur maximale est ${champ.max}`;
        }
      }
    });

    setErrors(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const handleSuivant = () => {
    if (validerEtape()) {
      if (estDerniereEtape) {
        onComplete(formData);
      } else {
        setEtapeActuelle(prev => prev + 1);
      }
    }
  };

  const handlePrecedent = () => {
    if (!estPremiereEtape) {
      setEtapeActuelle(prev => prev - 1);
    }
  };

  const renderChamp = (champ: ChampQuestionnaire) => {
    if (champ.dependsOn) {
      const valeurDependante = formData[champ.dependsOn.field];
      if (Array.isArray(champ.dependsOn.value)) {
        if (!champ.dependsOn.value.includes(valeurDependante)) {
          return null;
        }
      } else if (valeurDependante !== champ.dependsOn.value) {
        return null;
      }
    }

    const valeur = formData[champ.name as keyof QuestionnairePretType];
    const erreur = errors[champ.name];
    const id = `champ-${champ.name}`;

    return (
      <div key={champ.name} className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {champ.label}
          {champ.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {champ.type === 'text' && (
          <input
            id={id}
            type="text"
            value={(valeur as string) || ''}
            onChange={(e) => handleChange(champ.name, e.target.value)}
            placeholder={champ.placeholder}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              erreur ? 'border-red-500' : ''
            }`}
          />
        )}

        {champ.type === 'number' && (
          <input
            id={id}
            type="number"
            value={(valeur as number) || ''}
            onChange={(e) => handleChange(champ.name, e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder={champ.placeholder}
            min={champ.min}
            max={champ.max}
            step={champ.step}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              erreur ? 'border-red-500' : ''
            }`}
          />
        )}

        {champ.type === 'select' && (
          <select
            id={id}
            value={(valeur as string) || ''}
            onChange={(e) => handleChange(champ.name, e.target.value)}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              erreur ? 'border-red-500' : ''
            }`}
          >
            <option value="">Sélectionner...</option>
            {champ.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {champ.type === 'checkbox' && (
          <div className="flex items-center">
            <input
              id={id}
              type="checkbox"
              checked={(valeur as boolean) || false}
              onChange={(e) => handleChange(champ.name, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={id} className="ml-2 text-sm text-gray-700">
              {champ.label}
            </label>
          </div>
        )}

        {champ.type === 'textarea' && (
          <textarea
            id={id}
            value={(valeur as string) || ''}
            onChange={(e) => handleChange(champ.name, e.target.value)}
            placeholder={champ.placeholder}
            rows={4}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              erreur ? 'border-red-500' : ''
            }`}
          />
        )}

        {champ.type === 'date' && (
          <input
            id={id}
            type="date"
            value={(valeur as string) || ''}
            onChange={(e) => handleChange(champ.name, e.target.value)}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
              erreur ? 'border-red-500' : ''
            }`}
          />
        )}

        {champ.helpText && (
          <p className="mt-1 text-xs text-gray-500">{champ.helpText}</p>
        )}
        
        {erreur && (
          <p className="mt-1 text-sm text-red-600">{erreur}</p>
        )}
      </div>
    );
  };

  const progress = ((etapeActuelle + 1) / etapesQuestionnaire.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Étape {etapeActuelle + 1} sur {etapesQuestionnaire.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center mb-6 space-x-2">
        {etapesQuestionnaire.map((etapeItem, index) => (
          <div
            key={etapeItem.id}
            className={`flex items-center ${
              index < etapeActuelle ? 'text-green-600' :
              index === etapeActuelle ? 'text-blue-600' :
              'text-gray-400'
            }`}
          >
            {index < etapeActuelle ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
            {index < etapesQuestionnaire.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                index < etapeActuelle ? 'bg-green-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{etape.titre}</h2>
      {etape.description && (
        <p className="text-gray-600 mb-6">{etape.description}</p>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSuivant(); }}>
        <div className="space-y-4">
          {etape.champs.map(champ => renderChamp(champ))}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrecedent}
            disabled={estPremiereEtape}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${
              estPremiereEtape ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Précédent
          </button>

          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {estDerniereEtape ? 'Terminer' : 'Suivant'}
            {!estDerniereEtape && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </form>
    </div>
  );
}
