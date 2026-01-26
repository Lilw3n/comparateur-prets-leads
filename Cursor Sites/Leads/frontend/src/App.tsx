import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import ComparateurPrets from './pages/ComparateurPrets';
import AccueilComparateur from './pages/AccueilComparateur';
import SimulateurCapaciteEmprunt from './pages/SimulateurCapaciteEmprunt';
import SimulateurMensualites from './pages/SimulateurMensualites';
import Guides from './pages/Guides';
import Actualites from './pages/Actualites';
import CalculateurFraisNotaire from './pages/CalculateurFraisNotaire';
import CalculateurTauxEndettement from './pages/CalculateurTauxEndettement';
import AttestationFinancement from './pages/AttestationFinancement';
import MonDossier from './pages/MonDossier';
import RechercheBiens from './pages/RechercheBiens';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AccueilComparateur />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/comparateur" element={<AccueilComparateur />} />
          <Route path="/comparateur-prets" element={<ComparateurPrets />} />
          <Route path="/simulateurs/capacite-emprunt" element={<SimulateurCapaciteEmprunt />} />
          <Route path="/simulateurs/mensualites" element={<SimulateurMensualites />} />
          <Route path="/simulateurs/frais-notaire" element={<CalculateurFraisNotaire />} />
          <Route path="/simulateurs/taux-endettement" element={<CalculateurTauxEndettement />} />
          <Route path="/attestation-financement" element={<AttestationFinancement />} />
          <Route path="/mon-dossier" element={<MonDossier />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/actualites" element={<Actualites />} />
          <Route path="/recherche-biens" element={<RechercheBiens />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
