import { EtapeQuestionnaire } from '../types/questionnaire';

export const etapesQuestionnaire: EtapeQuestionnaire[] = [
  {
    id: 'situation-personnelle',
    titre: 'Situation personnelle',
    description: 'Informations sur votre situation personnelle et familiale',
    champs: [
      {
        name: 'age',
        label: 'Âge',
        type: 'number',
        required: true,
        min: 18,
        max: 100,
        helpText: 'Vous devez avoir au moins 18 ans pour contracter un prêt'
      },
      {
        name: 'situationFamiliale',
        label: 'Situation familiale',
        type: 'select',
        required: true,
        options: [
          { value: 'celibataire', label: 'Célibataire' },
          { value: 'marie', label: 'Marié(e)' },
          { value: 'pacse', label: 'Pacsé(e)' },
          { value: 'divorce', label: 'Divorcé(e)' },
          { value: 'veuf', label: 'Veuf(ve)' }
        ]
      },
      {
        name: 'nombreEnfants',
        label: 'Nombre d\'enfants à charge',
        type: 'number',
        min: 0,
        max: 10,
        helpText: 'Enfants de moins de 18 ans ou étudiants'
      },
      {
        name: 'nombrePersonnes',
        label: 'Nombre de personnes dans le foyer',
        type: 'number',
        required: true,
        min: 1,
        max: 10
      }
    ]
  },
  {
    id: 'situation-professionnelle',
    titre: 'Situation professionnelle',
    description: 'Informations sur votre activité professionnelle',
    champs: [
      {
        name: 'situationProfessionnelle',
        label: 'Situation professionnelle',
        type: 'select',
        required: true,
        options: [
          { value: 'cdi', label: 'CDI (Contrat à durée indéterminée)' },
          { value: 'cdd', label: 'CDD (Contrat à durée déterminée)' },
          { value: 'interim', label: 'Intérim' },
          { value: 'fonctionnaire', label: 'Fonctionnaire' },
          { value: 'liberal', label: 'Profession libérale' },
          { value: 'retraite', label: 'Retraité(e)' },
          { value: 'chomage', label: 'Demandeur d\'emploi' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        name: 'anciennete',
        label: 'Ancienneté dans l\'entreprise (mois)',
        type: 'number',
        required: true,
        min: 0,
        max: 600,
        helpText: 'Durée depuis votre embauche'
      },
      {
        name: 'nomEmployeur',
        label: 'Nom de l\'employeur',
        type: 'text',
        placeholder: 'Nom de l\'entreprise'
      },
      {
        name: 'secteurActivite',
        label: 'Secteur d\'activité',
        type: 'select',
        options: [
          { value: 'commerce', label: 'Commerce' },
          { value: 'industrie', label: 'Industrie' },
          { value: 'services', label: 'Services' },
          { value: 'sante', label: 'Santé' },
          { value: 'education', label: 'Éducation' },
          { value: 'finance', label: 'Finance' },
          { value: 'immobilier', label: 'Immobilier' },
          { value: 'technologie', label: 'Technologie' },
          { value: 'autre', label: 'Autre' }
        ]
      }
    ]
  },
  {
    id: 'revenus-charges',
    titre: 'Revenus et charges',
    description: 'Vos revenus mensuels et vos charges récurrentes',
    champs: [
      {
        name: 'revenusMensuels',
        label: 'Revenus mensuels nets (€)',
        type: 'number',
        required: true,
        min: 0,
        step: 100,
        helpText: 'Salaire net après impôts'
      },
      {
        name: 'revenusConjoint',
        label: 'Revenus mensuels du conjoint (€)',
        type: 'number',
        min: 0,
        step: 100,
        dependsOn: {
          field: 'situationFamiliale',
          value: ['marie', 'pacse']
        }
      },
      {
        name: 'autresRevenus',
        label: 'Autres revenus mensuels (€)',
        type: 'number',
        min: 0,
        step: 100,
        helpText: 'Pensions, loyers, dividendes, etc.'
      },
      {
        name: 'chargesMensuelles',
        label: 'Charges mensuelles récurrentes (€)',
        type: 'number',
        min: 0,
        step: 50,
        helpText: 'Assurances, abonnements, etc. (hors crédits et loyer)'
      },
      {
        name: 'loyerActuel',
        label: 'Loyer actuel (€)',
        type: 'number',
        min: 0,
        step: 50
      },
      {
        name: 'autresCredits',
        label: 'Mensualités autres crédits (€)',
        type: 'number',
        min: 0,
        step: 50,
        helpText: 'Crédit auto, consommation, etc.'
      }
    ]
  },
  {
    id: 'projet-immobilier',
    titre: 'Projet immobilier',
    description: 'Détails sur votre projet d\'achat ou de financement',
    champs: [
      {
        name: 'typeProjet',
        label: 'Type de projet',
        type: 'select',
        required: true,
        options: [
          { value: 'achat_residence', label: 'Achat résidence principale' },
          { value: 'achat_investissement', label: 'Achat investissement locatif' },
          { value: 'rachat_credit', label: 'Rachat de crédit' },
          { value: 'travaux', label: 'Travaux / Rénovation' },
          { value: 'autre', label: 'Autre' }
        ]
      },
      {
        name: 'typeBien',
        label: 'Type de bien',
        type: 'select',
        required: true,
        options: [
          { value: 'appartement', label: 'Appartement' },
          { value: 'maison', label: 'Maison' },
          { value: 'terrain', label: 'Terrain' },
          { value: 'local_commercial', label: 'Local commercial' },
          { value: 'autre', label: 'Autre' }
        ],
        dependsOn: {
          field: 'typeProjet',
          value: ['achat_residence', 'achat_investissement']
        }
      },
      {
        name: 'usageBien',
        label: 'Usage du bien',
        type: 'select',
        required: true,
        options: [
          { value: 'residence_principale', label: 'Résidence principale' },
          { value: 'residence_secondaire', label: 'Résidence secondaire' },
          { value: 'investissement_locatif', label: 'Investissement locatif' }
        ]
      },
      {
        name: 'localisation',
        label: 'Localisation du bien',
        type: 'text',
        placeholder: 'Ville, département ou région'
      },
      {
        name: 'prixBien',
        label: 'Prix du bien (€)',
        type: 'number',
        required: true,
        min: 0,
        step: 1000,
        dependsOn: {
          field: 'typeProjet',
          value: ['achat_residence', 'achat_investissement']
        }
      },
      {
        name: 'apport',
        label: 'Apport disponible (€)',
        type: 'number',
        required: true,
        min: 0,
        step: 1000,
        helpText: 'Économies, héritage, vente d\'un bien, etc.'
      },
      {
        name: 'montantPret',
        label: 'Montant du prêt souhaité (€)',
        type: 'number',
        required: true,
        min: 10000,
        step: 1000,
        helpText: 'Montant à emprunter'
      },
      {
        name: 'travauxPrevu',
        label: 'Travaux prévus',
        type: 'checkbox'
      },
      {
        name: 'montantTravaux',
        label: 'Montant des travaux (€)',
        type: 'number',
        min: 0,
        step: 1000,
        dependsOn: {
          field: 'travauxPrevu',
          value: true
        }
      },
      {
        name: 'venteBienActuel',
        label: 'Vente d\'un bien actuel prévue',
        type: 'checkbox'
      },
      {
        name: 'prixVenteEstime',
        label: 'Prix de vente estimé (€)',
        type: 'number',
        min: 0,
        step: 1000,
        dependsOn: {
          field: 'venteBienActuel',
          value: true
        }
      }
    ]
  },
  {
    id: 'preferences-credit',
    titre: 'Préférences de crédit',
    description: 'Vos préférences concernant le crédit',
    champs: [
      {
        name: 'typeCredit',
        label: 'Type de crédit',
        type: 'select',
        required: true,
        options: [
          { value: 'immobilier', label: 'Crédit immobilier' },
          { value: 'consommation', label: 'Crédit consommation' },
          { value: 'professionnel', label: 'Crédit professionnel' }
        ]
      },
      {
        name: 'dureeSouhaitee',
        label: 'Durée souhaitée (années)',
        type: 'number',
        required: true,
        min: 5,
        max: 30,
        step: 1,
        helpText: 'Durée de remboursement souhaitée'
      },
      {
        name: 'mensualiteMax',
        label: 'Mensualité maximum souhaitée (€)',
        type: 'number',
        min: 0,
        step: 50,
        helpText: 'Mensualité maximale que vous pouvez rembourser'
      },
      {
        name: 'assuranceCredit',
        label: 'Souhaitez-vous une assurance crédit ?',
        type: 'checkbox',
        helpText: 'Assurance décès, invalidité, perte d\'emploi'
      },
      {
        name: 'assuranceHabitation',
        label: 'Souhaitez-vous une assurance habitation ?',
        type: 'checkbox'
      },
      {
        name: 'dateSouhaitee',
        label: 'Date souhaitée pour l\'obtention du crédit',
        type: 'date',
        helpText: 'Quand souhaitez-vous obtenir le crédit ?'
      }
    ]
  },
  {
    id: 'informations-complementaires',
    titre: 'Informations complémentaires',
    description: 'Toute information supplémentaire utile',
    champs: [
      {
        name: 'notes',
        label: 'Notes ou commentaires',
        type: 'textarea',
        placeholder: 'Informations complémentaires sur votre projet...',
        helpText: 'Toute information qui pourrait être utile pour votre demande'
      },
      {
        name: 'accepteCGU',
        label: 'J\'accepte les conditions générales d\'utilisation',
        type: 'checkbox',
        required: true
      }
    ]
  }
];
