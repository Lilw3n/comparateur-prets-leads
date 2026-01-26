import { leadsApi } from './api';
import { Secteur } from '../types';

export interface LeadCaptureData {
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  secteur: Secteur;
  source: string;
  notes?: string;
  budget?: number;
  typeBien?: string;
  typeCredit?: string;
  montantCredit?: number;
  typeAssurance?: string;
  produitFinancier?: string;
  entreprise?: string;
}

/**
 * Service pour capturer automatiquement des leads depuis les actions utilisateurs
 */
export class LeadCaptureService {
  /**
   * Capture un lead depuis un simulateur
   */
  static async captureFromSimulator(
    email: string,
    data: {
      nom?: string;
      prenom?: string;
      telephone?: string;
      secteur: Secteur;
      simulatorType: 'capacite' | 'mensualites' | 'taux_endettement' | 'frais_notaire';
      simulatorData?: any;
      source?: string;
    }
  ): Promise<void> {
    try {
      const leadData: LeadCaptureData = {
        email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        secteur: data.secteur,
        source: data.source || `Simulateur ${data.simulatorType}`,
        notes: `Lead capturé depuis le simulateur ${data.simulatorType}. Données: ${JSON.stringify(data.simulatorData || {})}`,
      };

      // Ajouter des données spécifiques selon le simulateur
      if (data.simulatorData) {
        if (data.simulatorData.montant) {
          leadData.montantCredit = data.simulatorData.montant;
        }
        if (data.simulatorData.budget) {
          leadData.budget = data.simulatorData.budget;
        }
        if (data.simulatorData.typeCredit) {
          leadData.typeCredit = data.simulatorData.typeCredit;
        }
        if (data.simulatorData.typeBien) {
          leadData.typeBien = data.simulatorData.typeBien;
        }
      }

      await leadsApi.create(leadData);
    } catch (error) {
      console.error('Erreur lors de la capture du lead:', error);
      // Ne pas bloquer l'utilisateur si la capture échoue
    }
  }

  /**
   * Capture un lead depuis une recherche de bien immobilier
   */
  static async captureFromBienSearch(
    email: string,
    data: {
      nom?: string;
      prenom?: string;
      telephone?: string;
      rechercheData: {
        typeBien: string;
        budgetMin?: number;
        budgetMax?: number;
        localisation?: string;
        surfaceMin?: number;
        nombrePieces?: number;
      };
      source?: string;
    }
  ): Promise<void> {
    try {
      const leadData: LeadCaptureData = {
        email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        secteur: Secteur.IMMOBILIER,
        source: data.source || 'Recherche de bien immobilier',
        budget: data.rechercheData.budgetMax || data.rechercheData.budgetMin,
        typeBien: data.rechercheData.typeBien,
        notes: `Recherche de bien: ${data.rechercheData.typeBien} à ${data.rechercheData.localisation || 'non spécifié'}. Budget: ${data.rechercheData.budgetMin || 'N/A'} - ${data.rechercheData.budgetMax || 'N/A'}€. Surface: ${data.rechercheData.surfaceMin || 'N/A'}m². Pièces: ${data.rechercheData.nombrePieces || 'N/A'}`,
      };

      await leadsApi.create(leadData);
    } catch (error) {
      console.error('Erreur lors de la capture du lead:', error);
    }
  }

  /**
   * Capture un lead depuis un comparateur de prêts
   */
  static async captureFromComparateur(
    email: string,
    data: {
      nom?: string;
      prenom?: string;
      telephone?: string;
      comparaisonData: {
        montant: number;
        duree: number;
        typeCredit: string;
        apport?: number;
        revenus?: number;
      };
      source?: string;
    }
  ): Promise<void> {
    try {
      const secteur = data.comparaisonData.typeCredit === 'immobilier' 
        ? Secteur.CREDIT_IMMOBILIER 
        : data.comparaisonData.typeCredit === 'consommation'
        ? Secteur.CREDIT_CONSOMMATION
        : Secteur.CREDIT_PROFESSIONNEL;

      const leadData: LeadCaptureData = {
        email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        secteur,
        source: data.source || 'Comparateur de prêts',
        montantCredit: data.comparaisonData.montant,
        typeCredit: data.comparaisonData.typeCredit,
        notes: `Comparaison de prêt ${data.comparaisonData.typeCredit}. Montant: ${data.comparaisonData.montant}€, Durée: ${data.comparaisonData.duree} mois, Apport: ${data.comparaisonData.apport || 0}%`,
      };

      await leadsApi.create(leadData);
    } catch (error) {
      console.error('Erreur lors de la capture du lead:', error);
    }
  }

  /**
   * Capture un lead depuis un téléchargement de guide/article
   */
  static async captureFromDownload(
    email: string,
    data: {
      nom?: string;
      prenom?: string;
      telephone?: string;
      documentType: string;
      documentTitle: string;
      secteur?: Secteur;
      source?: string;
    }
  ): Promise<void> {
    try {
      const leadData: LeadCaptureData = {
        email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        secteur: data.secteur || Secteur.AUTRE,
        source: data.source || `Téléchargement ${data.documentType}`,
        notes: `Téléchargement: ${data.documentTitle} (${data.documentType})`,
      };

      await leadsApi.create(leadData);
    } catch (error) {
      console.error('Erreur lors de la capture du lead:', error);
    }
  }

  /**
   * Capture un lead depuis une consultation d'article
   */
  static async captureFromArticle(
    email: string,
    data: {
      nom?: string;
      prenom?: string;
      telephone?: string;
      articleTitle: string;
      articleCategory: string;
      secteur?: Secteur;
      source?: string;
    }
  ): Promise<void> {
    try {
      const leadData: LeadCaptureData = {
        email,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        secteur: data.secteur || Secteur.AUTRE,
        source: data.source || `Article: ${data.articleCategory}`,
        notes: `Intéressé par l'article: ${data.articleTitle} (${data.articleCategory})`,
      };

      await leadsApi.create(leadData);
    } catch (error) {
      console.error('Erreur lors de la capture du lead:', error);
    }
  }
}

export default LeadCaptureService;
