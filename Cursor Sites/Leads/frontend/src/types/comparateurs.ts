export interface ComparateurPret {
  id: string;
  nom: string;
  type: 'INTERNE' | 'PRETTO' | 'MEILLEUR_TAUX' | 'MEILLEUR_AGENTS' | 'AUTRE';
  url?: string | null;
  apiKey?: string | null;
  actif: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  offres?: OffrePret[];
}

export interface OffrePret {
  id: string;
  comparateurId: string;
  comparateur?: ComparateurPret;
  nomBanque: string;
  nomProduit: string;
  typeCredit: string;
  montantMin: number;
  montantMax: number;
  dureeMin: number;
  dureeMax: number;
  tauxNominal: number;
  tauxEffectif: number;
  apportMin?: number | null;
  fraisDossier?: number | null;
  fraisGarantie?: number | null;
  assuranceObli: boolean;
  montantAssurance?: number | null;
  conditions?: string | null;
  avantages?: string | null;
  delaiTraitement?: number | null;
  disponible: boolean;
  dateExpiration?: string | null;
  score?: number | null;
  nombreDemandes: number;
  tauxAcceptation?: number | null;
  createdAt: string;
  updatedAt: string;
  // Champs calculés
  mensualite?: number;
  coutTotal?: number;
  coutTotalAvecFrais?: number;
  tauxEndettement?: number | null;
}

export interface ComparaisonPret {
  id: string;
  leadId?: string | null;
  montant: number;
  duree: number;
  typeCredit: string;
  apport?: number | null;
  revenus?: number | null;
  offresIds: string;
  meilleureOffreId?: string | null;
  createdAt: string;
}

export interface ComparaisonRequest {
  montant: number;
  duree: number;
  typeCredit: string;
  apport?: number;
  revenus?: number;
  leadId?: string;
  questionnaireData?: any;
}

export interface ComparaisonResponse {
  comparaison: ComparaisonPret;
  offres: OffrePret[];
  meilleureOffre: OffrePret | null;
}

export interface TauxMoyen {
  typeCredit: string;
  tauxMoyen: number;
  duree: number;
  dateMiseAJour: string;
  nombreOffres: number;
}
