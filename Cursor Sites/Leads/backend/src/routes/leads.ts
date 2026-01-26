import express from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadsStats,
  exportLeads
} from '../controllers/leadsController';
import {
  genererLeadsSecteur,
  genererLeadsMultiples,
  genererLeadsTous,
  listerSecteurs
} from '../controllers/leadGeneratorController';

const router = express.Router();

// Routes de génération de leads
router.post('/generate/secteur', genererLeadsSecteur);
router.post('/generate/multiples', genererLeadsMultiples);
router.post('/generate/tous', genererLeadsTous);
router.get('/generate/secteurs', listerSecteurs);

// Routes standard
router.get('/', getAllLeads);
router.get('/stats', getLeadsStats);
router.get('/export', exportLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
