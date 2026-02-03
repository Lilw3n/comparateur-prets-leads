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
  const visitsRoutes = require('../backend/dist/routes/visits');

  // Routes - Gérer les exports CommonJS et ES6
  const getRouter = (routeModule) => {
    if (routeModule && routeModule.default) return routeModule.default;
    if (typeof routeModule === 'function') return routeModule;
    return routeModule;
  };

  try {
    app.use('/api/leads', getRouter(leadsRoutes));
    app.use('/api', getRouter(comparateursRoutes));
    app.use('/api', getRouter(bankingRoutes));
    app.use('/api/articles', getRouter(articlesRoutes));
    app.use('/api/dossiers', getRouter(dossiersRoutes));
    app.use('/api/contact', getRouter(contactRoutes));
    app.use('/api/visits', getRouter(visitsRoutes));
    console.log('✅ Routes chargées avec succès');
  } catch (routeError) {
    console.error('❌ Erreur lors du montage des routes:', routeError);
  }
} catch (error) {
  console.error('❌ Error loading routes:', error);
  console.error('Error stack:', error.stack);
  // Fallback: routes simples si les routes compilées ne sont pas disponibles
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'API is running on Vercel',
      warning: 'Routes not fully loaded - backend may need to be built',
      error: error.message
    });
  });
  
  // Route de test pour le comparateur
  app.post('/api/comparer', (req, res) => {
    console.log('Test endpoint /api/comparer appelé');
    res.json({
      comparaison: null,
      offres: [
        {
          id: 'test-1',
          nomBanque: 'Pretto',
          nomProduit: 'Prêt Immobilier Optimisé',
          typeCredit: req.body.typeCredit || 'immobilier',
          tauxEffectif: 2.8,
          mensualite: 1000,
          score: 2.8,
          comparateur: { nom: 'Pretto' }
        }
      ],
      meilleureOffre: {
        id: 'test-1',
        nomBanque: 'Pretto',
        tauxEffectif: 2.8
      },
      message: 'Mode fallback - routes non chargées'
    });
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running on Vercel' });
});

// Export pour Vercel
module.exports = app;
