import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { sendContactEmail } from '../services/emailService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation rules
export const validateContact = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('typeDemande').isIn(['BIEN', 'PRET', 'ASSURANCE', 'CONTACT_GENERAL']).withMessage('Type de demande invalide'),
];

// Créer une demande de contact
export const createContact = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactData = req.body;

    // Envoyer l'email au courtier
    const emailResult = await sendContactEmail(contactData);

    if (!emailResult.success) {
      console.error('Erreur envoi email:', emailResult.message);
      // Continuer même si l'email échoue, on crée quand même le lead
    }

    // Créer un lead automatiquement dans la base de données
    let leadId = null;
    try {
      // Déterminer le secteur selon le type de demande
      const secteurMap: Record<string, string> = {
        BIEN: 'IMMOBILIER',
        PRET: 'CREDIT_IMMOBILIER',
        ASSURANCE: 'ASSURANCE',
        CONTACT_GENERAL: 'AUTRE',
      };

      const lead = await prisma.lead.create({
        data: {
          nom: contactData.nom,
          prenom: contactData.prenom,
          email: contactData.email,
          telephone: contactData.telephone || null,
          secteur: secteurMap[contactData.typeDemande] || 'AUTRE',
          statut: 'NOUVEAU',
          source: `Formulaire contact - ${contactData.typeDemande}`,
          typeCredit: contactData.typeDemande === 'PRET' ? 'immobilier' : null,
          montantCredit: contactData.montant || null,
          typeBien: contactData.typeBien || null,
          typeAssurance: contactData.typeAssurance || null,
          notes: contactData.message || `Demande de ${contactData.typeDemande}`,
        },
      });
      leadId = lead.id;
    } catch (leadError) {
      console.error('Erreur création lead:', leadError);
      // Continuer même si la création du lead échoue
    }

    res.status(201).json({
      success: true,
      message: 'Votre demande a été envoyée avec succès. Nous vous contacterons rapidement.',
      leadId,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l\'envoi de votre demande',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Health check pour le service de contact
export const contactHealth = async (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Contact service is running',
    courtierEmail: 'courtier972@gmail.com'
  });
};
