import { useState, useEffect } from 'react';
import { 
  CheckCircle, User, Home, FileText, Calendar, Mail, Phone, Building2, 
  Users, Plus, Trash2, Euro, Briefcase, CreditCard, Building2 as Bank, AlertCircle,
  Save, Send, Download, FileText as FileIcon
} from 'lucide-react';
import LeadCaptureService from '../services/leadCapture';
import { Secteur } from '../types';
import { dossiersService } from '../services/dossiersApi';
import { useParams, useNavigate } from 'react-router-dom';

interface FormulaireDossierCompletProps {
  dossierId?: string;
  onSave?: (data: any) => void;
  onSend?: (data: any) => void;
}

export default function FormulaireDossierComplet({ dossierId: propDossierId, onSave, onSend }: FormulaireDossierCompletProps) {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const dossierId = propDossierId || id;
  const [loading, setLoading] = useState(false);

  // Charger le dossier existant si un ID est fourni
  useEffect(() => {
    const loadDossier = async () => {
      if (dossierId) {
        try {
          setLoading(true);
          const dossier = await dossiersService.getById(dossierId);
          
          // Remplir le formulaire avec les données du dossier
          setFormData(prev => ({
            ...prev,
            identifiant: dossier.identifiant,
            gestionnaireDossier: dossier.gestionnaireDossier,
            typePret: dossier.typePret,
            montantSouhaite: dossier.montantSouhaite.toString(),
            dureeSouhaitee: dossier.dureeSouhaitee.toString(),
            apportPersonnel: dossier.apportPersonnel?.toString() || '',
            finalite: dossier.finalite || '',
            natureBien: dossier.natureBien || '',
            travaux: dossier.travaux,
            emprunteurCivilite: dossier.emprunteurCivilite,
            emprunteurNom: dossier.emprunteurNom,
            emprunteurPrenom: dossier.emprunteurPrenom,
            emprunteurDateNaissance: dossier.emprunteurDateNaissance ? new Date(dossier.emprunteurDateNaissance).toISOString().split('T')[0] : '',
            emprunteurLieuNaissance: dossier.emprunteurLieuNaissance || '',
            emprunteurNationalite: dossier.emprunteurNationalite || '',
            emprunteurSituationFamiliale: dossier.emprunteurSituationFamiliale || '',
            emprunteurNombreEnfants: dossier.emprunteurNombreEnfants?.toString() || '',
            emprunteurAdresse: dossier.emprunteurAdresse || '',
            emprunteurCodePostal: dossier.emprunteurCodePostal || '',
            emprunteurVille: dossier.emprunteurVille || '',
            emprunteurPays: dossier.emprunteurPays || '',
            emprunteurEmail: dossier.emprunteurEmail,
            emprunteurTelephone: dossier.emprunteurTelephone || '',
            situationFamiliale: dossier.situationFamiliale || '',
            nomConjoint: dossier.nomConjoint || '',
            prenomConjoint: dossier.prenomConjoint || '',
            dateNaissanceConjoint: dossier.dateNaissanceConjoint ? new Date(dossier.dateNaissanceConjoint).toISOString().split('T')[0] : '',
            regimeMatrimonial: dossier.regimeMatrimonial || '',
            enfantsCharge: dossier.enfantsCharge,
            agesEnfants: dossier.agesEnfants ? JSON.parse(dossier.agesEnfants) : [],
            situationFiscale: dossier.situationFiscale || '',
            nombrePartsFiscales: dossier.nombrePartsFiscales?.toString() || '',
            revenusMensuelsFoyer: dossier.revenusMensuelsFoyer?.toString() || '',
            statutLogement: dossier.statutLogement || '',
            loyerMensuel: dossier.loyerMensuel?.toString() || '',
            adresseLogement: dossier.adresseLogement || '',
            codePostalLogement: dossier.codePostalLogement || '',
            villeLogement: dossier.villeLogement || '',
            typeLogement: dossier.typeLogement || '',
            usageLogement: dossier.usageLogement || '',
            depuisQuandLogement: dossier.depuisQuandLogement || '',
            nomBanque: dossier.nomBanque || '',
            numeroCompte: dossier.numeroCompte || '',
            depuisQuandBanque: dossier.depuisQuandBanque || '',
            statutCompte: dossier.statutCompte || '',
            montantDecouvert: dossier.montantDecouvert?.toString() || '',
            informationsComplementaires: dossier.informationsComplementaires || '',
            commentaires: dossier.commentaires ? JSON.parse(dossier.commentaires) : []
          }));

          // Charger les revenus et charges
          if (dossier.revenus) {
            setRevenus(JSON.parse(dossier.revenus));
          }
          if (dossier.charges) {
            setCharges(JSON.parse(dossier.charges));
          }

          // Charger les données du co-emprunteur
          if (dossier.coEmprunteurData) {
            const coEmprunteurData = JSON.parse(dossier.coEmprunteurData);
            setHasCoEmprunteur(true);
            setFormData(prev => ({
              ...prev,
              coEmprunteurCivilite: coEmprunteurData.civilite || 'Mme.',
              coEmprunteurNom: coEmprunteurData.nom || '',
              coEmprunteurPrenom: coEmprunteurData.prenom || '',
              coEmprunteurDateNaissance: coEmprunteurData.dateNaissance ? new Date(coEmprunteurData.dateNaissance).toISOString().split('T')[0] : '',
              coEmprunteurLieuNaissance: coEmprunteurData.lieuNaissance || '',
              coEmprunteurNationalite: coEmprunteurData.nationalite || '',
              coEmprunteurSituationFamiliale: coEmprunteurData.situationFamiliale || '',
              coEmprunteurNombreEnfants: coEmprunteurData.nombreEnfants?.toString() || '',
              coEmprunteurAdresse: coEmprunteurData.adresse || '',
              coEmprunteurCodePostal: coEmprunteurData.codePostal || '',
              coEmprunteurVille: coEmprunteurData.ville || '',
              coEmprunteurPays: coEmprunteurData.pays || '',
              coEmprunteurEmail: coEmprunteurData.email || '',
              coEmprunteurTelephone: coEmprunteurData.telephone || ''
            }));
          }

          // Charger les situations professionnelles
          if (dossier.emprunteurSituationPro) {
            const situationPro = JSON.parse(dossier.emprunteurSituationPro);
            setFormData(prev => ({
              ...prev,
              emprunteurStatut: situationPro.statut || '',
              emprunteurEmployeur: situationPro.employeur || '',
              emprunteurDateEmbauche: situationPro.dateEmbauche ? new Date(situationPro.dateEmbauche).toISOString().split('T')[0] : '',
              emprunteurRevenusNets: situationPro.revenusNets?.toString() || '',
              emprunteurTypeContrat: situationPro.typeContrat || '',
              emprunteurAnciennete: situationPro.anciennete || '',
              emprunteurAdressePro: situationPro.adressePro || '',
              emprunteurCodePostalPro: situationPro.codePostalPro || '',
              emprunteurVillePro: situationPro.villePro || '',
              emprunteurFonction: situationPro.fonction || '',
              emprunteurDepuisQuand: situationPro.depuisQuand || ''
            }));
          }

          if (dossier.coEmprunteurSituationPro) {
            const coSituationPro = JSON.parse(dossier.coEmprunteurSituationPro);
            setFormData(prev => ({
              ...prev,
              coEmprunteurStatut: coSituationPro.statut || '',
              coEmprunteurEmployeur: coSituationPro.employeur || '',
              coEmprunteurDateEmbauche: coSituationPro.dateEmbauche ? new Date(coSituationPro.dateEmbauche).toISOString().split('T')[0] : '',
              coEmprunteurRevenusNets: coSituationPro.revenusNets?.toString() || '',
              coEmprunteurTypeContrat: coSituationPro.typeContrat || '',
              coEmprunteurAnciennete: coSituationPro.anciennete || '',
              coEmprunteurAdressePro: coSituationPro.adressePro || '',
              coEmprunteurCodePostalPro: coSituationPro.codePostalPro || '',
              coEmprunteurVillePro: coSituationPro.villePro || '',
              coEmprunteurFonction: coSituationPro.fonction || '',
              coEmprunteurDepuisQuand: coSituationPro.depuisQuand || ''
            }));
          }
        } catch (error) {
          console.error('Error loading dossier:', error);
          alert('Erreur lors du chargement du dossier');
        } finally {
          setLoading(false);
        }
      }
    };

    loadDossier();
  }, [dossierId]);
  const [currentSection, setCurrentSection] = useState(1);
  const [hasCoEmprunteur, setHasCoEmprunteur] = useState(false);
  const [hasAutresBiens, setHasAutresBiens] = useState(false);
  const [hasBiensFinanciers, setHasBiensFinanciers] = useState(false);
  const [hasCreditsConso, setHasCreditsConso] = useState(false);
  const [hasRetard, setHasRetard] = useState(false);
  
  const [revenus, setRevenus] = useState<Array<{type: string; montant: number; periodicite: string; justificatif: string}>>([
    { type: 'Salaire net', montant: 0, periodicite: 'Mensuel', justificatif: '' }
  ]);
  
  const [charges, setCharges] = useState<Array<{type: string; montant: number; periodicite: string; crediteur: string}>>([
    { type: 'Loyer/Mensualités de prêt', montant: 0, periodicite: 'Mensuel', crediteur: '' }
  ]);

  const [formData, setFormData] = useState({
    // Responsable de dossier
    gestionnaireDossier: true,
    identifiant: dossierId || 'Dossier prêt',
    
    // Le Projet
    typePret: '',
    montantSouhaite: '',
    dureeSouhaitee: '',
    apportPersonnel: '',
    finalite: '',
    natureBien: '',
    travaux: false,
    
    // Emprunteur
    emprunteurCivilite: 'Mme.',
    emprunteurNom: '',
    emprunteurPrenom: '',
    emprunteurDateNaissance: '',
    emprunteurLieuNaissance: '',
    emprunteurNationalite: '',
    emprunteurSituationFamiliale: '',
    emprunteurNombreEnfants: '',
    emprunteurAdresse: '',
    emprunteurCodePostal: '',
    emprunteurVille: '',
    emprunteurPays: 'France',
    emprunteurEmail: '',
    emprunteurTelephone: '',
    
    // Co-emprunteur
    coEmprunteurCivilite: 'Mme.',
    coEmprunteurNom: '',
    coEmprunteurPrenom: '',
    coEmprunteurDateNaissance: '',
    coEmprunteurLieuNaissance: '',
    coEmprunteurNationalite: '',
    coEmprunteurSituationFamiliale: '',
    coEmprunteurNombreEnfants: '',
    coEmprunteurAdresse: '',
    coEmprunteurCodePostal: '',
    coEmprunteurVille: '',
    coEmprunteurPays: 'France',
    coEmprunteurEmail: '',
    coEmprunteurTelephone: '',
    
    // Situation de famille
    situationFamiliale: '',
    nomConjoint: '',
    prenomConjoint: '',
    dateNaissanceConjoint: '',
    regimeMatrimonial: '',
    enfantsCharge: false,
    agesEnfants: [] as string[],
    situationFiscale: '',
    nombrePartsFiscales: '',
    revenusMensuelsFoyer: '',
    
    // Logement
    statutLogement: '',
    loyerMensuel: '',
    adresseLogement: '',
    codePostalLogement: '',
    villeLogement: '',
    typeLogement: '',
    usageLogement: '',
    depuisQuandLogement: '',
    
    // Situation professionnelle Emprunteur
    emprunteurStatut: '',
    emprunteurEmployeur: '',
    emprunteurDateEmbauche: '',
    emprunteurRevenusNets: '',
    emprunteurTypeContrat: '',
    emprunteurAnciennete: '',
    emprunteurAdressePro: '',
    emprunteurCodePostalPro: '',
    emprunteurVillePro: '',
    emprunteurFonction: '',
    emprunteurDepuisQuand: '',
    
    // Situation professionnelle Co-emprunteur
    coEmprunteurStatut: '',
    coEmprunteurEmployeur: '',
    coEmprunteurDateEmbauche: '',
    coEmprunteurRevenusNets: '',
    coEmprunteurTypeContrat: '',
    coEmprunteurAnciennete: '',
    coEmprunteurAdressePro: '',
    coEmprunteurCodePostalPro: '',
    coEmprunteurVillePro: '',
    coEmprunteurFonction: '',
    coEmprunteurDepuisQuand: '',
    
    // Banque
    nomBanque: '',
    numeroCompte: '',
    depuisQuandBanque: '',
    statutCompte: '',
    montantDecouvert: '',
    
    // Informations complémentaires
    informationsComplementaires: '',
    commentaires: [] as string[]
  });

  const sections = [
    { id: 1, title: 'Responsable de dossier', icon: User },
    { id: 2, title: 'Le Projet', icon: Home },
    { id: 3, title: 'Emprunteur', icon: User },
    { id: 4, title: 'Co-emprunteur', icon: Users },
    { id: 5, title: 'Situation de Famille', icon: Users },
    { id: 6, title: 'Votre Logement', icon: Home },
    { id: 7, title: 'Autres Biens Immobiliers', icon: Building2 },
    { id: 8, title: 'Biens Financiers', icon: CreditCard },
    { id: 9, title: 'Crédits Consommation', icon: CreditCard },
    { id: 10, title: 'Votre Banque', icon: Bank },
    { id: 11, title: 'Retard', icon: AlertCircle },
    { id: 12, title: 'Situation Professionnelle', icon: Briefcase },
    { id: 13, title: 'Revenus Mensuels', icon: Euro },
    { id: 14, title: 'Charges Mensuelles', icon: Euro },
    { id: 15, title: 'Résultat Simulation', icon: FileText }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRevenu = () => {
    setRevenus([...revenus, { type: '', montant: 0, periodicite: 'Mensuel', justificatif: '' }]);
  };

  const handleRemoveRevenu = (index: number) => {
    setRevenus(revenus.filter((_, i) => i !== index));
  };

  const handleRevenuChange = (index: number, field: string, value: any) => {
    const newRevenus = [...revenus];
    newRevenus[index] = { ...newRevenus[index], [field]: value };
    setRevenus(newRevenus);
  };

  const handleAddCharge = () => {
    setCharges([...charges, { type: '', montant: 0, periodicite: 'Mensuel', crediteur: '' }]);
  };

  const handleRemoveCharge = (index: number) => {
    setCharges(charges.filter((_, i) => i !== index));
  };

  const handleChargeChange = (index: number, field: string, value: any) => {
    const newCharges = [...charges];
    newCharges[index] = { ...newCharges[index], [field]: value };
    setCharges(newCharges);
  };

  const handleAddCommentaire = () => {
    const commentaire = prompt('Ajouter un commentaire lié au dossier:');
    if (commentaire) {
      setFormData(prev => ({
        ...prev,
        commentaires: [...prev.commentaires, commentaire]
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Préparer les données du co-emprunteur en JSON
      const coEmprunteurData = hasCoEmprunteur ? {
        civilite: formData.coEmprunteurCivilite,
        nom: formData.coEmprunteurNom,
        prenom: formData.coEmprunteurPrenom,
        dateNaissance: formData.coEmprunteurDateNaissance,
        lieuNaissance: formData.coEmprunteurLieuNaissance,
        nationalite: formData.coEmprunteurNationalite,
        situationFamiliale: formData.coEmprunteurSituationFamiliale,
        nombreEnfants: formData.coEmprunteurNombreEnfants,
        adresse: formData.coEmprunteurAdresse,
        codePostal: formData.coEmprunteurCodePostal,
        ville: formData.coEmprunteurVille,
        pays: formData.coEmprunteurPays,
        email: formData.coEmprunteurEmail,
        telephone: formData.coEmprunteurTelephone
      } : null;

      // Préparer les données de situation professionnelle
      const emprunteurSituationPro = {
        statut: formData.emprunteurStatut,
        employeur: formData.emprunteurEmployeur,
        dateEmbauche: formData.emprunteurDateEmbauche,
        revenusNets: formData.emprunteurRevenusNets,
        typeContrat: formData.emprunteurTypeContrat,
        anciennete: formData.emprunteurAnciennete,
        adressePro: formData.emprunteurAdressePro,
        codePostalPro: formData.emprunteurCodePostalPro,
        villePro: formData.emprunteurVillePro,
        fonction: formData.emprunteurFonction,
        depuisQuand: formData.emprunteurDepuisQuand
      };

      const coEmprunteurSituationPro = hasCoEmprunteur ? {
        statut: formData.coEmprunteurStatut,
        employeur: formData.coEmprunteurEmployeur,
        dateEmbauche: formData.coEmprunteurDateEmbauche,
        revenusNets: formData.coEmprunteurRevenusNets,
        typeContrat: formData.coEmprunteurTypeContrat,
        anciennete: formData.coEmprunteurAnciennete,
        adressePro: formData.coEmprunteurAdressePro,
        codePostalPro: formData.coEmprunteurCodePostalPro,
        villePro: formData.coEmprunteurVillePro,
        fonction: formData.coEmprunteurFonction,
        depuisQuand: formData.coEmprunteurDepuisQuand
      } : null;

      const allData = {
        ...formData,
        revenus,
        charges,
        coEmprunteurData,
        emprunteurSituationPro,
        coEmprunteurSituationPro,
        // Convertir les dates en format ISO
        emprunteurDateNaissance: formData.emprunteurDateNaissance || undefined,
        dateNaissanceConjoint: formData.dateNaissanceConjoint || undefined,
        emprunteurDateEmbauche: formData.emprunteurDateEmbauche || undefined,
        coEmprunteurDateEmbauche: formData.coEmprunteurDateEmbauche || undefined,
        // Convertir les nombres
        montantSouhaite: parseFloat(formData.montantSouhaite) || 0,
        dureeSouhaitee: parseInt(formData.dureeSouhaitee) || 0,
        apportPersonnel: formData.apportPersonnel ? parseFloat(formData.apportPersonnel) : undefined,
        emprunteurNombreEnfants: parseInt(formData.emprunteurNombreEnfants) || 0,
        revenusMensuelsFoyer: formData.revenusMensuelsFoyer ? parseFloat(formData.revenusMensuelsFoyer) : undefined,
        loyerMensuel: formData.loyerMensuel ? parseFloat(formData.loyerMensuel) : undefined,
        nombrePartsFiscales: formData.nombrePartsFiscales ? parseFloat(formData.nombrePartsFiscales) : undefined,
        montantDecouvert: formData.montantDecouvert ? parseFloat(formData.montantDecouvert) : undefined,
        // Ajouter les données de simulation
        capaciteEmprunt: simulation.capaciteEmprunt,
        mensualiteMax: simulation.mensualiteMax,
        tauxEndettement: simulation.tauxEndettement,
        resteAVivre: simulation.resteAVivre,
        mensualiteEstimee: simulation.mensualite,
        tauxPropose: simulation.tauxPropose,
        coutTotal: simulation.coutTotal,
        statut: 'BROUILLON'
      };
      
      let savedDossier;
      if (dossierId) {
        // Mise à jour d'un dossier existant
        savedDossier = await dossiersService.update(dossierId, allData);
      } else {
        // Création d'un nouveau dossier
        savedDossier = await dossiersService.create(allData);
      }
      
      // Générer un lead automatiquement
      if (formData.emprunteurEmail) {
        await LeadCaptureService.captureFromComparateur(formData.emprunteurEmail, {
          nom: formData.emprunteurNom,
          prenom: formData.emprunteurPrenom,
          telephone: formData.emprunteurTelephone,
          comparaisonData: {
            montant: parseFloat(formData.montantSouhaite) || 0,
            duree: (parseFloat(formData.dureeSouhaitee) || 0) * 12,
            typeCredit: formData.typePret === 'Prêt Immobilier' ? 'immobilier' : 'consommation',
            apport: formData.apportPersonnel ? parseFloat(formData.apportPersonnel) : undefined,
            revenus: parseFloat(formData.revenusMensuelsFoyer) || 0
          },
          source: 'Formulaire dossier complet'
        });
      }
      
      if (onSave) {
        onSave(savedDossier);
      } else {
        alert(`Dossier sauvegardé avec succès !\nIdentifiant: ${savedDossier.identifiant}`);
      }
    } catch (error) {
      console.error('Error saving dossier:', error);
      alert('Erreur lors de la sauvegarde du dossier');
    }
  };

  const handleSend = async () => {
    try {
      // Préparer les données du co-emprunteur en JSON
      const coEmprunteurData = hasCoEmprunteur ? {
        civilite: formData.coEmprunteurCivilite,
        nom: formData.coEmprunteurNom,
        prenom: formData.coEmprunteurPrenom,
        dateNaissance: formData.coEmprunteurDateNaissance,
        lieuNaissance: formData.coEmprunteurLieuNaissance,
        nationalite: formData.coEmprunteurNationalite,
        situationFamiliale: formData.coEmprunteurSituationFamiliale,
        nombreEnfants: formData.coEmprunteurNombreEnfants,
        adresse: formData.coEmprunteurAdresse,
        codePostal: formData.coEmprunteurCodePostal,
        ville: formData.coEmprunteurVille,
        pays: formData.coEmprunteurPays,
        email: formData.coEmprunteurEmail,
        telephone: formData.coEmprunteurTelephone
      } : null;

      // Préparer les données de situation professionnelle
      const emprunteurSituationPro = {
        statut: formData.emprunteurStatut,
        employeur: formData.emprunteurEmployeur,
        dateEmbauche: formData.emprunteurDateEmbauche,
        revenusNets: formData.emprunteurRevenusNets,
        typeContrat: formData.emprunteurTypeContrat,
        anciennete: formData.emprunteurAnciennete,
        adressePro: formData.emprunteurAdressePro,
        codePostalPro: formData.emprunteurCodePostalPro,
        villePro: formData.emprunteurVillePro,
        fonction: formData.emprunteurFonction,
        depuisQuand: formData.emprunteurDepuisQuand
      };

      const coEmprunteurSituationPro = hasCoEmprunteur ? {
        statut: formData.coEmprunteurStatut,
        employeur: formData.coEmprunteurEmployeur,
        dateEmbauche: formData.coEmprunteurDateEmbauche,
        revenusNets: formData.coEmprunteurRevenusNets,
        typeContrat: formData.coEmprunteurTypeContrat,
        anciennete: formData.coEmprunteurAnciennete,
        adressePro: formData.coEmprunteurAdressePro,
        codePostalPro: formData.coEmprunteurCodePostalPro,
        villePro: formData.coEmprunteurVillePro,
        fonction: formData.coEmprunteurFonction,
        depuisQuand: formData.coEmprunteurDepuisQuand
      } : null;

      const allData = {
        ...formData,
        revenus,
        charges,
        coEmprunteurData,
        emprunteurSituationPro,
        coEmprunteurSituationPro,
        // Convertir les dates en format ISO
        emprunteurDateNaissance: formData.emprunteurDateNaissance || undefined,
        dateNaissanceConjoint: formData.dateNaissanceConjoint || undefined,
        emprunteurDateEmbauche: formData.emprunteurDateEmbauche || undefined,
        coEmprunteurDateEmbauche: formData.coEmprunteurDateEmbauche || undefined,
        // Convertir les nombres
        montantSouhaite: parseFloat(formData.montantSouhaite) || 0,
        dureeSouhaitee: parseInt(formData.dureeSouhaitee) || 0,
        apportPersonnel: formData.apportPersonnel ? parseFloat(formData.apportPersonnel) : undefined,
        emprunteurNombreEnfants: parseInt(formData.emprunteurNombreEnfants) || 0,
        revenusMensuelsFoyer: formData.revenusMensuelsFoyer ? parseFloat(formData.revenusMensuelsFoyer) : undefined,
        loyerMensuel: formData.loyerMensuel ? parseFloat(formData.loyerMensuel) : undefined,
        nombrePartsFiscales: formData.nombrePartsFiscales ? parseFloat(formData.nombrePartsFiscales) : undefined,
        montantDecouvert: formData.montantDecouvert ? parseFloat(formData.montantDecouvert) : undefined,
        // Ajouter les données de simulation
        capaciteEmprunt: simulation.capaciteEmprunt,
        mensualiteMax: simulation.mensualiteMax,
        tauxEndettement: simulation.tauxEndettement,
        resteAVivre: simulation.resteAVivre,
        mensualiteEstimee: simulation.mensualite,
        tauxPropose: simulation.tauxPropose,
        coutTotal: simulation.coutTotal,
        statut: 'EN_COURS'
      };
      
      let savedDossier;
      if (dossierId) {
        savedDossier = await dossiersService.update(dossierId, allData);
      } else {
        savedDossier = await dossiersService.create(allData);
      }
      
      if (onSend) {
        onSend(savedDossier);
      } else {
        alert(`Dossier envoyé avec succès !\nIdentifiant: ${savedDossier.identifiant}`);
      }
    } catch (error) {
      console.error('Error sending dossier:', error);
      alert('Erreur lors de l\'envoi du dossier');
    }
  };

  const calculateSimulation = () => {
    const montant = parseFloat(formData.montantSouhaite) || 0;
    const duree = parseFloat(formData.dureeSouhaitee) || 20;
    const revenusTotaux = revenus.reduce((sum, r) => sum + (r.montant || 0), 0);
    const chargesTotales = charges.reduce((sum, c) => sum + (c.montant || 0), 0);
    const taux = 3.5; // Taux moyen
    
    const tauxMensuel = taux / 100 / 12;
    const dureeMois = duree * 12;
    const mensualite = montant * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -dureeMois)));
    const tauxEndettement = revenusTotaux > 0 ? (chargesTotales + mensualite) / revenusTotaux * 100 : 0;
    const capaciteEmprunt = revenusTotaux > 0 ? (revenusTotaux * 0.33 - chargesTotales) * dureeMois / (1 + tauxMensuel * dureeMois) : 0;
    const resteAVivre = revenusTotaux - chargesTotales - mensualite;
    const coutTotal = mensualite * dureeMois - montant;

    return {
      capaciteEmprunt,
      mensualiteMax: revenusTotaux * 0.33,
      tauxEndettement,
      resteAVivre,
      mensualite,
      coutTotal,
      tauxPropose: taux
    };
  };

  const simulation = calculateSimulation();

  const renderSection = () => {
    switch (currentSection) {
      case 1: // Responsable de dossier
        return (
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="gestionnaireDossier"
                checked={formData.gestionnaireDossier}
                onChange={handleChange}
                className="w-5 h-5 mr-2"
              />
              <label className="text-lg font-semibold">Gestionnaire de dossier</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
              <input
                type="text"
                name="identifiant"
                value={formData.identifiant}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Dossier prêt"
              />
            </div>
          </div>
        );

      case 2: // Le Projet
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de prêt *</label>
              <select
                name="typePret"
                value={formData.typePret}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionner</option>
                <option value="Prêt Immobilier">Prêt Immobilier</option>
                <option value="Prêt Consommation">Prêt Consommation</option>
                <option value="Prêt Professionnel">Prêt Professionnel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant souhaité (€) *</label>
              <input
                type="number"
                name="montantSouhaite"
                value={formData.montantSouhaite}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée souhaitée (années) *</label>
              <input
                type="number"
                name="dureeSouhaitee"
                value={formData.dureeSouhaitee}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apport personnel (€)</label>
              <input
                type="number"
                name="apportPersonnel"
                value={formData.apportPersonnel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Finalité *</label>
              <select
                name="finalite"
                value={formData.finalite}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionner</option>
                <option value="Achat résidence principale">Achat résidence principale</option>
                <option value="Achat résidence secondaire">Achat résidence secondaire</option>
                <option value="Investissement locatif">Investissement locatif</option>
                <option value="Travaux">Travaux</option>
                <option value="Rachat de crédit">Rachat de crédit</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nature du bien</label>
              <select
                name="natureBien"
                value={formData.natureBien}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionner</option>
                <option value="Appartement">Appartement</option>
                <option value="Maison">Maison</option>
                <option value="Terrain">Terrain</option>
                <option value="Local commercial">Local commercial</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="travaux"
                  checked={formData.travaux}
                  onChange={handleChange}
                  className="w-5 h-5 mr-2"
                />
                <span>Travaux</span>
              </label>
            </div>
          </div>
        );

      case 3: // Emprunteur
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Civilité *</label>
              <select
                name="emprunteurCivilite"
                value={formData.emprunteurCivilite}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Mme.">Mme.</option>
                <option value="M.">M.</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                name="emprunteurNom"
                value={formData.emprunteurNom}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                name="emprunteurPrenom"
                value={formData.emprunteurPrenom}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
              <input
                type="date"
                name="emprunteurDateNaissance"
                value={formData.emprunteurDateNaissance}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
              <input
                type="text"
                name="emprunteurLieuNaissance"
                value={formData.emprunteurLieuNaissance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
              <input
                type="text"
                name="emprunteurNationalite"
                value={formData.emprunteurNationalite}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Française"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Situation familiale</label>
              <select
                name="emprunteurSituationFamiliale"
                value={formData.emprunteurSituationFamiliale}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionner</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié(e)">Marié(e)</option>
                <option value="Pacsé(e)">Pacsé(e)</option>
                <option value="Divorcé(e)">Divorcé(e)</option>
                <option value="Veuf(ve)">Veuf(ve)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants à charge</label>
              <input
                type="number"
                name="emprunteurNombreEnfants"
                value={formData.emprunteurNombreEnfants}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
              <input
                type="text"
                name="emprunteurAdresse"
                value={formData.emprunteurAdresse}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code postal *</label>
              <input
                type="text"
                name="emprunteurCodePostal"
                value={formData.emprunteurCodePostal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
              <input
                type="text"
                name="emprunteurVille"
                value={formData.emprunteurVille}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <input
                type="text"
                name="emprunteurPays"
                value={formData.emprunteurPays}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="emprunteurEmail"
                value={formData.emprunteurEmail}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                type="tel"
                name="emprunteurTelephone"
                value={formData.emprunteurTelephone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        );

      case 4: // Co-emprunteur
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Co-emprunteur</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCoEmprunteur}
                  onChange={(e) => setHasCoEmprunteur(e.target.checked)}
                  className="w-5 h-5 mr-2"
                />
                <span>Activer le co-emprunteur</span>
              </label>
            </div>
            {hasCoEmprunteur && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Civilité</label>
                  <select
                    name="coEmprunteurCivilite"
                    value={formData.coEmprunteurCivilite}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="Mme.">Mme.</option>
                    <option value="M.">M.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    name="coEmprunteurNom"
                    value={formData.coEmprunteurNom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    name="coEmprunteurPrenom"
                    value={formData.coEmprunteurPrenom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input
                    type="date"
                    name="coEmprunteurDateNaissance"
                    value={formData.coEmprunteurDateNaissance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de naissance</label>
                  <input
                    type="text"
                    name="coEmprunteurLieuNaissance"
                    value={formData.coEmprunteurLieuNaissance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationalité</label>
                  <input
                    type="text"
                    name="coEmprunteurNationalite"
                    value={formData.coEmprunteurNationalite}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Situation familiale</label>
                  <select
                    name="coEmprunteurSituationFamiliale"
                    value={formData.coEmprunteurSituationFamiliale}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Célibataire">Célibataire</option>
                    <option value="Marié(e)">Marié(e)</option>
                    <option value="Pacsé(e)">Pacsé(e)</option>
                    <option value="Divorcé(e)">Divorcé(e)</option>
                    <option value="Veuf(ve)">Veuf(ve)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'enfants à charge</label>
                  <input
                    type="number"
                    name="coEmprunteurNombreEnfants"
                    value={formData.coEmprunteurNombreEnfants}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input
                    type="text"
                    name="coEmprunteurAdresse"
                    value={formData.coEmprunteurAdresse}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    name="coEmprunteurCodePostal"
                    value={formData.coEmprunteurCodePostal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    name="coEmprunteurVille"
                    value={formData.coEmprunteurVille}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <input
                    type="text"
                    name="coEmprunteurPays"
                    value={formData.coEmprunteurPays}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="coEmprunteurEmail"
                    value={formData.coEmprunteurEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    name="coEmprunteurTelephone"
                    value={formData.coEmprunteurTelephone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 5: // Situation de famille
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Situation familiale *</label>
              <div className="flex flex-wrap gap-4">
                {['Célibataire', 'Marié(e)', 'Pacsé(e)', 'Divorcé(e)', 'Veuf(ve)', 'Autres'].map((situation) => (
                  <label key={situation} className="flex items-center">
                    <input
                      type="radio"
                      name="situationFamiliale"
                      value={situation}
                      checked={formData.situationFamiliale === situation}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>{situation}</span>
                  </label>
                ))}
              </div>
            </div>
            {(formData.situationFamiliale === 'Marié(e)' || formData.situationFamiliale === 'Pacsé(e)') && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du conjoint</label>
                    <input
                      type="text"
                      name="nomConjoint"
                      value={formData.nomConjoint}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom du conjoint</label>
                    <input
                      type="text"
                      name="prenomConjoint"
                      value={formData.prenomConjoint}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance du conjoint</label>
                    <input
                      type="date"
                      name="dateNaissanceConjoint"
                      value={formData.dateNaissanceConjoint}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Régime matrimonial</label>
                  <select
                    name="regimeMatrimonial"
                    value={formData.regimeMatrimonial}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Communauté réduite aux acquêts">Communauté réduite aux acquêts</option>
                    <option value="Séparation de biens">Séparation de biens</option>
                    <option value="Communauté universelle">Communauté universelle</option>
                    <option value="Participation aux acquêts">Participation aux acquêts</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="enfantsCharge"
                  checked={formData.enfantsCharge}
                  onChange={handleChange}
                  className="w-5 h-5 mr-2"
                />
                <span>Enfants à charge</span>
              </label>
              {formData.enfantsCharge && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Âge des enfants</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.agesEnfants.map((age, index) => (
                      <input
                        key={index}
                        type="number"
                        value={age}
                        onChange={(e) => {
                          const newAges = [...formData.agesEnfants];
                          newAges[index] = e.target.value;
                          setFormData(prev => ({ ...prev, agesEnfants: newAges }));
                        }}
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        placeholder="Âge"
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, agesEnfants: [...prev.agesEnfants, ''] }))}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 inline" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Situation fiscale</label>
                <select
                  name="situationFiscale"
                  value={formData.situationFiscale}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sélectionner</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié sans enfant">Marié sans enfant</option>
                  <option value="Marié avec enfant(s)">Marié avec enfant(s)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de parts fiscales</label>
                <input
                  type="number"
                  name="nombrePartsFiscales"
                  value={formData.nombrePartsFiscales}
                  onChange={handleChange}
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Revenus mensuels nets du foyer (€)</label>
                <input
                  type="number"
                  name="revenusMensuelsFoyer"
                  value={formData.revenusMensuelsFoyer}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );

      case 6: // Votre Logement
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut du logement *</label>
              <div className="flex flex-wrap gap-4">
                {['Locataire', 'Propriétaire', 'Hébergé(e) gratuitement', 'Autre'].map((statut) => (
                  <label key={statut} className="flex items-center">
                    <input
                      type="radio"
                      name="statutLogement"
                      value={statut}
                      checked={formData.statutLogement === statut}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>{statut}</span>
                  </label>
                ))}
              </div>
            </div>
            {formData.statutLogement === 'Locataire' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loyer mensuel (€)</label>
                <input
                  type="number"
                  name="loyerMensuel"
                  value={formData.loyerMensuel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input
                  type="text"
                  name="adresseLogement"
                  value={formData.adresseLogement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                <input
                  type="text"
                  name="codePostalLogement"
                  value={formData.codePostalLogement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  name="villeLogement"
                  value={formData.villeLogement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="typeLogement"
                  value={formData.typeLogement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sélectionner</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Maison">Maison</option>
                  <option value="Studio">Studio</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage</label>
                <div className="flex flex-wrap gap-4">
                  {['Résidence principale', 'Résidence secondaire', 'Investissement locatif', 'Autre'].map((usage) => (
                    <label key={usage} className="flex items-center">
                      <input
                        type="radio"
                        name="usageLogement"
                        value={usage}
                        checked={formData.usageLogement === usage}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span>{usage}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Depuis quand ?</label>
                <select
                  name="depuisQuandLogement"
                  value={formData.depuisQuandLogement}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Sélectionner</option>
                  <option value="Moins de 1 an">Moins de 1 an</option>
                  <option value="1 à 3 ans">1 à 3 ans</option>
                  <option value="3 à 5 ans">3 à 5 ans</option>
                  <option value="Plus de 5 ans">Plus de 5 ans</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 7: // Autres Biens Immobiliers
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Autres Biens Immobiliers</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAutresBiens}
                  onChange={(e) => setHasAutresBiens(e.target.checked)}
                  className="w-5 h-5 mr-2"
                />
                <span>J'ai d'autres biens immobiliers</span>
              </label>
            </div>
            {hasAutresBiens && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Cette section sera développée pour permettre l'ajout de plusieurs biens immobiliers avec leurs caractéristiques.
                </p>
              </div>
            )}
          </div>
        );

      case 8: // Biens Financiers
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Autres Biens Financiers Importants</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasBiensFinanciers}
                  onChange={(e) => setHasBiensFinanciers(e.target.checked)}
                  className="w-5 h-5 mr-2"
                />
                <span>J'ai d'autres biens financiers</span>
              </label>
            </div>
            {hasBiensFinanciers && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Cette section sera développée pour permettre l'ajout de biens financiers (épargne, placements, etc.).
                </p>
              </div>
            )}
          </div>
        );

      case 9: // Crédits Consommation
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crédits à la Consommation</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCreditsConso}
                  onChange={(e) => setHasCreditsConso(e.target.checked)}
                  className="w-5 h-5 mr-2"
                />
                <span>J'ai des crédits à la consommation</span>
              </label>
            </div>
            {hasCreditsConso && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Cette section sera développée pour permettre l'ajout de crédits consommation avec leurs mensualités.
                </p>
              </div>
            )}
          </div>
        );

      case 10: // Votre Banque
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la banque</label>
              <input
                type="text"
                name="nomBanque"
                value={formData.nomBanque}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de compte</label>
              <input
                type="text"
                name="numeroCompte"
                value={formData.numeroCompte}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Depuis quand ?</label>
              <select
                name="depuisQuandBanque"
                value={formData.depuisQuandBanque}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionner</option>
                <option value="Moins de 1 an">Moins de 1 an</option>
                <option value="1 à 3 ans">1 à 3 ans</option>
                <option value="3 à 5 ans">3 à 5 ans</option>
                <option value="Plus de 5 ans">Plus de 5 ans</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut du compte</label>
              <div className="flex flex-wrap gap-4">
                {['Solde positif', 'Solde négatif', 'Découvert autorisé'].map((statut) => (
                  <label key={statut} className="flex items-center">
                    <input
                      type="radio"
                      name="statutCompte"
                      value={statut}
                      checked={formData.statutCompte === statut}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>{statut}</span>
                  </label>
                ))}
              </div>
            </div>
            {formData.statutCompte === 'Découvert autorisé' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant du découvert autorisé (€)</label>
                <input
                  type="number"
                  name="montantDecouvert"
                  value={formData.montantDecouvert}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        );

      case 11: // Retard
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Retard</h3>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRetard}
                  onChange={(e) => setHasRetard(e.target.checked)}
                  className="w-5 h-5 mr-2"
                />
                <span>J'ai eu des retards de paiement</span>
              </label>
            </div>
            {hasRetard && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Cette section sera développée pour permettre la déclaration de retards de paiement.
                </p>
              </div>
            )}
          </div>
        );

      case 12: // Situation Professionnelle
        return (
          <div className="space-y-6">
            {/* Emprunteur */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Situation Professionnelle - Emprunteur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
                  <select
                    name="emprunteurStatut"
                    value={formData.emprunteurStatut}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Salarié">Salarié</option>
                    <option value="Indépendant">Indépendant</option>
                    <option value="Retraité">Retraité</option>
                    <option value="Chômage">Chômage</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'employeur</label>
                  <input
                    type="text"
                    name="emprunteurEmployeur"
                    value={formData.emprunteurEmployeur}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                  <input
                    type="date"
                    name="emprunteurDateEmbauche"
                    value={formData.emprunteurDateEmbauche}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenus nets mensuels (€) *</label>
                  <input
                    type="number"
                    name="emprunteurRevenusNets"
                    value={formData.emprunteurRevenusNets}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                  <select
                    name="emprunteurTypeContrat"
                    value={formData.emprunteurTypeContrat}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Intérim">Intérim</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ancienneté</label>
                  <input
                    type="text"
                    name="emprunteurAnciennete"
                    value={formData.emprunteurAnciennete}
                    onChange={handleChange}
                    placeholder="Ex: 5 ans"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse professionnelle</label>
                  <input
                    type="text"
                    name="emprunteurAdressePro"
                    value={formData.emprunteurAdressePro}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <input
                    type="text"
                    name="emprunteurCodePostalPro"
                    value={formData.emprunteurCodePostalPro}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    type="text"
                    name="emprunteurVillePro"
                    value={formData.emprunteurVillePro}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
                  <input
                    type="text"
                    name="emprunteurFonction"
                    value={formData.emprunteurFonction}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Depuis quand ?</label>
                  <select
                    name="emprunteurDepuisQuand"
                    value={formData.emprunteurDepuisQuand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Moins de 1 an">Moins de 1 an</option>
                    <option value="1 à 3 ans">1 à 3 ans</option>
                    <option value="3 à 5 ans">3 à 5 ans</option>
                    <option value="Plus de 5 ans">Plus de 5 ans</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Co-emprunteur */}
            {hasCoEmprunteur && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Situation Professionnelle - Co-emprunteur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="coEmprunteurStatut"
                      value={formData.coEmprunteurStatut}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Salarié">Salarié</option>
                      <option value="Indépendant">Indépendant</option>
                      <option value="Retraité">Retraité</option>
                      <option value="Chômage">Chômage</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'employeur</label>
                    <input
                      type="text"
                      name="coEmprunteurEmployeur"
                      value={formData.coEmprunteurEmployeur}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
                    <input
                      type="date"
                      name="coEmprunteurDateEmbauche"
                      value={formData.coEmprunteurDateEmbauche}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Revenus nets mensuels (€)</label>
                    <input
                      type="number"
                      name="coEmprunteurRevenusNets"
                      value={formData.coEmprunteurRevenusNets}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                    <select
                      name="coEmprunteurTypeContrat"
                      value={formData.coEmprunteurTypeContrat}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Sélectionner</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="Stage">Stage</option>
                      <option value="Intérim">Intérim</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ancienneté</label>
                    <input
                      type="text"
                      name="coEmprunteurAnciennete"
                      value={formData.coEmprunteurAnciennete}
                      onChange={handleChange}
                      placeholder="Ex: 3 ans"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse professionnelle</label>
                    <input
                      type="text"
                      name="coEmprunteurAdressePro"
                      value={formData.coEmprunteurAdressePro}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                    <input
                      type="text"
                      name="coEmprunteurCodePostalPro"
                      value={formData.coEmprunteurCodePostalPro}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                    <input
                      type="text"
                      name="coEmprunteurVillePro"
                      value={formData.coEmprunteurVillePro}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
                    <input
                      type="text"
                      name="coEmprunteurFonction"
                      value={formData.coEmprunteurFonction}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Depuis quand ?</label>
                    <select
                      name="coEmprunteurDepuisQuand"
                      value={formData.coEmprunteurDepuisQuand}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Sélectionner</option>
                      <option value="Moins de 1 an">Moins de 1 an</option>
                      <option value="1 à 3 ans">1 à 3 ans</option>
                      <option value="3 à 5 ans">3 à 5 ans</option>
                      <option value="Plus de 5 ans">Plus de 5 ans</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 13: // Revenus Mensuels
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Vos Revenus Mensuels</h3>
              <button
                type="button"
                onClick={handleAddRevenu}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter un revenu
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Type de revenu</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Montant (€)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Périodicité</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Justificatif</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {revenus.map((revenu, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          value={revenu.type}
                          onChange={(e) => handleRevenuChange(index, 'type', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Salaire net">Salaire net</option>
                          <option value="Revenus fonciers">Revenus fonciers</option>
                          <option value="Allocations">Allocations</option>
                          <option value="Pensions">Pensions</option>
                          <option value="Autres revenus">Autres revenus</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={revenu.montant}
                          onChange={(e) => handleRevenuChange(index, 'montant', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          value={revenu.periodicite}
                          onChange={(e) => handleRevenuChange(index, 'periodicite', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="Mensuel">Mensuel</option>
                          <option value="Trimestriel">Trimestriel</option>
                          <option value="Annuel">Annuel</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={revenu.justificatif}
                          onChange={(e) => handleRevenuChange(index, 'justificatif', e.target.value)}
                          placeholder="Type de justificatif"
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {revenus.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRevenu(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 14: // Charges Mensuelles
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Charges Mensuelles</h3>
              <button
                type="button"
                onClick={handleAddCharge}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter une charge
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Type de charge</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Montant (€)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Périodicité</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Créancier</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.map((charge, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          value={charge.type}
                          onChange={(e) => handleChargeChange(index, 'type', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="">Sélectionner</option>
                          <option value="Loyer/Mensualités de prêt">Loyer/Mensualités de prêt</option>
                          <option value="Impôts">Impôts</option>
                          <option value="Assurances">Assurances</option>
                          <option value="Crédit auto">Crédit auto</option>
                          <option value="Autres crédits">Autres crédits</option>
                          <option value="Autres charges">Autres charges</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={charge.montant}
                          onChange={(e) => handleChargeChange(index, 'montant', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <select
                          value={charge.periodicite}
                          onChange={(e) => handleChargeChange(index, 'periodicite', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="Mensuel">Mensuel</option>
                          <option value="Trimestriel">Trimestriel</option>
                          <option value="Annuel">Annuel</option>
                        </select>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={charge.crediteur}
                          onChange={(e) => handleChargeChange(index, 'crediteur', e.target.value)}
                          placeholder="Nom du créancier"
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {charges.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCharge(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 15: // Résultat Simulation
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Résultat de Simulation</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Libellé</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Montant</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Taux proposé</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Durée</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Coût total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Capacité d'emprunt</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{simulation.capaciteEmprunt.toFixed(2)} €</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Mensualité max</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{simulation.mensualiteMax.toFixed(2)} €</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Taux d'endettement</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{simulation.tauxEndettement.toFixed(2)} %</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Restes à vivre</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{simulation.resteAVivre.toFixed(2)} €</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                  </tr>
                  {formData.montantSouhaite && (
                    <tr className="bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 font-semibold">Mensualité estimée</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{simulation.mensualite.toFixed(2)} €</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{simulation.tauxPropose.toFixed(2)} %</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formData.dureeSouhaitee || 0} ans</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{simulation.coutTotal.toFixed(2)} €</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Simulateur / Comparateur CREDITS</h1>
        <p className="text-blue-100">
          {dossierId ? `Modification du dossier: ${formData.identifiant}` : 'Formulaire complet de dossier de prêt'}
        </p>
      </div>

      {/* Navigation des sections */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isCompleted = currentSection > section.id;
            const isCurrent = currentSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isCompleted && <CheckCircle className="w-4 h-4" />}
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.id}. {section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className={`w-5 h-5 ${currentSection > sections.findIndex(s => s.id === currentSection) ? 'text-green-600' : 'text-gray-400'}`} />
            <h2 className="text-xl font-bold text-gray-900">
              {sections.find(s => s.id === currentSection)?.title}
            </h2>
          </div>
        </div>

        {renderSection()}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
            disabled={currentSection === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          {currentSection < sections.length ? (
            <button
              type="button"
              onClick={() => setCurrentSection(currentSection + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Suivant
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Télécharger
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Envoyer le dossier
              </button>
              <button
                type="button"
                onClick={() => alert('Fonctionnalité à venir')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FileIcon className="w-4 h-4" />
                Préparer un devis
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Informations complémentaires et commentaires */}
      {currentSection === sections.length && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Informations complémentaires</label>
            <textarea
              name="informationsComplementaires"
              value={formData.informationsComplementaires}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Toute information complémentaire utile..."
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Commentaires</label>
              <button
                type="button"
                onClick={handleAddCommentaire}
                className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Ajouter un commentaire lié au dossier
              </button>
            </div>
            <div className="space-y-2">
              {formData.commentaires.map((commentaire, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-start justify-between">
                  <p className="text-sm text-gray-700">{commentaire}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const newComments = formData.commentaires.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, commentaires: newComments }));
                    }}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
