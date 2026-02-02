import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import { syncExternalOffers } from '../services/externalApis';

const prisma = new PrismaClient();

// ========== COMPARATEURS ==========

export const getAllComparateurs = async (req: Request, res: Response) => {
  try {
    const comparateurs = await prisma.comparateurPret.findMany({
      include: {
        _count: {
          select: { offres: true }
        }
      },
      orderBy: { nom: 'asc' }
    });
    res.json(comparateurs);
  } catch (error) {
    console.error('Error fetching comparateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des comparateurs' });
  }
};

export const getComparateurById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comparateur = await prisma.comparateurPret.findUnique({
      where: { id },
      include: { offres: true }
    });
    if (!comparateur) {
      return res.status(404).json({ error: 'Comparateur non trouvé' });
    }
    res.json(comparateur);
  } catch (error) {
    console.error('Error fetching comparateur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du comparateur' });
  }
};

export const createComparateur = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comparateur = await prisma.comparateurPret.create({
      data: req.body
    });
    res.status(201).json(comparateur);
  } catch (error) {
    console.error('Error creating comparateur:', error);
    res.status(500).json({ error: 'Erreur lors de la création du comparateur' });
  }
};

export const updateComparateur = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comparateur = await prisma.comparateurPret.update({
      where: { id },
      data: req.body
    });
    res.json(comparateur);
  } catch (error) {
    console.error('Error updating comparateur:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Comparateur non trouvé' });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du comparateur' });
  }
};

export const deleteComparateur = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.comparateurPret.delete({
      where: { id }
    });
    res.json({ message: 'Comparateur supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting comparateur:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Comparateur non trouvé' });
    }
    res.status(500).json({ error: 'Erreur lors de la suppression du comparateur' });
  }
};

// ========== OFFRES ==========

export const getAllOffres = async (req: Request, res: Response) => {
  try {
    const {
      comparateurId,
      typeCredit,
      montantMin,
      montantMax,
      duree,
      disponible
    } = req.query;

    const where: any = {};

    if (comparateurId) where.comparateurId = comparateurId as string;
    if (typeCredit) where.typeCredit = typeCredit as string;
    if (disponible !== undefined) where.disponible = disponible === 'true';
    if (montantMin || montantMax) {
      where.OR = [
        { montantMin: { lte: montantMax ? parseFloat(montantMax as string) : undefined } },
        { montantMax: { gte: montantMin ? parseFloat(montantMin as string) : undefined } }
      ];
    }

    const offres = await prisma.offrePret.findMany({
      where,
      include: { comparateur: true },
      orderBy: { tauxEffectif: 'asc' }
    });

    // Filtrer par durée si spécifiée
    let filteredOffres = offres;
    if (duree) {
      const dureeNum = parseInt(duree as string);
      filteredOffres = offres.filter(
        offre => offre.dureeMin <= dureeNum && offre.dureeMax >= dureeNum
      );
    }

    res.json(filteredOffres);
  } catch (error) {
    console.error('Error fetching offres:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
  }
};

export const createOffre = async (req: Request, res: Response) => {
  try {
    const offre = await prisma.offrePret.create({
      data: req.body,
      include: { comparateur: true }
    });
    res.status(201).json(offre);
  } catch (error) {
    console.error('Error creating offre:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'offre' });
  }
};

export const updateOffre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const offre = await prisma.offrePret.update({
      where: { id },
      data: req.body,
      include: { comparateur: true }
    });
    res.json(offre);
  } catch (error) {
    console.error('Error updating offre:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'offre' });
  }
};

export const deleteOffre = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.offrePret.delete({
      where: { id }
    });
    res.json({ message: 'Offre supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting offre:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre' });
  }
};

// ========== COMPARAISON ==========

