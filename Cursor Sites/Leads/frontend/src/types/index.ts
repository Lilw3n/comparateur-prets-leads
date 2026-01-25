export enum Secteur {
  IMMOBILIER = 'IMMOBILIER',
  ASSURANCE = 'ASSURANCE',
  BANQUE_PRET = 'BANQUE_PRET',
  MARCHE_FINANCIER = 'MARCHE_FINANCIER',
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
