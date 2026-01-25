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

const router = express.Router();

router.get('/', getAllLeads);
router.get('/stats', getLeadsStats);
router.get('/export', exportLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

export default router;
