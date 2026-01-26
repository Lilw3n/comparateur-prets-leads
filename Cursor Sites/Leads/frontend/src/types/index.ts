export enum Secteur {
  // Secteurs principaux
  IMMOBILIER = 'IMMOBILIER',
  ASSURANCE = 'ASSURANCE',
  BANQUE_PRET = 'BANQUE_PRET',
  MARCHE_FINANCIER = 'MARCHE_FINANCIER',
  GESTION_PATRIMOINE = 'GESTION_PATRIMOINE',
  INVESTISSEMENT_FINANCIER = 'INVESTISSEMENT_FINANCIER',
  COURTAGE_ASSURANCE = 'COURTAGE_ASSURANCE',
  CONSEIL_FINANCIER = 'CONSEIL_FINANCIER',
  
  // Prêts détaillés
  CREDIT_CONSOMMATION = 'CREDIT_CONSOMMATION',
  CREDIT_IMMOBILIER = 'CREDIT_IMMOBILIER',
  CREDIT_PROFESSIONNEL = 'CREDIT_PROFESSIONNEL',
  
  // Assurances détaillées
  ASSURANCE_VIE = 'ASSURANCE_VIE',
  ASSURANCE_HABITATION = 'ASSURANCE_HABITATION',
  ASSURANCE_AUTO = 'ASSURANCE_AUTO',
  ASSURANCE_SANTE = 'ASSURANCE_SANTE',
  ASSURANCE_VL = 'ASSURANCE_VL',
  
  // Investissements
  SCPI = 'SCPI',
  PERP = 'PERP',
  PEA = 'PEA',
  INVESTISSEMENT_LOCATIF = 'INVESTISSEMENT_LOCATIF',
  
  // Fiscalité et optimisation
  DEFISCALISATION = 'DEFISCALISATION',
  FISCALITE = 'FISCALITE',
  SUCCESSION = 'SUCCESSION',
  DONATION = 'DONATION',
  
  // Immobilier détaillé
  LMNP = 'LMNP',
  PINEL = 'PINEL',
  DEFICIT_FONCIER = 'DEFICIT_FONCIER',
  SCI = 'SCI',
  
  // Retraite et épargne
  RETRAITE = 'RETRAITE',
  EPARGNE = 'EPARGNE',
  
  // Autres
  TRADING = 'TRADING',
  CRYPTO = 'CRYPTO',
  ENTREPRENEURIAT = 'ENTREPRENEURIAT',
  FORMATION_FINANCIERE = 'FORMATION_FINANCIERE',
  CONSEIL_EN_PATRIMOINE = 'CONSEIL_EN_PATRIMOINE',
  MANDAT_MANAGEMENT = 'MANDAT_MANAGEMENT',
  AUTRE = 'AUTRE',
}

export enum Statut {
  NOUVEAU = 'NOUVEAU',
  CONTACTE = 'CONTACTE',
  CONVERTI = 'CONVERTI',
  PERDU = 'PERDU',
}

export interface Lead {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  secteur: Secteur;
  statut: Statut;
  source?: string | null;
  notes?: string | null;
  entreprise?: string | null;
  budget?: number | null;
  typeBien?: string | null;
  typeCredit?: string | null;
  montantCredit?: number | null;
  typeAssurance?: string | null;
  produitFinancier?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StatsResponse {
  total: number;
  tauxConversion: number;
  bySecteur: Record<Secteur, number>;
  byStatut: Record<Statut, number>;
  recentLeads: Lead[];
}
