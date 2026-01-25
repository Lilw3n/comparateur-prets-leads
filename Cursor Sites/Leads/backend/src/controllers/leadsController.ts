import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Validation rules
export const validateLead = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('secteur').isIn(['IMMOBILIER', 'ASSURANCE', 'BANQUE_PRET', 'MARCHE_FINANCIER']).withMessage('Secteur invalide'),
  body('statut').optional().isIn(['NOUVEAU', 'CONTACTE', 'CONVERTI', 'PERDU']).withMessage('Statut invalide'),
];

// Get all leads with filters
export const getAllLeads = async (req: Request, res: Response) => {
  try {
    const {
      secteur,
      statut,
      search,
      page = '1',
      limit = '50'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (secteur) {
      where.secteur = secteur;
    }

    if (statut) {
      where.statut = statut;
    }

    if (search) {
      where.OR = [
        { nom: { contains: search as string } },
        { prenom: { contains: search as string } },
        { email: { contains: search as string } },
        { telephone: { contains: search as string } },
        { entreprise: { contains: search as string } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({
      leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des leads' });
  }
};

// Get lead by ID
export const getLeadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead non trouvé' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du lead' });
  }
};

// Create lead
export const createLead = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lead = await prisma.lead.create({
      data: req.body,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Erreur lors de la création du lead' });
  }
};

// Update lead
export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: req.body,
    });

    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Lead non trouvé' });
    }
    res.status(500).json({ error: 'Erreur lors de la mise à jour du lead' });
  }
};

// Delete lead
export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lead.delete({
      where: { id },
    });

    res.json({ message: 'Lead supprimé avec succès' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Lead non trouvé' });
    }
    res.status(500).json({ error: 'Erreur lors de la suppression du lead' });
  }
};

// Get statistics
export const getLeadsStats = async (req: Request, res: Response) => {
  try {
    const [total, bySecteur, byStatut, recentLeads] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ['secteur'],
        _count: true,
      }),
      prisma.lead.groupBy({
        by: ['statut'],
        _count: true,
      }),
      prisma.lead.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const convertis = await prisma.lead.count({
      where: { statut: 'CONVERTI' },
    });

    const tauxConversion = total > 0 ? (convertis / total) * 100 : 0;

    res.json({
      total,
      tauxConversion: Math.round(tauxConversion * 100) / 100,
      bySecteur: bySecteur.reduce((acc, item) => {
        acc[item.secteur] = item._count;
        return acc;
      }, {} as Record<string, number>),
      byStatut: byStatut.reduce((acc, item) => {
        acc[item.statut] = item._count;
        return acc;
      }, {} as Record<string, number>),
      recentLeads,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};

// Export leads
export const exportLeads = async (req: Request, res: Response) => {
  try {
    const { secteur, statut, format = 'csv' } = req.query;

    const where: any = {};
    if (secteur) where.secteur = secteur;
    if (statut) where.statut = statut;

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      const headers = [
        'ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Secteur', 'Statut',
        'Source', 'Entreprise', 'Budget', 'Type Bien', 'Type Crédit',
        'Montant Crédit', 'Type Assurance', 'Produit Financier', 'Notes', 'Date Création'
      ];

      const csvRows = [
        headers.join(','),
        ...leads.map(lead =>
          [
            lead.id,
            `"${lead.nom}"`,
            `"${lead.prenom}"`,
            lead.email,
            lead.telephone || '',
            lead.secteur,
            lead.statut,
            lead.source || '',
            lead.entreprise || '',
            lead.budget || '',
            lead.typeBien || '',
            lead.typeCredit || '',
            lead.montantCredit || '',
            lead.typeAssurance || '',
            lead.produitFinancier || '',
            `"${(lead.notes || '').replace(/"/g, '""')}"`,
            lead.createdAt.toISOString(),
          ].join(',')
        ),
      ];

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
      res.send(csvRows.join('\n'));
    } else {
      res.json(leads);
    }
  } catch (error) {
    console.error('Error exporting leads:', error);
    res.status(500).json({ error: 'Erreur lors de l\'export des leads' });
  }
};
