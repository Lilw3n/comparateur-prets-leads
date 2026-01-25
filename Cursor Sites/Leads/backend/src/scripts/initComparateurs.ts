import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initComparateurs() {
  try {
    // Créer les comparateurs de base
    const comparateurs = [
      {
        nom: 'Comparateur Interne',
        type: 'INTERNE',
        actif: true,
        description: 'Comparateur interne avec nos propres offres'
      },
      {
        nom: 'Pretto',
        type: 'PRETTO',
        actif: true,
        url: 'https://www.pretto.fr',
        description: 'Comparateur de prêts immobiliers Pretto'
      },
      {
        nom: 'Meilleur Taux',
        type: 'MEILLEUR_TAUX',
        actif: true,
        url: 'https://www.meilleurtaux.com',
        description: 'Comparateur Meilleur Taux'
      },
      {
        nom: 'Meilleur Agents',
        type: 'MEILLEUR_AGENTS',
        actif: true,
        url: 'https://www.meilleuragents.com',
        description: 'Comparateur Meilleur Agents'
      }
    ];

    for (const comparateurData of comparateurs) {
      const existing = await prisma.comparateurPret.findFirst({
        where: { nom: comparateurData.nom }
      });

      if (!existing) {
        await prisma.comparateurPret.create({
          data: comparateurData
        });
        console.log(`✅ Comparateur créé: ${comparateurData.nom}`);
      } else {
        console.log(`⏭️  Comparateur déjà existant: ${comparateurData.nom}`);
      }
    }

    // Créer quelques offres d'exemple pour le comparateur interne
    const comparateurInterne = await prisma.comparateurPret.findFirst({
      where: { type: 'INTERNE' }
    });

    if (comparateurInterne) {
      const offresExemple = [
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Banque Populaire',
          nomProduit: 'Prêt Immobilier Classique',
          typeCredit: 'immobilier',
          montantMin: 50000,
          montantMax: 500000,
          dureeMin: 60,
          dureeMax: 300,
          tauxNominal: 2.1,
          tauxEffectif: 2.4,
          apportMin: 10,
          fraisDossier: 500,
          fraisGarantie: 0,
          assuranceObli: true,
          montantAssurance: 40,
          delaiTraitement: 15,
          disponible: true
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Crédit Agricole',
          nomProduit: 'Crédit Immobilier Avantage',
          typeCredit: 'immobilier',
          montantMin: 75000,
          montantMax: 600000,
          dureeMin: 84,
          dureeMax: 300,
          tauxNominal: 2.0,
          tauxEffectif: 2.3,
          apportMin: 15,
          fraisDossier: 800,
          fraisGarantie: 1000,
          assuranceObli: false,
          montantAssurance: null,
          delaiTraitement: 20,
          disponible: true
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'BNP Paribas',
          nomProduit: 'Prêt Immobilier Optimisé',
          typeCredit: 'immobilier',
          montantMin: 100000,
          montantMax: 800000,
          dureeMin: 120,
          dureeMax: 300,
          tauxNominal: 1.9,
          tauxEffectif: 2.2,
          apportMin: 20,
          fraisDossier: 1000,
          fraisGarantie: 0,
          assuranceObli: true,
          montantAssurance: 35,
          delaiTraitement: 12,
          disponible: true
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'Société Générale',
          nomProduit: 'Crédit Consommation Flex',
          typeCredit: 'consommation',
          montantMin: 1000,
          montantMax: 75000,
          dureeMin: 12,
          dureeMax: 84,
          tauxNominal: 3.5,
          tauxEffectif: 4.2,
          apportMin: 0,
          fraisDossier: 0,
          fraisGarantie: 0,
          assuranceObli: false,
          montantAssurance: null,
          delaiTraitement: 5,
          disponible: true
        },
        {
          comparateurId: comparateurInterne.id,
          nomBanque: 'LCL',
          nomProduit: 'Crédit Professionnel Pro',
          typeCredit: 'professionnel',
          montantMin: 10000,
          montantMax: 500000,
          dureeMin: 12,
          dureeMax: 120,
          tauxNominal: 2.8,
          tauxEffectif: 3.5,
          apportMin: 20,
          fraisDossier: 1500,
          fraisGarantie: 0,
          assuranceObli: false,
          montantAssurance: null,
          delaiTraitement: 10,
          disponible: true
        }
      ];

      for (const offreData of offresExemple) {
        const existing = await prisma.offrePret.findFirst({
          where: {
            comparateurId: offreData.comparateurId,
            nomBanque: offreData.nomBanque,
            nomProduit: offreData.nomProduit
          }
        });

        if (!existing) {
          await prisma.offrePret.create({
            data: offreData
          });
          console.log(`✅ Offre créée: ${offreData.nomBanque} - ${offreData.nomProduit}`);
        }
      }
    }

    console.log('✅ Initialisation terminée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initComparateurs();
