import express from 'express';
import { createContact, contactHealth, validateContact } from '../controllers/contactController';

const router = express.Router();

router.get('/health', contactHealth);
router.post('/', validateContact, createContact);

export default router;
