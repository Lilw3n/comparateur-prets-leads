import axios from 'axios';
import bankingApis from './bankingApis';

/**
 * Service pour intégrer les APIs externes de comparateurs de prêts
 * Amélioré avec support des vraies API bancaires françaises
 */

/**
 * Intégration avec l'API Pretto (exemple - à adapter selon la vraie API)
 */
export async function fetchPrettoOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    // TODO: Remplacer par la vraie URL de l'API Pretto
    // const response = await axios.get('https://api.pretto.fr/offers', {
    //   headers: {
    //     'Authorization': `Bearer ${params.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   params: {
    //     amount: params.montant,
    //     duration: params.duree,
    //     type: params.typeCredit
    //   }
    // });
    
    // Données mockées basées sur les caractéristiques réelles de Pretto
    return [
      {
        nomBanque: 'Pretto Partenaire',
        nomProduit: 'Prêt Immobilier Optimisé',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.8,
        montantMax: params.montant * 1.2,
        dureeMin: Math.max(12, params.duree - 12),
        dureeMax: params.duree + 12,
        tauxNominal: 2.5,
        tauxEffectif: 2.8,
        apportMin: 10,
        fraisDossier: 500,
        fraisGarantie: 0,
        assuranceObli: true,
        montantAssurance: 50,
        delaiTraitement: 15,
        disponible: true,
        avantages: 'Courtier en ligne, démarches simplifiées'
      }
    ];
  } catch (error) {
    console.error('Error fetching Pretto offers:', error);
    return [];
  }
}

/**
 * Intégration avec l'API Meilleur Taux (exemple - à adapter selon la vraie API)
 */
export async function fetchMeilleurTauxOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    // TODO: Remplacer par la vraie URL de l'API Meilleur Taux
    // const response = await axios.get('https://api.meilleurtaux.com/offers', {
    //   headers: {
    //     'X-API-Key': params.apiKey,
    //     'Content-Type': 'application/json'
    //   },
    //   params: {
    //     montant: params.montant,
    //     duree: params.duree,
    //     type: params.typeCredit
    //   }
    // });
    
    // Données mockées basées sur les caractéristiques réelles de Meilleur Taux
    return [
      {
        nomBanque: 'Meilleur Taux Partenaire',
        nomProduit: 'Crédit Immobilier Avantage',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.9,
        montantMax: params.montant * 1.1,
        dureeMin: Math.max(12, params.duree - 24),
        dureeMax: params.duree + 24,
        tauxNominal: 2.3,
        tauxEffectif: 2.6,
        apportMin: 15,
        fraisDossier: 800,
        fraisGarantie: 1000,
        assuranceObli: false,
        montantAssurance: null,
        delaiTraitement: 20,
        disponible: true,
        avantages: 'Leader du courtage, large réseau de partenaires'
      }
    ];
  } catch (error) {
    console.error('Error fetching Meilleur Taux offers:', error);
    return [];
  }
}

/**
 * Intégration avec Meilleur Agents (exemple - à adapter selon la vraie API)
 */
export async function fetchMeilleurAgentsOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    // Données mockées basées sur les caractéristiques réelles de Meilleur Agents
    return [
      {
        nomBanque: 'Banque Partenaire Meilleur Agents',
        nomProduit: 'Prêt Immobilier Expert',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.85,
        montantMax: params.montant * 1.15,
        dureeMin: Math.max(12, params.duree - 18),
        dureeMax: params.duree + 18,
        tauxNominal: 2.4,
        tauxEffectif: 2.7,
        apportMin: 12,
        fraisDossier: 600,
        fraisGarantie: 800,
        assuranceObli: true,
        montantAssurance: 45,
        delaiTraitement: 12,
        disponible: true
      }
    ];
  } catch (error) {
    console.error('Error fetching Meilleur Agents offers:', error);
    return [];
  }
}

/**
 * Intégration avec APICIL / Crédit Logement
 */
export async function fetchApicilOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    // APICIL via Crédit Logement - spécialisé dans la garantie et le financement
    return [
      {
        nomBanque: 'APICIL / Crédit Logement',
        nomProduit: 'Prêt Immobilier avec Garantie CL',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.8,
        montantMax: params.montant * 1.2,
        dureeMin: Math.max(12, params.duree - 24),
        dureeMax: params.duree + 24,
        tauxNominal: 2.2,
        tauxEffectif: 2.5,
        apportMin: 10,
        fraisDossier: 700,
        fraisGarantie: 1200, // Frais de garantie Crédit Logement
        assuranceObli: true,
        montantAssurance: 48,
        delaiTraitement: 18,
        disponible: true,
        avantages: 'Garantie Crédit Logement incluse, financement jusqu\'à 100%'
      },
      {
        nomBanque: 'APICIL Partenaire',
        nomProduit: 'Prêt Immobilier Classique',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.9,
        montantMax: params.montant * 1.1,
        dureeMin: Math.max(12, params.duree - 12),
        dureeMax: params.duree + 12,
        tauxNominal: 2.3,
        tauxEffectif: 2.6,
        apportMin: 15,
        fraisDossier: 500,
        fraisGarantie: 0,
        assuranceObli: false,
        montantAssurance: null,
        delaiTraitement: 15,
        disponible: true
      }
    ];
  } catch (error) {
    console.error('Error fetching APICIL offers:', error);
    return [];
  }
}

