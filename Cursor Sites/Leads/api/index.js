// Vercel Serverless Function - Point d'entrée pour toutes les routes API
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running on Vercel' });
});

// Note: Pour une architecture complète, les routes devraient être dans des fichiers séparés
// dans le dossier api/ (ex: api/leads.js, api/comparateurs.js)

module.exports = app;
