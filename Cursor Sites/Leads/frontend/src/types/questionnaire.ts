export interface QuestionnairePret {
  // Étape 1: Situation personnelle
  age?: number;
  situationFamiliale?: 'celibataire' | 'marie' | 'pacse' | 'divorce' | 'veuf';
  nombreEnfants?: number;
  nombrePersonnes?: number;
  
  // Étape 2: Situation professionnelle
  situationProfessionnelle?: 'cdi' | 'cdd' | 'interim' | 'fonctionnaire' | 'liberal' | 'retraite' | 'chomage' | 'autre';
  anciennete?: number;
  typeContrat?: string;
  nomEmployeur?: string;
  secteurActivite?: string;
  
  // Étape 3: Revenus et charges
  revenusMensuels?: number;
  revenusConjoint?: number;
  autresRevenus?: number;
  chargesMensuelles?: number;
  loyerActuel?: number;
  autresCredits?: number;
  
  // Étape 4: Projet immobilier
  typeProjet?: 'achat_residence' | 'achat_investissement' | 'rachat_credit' | 'travaux' | 'autre';
  typeBien?: 'appartement' | 'maison' | 'terrain' | 'local_commercial' | 'autre';
  usageBien?: 'residence_principale' | 'residence_secondaire' | 'investissement_locatif';
  localisation?: string;
  prixBien?: number;
  montantPret?: number;
  apport?: number;
  apportPourcentage?: number;
  
  // Étape 5: Préférences crédit
  dureeSouhaitee?: number;
  mensualiteMax?: number;
  typeCredit?: 'immobilier' | 'consommation' | 'professionnel';
  assuranceCredit?: boolean;
  assuranceHabitation?: boolean;
  
  // Étape 6: Informations complémentaires
  travauxPrevu?: boolean;
  montantTravaux?: number;
  venteBienActuel?: boolean;
  prixVenteEstime?: number;
  dateSouhaitee?: string;
  notes?: string;
  
  // Métadonnées
  leadId?: string;
  accepteCGU?: boolean;
}

export interface EtapeQuestionnaire {
  id: string;
  titre: string;
  description?: string;
  champs: ChampQuestionnaire[];
}

export interface ChampQuestionnaire {
  name: keyof QuestionnairePret;
  label: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'date';
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  validation?: (value: any) => string | null;
  dependsOn?: {
    field: keyof QuestionnairePret;
    value: any;
  };
}