export const comparerPrets = async (req: Request, res: Response) => {
  try {
    const {
      montant,
      duree,
      typeCredit,
      apport,
      revenus,
      leadId,
      questionnaireData
    } = req.body;

    if (!montant || !duree || !typeCredit) {
      return res.status(400).json({ error: 'Montant, durée et type de crédit sont requis' });
    }

    // Récupérer les comparateurs actifs
    let comparateurs = await prisma.comparateurPret.findMany({
      where: { actif: true }
    });

    // Si aucun comparateur, créer les comparateurs français de base
    if (comparateurs.length === 0) {
      console.log('Aucun comparateur trouvé, création des comparateurs français...');
      const comparateursBase = [
        { nom: 'Pretto', type: 'PRETTO', actif: true, url: 'https://www.pretto.fr', description: 'Courtier en ligne' },
        { nom: 'Meilleur Taux', type: 'MEILLEUR_TAUX', actif: true, url: 'https://www.meilleurtaux.com', description: 'Leader du courtage' },
        { nom: 'APICIL / Crédit Logement', type: 'APICIL', actif: true, url: 'https://www.credit-logement.fr', description: 'Garantie et financement' },
        { nom: 'Cercle des Épargnants', type: 'CERCLE_EPARGNANTS', actif: true, url: 'https://www.cercledesepargnants.fr', description: 'Courtier crédit immobilier' },
        { nom: 'Immoprêt / CAFPI', type: 'IMMOPRET', actif: true, url: 'https://www.immopret.fr', description: 'Réseau de courtiers' },
        { nom: 'Linéa', type: 'LINEA', actif: true, url: 'https://www.linea.fr', description: 'Courtier crédit immobilier' },
        { nom: 'Premista', type: 'PREMISTA', actif: true, url: 'https://www.premista.fr', description: 'Courtier crédit immobilier' },
        { nom: 'Partners Finances', type: 'PARTNERS_FINANCES', actif: true, url: 'https://www.partners-finances.fr', description: 'Courtier crédit immobilier' },
        { nom: 'Weinberg Capital', type: 'WEINBERG', actif: true, url: 'https://www.weinberg-capital.fr', description: 'Courtier crédit immobilier' },
        { nom: 'Hexafi', type: 'HEXAFI', actif: true, url: 'https://www.hexafi.fr', description: 'Courtier crédit immobilier' }
      ];

      for (const compData of comparateursBase) {
        try {
          await prisma.comparateurPret.create({ data: compData });
        } catch (error) {
          // Ignorer si déjà existant
        }
      }

      comparateurs = await prisma.comparateurPret.findMany({
        where: { actif: true }
      });
    }

    // Synchroniser les offres depuis les APIs externes
    for (const comparateur of comparateurs) {
      if (comparateur.type !== 'INTERNE') {
        try {
          const externalOffers = await syncExternalOffers(
            comparateur.id,
            comparateur.type,
            { montant, duree, typeCredit, apiKey: comparateur.apiKey }
          );
          
          // Créer ou mettre à jour les offres dans la base de données
          for (const offerData of externalOffers) {
            try {
              const existingOffer = await prisma.offrePret.findFirst({
                where: {
                  comparateurId: comparateur.id,
                  nomBanque: offerData.nomBanque,
                  nomProduit: offerData.nomProduit
                }
              });

              if (existingOffer) {
                await prisma.offrePret.update({
                  where: { id: existingOffer.id },
                  data: {
                    ...offerData,
                    updatedAt: new Date()
                  }
                });
              } else {
                await prisma.offrePret.create({
                  data: {
                    comparateurId: comparateur.id,
                    ...offerData
                  }
                });
              }
            } catch (offerError) {
              console.error(`Error creating/updating offer from ${comparateur.nom}:`, offerError);
            }
          }
        } catch (error) {
          console.error(`Error syncing offers from ${comparateur.nom}:`, error);
        }
      }
    }

    // Récupérer les offres correspondantes
    let offres = await prisma.offrePret.findMany({
      where: {
        typeCredit,
        disponible: true,
        montantMin: { lte: montant },
        montantMax: { gte: montant },
        dureeMin: { lte: duree },
        dureeMax: { gte: duree },
        OR: [
          { dateExpiration: null },
          { dateExpiration: { gt: new Date() } }
        ]
      },
      include: { comparateur: true },
      orderBy: { tauxEffectif: 'asc' }
    });

    // Si aucune offre trouvée, créer des offres mockées pour la démo
    if (offres.length === 0) {
      console.log('Aucune offre trouvée, création d\'offres mockées pour la démo');
      
      // Trouver ou créer un comparateur interne
      let comparateurInterne = await prisma.comparateurPret.findFirst({
        where: { type: 'INTERNE' }
      });

      if (!comparateurInterne) {
        comparateurInterne = await prisma.comparateurPret.create({
          data: {
            nom: 'Comparateur Interne',
            type: 'INTERNE',
            actif: true,
            description: 'Comparateur interne avec offres de démonstration'
          }
        });
      }

      // Créer des offres mockées basées sur les vrais comparateurs français
      const offresMockees = [
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Pretto',
          nomProduit: 'Prêt Immobilier Optimisé',
          typeCredit,
          montantMin: montant * 0.8,
          montantMax: montant * 1.2,
          dureeMin: Math.max(12, duree - 24),
          dureeMax: duree + 24,
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
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Meilleur Taux',
          nomProduit: 'Crédit Immobilier Avantage',
          typeCredit,
          montantMin: montant * 0.85,
          montantMax: montant * 1.15,
          dureeMin: Math.max(12, duree - 18),
          dureeMax: duree + 18,
          tauxNominal: 2.3,
          tauxEffectif: 2.6,
          apportMin: 15,
          fraisDossier: 800,
          fraisGarantie: 1000,
          assuranceObli: false,
          montantAssurance: null,
          delaiTraitement: 20,
          disponible: true,
          avantages: 'Leader du courtage, large réseau'
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'APICIL / Crédit Logement',
          nomProduit: 'Prêt avec Garantie CL',
          typeCredit,
          montantMin: montant * 0.9,
          montantMax: montant * 1.1,
          dureeMin: Math.max(12, duree - 12),
          dureeMax: duree + 12,
          tauxNominal: 2.2,
          tauxEffectif: 2.5,
          apportMin: 10,
          fraisDossier: 700,
          fraisGarantie: 1200,
          assuranceObli: true,
          montantAssurance: 48,
          delaiTraitement: 18,
          disponible: true,
          avantages: 'Garantie Crédit Logement, financement jusqu\'à 100%'
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Cercle des Épargnants',
          nomProduit: 'Crédit Immobilier Épargnant',
          typeCredit,
          montantMin: montant * 0.85,
          montantMax: montant * 1.15,
          dureeMin: Math.max(12, duree - 20),
          dureeMax: duree + 20,
          tauxNominal: 2.1,
          tauxEffectif: 2.4,
          apportMin: 10,
          fraisDossier: 550,
          fraisGarantie: 900,
          assuranceObli: true,
          montantAssurance: 42,
          delaiTraitement: 14,
          disponible: true,
          avantages: 'Taux préférentiel pour épargnants'
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Immoprêt / CAFPI',
          nomProduit: 'Prêt Immobilier Réseau',
          typeCredit,
          montantMin: montant * 0.8,
          montantMax: montant * 1.2,
          dureeMin: Math.max(12, duree - 24),
          dureeMax: duree + 24,
          tauxNominal: 2.0,
          tauxEffectif: 2.3,
          apportMin: 10,
          fraisDossier: 600,
          fraisGarantie: 1000,
          assuranceObli: true,
          montantAssurance: 50,
          delaiTraitement: 16,
          disponible: true,
          avantages: 'Réseau de courtiers experts'
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Weinberg Capital',
          nomProduit: 'Crédit Immobilier Premium',
          typeCredit,
          montantMin: montant * 0.9,
          montantMax: montant * 1.1,
          dureeMin: Math.max(12, duree - 12),
          dureeMax: duree + 12,
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

      // Créer les offres dans la base de données
      for (const offreData of offresMockees) {
        try {
          await prisma.offrePret.create({
            data: offreData
          });
        } catch (createError) {
          console.error('Error creating mock offer:', createError);
        }
      }

      // Récupérer les offres créées
      offres = await prisma.offrePret.findMany({
        where: {
          comparateurId: comparateurInterne.id,
          typeCredit,
          disponible: true
        },
        include: { comparateur: true },
        orderBy: { tauxEffectif: 'asc' }
      });
    }

    // Filtrer selon les capacités de remboursement si revenus fournis
    if (revenus && questionnaireData) {
      const revenusTotaux = (questionnaireData.revenusMensuels || 0) + 
                           (questionnaireData.revenusConjoint || 0) + 
                           (questionnaireData.autresRevenus || 0);
      const chargesTotales = (questionnaireData.chargesMensuelles || 0) + 
                            (questionnaireData.loyerActuel || 0) + 
                            (questionnaireData.autresCredits || 0);
      const capaciteRemboursement = revenusTotaux - chargesTotales;
      const mensualiteMaxAutorisee = capaciteRemboursement * 0.33;
      
      // Filtrer les offres avec apport minimum si requis
      if (apport && questionnaireData.apport) {
        offres = offres.filter(offre => {
          const apportRequis = (offre.apportMin || 0) / 100 * montant;
          return questionnaireData.apport! >= apportRequis;
        });
      }
    }

    // Calculer le coût total pour chaque offre
    const offresAvecCout = offres.map(offre => {
      const tauxMensuel = offre.tauxEffectif / 100 / 12;
      const nombreMois = duree;
      const mensualite = (montant * tauxMensuel * Math.pow(1 + tauxMensuel, nombreMois)) /
        (Math.pow(1 + tauxMensuel, nombreMois) - 1);
      
      const coutTotal = (mensualite * nombreMois) - montant;
      const coutTotalAvecFrais = coutTotal + (offre.fraisDossier || 0) + (offre.fraisGarantie || 0);
      
      // Calculer le taux d'endettement si revenus fournis
      let tauxEndettement = null;
      if (revenus && questionnaireData) {
        const revenusTotaux = (questionnaireData.revenusMensuels || 0) + 
                             (questionnaireData.revenusConjoint || 0) + 
                             (questionnaireData.autresRevenus || 0);
        tauxEndettement = (mensualite / revenusTotaux) * 100;
      }
      
      // Score de qualité (plus bas = meilleur)
      let score = offre.tauxEffectif;
      if (offre.fraisDossier) score += offre.fraisDossier / montant * 100;
      if (offre.fraisGarantie) score += offre.fraisGarantie / montant * 100;
      if (offre.assuranceObli && offre.montantAssurance) {
        score += (offre.montantAssurance * nombreMois) / montant * 100;
      }
      
      if (tauxEndettement && tauxEndettement < 33) {
        score -= 0.1;
      }

      return {
        ...offre,
        mensualite: Math.round(mensualite * 100) / 100,
        coutTotal: Math.round(coutTotal * 100) / 100,
        coutTotalAvecFrais: Math.round(coutTotalAvecFrais * 100) / 100,
        tauxEndettement: tauxEndettement ? Math.round(tauxEndettement * 10) / 10 : null,
        score: Math.round(score * 100) / 100
      };
    });

    // Trier par score (meilleur en premier)
    offresAvecCout.sort((a, b) => a.score - b.score);

    // Sauvegarder la comparaison (même si aucune offre trouvée)
    let comparaison;
    try {
      comparaison = await prisma.comparaisonPret.create({
        data: {
          leadId: leadId || null,
          montant,
          duree,
          typeCredit,
          apport: apport || null,
          revenus: revenus || null,
          offresIds: JSON.stringify(offresAvecCout.map(o => o.id)),
          meilleureOffreId: offresAvecCout.length > 0 ? offresAvecCout[0].id : null
        }
      });
    } catch (dbError: any) {
      console.error('Error saving comparison to database:', dbError);
      // Continuer même si la sauvegarde échoue
    }

    res.json({
      comparaison: comparaison || null,
      offres: offresAvecCout,
      meilleureOffre: offresAvecCout.length > 0 ? offresAvecCout[0] : null,
      message: offresAvecCout.length === 0 
        ? 'Aucune offre trouvée pour vos critères. Veuillez ajuster vos paramètres ou contacter un conseiller.'
        : undefined
    });
  } catch (error: any) {
    console.error('Error comparing prets:', error);
    const errorMessage = error.message || 'Erreur lors de la comparaison des prêts';
    console.error('Error details:', {
      message: errorMessage,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getMeilleuresOffres = async (req: Request, res: Response) => {
  try {
    const { typeCredit, limit = '5' } = req.query;

    const where: any = {
      disponible: true,
      OR: [
        { dateExpiration: null },
        { dateExpiration: { gt: new Date() } }
      ]
    };

    if (typeCredit) {
      where.typeCredit = typeCredit;
    }

    const offres = await prisma.offrePret.findMany({
      where,
      include: { comparateur: true },
      orderBy: { tauxEffectif: 'asc' },
      take: parseInt(limit as string)
    });

    res.json(offres);
  } catch (error) {
    console.error('Error fetching meilleures offres:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des meilleures offres' });
  }
};

// ========== TAUX MOYENS ==========

export const getTauxMoyens = async (req: Request, res: Response) => {
  try {
    const { duree } = req.query;
    const dureeMois = duree ? parseInt(duree as string) * 12 : 15 * 12; // Par défaut 15 ans

    const typesCredits = ['immobilier', 'consommation', 'professionnel'];
    const tauxMoyens = [];

    for (const typeCredit of typesCredits) {
      const offres = await prisma.offrePret.findMany({
        where: {
          typeCredit,
          disponible: true,
          dureeMin: { lte: dureeMois },
          dureeMax: { gte: dureeMois },
          OR: [
            { dateExpiration: null },
            { dateExpiration: { gt: new Date() } }
          ]
        }
      });

      if (offres.length > 0) {
        const tauxMoyen = offres.reduce((sum, offre) => sum + offre.tauxEffectif, 0) / offres.length;
        tauxMoyens.push({
          typeCredit,
          tauxMoyen: Math.round(tauxMoyen * 100) / 100,
          duree: Math.round(dureeMois / 12),
          dateMiseAJour: new Date(),
          nombreOffres: offres.length
        });
      }
    }

    res.json(tauxMoyens);
  } catch (error) {
    console.error('Error fetching taux moyens:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des taux moyens' });
  }
};