/**
 * Intégration avec Cercle des Épargnants
 */
export async function fetchCercleEpargnantsOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    // Cercle des Épargnants - courtier spécialisé crédit immobilier
    return [
      {
        nomBanque: 'Banque Partenaire Cercle des Épargnants',
        nomProduit: 'Crédit Immobilier Épargnant',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.85,
        montantMax: params.montant * 1.15,
        dureeMin: Math.max(12, params.duree - 20),
        dureeMax: params.duree + 20,
        tauxNominal: 2.1,
        tauxEffectif: 2.4,
        apportMin: 10,
        fraisDossier: 550,
        fraisGarantie: 900,
        assuranceObli: true,
        montantAssurance: 42,
        delaiTraitement: 14,
        disponible: true,
        avantages: 'Taux préférentiel pour épargnants, accompagnement personnalisé'
      }
    ];
  } catch (error) {
    console.error('Error fetching Cercle des Épargnants offers:', error);
    return [];
  }
}

/**
 * Intégration avec Immoprêt / CAFPI
 */
export async function fetchImmopretOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    // Immoprêt / CAFPI - réseau de courtiers immobiliers
    return [
      {
        nomBanque: 'Immoprêt / CAFPI',
        nomProduit: 'Prêt Immobilier Réseau',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.8,
        montantMax: params.montant * 1.2,
        dureeMin: Math.max(12, params.duree - 24),
        dureeMax: params.duree + 24,
        tauxNominal: 2.0,
        tauxEffectif: 2.3,
        apportMin: 10,
        fraisDossier: 600,
        fraisGarantie: 1000,
        assuranceObli: true,
        montantAssurance: 50,
        delaiTraitement: 16,
        disponible: true,
        avantages: 'Réseau de courtiers experts, négociation renforcée'
      },
      {
        nomBanque: 'CAFPI Partenaire',
        nomProduit: 'Crédit Immobilier Expert',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.9,
        montantMax: params.montant * 1.1,
        dureeMin: Math.max(12, params.duree - 12),
        dureeMax: params.duree + 12,
        tauxNominal: 2.2,
        tauxEffectif: 2.5,
        apportMin: 15,
        fraisDossier: 800,
        fraisGarantie: 0,
        assuranceObli: false,
        montantAssurance: null,
        delaiTraitement: 12,
        disponible: true
      }
    ];
  } catch (error) {
    console.error('Error fetching Immoprêt offers:', error);
    return [];
  }
}

/**
 * Intégration avec Linéa
 */
export async function fetchLineaOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    return [
      {
        nomBanque: 'Linéa',
        nomProduit: 'Prêt Immobilier Linéa',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.85,
        montantMax: params.montant * 1.15,
        dureeMin: Math.max(12, params.duree - 18),
        dureeMax: params.duree + 18,
        tauxNominal: 2.3,
        tauxEffectif: 2.6,
        apportMin: 12,
        fraisDossier: 650,
        fraisGarantie: 850,
        assuranceObli: true,
        montantAssurance: 47,
        delaiTraitement: 13,
        disponible: true
      }
    ];
  } catch (error) {
    console.error('Error fetching Linéa offers:', error);
    return [];
  }
}

/**
 * Intégration avec Premista
 */
export async function fetchPremistaOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    return [
      {
        nomBanque: 'Premista',
        nomProduit: 'Crédit Immobilier Premista',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.9,
        montantMax: params.montant * 1.1,
        dureeMin: Math.max(12, params.duree - 12),
        dureeMax: params.duree + 12,
        tauxNominal: 2.1,
        tauxEffectif: 2.4,
        apportMin: 10,
        fraisDossier: 500,
        fraisGarantie: 0,
        assuranceObli: true,
        montantAssurance: 40,
        delaiTraitement: 11,
        disponible: true
      }
    ];
  } catch (error) {
    console.error('Error fetching Premista offers:', error);
    return [];
  }
}

/**
 * Intégration avec Partners Finances
 */
export async function fetchPartnersFinancesOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    return [
      {
        nomBanque: 'Partners Finances',
        nomProduit: 'Prêt Immobilier Partners',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.85,
        montantMax: params.montant * 1.15,
        dureeMin: Math.max(12, params.duree - 20),
        dureeMax: params.duree + 20,
        tauxNominal: 2.2,
        tauxEffectif: 2.5,
        apportMin: 12,
        fraisDossier: 600,
        fraisGarantie: 950,
        assuranceObli: true,
        montantAssurance: 45,
        delaiTraitement: 15,
        disponible: true
      }
    ];
  } catch (error) {
    console.error('Error fetching Partners Finances offers:', error);
    return [];
  }
}

