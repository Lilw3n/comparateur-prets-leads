import express from 'express';
import cors from 'cors';
import leadsRoutes from './routes/leads';
import comparateursRoutes from './routes/comparateurs';
import bankingRoutes from './routes/banking';
import articlesRoutes from './routes/articles';
import dossiersRoutes from './routes/dossiers';
import contactRoutes from './routes/contact';
import visitsRoutes from './routes/visits';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/leads', leadsRoutes);
app.use('/api', comparateursRoutes);
app.use('/api', bankingRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/dossiers', dossiersRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/visits', visitsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
