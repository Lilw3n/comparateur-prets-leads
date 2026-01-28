import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Get all dossiers
export const getAllDossiers = async (req: Request, res: Response) => {
  try {
    const { statut, email, typePret } = req.query;
    
    const where: any = {};
    if (statut) where.statut = statut;
    if (email) where.emprunteurEmail = email as string;
    if (typePret) where.typePret = typePret as string;
    
    const dossiers = await prisma.dossierPret.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(dossiers);
  } catch (error) {
    console.error('Error fetching dossiers:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des dossiers' });
  }
};

// Get dossier by ID
export const getDossierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const dossier = await prisma.dossierPret.findUnique({
      where: { id }
    });
    
    if (!dossier) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }
    
    res.json(dossier);
  } catch (error) {
    console.error('Error fetching dossier:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du dossier' });
  }
};

// Get dossier by identifiant
export const getDossierByIdentifiant = async (req: Request, res: Response) => {
  try {
    const { identifiant } = req.params;
    const dossier = await prisma.dossierPret.findUnique({
      where: { identifiant }
    });
    
    if (!dossier) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }
    
    res.json(dossier);
  } catch (error) {
    console.error('Error fetching dossier:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du dossier' });
  }
};

// Get dossiers by email
export const getDossiersByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const dossiers = await prisma.dossierPret.findMany({
      where: { emprunteurEmail: email },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(dossiers);
  } catch (error) {
    console.error('Error fetching dossiers:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des dossiers' });
  }
};

// Get dossiers by statut
export const getDossiersByStatut = async (req: Request, res: Response) => {
  try {
    const { statut } = req.params;
    const dossiers = await prisma.dossierPret.findMany({
      where: { statut },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(dossiers);
  } catch (error) {
    console.error('Error fetching dossiers:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des dossiers' });
  }
};

// Create dossier
export const createDossier = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    // Générer un identifiant unique si non fourni
    if (!data.identifiant) {
      data.identifiant = `DOSSIER-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
    }
    
    // Convertir les arrays en JSON strings
    if (data.revenus && Array.isArray(data.revenus)) {
      data.revenus = JSON.stringify(data.revenus);
    }
    if (data.charges && Array.isArray(data.charges)) {
      data.charges = JSON.stringify(data.charges);
    }
    if (data.agesEnfants && Array.isArray(data.agesEnfants)) {
      data.agesEnfants = JSON.stringify(data.agesEnfants);
    }
    if (data.commentaires && Array.isArray(data.commentaires)) {
      data.commentaires = JSON.stringify(data.commentaires);
    }
    if (data.coEmprunteurData && typeof data.coEmprunteurData === 'object') {
      data.coEmprunteurData = JSON.stringify(data.coEmprunteurData);
    }
    if (data.emprunteurSituationPro && typeof data.emprunteurSituationPro === 'object') {
      data.emprunteurSituationPro = JSON.stringify(data.emprunteurSituationPro);
    }
    if (data.coEmprunteurSituationPro && typeof data.coEmprunteurSituationPro === 'object') {
      data.coEmprunteurSituationPro = JSON.stringify(data.coEmprunteurSituationPro);
    }
    
    // Créer un lead automatiquement si email fourni
    let leadId = null;
    if (data.emprunteurEmail) {
      try {
        const lead = await prisma.lead.create({
          data: {
            nom: data.emprunteurNom || '',
            prenom: data.emprunteurPrenom || '',
            email: data.emprunteurEmail,
            telephone: data.emprunteurTelephone || null,
            secteur: 'CREDIT_IMMOBILIER',
            statut: 'NOUVEAU',
            source: 'Formulaire dossier complet',
            typeCredit: data.typePret || null,
            montantCredit: data.montantSouhaite || null,
            notes: `Dossier créé: ${data.identifiant}`
          }
        });
        leadId = lead.id;
      } catch (leadError) {
        console.error('Error creating lead:', leadError);
        // Continue même si la création du lead échoue
      }
    }
    
    const dossier = await prisma.dossierPret.create({
      data: {
        ...data,
        leadId
      }
    });
    
    res.status(201).json(dossier);
  } catch (error) {
    console.error('Error creating dossier:', error);
    res.status(500).json({ error: 'Erreur lors de la création du dossier', details: error });
  }
};

// Update dossier
export const updateDossier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    // Convertir les arrays en JSON strings si nécessaire
    if (data.revenus && Array.isArray(data.revenus)) {
      data.revenus = JSON.stringify(data.revenus);
    }
    if (data.charges && Array.isArray(data.charges)) {
      data.charges = JSON.stringify(data.charges);
    }
    if (data.agesEnfants && Array.isArray(data.agesEnfants)) {
      data.agesEnfants = JSON.stringify(data.agesEnfants);
    }
    if (data.commentaires && Array.isArray(data.commentaires)) {
      data.commentaires = JSON.stringify(data.commentaires);
    }
    if (data.coEmprunteurData && typeof data.coEmprunteurData === 'object') {
      data.coEmprunteurData = JSON.stringify(data.coEmprunteurData);
    }
    if (data.emprunteurSituationPro && typeof data.emprunteurSituationPro === 'object') {
      data.emprunteurSituationPro = JSON.stringify(data.emprunteurSituationPro);
    }
    if (data.coEmprunteurSituationPro && typeof data.coEmprunteurSituationPro === 'object') {
      data.coEmprunteurSituationPro = JSON.stringify(data.coEmprunteurSituationPro);
    }
    
    const dossier = await prisma.dossierPret.update({
      where: { id },
      data
    });
    
    res.json(dossier);
  } catch (error) {
    console.error('Error updating dossier:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du dossier' });
  }
};

// Delete dossier
export const deleteDossier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.dossierPret.delete({
      where: { id }
    });
    
    res.json({ message: 'Dossier supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting dossier:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du dossier' });
  }
};
