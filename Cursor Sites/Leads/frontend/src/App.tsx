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
import FormulaireDossierComplet from './pages/FormulaireDossierComplet';
import ListeDossiers from './pages/ListeDossiers';
import Presentation from './pages/Presentation';
import Assurance from './pages/Assurance';
import MentionsLegales from './pages/MentionsLegales';
import Confidentialite from './pages/Confidentialite';
import CGU from './pages/CGU';
import NosAutresSites from './pages/NosAutresSites';
import VisitsStats from './pages/VisitsStats';

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
          <Route path="/formulaire-dossier/:id?" element={<FormulaireDossierComplet />} />
          <Route path="/dossiers" element={<ListeDossiers />} />
          <Route path="/presentation" element={<Presentation />} />
          <Route path="/assurance" element={<Assurance />} />
          <Route path="/assurance/:type" element={<Assurance />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/nos-autres-sites" element={<NosAutresSites />} />
          <Route path="/visits-stats" element={<VisitsStats />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
