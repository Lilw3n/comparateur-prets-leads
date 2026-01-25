import express from 'express';
import {
  getAllComparateurs,
  getComparateurById,
  createComparateur,
  updateComparateur,
  deleteComparateur,
  getAllOffres,
  createOffre,
  updateOffre,
  deleteOffre,
  comparerPrets,
  getMeilleuresOffres,
  getTauxMoyens
} from '../controllers/comparateursController';

const router = express.Router();

// Routes pour les comparateurs
router.get('/comparateurs', getAllComparateurs);
router.get('/comparateurs/:id', getComparateurById);
router.post('/comparateurs', createComparateur);
router.put('/comparateurs/:id', updateComparateur);
router.delete('/comparateurs/:id', deleteComparateur);

// Routes pour les offres
router.get('/offres', getAllOffres);
router.post('/offres', createOffre);
router.put('/offres/:id', updateOffre);
router.delete('/offres/:id', deleteOffre);

// Routes pour la comparaison
router.post('/comparer', comparerPrets);
router.get('/meilleures-offres', getMeilleuresOffres);
router.get('/taux-moyens', getTauxMoyens);

export default router;