/**
 * Intégration avec Weinberg Capital
 */
export async function fetchWeinbergOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    return [
      {
        nomBanque: 'Weinberg Capital',
        nomProduit: 'Crédit Immobilier Weinberg',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.9,
        montantMax: params.montant * 1.1,
        dureeMin: Math.max(12, params.duree - 12),
        dureeMax: params.duree + 12,
        tauxNominal: 2.0,
        tauxEffectif: 2.3,
        apportMin: 15,
        fraisDossier: 750,
        fraisGarantie: 1100,
        assuranceObli: true,
        montantAssurance: 48,
        delaiTraitement: 14,
        disponible: true,
        avantages: 'Accompagnement premium, taux négociés'
      }
    ];
  } catch (error) {
    console.error('Error fetching Weinberg offers:', error);
    return [];
  }
}

/**
 * Intégration avec Hexafi
 */
export async function fetchHexafiOffers(params: {
  montant: number;
  duree: number;
  typeCredit: string;
  apiKey?: string;
}): Promise<any[]> {
  try {
    return [
      {
        nomBanque: 'Hexafi',
        nomProduit: 'Prêt Immobilier Hexafi',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.85,
        montantMax: params.montant * 1.15,
        dureeMin: Math.max(12, params.duree - 18),
        dureeMax: params.duree + 18,
        tauxNominal: 2.2,
        tauxEffectif: 2.5,
        apportMin: 10,
        fraisDossier: 580,
        fraisGarantie: 900,
        assuranceObli: true,
        montantAssurance: 43,
        delaiTraitement: 13,
        disponible: true
      }
    ];
  } catch (error) {
    console.error('Error fetching Hexafi offers:', error);
    return [];
  }
}

/**
 * Fonction générique pour synchroniser les offres depuis les comparateurs externes
 * Améliorée avec support des vraies API bancaires
 */
export async function syncExternalOffers(comparateurId: string, comparateurType: string, params: any) {
  let offers: any[] = [];

  // Essayer d'abord les vraies API si disponibles
  if (process.env.ENABLE_REAL_BANKING_APIS === 'true') {
    try {
      // Utiliser l'API de simulation réelle
      const simulation = await bankingApis.simulateLoanOpenCredits({
        montant: params.montant,
        duree: params.duree,
        typeCredit: params.typeCredit,
        revenus: params.revenus,
        charges: params.charges
      });

      if (simulation.offers && simulation.offers.length > 0) {
        offers = simulation.offers.map((offer: any) => ({
          nomBanque: offer.bank || 'Banque Partenaire',
          nomProduit: `${params.typeCredit} - Offre optimisée`,
          typeCredit: params.typeCredit,
          montantMin: params.montant * 0.9,
          montantMax: params.montant * 1.1,
          dureeMin: params.duree - 12,
          dureeMax: params.duree + 12,
          tauxNominal: offer.rate - 0.3,
          tauxEffectif: offer.rate,
          apportMin: 10,
          fraisDossier: 500,
          fraisGarantie: 0,
          assuranceObli: true,
          montantAssurance: 50,
          delaiTraitement: 15,
          disponible: true,
          mensualite: offer.monthlyPayment,
          coutTotal: offer.totalCost
        }));
      }
    } catch (error) {
      console.warn('Erreur avec API réelle, utilisation des comparateurs mockés:', error);
    }
  }

  // Si pas d'offres des vraies API, utiliser les comparateurs mockés
  if (offers.length === 0) {
    switch (comparateurType) {
      case 'PRETTO':
        offers = await fetchPrettoOffers(params);
        break;
      case 'MEILLEUR_TAUX':
        offers = await fetchMeilleurTauxOffers(params);
        break;
      case 'MEILLEUR_AGENTS':
        offers = await fetchMeilleurAgentsOffers(params);
        break;
      case 'APICIL':
        offers = await fetchApicilOffers(params);
        break;
      case 'CERCLE_EPARGNANTS':
        offers = await fetchCercleEpargnantsOffers(params);
        break;
      case 'IMMOPRET':
        offers = await fetchImmopretOffers(params);
        break;
      case 'LINEA':
        offers = await fetchLineaOffers(params);
        break;
      case 'PREMISTA':
        offers = await fetchPremistaOffers(params);
        break;
      case 'PARTNERS_FINANCES':
        offers = await fetchPartnersFinancesOffers(params);
        break;
      case 'WEINBERG':
        offers = await fetchWeinbergOffers(params);
        break;
      case 'HEXAFI':
        offers = await fetchHexafiOffers(params);
        break;
      default:
        console.warn(`Type de comparateur non supporté: ${comparateurType}`);
    }
  }

  return offers.map(offer => ({
    ...offer,
    comparateurId
  }));
}
