// Vercel Serverless Function - Point d'entrée pour toutes les routes API
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes compilées depuis le backend
// Note: Ces routes doivent être compilées en JavaScript avant le déploiement
try {
  const leadsRoutes = require('../backend/dist/routes/leads');
  const comparateursRoutes = require('../backend/dist/routes/comparateurs');
  const bankingRoutes = require('../backend/dist/routes/banking');
  const articlesRoutes = require('../backend/dist/routes/articles');
  const dossiersRoutes = require('../backend/dist/routes/dossiers');
  const contactRoutes = require('../backend/dist/routes/contact');

  // Routes
  app.use('/api/leads', leadsRoutes.default || leadsRoutes);
  app.use('/api', comparateursRoutes.default || comparateursRoutes);
  app.use('/api', bankingRoutes.default || bankingRoutes);
  app.use('/api/articles', articlesRoutes.default || articlesRoutes);
  app.use('/api/dossiers', dossiersRoutes.default || dossiersRoutes);
  app.use('/api/contact', contactRoutes.default || contactRoutes);
} catch (error) {
  console.error('Error loading routes:', error);
  // Fallback: routes simples si les routes compilées ne sont pas disponibles
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'API is running on Vercel',
      warning: 'Routes not fully loaded - backend may need to be built'
    });
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running on Vercel' });
});

// Export pour Vercel
module.exports = app;
