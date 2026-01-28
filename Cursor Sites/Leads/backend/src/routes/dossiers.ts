import express from 'express';
import {
  getAllDossiers,
  getDossierById,
  getDossierByIdentifiant,
  createDossier,
  updateDossier,
  deleteDossier,
  getDossiersByEmail,
  getDossiersByStatut
} from '../controllers/dossiersController';

const router = express.Router();

router.get('/', getAllDossiers);
router.get('/email/:email', getDossiersByEmail);
router.get('/statut/:statut', getDossiersByStatut);
router.get('/identifiant/:identifiant', getDossierByIdentifiant);
router.get('/:id', getDossierById);
router.post('/', createDossier);
router.put('/:id', updateDossier);
router.delete('/:id', deleteDossier);

export default router;
