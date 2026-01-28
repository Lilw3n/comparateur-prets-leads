import { Shield, Lock, Eye, Mail, FileText } from 'lucide-react';

export default function Confidentialite() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
        <p className="text-gray-600">Protection de vos données personnelles</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
        {/* Introduction */}
        <section>
          <p className="text-gray-700 leading-relaxed">
            La présente politique de confidentialité décrit la manière dont BUCHET WENDY collecte, utilise et protège 
            les informations que vous nous fournissez lorsque vous utilisez notre site web. Nous nous engageons à respecter 
            votre vie privée et à protéger vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD) 
            et à la loi Informatique et Libertés.
          </p>
        </section>

        {/* Responsable du traitement */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            1. Responsable du traitement
          </h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Responsable :</strong> BUCHET WENDY</p>
            <p><strong>SIREN :</strong> 810 571 513</p>
            <p className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <span><strong>Email :</strong> <a href="mailto:courtier972@gmail.com" className="text-blue-600 hover:underline">courtier972@gmail.com</a></span>
            </p>
            <p><strong>Adresse :</strong> 15 ET17, 15 RUE PIERRE CURIE, 54110 VARANGEVILLE</p>
          </div>
        </section>

        {/* Données collectées */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-600" />
            2. Données collectées
          </h2>
          <div className="space-y-3 text-gray-700">
            <p>Nous collectons les données personnelles suivantes :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
              <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées, durée de visite</li>
              <li><strong>Données relatives à vos demandes :</strong> informations sur vos projets immobiliers, prêts, assurances</li>
              <li><strong>Données de contact :</strong> messages et communications échangées</li>
            </ul>
            <p className="mt-4">
              Ces données sont collectées lorsque vous remplissez un formulaire de contact, utilisez nos simulateurs, 
              ou naviguez sur notre site.
            </p>
          </div>
        </section>

        {/* Finalités */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
          <div className="space-y-2 text-gray-700">
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Répondre à vos demandes de contact et de devis</li>
              <li>Vous fournir des services de courtage en assurance et en prêts immobiliers</li>
              <li>Améliorer nos services et votre expérience utilisateur</li>
              <li>Vous envoyer des informations commerciales (avec votre consentement)</li>
              <li>Respecter nos obligations légales et réglementaires</li>
              <li>Gérer votre dossier de prêt ou d'assurance</li>
            </ul>
          </div>
        </section>

        {/* Base légale */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale du traitement</h2>
          <div className="space-y-2 text-gray-700">
            <p>Le traitement de vos données personnelles est fondé sur :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Votre consentement</strong> pour l'envoi de communications commerciales</li>
              <li><strong>L'exécution d'un contrat</strong> ou de mesures précontractuelles pour la gestion de vos dossiers</li>
              <li><strong>L'intérêt légitime</strong> pour l'amélioration de nos services</li>
              <li><strong>Le respect d'obligations légales</strong> notamment en matière de courtage en assurance</li>
            </ul>
          </div>
        </section>

        {/* Conservation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Durée de conservation</h2>
          <div className="space-y-2 text-gray-700">
            <p>Vos données personnelles sont conservées :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Données de contact :</strong> 3 ans à compter du dernier contact</li>
              <li><strong>Données de navigation :</strong> 13 mois maximum</li>
              <li><strong>Données contractuelles :</strong> durée de la relation contractuelle + 10 ans (obligations comptables et fiscales)</li>
              <li><strong>Données de prospection :</strong> 3 ans à compter du dernier contact ou jusqu'à votre opposition</li>
            </ul>
          </div>
        </section>

        {/* Destinataires */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Destinataires des données</h2>
          <div className="space-y-2 text-gray-700">
            <p>Vos données peuvent être transmises à :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Nos partenaires assureurs et établissements bancaires pour le traitement de vos dossiers</li>
              <li>Nos prestataires techniques (hébergement, maintenance)</li>
              <li>Les autorités compétentes en cas d'obligation légale</li>
            </ul>
            <p className="mt-4">
              Nous ne vendons jamais vos données personnelles à des tiers à des fins commerciales.
            </p>
          </div>
        </section>

        {/* Sécurité */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-purple-600" />
            7. Sécurité des données
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données 
              personnelles contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation, l'altération ou la destruction.
            </p>
            <p>
              Ces mesures incluent notamment le chiffrement des données, l'accès sécurisé, et la formation de notre personnel.
            </p>
          </div>
        </section>

        {/* Vos droits */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Vos droits</h2>
          <div className="space-y-3 text-gray-700">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li><strong>Droit de rectification :</strong> corriger vos données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement :</strong> supprimer vos données dans certains cas</li>
              <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données dans un format structuré</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong>Droit de retirer votre consentement :</strong> à tout moment</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <a href="mailto:courtier972@gmail.com" className="text-blue-600 hover:underline font-semibold">courtier972@gmail.com</a>
            </p>
            <p>
              Vous avez également le droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) 
              si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD.
            </p>
            <p>
              <strong>CNIL :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07 - Tél : 01 53 73 22 22
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic. 
              Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.
            </p>
            <p>
              Les cookies utilisés sont principalement des cookies techniques nécessaires au fonctionnement du site.
            </p>
          </div>
        </section>

        {/* Modifications */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Nous nous réservons le droit de modifier la présente politique de confidentialité à tout moment. 
              Les modifications entrent en vigueur dès leur publication sur le site.
            </p>
            <p>
              Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance de la dernière version.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-purple-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
          <div className="space-y-2 text-gray-700">
            <p>Pour toute question concernant cette politique de confidentialité :</p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              <a href="mailto:courtier972@gmail.com" className="text-blue-600 hover:underline font-semibold">courtier972@gmail.com</a>
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
