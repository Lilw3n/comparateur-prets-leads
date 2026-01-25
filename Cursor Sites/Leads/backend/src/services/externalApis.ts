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
    
    // Pour l'instant, retourner des données mockées
    return [
      {
        nomBanque: 'Banque Pretto',
        nomProduit: 'Prêt Immobilier Optimisé',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.8,
        montantMax: params.montant * 1.2,
        dureeMin: params.duree - 12,
        dureeMax: params.duree + 12,
        tauxNominal: 2.5,
        tauxEffectif: 2.8,
        apportMin: 10,
        fraisDossier: 500,
        fraisGarantie: 0,
        assuranceObli: true,
        montantAssurance: 50,
        delaiTraitement: 15,
        disponible: true
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
    
    // Pour l'instant, retourner des données mockées
    return [
      {
        nomBanque: 'Meilleur Taux Partenaire',
        nomProduit: 'Crédit Immobilier Avantage',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.9,
        montantMax: params.montant * 1.1,
        dureeMin: params.duree - 24,
        dureeMax: params.duree + 24,
        tauxNominal: 2.3,
        tauxEffectif: 2.6,
        apportMin: 15,
        fraisDossier: 800,
        fraisGarantie: 1000,
        assuranceObli: false,
        montantAssurance: null,
        delaiTraitement: 20,
        disponible: true
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
    // TODO: Remplacer par la vraie URL de l'API Meilleur Agents
    // const response = await axios.get('https://api.meilleuragents.com/credit', {
    //   headers: {
    //     'Authorization': `Bearer ${params.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   params: {
    //     montant: params.montant,
    //     duree: params.duree,
    //     type: params.typeCredit
    //   }
    // });
    
    // Pour l'instant, retourner des données mockées
    return [
      {
        nomBanque: 'Banque Meilleur Agents',
        nomProduit: 'Prêt Immobilier Expert',
        typeCredit: params.typeCredit,
        montantMin: params.montant * 0.85,
        montantMax: params.montant * 1.15,
        dureeMin: params.duree - 18,
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
      default:
        console.warn(`Type de comparateur non supporté: ${comparateurType}`);
    }
  }

  return offers.map(offer => ({
    ...offer,
    comparateurId
  }));
}
