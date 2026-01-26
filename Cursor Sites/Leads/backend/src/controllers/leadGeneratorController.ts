import { Request, Response } from 'express';
import leadGenerator, { SECTEURS } from '../services/leadGenerator';

/**
 * Génère des leads pour un secteur spécifique
 */
export const genererLeadsSecteur = async (req: Request, res: Response) => {
  try {
    const { secteur, nombre = 10 } = req.body;

    if (!secteur) {
      return res.status(400).json({ error: 'Le secteur est requis' });
    }

    if (!SECTEURS.includes(secteur as any)) {
      return res.status(400).json({ error: 'Secteur invalide' });
    }

    const nombreNum = parseInt(nombre as string) || 10;
    if (nombreNum < 1 || nombreNum > 1000) {
      return res.status(400).json({ error: 'Le nombre doit être entre 1 et 1000' });
    }

    const generes = await leadGenerator.genererLeadsPourSecteur(secteur, nombreNum);

    res.json({
      success: true,
      secteur,
      generes,
      message: `${generes} leads générés pour le secteur ${secteur}`,
    });
  } catch (error) {
    console.error('Erreur lors de la génération de leads:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des leads' });
  }
};

/**
 * Génère des leads pour plusieurs secteurs
 */
export const genererLeadsMultiples = async (req: Request, res: Response) => {
  try {
    const { secteurs, nombreParSecteur = 10 } = req.body;

    if (!secteurs || !Array.isArray(secteurs) || secteurs.length === 0) {
      return res.status(400).json({ error: 'La liste des secteurs est requise' });
    }

    const nombreNum = parseInt(nombreParSecteur as string) || 10;
    if (nombreNum < 1 || nombreNum > 1000) {
      return res.status(400).json({ error: 'Le nombre doit être entre 1 et 1000' });
    }

    // Vérifier que tous les secteurs sont valides
    const secteursInvalides = secteurs.filter(s => !SECTEURS.includes(s as any));
    if (secteursInvalides.length > 0) {
      return res.status(400).json({
        error: `Secteurs invalides: ${secteursInvalides.join(', ')}`,
      });
    }

    const resultats = await leadGenerator.genererLeadsSecteurs(secteurs, nombreNum);

    const total = resultats.reduce((sum, r) => sum + r.generes, 0);

    res.json({
      success: true,
      resultats,
      total,
      message: `${total} leads générés au total`,
    });
  } catch (error) {
    console.error('Erreur lors de la génération de leads:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des leads' });
  }
};

/**
 * Génère des leads pour tous les secteurs
 */
export const genererLeadsTous = async (req: Request, res: Response) => {
  try {
    const { nombreParSecteur = 10 } = req.body;

    const nombreNum = parseInt(nombreParSecteur as string) || 10;
    if (nombreNum < 1 || nombreNum > 100) {
      return res.status(400).json({ error: 'Le nombre doit être entre 1 et 100 par secteur' });
    }

    const resultats = await leadGenerator.genererLeadsTousSecteurs(nombreNum);

    const total = resultats.reduce((sum, r) => sum + r.generes, 0);

    res.json({
      success: true,
      resultats,
      total,
      message: `${total} leads générés pour tous les secteurs`,
    });
  } catch (error) {
    console.error('Erreur lors de la génération de leads:', error);
    res.status(500).json({ error: 'Erreur lors de la génération des leads' });
  }
};

/**
 * Liste tous les secteurs disponibles
 */
export const listerSecteurs = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      secteurs: SECTEURS,
      total: SECTEURS.length,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des secteurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des secteurs' });
  }
};
