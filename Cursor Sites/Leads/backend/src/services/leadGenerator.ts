import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Liste complète des secteurs disponibles
export const SECTEURS = [
  // Vos secteurs principaux
  'IMMOBILIER',
  'ASSURANCE',
  'BANQUE_PRET',
  'MARCHE_FINANCIER',
  'GESTION_PATRIMOINE',
  'INVESTISSEMENT_FINANCIER',
  'COURTAGE_ASSURANCE',
  'CONSEIL_FINANCIER',
  
  // Prêts détaillés
  'CREDIT_CONSOMMATION',
  'CREDIT_IMMOBILIER',
  'CREDIT_PROFESSIONNEL',
  
  // Assurances détaillées
  'ASSURANCE_VIE',
  'ASSURANCE_HABITATION',
  'ASSURANCE_AUTO',
  'ASSURANCE_SANTE',
  'ASSURANCE_VL',
  
  // Investissements
  'SCPI',
  'PERP',
  'PEA',
  'INVESTISSEMENT_LOCATIF',
  
  // Fiscalité et optimisation
  'DEFISCALISATION',
  'FISCALITE',
  'SUCCESSION',
  'DONATION',
  
  // Immobilier détaillé
  'LMNP',
  'PINEL',
  'DEFICIT_FONCIER',
  'SCI',
  
  // Retraite et épargne
  'RETRAITE',
  'EPARGNE',
  
  // Autres
  'TRADING',
  'CRYPTO',
  'ENTREPRENEURIAT',
  'FORMATION_FINANCIERE',
  'CONSEIL_EN_PATRIMOINE',
  'MANDAT_MANAGEMENT',
  'AUTRE',
] as const;

// Prénoms français courants
const PRENOMS = [
  'Marie', 'Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'Alain', 'Bernard', 'François', 'Daniel',
  'Sophie', 'Isabelle', 'Nathalie', 'Catherine', 'Françoise', 'Monique', 'Martine', 'Christine', 'Sylvie', 'Valérie',
  'Thomas', 'Nicolas', 'Julien', 'Antoine', 'Guillaume', 'Maxime', 'Alexandre', 'David', 'Sébastien', 'Vincent',
  'Julie', 'Camille', 'Céline', 'Emilie', 'Laura', 'Pauline', 'Marion', 'Audrey', 'Claire', 'Sarah',
  'Lucas', 'Hugo', 'Louis', 'Léo', 'Gabriel', 'Raphaël', 'Arthur', 'Ethan', 'Noah', 'Adam',
  'Emma', 'Léa', 'Chloé', 'Manon', 'Inès', 'Lola', 'Zoé', 'Louise', 'Jade', 'Anna'
];

// Noms français courants
const NOMS = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
  'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
  'Morel', 'Girard', 'André', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez',
  'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas',
  'Perrin', 'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin'
];

// Domaines email courants
const DOMAINES_EMAIL = [
  'gmail.com', 'yahoo.fr', 'hotmail.com', 'outlook.fr', 'free.fr', 'orange.fr', 'wanadoo.fr',
  'laposte.net', 'sfr.fr', 'live.fr', 'icloud.com', 'protonmail.com', 'mail.com'
];

// Entreprises françaises
const ENTREPRISES = [
  'Total', 'Carrefour', 'Orange', 'EDF', 'Engie', 'BNP Paribas', 'Crédit Agricole', 'Société Générale',
  'LVMH', 'L\'Oréal', 'Danone', 'Sanofi', 'Airbus', 'Renault', 'Peugeot', 'Michelin',
  'Accor', 'Vinci', 'Bouygues', 'Veolia', 'Suez', 'Thales', 'Dassault', 'Atos',
  'Capgemini', 'Sopra Steria', 'Criteo', 'CACIB', 'Natixis', 'Crédit Mutuel', 'La Poste', 'SNCF'
];

// Sources de leads
const SOURCES = [
  'Site web', 'Réseaux sociaux', 'Recommandation', 'Salon professionnel', 'Publicité Google',
  'Publicité Facebook', 'Emailing', 'Télémarketing', 'Partenariat', 'Référencement naturel',
  'LinkedIn', 'Instagram', 'YouTube', 'Pinterest', 'TikTok', 'Campagne email', 'Webinaire',
  'Podcast', 'Blog', 'Forum', 'Comparateur', 'Annonce', 'Bouche à oreille', 'Autre'
];

// Données spécifiques par secteur
const DONNEES_PAR_SECTEUR: Record<string, any> = {
  IMMOBILIER: {
    budget: () => Math.floor(Math.random() * 500000) + 100000,
    typeBien: () => ['Appartement', 'Maison', 'Villa', 'Studio', 'Loft', 'Terrain'][Math.floor(Math.random() * 6)],
  },
  CREDIT_IMMOBILIER: {
    montantCredit: () => Math.floor(Math.random() * 400000) + 50000,
    typeCredit: 'immobilier',
  },
  CREDIT_CONSOMMATION: {
    montantCredit: () => Math.floor(Math.random() * 50000) + 1000,
    typeCredit: 'consommation',
  },
  CREDIT_PROFESSIONNEL: {
    montantCredit: () => Math.floor(Math.random() * 200000) + 10000,
    typeCredit: 'professionnel',
  },
  ASSURANCE_VIE: {
    typeAssurance: 'Vie',
  },
  ASSURANCE_HABITATION: {
    typeAssurance: 'Habitation',
  },
  ASSURANCE_AUTO: {
    typeAssurance: 'Auto',
  },
  ASSURANCE_SANTE: {
    typeAssurance: 'Santé',
  },
  INVESTISSEMENT_LOCATIF: {
    budget: () => Math.floor(Math.random() * 300000) + 80000,
    typeBien: () => ['Appartement', 'Maison', 'Studio'][Math.floor(Math.random() * 3)],
  },
  SCPI: {
    produitFinancier: 'SCPI',
  },
  PEA: {
    produitFinancier: 'PEA',
  },
  PERP: {
    produitFinancier: 'PERP',
  },
  PINEL: {
    typeBien: 'Appartement',
    budget: () => Math.floor(Math.random() * 200000) + 100000,
  },
  LMNP: {
    typeBien: 'Appartement',
    budget: () => Math.floor(Math.random() * 250000) + 100000,
  },
};

