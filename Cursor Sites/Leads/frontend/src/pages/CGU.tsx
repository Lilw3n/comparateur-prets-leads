import { FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react';

export default function CGU() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Scale className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-gray-600">Règles d'utilisation du site</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
        {/* Introduction */}
        <section>
          <p className="text-gray-700 leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site web de BUCHET WENDY. 
            L'accès et l'utilisation du site impliquent l'acceptation pleine et entière des présentes CGU.
          </p>
        </section>

        {/* Objet */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            1. Objet
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Le présent site a pour objet de présenter les services de courtage en assurance et en prêts immobiliers 
              proposés par BUCHET WENDY, ainsi que de permettre aux utilisateurs de :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Consulter des informations sur nos services</li>
              <li>Utiliser nos simulateurs de prêt et d'assurance</li>
              <li>Effectuer des demandes de devis ou de contact</li>
              <li>Comparer des offres de prêts et d'assurances</li>
            </ul>
          </div>
        </section>

        {/* Acceptation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptation des CGU</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              L'utilisation du site implique l'acceptation sans réserve des présentes CGU. 
              Si vous n'acceptez pas ces conditions, nous vous invitons à ne pas utiliser le site.
            </p>
            <p>
              BUCHET WENDY se réserve le droit de modifier les présentes CGU à tout moment. 
              Les modifications sont applicables dès leur mise en ligne.
            </p>
          </div>
        </section>

        {/* Accès au site */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Accès au site</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              L'accès au site est gratuit. Tous les frais nécessaires pour l'accès aux services (matériel informatique, connexion Internet, etc.) 
              sont à la charge de l'utilisateur.
            </p>
            <p>
              BUCHET WENDY se réserve le droit de suspendre, d'interrompre ou de limiter l'accès à tout ou partie du site, 
              notamment en cas de maintenance, sans préavis ni justification.
            </p>
          </div>
        </section>

        {/* Utilisation du site */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            4. Utilisation du site
          </h2>
          <div className="space-y-3 text-gray-700">
            <p><strong>L'utilisateur s'engage à :</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Utiliser le site conformément à sa destination</li>
              <li>Ne pas utiliser le site à des fins illégales ou frauduleuses</li>
              <li>Ne pas tenter d'accéder de manière non autorisée au site ou à ses systèmes</li>
              <li>Ne pas perturber le fonctionnement du site</li>
              <li>Fournir des informations exactes et à jour lors de l'utilisation des formulaires</li>
              <li>Respecter les droits de propriété intellectuelle</li>
            </ul>
            <p className="mt-4">
              Tout usage non conforme du site peut entraîner la suppression des données de l'utilisateur 
              et des poursuites judiciaires.
            </p>
          </div>
        </section>

        {/* Services proposés */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Services proposés</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              Le site propose des services de courtage en assurance et en prêts immobiliers, notamment :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Comparaison d'offres de prêts immobiliers</li>
              <li>Simulation de capacité d'emprunt et de mensualités</li>
              <li>Comparaison d'offres d'assurance</li>
              <li>Conseil et accompagnement dans vos démarches</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <p className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Important :</strong> Les informations et simulations fournies sur le site sont indicatives 
                  et ne constituent pas une offre ferme et définitive. Les conditions finales dépendent de l'acceptation 
                  de votre dossier par les établissements financiers et assureurs partenaires.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Responsabilité */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-green-600" />
            6. Limitation de responsabilité
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              BUCHET WENDY s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. 
              Toutefois, des erreurs ou omissions peuvent survenir.
            </p>
            <p>
              BUCHET WENDY ne pourra être tenue responsable :
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
              <li>Des interruptions ou dysfonctionnements du site</li>
              <li>De l'inexactitude ou de l'obsolescence des informations</li>
              <li>Des décisions prises sur la base des informations du site</li>
              <li>Des dommages résultant d'une intrusion frauduleuse d'un tiers</li>
            </ul>
            <p className="mt-4">
              L'utilisateur reconnaît utiliser les informations sous sa seule responsabilité.
            </p>
          </div>
        </section>

        {/* Propriété intellectuelle */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriété intellectuelle</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              L'ensemble des éléments du site (textes, images, logos, icônes, etc.) sont la propriété exclusive de BUCHET WENDY 
              ou de ses partenaires et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, 
              quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable de BUCHET WENDY.
            </p>
          </div>
        </section>

        {/* Données personnelles */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Données personnelles</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Le traitement de vos données personnelles est régi par notre <a href="/confidentialite" className="text-blue-600 hover:underline">Politique de Confidentialité</a>, 
              qui fait partie intégrante des présentes CGU.
            </p>
            <p>
              En utilisant le site, vous acceptez le traitement de vos données personnelles dans les conditions décrites 
              dans la Politique de Confidentialité.
            </p>
          </div>
        </section>

        {/* Liens externes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Liens externes</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Le site peut contenir des liens vers des sites externes. BUCHET WENDY n'exerce aucun contrôle sur ces sites 
              et décline toute responsabilité quant à leur contenu, leur accessibilité ou leur politique de confidentialité.
            </p>
            <p>
              L'insertion de liens vers le site est autorisée sous réserve que ces liens ne portent pas atteinte à l'image de BUCHET WENDY 
              et que le site lié ne contienne pas de contenu illicite.
            </p>
          </div>
        </section>

        {/* Droit de rétractation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Droit de rétractation</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Conformément à la législation en vigueur, vous disposez d'un droit de rétractation de 14 jours à compter de la conclusion 
              d'un contrat de service, sauf exceptions prévues par la loi.
            </p>
            <p>
              Pour exercer votre droit de rétractation, contactez-nous à : <a href="mailto:courtier972@gmail.com" className="text-blue-600 hover:underline">courtier972@gmail.com</a>
            </p>
          </div>
        </section>

        {/* Médiation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Médiation</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Conformément aux articles L.611-1 et R.612-1 et suivants du Code de la consommation, 
              BUCHET WENDY adhère au Médiateur de la consommation suivant :
            </p>
            <p className="ml-4">
              <strong>Médiateur de la consommation compétent pour les intermédiaires en assurance</strong><br />
              Conformément à l'article L.612-1 du Code de la consommation, vous pouvez recourir gratuitement à un médiateur 
              de la consommation en vue de la résolution amiable d'un litige qui nous opposerait.
            </p>
          </div>
        </section>

        {/* Droit applicable */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Droit applicable et juridiction</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Les présentes CGU sont régies par le droit français. 
              En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux compétents 
              conformément aux règles de compétence en vigueur.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-green-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact</h2>
          <div className="space-y-2 text-gray-700">
            <p>Pour toute question concernant les présentes CGU :</p>
            <p>
              <strong>Email :</strong> <a href="mailto:courtier972@gmail.com" className="text-blue-600 hover:underline font-semibold">courtier972@gmail.com</a>
            </p>
            <p>
              <strong>Adresse :</strong> 15 ET17, 15 RUE PIERRE CURIE, 54110 VARANGEVILLE
            </p>
          </div>
        </section>

        <div className="text-sm text-gray-500 text-center pt-4 border-t">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}
