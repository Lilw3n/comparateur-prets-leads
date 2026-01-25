// Vercel Serverless Function pour le backend
// Ce fichier sera déployé comme fonction serverless sur Vercel

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes
const leadsRoutes = require('../backend/src/routes/leads');
const comparateursRoutes = require('../backend/src/routes/comparateurs');
const bankingRoutes = require('../backend/src/routes/banking');

// Routes
app.use('/api/leads', leadsRoutes);
app.use('/api', comparateursRoutes);
app.use('/api', bankingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Export pour Vercel
module.exports = app;