/**
 * Génère un email réaliste
 */
function genererEmail(prenom: string, nom: string): string {
  const formats = [
    `${prenom.toLowerCase()}.${nom.toLowerCase()}`,
    `${prenom.toLowerCase()}${nom.toLowerCase()}`,
    `${prenom.toLowerCase()}_${nom.toLowerCase()}`,
    `${prenom[0].toLowerCase()}${nom.toLowerCase()}`,
    `${prenom.toLowerCase()}${nom[0].toLowerCase()}`,
    `${prenom.toLowerCase()}${Math.floor(Math.random() * 99) + 1}`,
  ];
  const format = formats[Math.floor(Math.random() * formats.length)];
  const domaine = DOMAINES_EMAIL[Math.floor(Math.random() * DOMAINES_EMAIL.length)];
  return `${format}@${domaine}`;
}

/**
 * Génère un numéro de téléphone français réaliste
 */
function genererTelephone(): string {
  const prefixes = ['06', '07'];
  const prefix = prefixes[Math.floor(Math.random() * 2)];
  const numero = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `${prefix}${numero.substring(0, 2)} ${numero.substring(2, 4)} ${numero.substring(4, 6)} ${numero.substring(6, 8)}`;
}

/**
 * Génère un lead réaliste pour un secteur donné
 */
function genererLead(secteur: string, index: number = 0): any {
  const prenom = PRENOMS[Math.floor(Math.random() * PRENOMS.length)];
  const nom = NOMS[Math.floor(Math.random() * NOMS.length)];
  const email = genererEmail(prenom, nom);
  const telephone = Math.random() > 0.1 ? genererTelephone() : null; // 90% ont un téléphone
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
  const entreprise = Math.random() > 0.7 ? ENTREPRISES[Math.floor(Math.random() * ENTREPRISES.length)] : null;
  
  const lead: any = {
    nom,
    prenom,
    email: index > 0 ? `${email.split('@')[0]}+${index}@${email.split('@')[1]}` : email, // Évite les doublons
    telephone,
    secteur,
    statut: 'NOUVEAU',
    source,
    entreprise,
    notes: `Lead généré automatiquement pour le secteur ${secteur}`,
  };

  // Ajouter des données spécifiques au secteur
  const donneesSecteur = DONNEES_PAR_SECTEUR[secteur];
  if (donneesSecteur) {
    Object.keys(donneesSecteur).forEach(key => {
      const valeur = donneesSecteur[key];
      lead[key] = typeof valeur === 'function' ? valeur() : valeur;
    });
  }

  return lead;
}

/**
 * Génère plusieurs leads pour un secteur
 */
export async function genererLeadsPourSecteur(
  secteur: string,
  nombre: number = 10
): Promise<number> {
  const leads = [];
  
  for (let i = 0; i < nombre; i++) {
    leads.push(genererLead(secteur, i));
  }

  try {
    // SQLite ne supporte pas skipDuplicates, on utilise une approche alternative
    const result = await prisma.lead.createMany({
      data: leads
    });
    
    return result.count;
  } catch (error) {
    console.error(`Erreur lors de la génération de leads pour ${secteur}:`, error);
    throw error;
  }
}

/**
 * Génère des leads pour tous les secteurs
 */
export async function genererLeadsTousSecteurs(nombreParSecteur: number = 10): Promise<{
  secteur: string;
  generes: number;
  total: number;
}[]> {
  const resultats = [];
  let total = 0;

  for (const secteur of SECTEURS) {
    try {
      const generes = await genererLeadsPourSecteur(secteur, nombreParSecteur);
      total += generes;
      resultats.push({
        secteur,
        generes,
        total,
      });
    } catch (error) {
      console.error(`Erreur pour le secteur ${secteur}:`, error);
      resultats.push({
        secteur,
        generes: 0,
        total,
      });
    }
  }

  return resultats;
}

/**
 * Génère des leads pour plusieurs secteurs spécifiques
 */
export async function genererLeadsSecteurs(
  secteurs: string[],
  nombreParSecteur: number = 10
): Promise<{
  secteur: string;
  generes: number;
}[]> {
  const resultats = [];

  for (const secteur of secteurs) {
    try {
      const generes = await genererLeadsPourSecteur(secteur, nombreParSecteur);
      resultats.push({
        secteur,
        generes,
      });
    } catch (error) {
      console.error(`Erreur pour le secteur ${secteur}:`, error);
      resultats.push({
        secteur,
        generes: 0,
      });
    }
  }

  return resultats;
}

export default {
  genererLeadsPourSecteur,
  genererLeadsTousSecteurs,
  genererLeadsSecteurs,
  SECTEURS,
};
