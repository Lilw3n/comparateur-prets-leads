import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Types
interface ComparisonData {
  montant: number;
  duree: number;
  typeCredit: string;
  apport?: number;
  revenus?: number;
  offres?: any[];
  meilleureOffre?: any;
}

interface LeadData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  secteur: string;
  budget?: number;
  typeBien?: string;
  typeCredit?: string;
  montantCredit?: number;
  localisation?: string;
  [key: string]: any;
}

interface BienSearchData {
  typeBien: string;
  localisation: string;
  budgetMin: number;
  budgetMax: number;
  surfaceMin?: number;
  nombrePieces?: number;
}

interface SimulatorData {
  typeSimulateur: string;
  donnees: Record<string, any>;
  resultats: Record<string, any>;
}

// Helper function to read template
function readTemplate(templateName: string): string {
  const templatePath = path.join(__dirname, '../templates/articles', templateName);
  try {
    return fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading template ${templateName}:`, error);
    return '';
  }
}

// Helper function to generate slug
function generateSlug(titre: string): string {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

// Helper function to replace template variables
function replaceVariables(template: string, variables: Record<string, any>): string {
  let content = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    content = content.replace(regex, String(value || ''));
  }
  
  return content;
}

// Generate article from comparison
export async function generateFromComparison(
  comparisonData: ComparisonData,
  leadId?: string
): Promise<string> {
  const template = readTemplate('comparaison-pret.md');
  if (!template) {
    throw new Error('Template not found');
  }

  const {
    montant,
    duree,
    typeCredit,
    apport = 10,
    revenus = 0,
    offres = [],
    meilleureOffre
  } = comparisonData;

  const dureeMois = duree * 12;
  const nombreOffres = offres.length || 5;
  
  // Calculate best offer details
  const meilleureBanque = meilleureOffre?.nomBanque || 'Banque A';
  const meilleurTaux = meilleureOffre?.tauxEffectif?.toFixed(2) || '3.50';
  const meilleureMensualite = meilleureOffre?.mensualite?.toFixed(2) || '1500';
  const meilleurCoutTotal = meilleureOffre?.coutTotal?.toFixed(2) || '180000';
  const meilleursFrais = (meilleureOffre?.fraisDossier || 0) + (meilleureOffre?.fraisGarantie || 0);
  const meilleurDelai = meilleureOffre?.delaiTraitement || 20;

  // Calculate market average (mock for now)
  const tauxMoyen = '3.75';
  const pourcentageRevenus = revenus > 0 ? ((parseFloat(meilleureMensualite) / revenus) * 100).toFixed(1) : '0';
  const evaluationTauxEndettement = parseFloat(pourcentageRevenus) < 33 ? 'conforme aux recommandations' : 'au-dessus des recommandations';

  // Generate other offers list
  const autresOffres = offres.slice(1, 4).map((offre, idx) => 
    `### ${idx + 2}. ${offre.nomBanque || `Banque ${String.fromCharCode(66 + idx)}`}\n` +
    `- **Taux TAEG** : ${offre.tauxEffectif?.toFixed(2) || '3.80'}%\n` +
    `- **Mensualité** : ${offre.mensualite?.toFixed(2) || '1520'}€\n` +
    `- **Coût total** : ${offre.coutTotal?.toFixed(2) || '182400'}€\n`
  ).join('\n');

  const variables = {
    montant: montant.toLocaleString('fr-FR'),
    duree,
    dureeMois,
    typeCredit: typeCredit === 'immobilier' ? 'crédit immobilier' : typeCredit,
    apport,
    revenus: revenus.toLocaleString('fr-FR'),
    nombreOffres,
    meilleureBanque,
    meilleurTaux,
    meilleureMensualite,
    meilleurCoutTotal,
    meilleursFrais: meilleursFrais.toFixed(2),
    meilleurDelai,
    raisonMeilleureOffre: `Cette offre présente le meilleur taux TAEG du marché (${meilleurTaux}%) avec des frais réduits et un délai de traitement rapide.`,
    listeAutresOffres: autresOffres || 'Aucune autre offre disponible.',
    tauxMoyen,
    comparaisonTauxMoyen: parseFloat(meilleurTaux) < parseFloat(tauxMoyen) ? 'inférieures' : 'supérieures',
    pourcentageRevenus,
    evaluationTauxEndettement,
    montantEmprunte: montant.toLocaleString('fr-FR'),
    interetsTotaux: (parseFloat(meilleurCoutTotal) - montant).toFixed(2),
    fraisTotaux: meilleursFrais.toFixed(2),
    conseilsPersonnalises: `Avec un apport de ${apport}%, vous êtes dans une bonne position pour négocier. Nous recommandons de comparer plusieurs offres et de ne pas hésiter à négocier le taux.`,
    dateGeneration: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const contenu = replaceVariables(template, variables);
  const titre = `Comparaison des meilleurs taux pour un prêt de ${montant.toLocaleString('fr-FR')}€ sur ${duree} ans`;
  const slug = await ensureUniqueSlug(generateSlug(titre));
  const resume = `Découvrez les meilleures offres de prêt ${typeCredit} pour un montant de ${montant.toLocaleString('fr-FR')}€ sur ${duree} ans. Comparaison détaillée avec analyse personnalisée.`;

  const article = await prisma.article.create({
    data: {
      titre,
      slug,
      contenu,
      resume,
      categorie: typeCredit === 'immobilier' ? 'CREDIT_IMMOBILIER' : 'CREDIT_CONSOMMATION',
      tags: JSON.stringify(['comparaison', 'prêt', typeCredit, `${montant}€`, `${duree} ans`]),
      auteur: 'Système',
      source: 'AUTO_GENERATED',
      sourceData: JSON.stringify({ comparisonData, leadId }),
      published: true,
      publishedAt: new Date(),
      seoTitle: `${titre} - Comparateur de prêts`,
      seoDescription: resume,
      keywords: `prêt ${typeCredit}, taux ${typeCredit}, comparateur prêt, meilleur taux, ${montant}€`,
      leadId: leadId || null
    }
  });

  return article.id;
}

// Generate article from lead
export async function generateFromLead(lead: LeadData): Promise<string> {
  const template = readTemplate('profil-personnalise.md');
  if (!template) {
    throw new Error('Template not found');
  }

  const {
    nom,
    prenom,
    secteur,
    budget,
    typeBien,
    localisation,
    typeCredit,
    montantCredit
  } = lead;

  const titreProfil = `Guide ${secteur} pour ${prenom}`;
  const variables = {
    titreProfil,
    prenom,
    nom,
    secteur: secteur.replace(/_/g, ' ').toLowerCase(),
    age: '35', // Mock
    situationFamiliale: 'En couple',
    nombreEnfants: '2',
    situationProfessionnelle: 'Salarié',
    anciennete: '5',
    revenusMensuels: '3500',
    revenusConjoint: '2800',
    chargesMensuelles: '1200',
    tauxEndettement: '20',
    typeProjet: typeBien || secteur,
    budget: budget ? budget.toLocaleString('fr-FR') : montantCredit?.toLocaleString('fr-FR') || '200000',
    localisation: localisation || 'Paris',
    objectif: 'Achat immobilier',
    pointsForts: `- Revenus stables\n- Apport disponible\n- Bon profil emprunteur`,
    pointsAttention: `- Vérifier la capacité d'emprunt\n- Comparer les offres\n- Négocier le taux`,
    capaciteEmprunt: budget ? (budget * 1.1).toLocaleString('fr-FR') : '220000',
    budgetMax: budget ? (budget * 1.2).toLocaleString('fr-FR') : '240000',
    apport: '15',
    recommandationsProjet: `Avec votre profil, vous pouvez envisager un projet jusqu'à ${budget ? (budget * 1.2).toLocaleString('fr-FR') : '240000'}€. Nous recommandons de comparer plusieurs offres avant de vous engager.`,
    optimisations: `- Augmenter votre apport si possible\n- Négocier le taux avec plusieurs banques\n- Comparer les assurances emprunteur`,
    dispositifsAdaptes: `- PTZ (Prêt à Taux Zéro) si éligible\n- Action Logement\n- Dispositif Pinel si investissement locatif`,
    meilleuresOffres: `Nous avons sélectionné les meilleures offres adaptées à votre profil. Utilisez notre comparateur pour les découvrir.`,
    etape1: `Rassemblez vos documents (pièce d'identité, justificatifs de revenus, avis d'imposition)`,
    etape2: `Utilisez notre comparateur pour trouver les meilleures offres`,
    etape3: `Comparez les offres en détail et négociez les taux`,
    etape4: `Choisissez l'offre qui vous convient le mieux et finalisez votre dossier`,
    dateGeneration: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const contenu = replaceVariables(template, variables);
  const titre = `Guide personnalisé ${secteur.replace(/_/g, ' ')} pour ${prenom} ${nom}`;
  const slug = await ensureUniqueSlug(generateSlug(titre));
  const resume = `Guide personnalisé pour votre projet ${secteur.replace(/_/g, ' ').toLowerCase()} avec des recommandations adaptées à votre profil.`;

  const article = await prisma.article.create({
    data: {
      titre,
      slug,
      contenu,
      resume,
      categorie: secteur,
      tags: JSON.stringify([secteur.toLowerCase(), 'guide', 'personnalisé', prenom]),
      auteur: 'Système',
      source: 'USER_DATA',
      sourceData: JSON.stringify({ leadId: lead.id }),
      published: true,
      publishedAt: new Date(),
      seoTitle: `${titre} - Guide personnalisé`,
      seoDescription: resume,
      keywords: `${secteur}, guide, ${prenom}, personnalisé`,
      leadId: lead.id
    }
  });

  return article.id;
}

// Generate article from property search
export async function generateFromBienSearch(
  searchData: BienSearchData,
  leadId?: string
): Promise<string> {
  const template = readTemplate('guide-achat-bien.md');
  if (!template) {
    throw new Error('Template not found');
  }

  const {
    typeBien,
    localisation,
    budgetMin,
    budgetMax,
    surfaceMin = 50,
    nombrePieces = 3
  } = searchData;

  const budget = (budgetMin + budgetMax) / 2;
  const prixM2 = Math.round(budget / (surfaceMin + 20));
  const categoriePrix = prixM2 < 3000 ? 'économique' : prixM2 < 5000 ? 'moyen' : 'élevé';

  const variables = {
    typeBien: typeBien || 'appartement',
    localisation,
    budget: budget.toLocaleString('fr-FR'),
    budgetMin: budgetMin.toLocaleString('fr-FR'),
    budgetMax: budgetMax.toLocaleString('fr-FR'),
    surfaceMin,
    nombrePieces,
    prixM2: prixM2.toLocaleString('fr-FR'),
    categoriePrix,
    evolutionPrix: `Les prix ont augmenté de 3% sur les 12 derniers mois dans cette zone.`,
    typesBiensDisponibles: `- Appartements : ${Math.round(budget / 4000)}m² en moyenne\n- Maisons : ${Math.round(budget / 3500)}m² en moyenne`,
    typeBien1: typeBien || 'appartements',
    surface1: Math.round(budget / 4000),
    typeBien2: 'maisons',
    surface2: Math.round(budget / 3500),
    conseilsQuartiers: `Les quartiers les plus recherchés à ${localisation} sont le centre-ville, les zones proches des transports et les quartiers résidentiels.`,
    montantEmprunt: (budget * 0.9).toLocaleString('fr-FR'),
    apport: '10',
    duree: '20',
    taux: '3.5',
    mensualite: Math.round((budget * 0.9 * 0.035 / 12) / (1 - Math.pow(1 + 0.035/12, -20*12))).toLocaleString('fr-FR'),
    dispositifsAides: `- PTZ si éligible\n- Action Logement\n- Aides locales selon la commune`,
    meilleursQuartiers: `1. Centre-ville : Prix moyen ${(prixM2 * 1.2).toLocaleString('fr-FR')}€/m²\n2. Quartier résidentiel : Prix moyen ${prixM2.toLocaleString('fr-FR')}€/m²\n3. Proche transports : Prix moyen ${(prixM2 * 1.1).toLocaleString('fr-FR')}€/m²`,
    fraisNotaire: Math.round(budget * 0.08).toLocaleString('fr-FR'),
    dateGeneration: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const contenu = replaceVariables(template, variables);
  const titre = `Guide d'achat : Trouver un ${typeBien || 'bien'} à ${localisation} avec un budget de ${budget.toLocaleString('fr-FR')}€`;
  const slug = await ensureUniqueSlug(generateSlug(titre));
  const resume = `Guide complet pour trouver votre ${typeBien || 'bien'} idéal à ${localisation} avec un budget de ${budgetMin.toLocaleString('fr-FR')}€ à ${budgetMax.toLocaleString('fr-FR')}€.`;

  const article = await prisma.article.create({
    data: {
      titre,
      slug,
      contenu,
      resume,
      categorie: 'IMMOBILIER',
      tags: JSON.stringify(['achat', 'immobilier', typeBien, localisation, `${budget}€`]),
      auteur: 'Système',
      source: 'AUTO_GENERATED',
      sourceData: JSON.stringify({ searchData, leadId }),
      published: true,
      publishedAt: new Date(),
      seoTitle: `${titre} - Guide immobilier`,
      seoDescription: resume,
      keywords: `achat ${typeBien}, ${localisation}, immobilier, guide achat, ${budget}€`,
      leadId: leadId || null
    }
  });

  return article.id;
}

// Generate article from simulator
export async function generateFromSimulator(
  simulatorData: SimulatorData,
  leadId?: string
): Promise<string> {
  const template = readTemplate('simulateur-guide.md');
  if (!template) {
    throw new Error('Template not found');
  }

  const { typeSimulateur, donnees, resultats } = simulatorData;

  const listeDonneesEntrees = Object.entries(donnees).map(([key, value]) => 
    `- **${key}** : ${value}`
  ).join('\n');

  const listeResultats = Object.entries(resultats).map(([key, value]) => 
    `- **${key}** : ${value}`
  ).join('\n');

  const variables = {
    typeSimulateur: typeSimulateur === 'capacite' ? 'Capacité d\'emprunt' : 
                    typeSimulateur === 'mensualites' ? 'Mensualités' : 
                    typeSimulateur === 'taux-endettement' ? 'Taux d\'endettement' : typeSimulateur,
    donneePrincipale: Object.values(donnees)[0] || 'vos données',
    listeDonneesEntrees,
    listeResultats,
    explicationFormule: typeSimulateur === 'capacite' 
      ? 'La capacité d\'emprunt se calcule en fonction de vos revenus, charges et du taux d\'endettement maximum (33%).'
      : typeSimulateur === 'mensualites'
      ? 'La mensualité se calcule avec la formule : M = C × (t/12) / (1 - (1 + t/12)^-n) où C est le capital, t le taux et n le nombre de mois.'
      : 'Le taux d\'endettement se calcule en divisant les charges par les revenus.',
    parametre1: Object.keys(donnees)[0] || 'Paramètre 1',
    valeur1: Object.values(donnees)[0] || 'Valeur 1',
    parametre2: Object.keys(donnees)[1] || 'Paramètre 2',
    valeur2: Object.values(donnees)[1] || 'Valeur 2',
    parametre3: Object.keys(donnees)[2] || 'Paramètre 3',
    valeur3: Object.values(donnees)[2] || 'Valeur 3',
    resultat: Object.values(resultats)[0] || 'Résultat',
    interpretationResultat: typeSimulateur === 'capacite'
      ? 'Cette capacité d\'emprunt vous permet d\'envisager un projet immobilier adapté à votre budget.'
      : typeSimulateur === 'mensualites'
      ? 'Cette mensualité représente un engagement financier sur la durée du prêt. Assurez-vous qu\'elle soit compatible avec votre budget.'
      : 'Ce taux d\'endettement doit rester sous les 33% pour être accepté par les banques.',
    positionnementMarche: 'dans la moyenne',
    conseilsOptimisation: typeSimulateur === 'capacite'
      ? '- Augmentez votre apport\n- Réduisez vos charges\n- Négociez un meilleur taux'
      : '- Comparez plusieurs offres\n- Négociez le taux\n- Optimisez la durée',
    pointAttention1: 'Les taux peuvent varier selon votre profil',
    pointAttention2: 'Les frais ne sont pas inclus dans le calcul de base',
    pointAttention3: 'Consultez un conseiller pour valider votre projet',
    question1: 'Puis-je négocier le taux',
    reponse1: 'Oui, il est toujours possible de négocier, surtout avec un bon profil.',
    question2: 'Quels documents sont nécessaires',
    reponse2: 'Pièce d\'identité, justificatifs de revenus, avis d\'imposition.',
    dateGeneration: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const contenu = replaceVariables(template, variables);
  const titre = `Guide : ${variables.typeSimulateur} - Comment calculer avec ${variables.donneePrincipale}`;
  const slug = await ensureUniqueSlug(generateSlug(titre));
  const resume = `Guide détaillé pour comprendre le calcul de ${variables.typeSimulateur.toLowerCase()} avec des exemples concrets.`;

  const article = await prisma.article.create({
    data: {
      titre,
      slug,
      contenu,
      resume,
      categorie: 'CREDIT_IMMOBILIER',
      tags: JSON.stringify(['simulateur', typeSimulateur, 'guide', 'calcul']),
      auteur: 'Système',
      source: 'AUTO_GENERATED',
      sourceData: JSON.stringify({ simulatorData, leadId }),
      published: true,
      publishedAt: new Date(),
      seoTitle: `${titre} - Guide simulateur`,
      seoDescription: resume,
      keywords: `simulateur ${typeSimulateur}, calcul ${typeSimulateur}, guide`,
      leadId: leadId || null
    }
  });

  return article.id;
}

// Generate market analysis article
export async function generateMarketAnalysis(
  typeCredit: string,
  periode: string,
  stats?: any
): Promise<string> {
  const template = readTemplate('analyse-marche.md');
  if (!template) {
    throw new Error('Template not found');
  }

  const tauxMoyen = stats?.tauxMoyen || '3.75';
  const evolutionTaux = stats?.evolution || 'stabilité';
  const nombreDonnees = stats?.nombreComparaisons || 1000;

  const variables = {
    typeCredit: typeCredit === 'immobilier' ? 'crédits immobiliers' : typeCredit,
    periode,
    tauxMoyen,
    evolutionTaux,
    evolution6Mois: `- Mois 1 : 3.80%\n- Mois 2 : 3.78%\n- Mois 3 : 3.75%\n- Mois 4 : 3.73%\n- Mois 5 : 3.75%\n- Mois 6 : ${tauxMoyen}%`,
    previsions: `Les taux devraient rester stables dans les prochains mois, avec une légère tendance à la baisse pour les meilleurs profils.`,
    profil1: 'Jeunes actifs avec apport > 20%',
    taux1: '3.20',
    profil2: 'Couples avec revenus stables',
    taux2: '3.50',
    profil3: 'Investisseurs locatifs',
    taux3: '3.80',
    facteursCles: `- Apport conséquent (> 20%)\n- Revenus stables\n- Bon historique bancaire\n- Taux d'endettement < 30%`,
    tauxPetit: '3.90',
    mensualitePetit: '650',
    analysePetit: 'Les petits prêts ont des taux légèrement plus élevés mais restent accessibles.',
    tauxMoyenMontant: tauxMoyen,
    mensualiteMoyen: '1200',
    analyseMoyen: 'Les prêts moyens bénéficient des meilleures conditions du marché.',
    tauxGros: '3.60',
    mensualiteGros: '2500',
    analyseGros: 'Les gros prêts bénéficient de taux préférentiels grâce au volume.',
    analyseParDuree: `- 15 ans : ${(parseFloat(tauxMoyen) - 0.2).toFixed(2)}%\n- 20 ans : ${tauxMoyen}%\n- 25 ans : ${(parseFloat(tauxMoyen) + 0.2).toFixed(2)}%\n- 30 ans : ${(parseFloat(tauxMoyen) + 0.4).toFixed(2)}%`,
    analyseRegions: `- Île-de-France : ${tauxMoyen}%\n- Provence-Alpes-Côte d'Azur : ${(parseFloat(tauxMoyen) + 0.1).toFixed(2)}%\n- Auvergne-Rhône-Alpes : ${tauxMoyen}%\n- Nouvelle-Aquitaine : ${(parseFloat(tauxMoyen) - 0.1).toFixed(2)}%`,
    conseilsMeilleurTaux: `- Comparez plusieurs offres\n- Négociez avec plusieurs banques\n- Augmentez votre apport si possible\n- Améliorez votre profil emprunteur`,
    conclusion: `Le marché des ${typeCredit === 'immobilier' ? 'crédits immobiliers' : typeCredit} reste dynamique avec des taux compétitifs. Les meilleurs profils peuvent obtenir des conditions très avantageuses.`,
    nombreDonnees,
    dateGeneration: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  };

  const contenu = replaceVariables(template, variables);
  const titre = `Analyse du Marché : Tendances des ${typeCredit === 'immobilier' ? 'crédits immobiliers' : typeCredit} en ${periode}`;
  const slug = await ensureUniqueSlug(generateSlug(titre));
  const resume = `Analyse complète des tendances du marché des ${typeCredit === 'immobilier' ? 'crédits immobiliers' : typeCredit} pour la période ${periode}, basée sur ${nombreDonnees} comparaisons.`;

  const article = await prisma.article.create({
    data: {
      titre,
      slug,
      contenu,
      resume,
      categorie: typeCredit === 'immobilier' ? 'CREDIT_IMMOBILIER' : 'CREDIT_CONSOMMATION',
      tags: JSON.stringify(['analyse', 'marché', typeCredit, periode]),
      auteur: 'Système',
      source: 'AUTO_GENERATED',
      sourceData: JSON.stringify({ typeCredit, periode, stats }),
      published: true,
      publishedAt: new Date(),
      seoTitle: `${titre} - Analyse marché`,
      seoDescription: resume,
      keywords: `taux ${typeCredit}, marché ${typeCredit}, analyse ${periode}, tendances`,
      leadId: null
    }
  });

  return article.id;
}

export default {
  generateFromComparison,
  generateFromLead,
  generateFromBienSearch,
  generateFromSimulator,
  generateMarketAnalysis
};
