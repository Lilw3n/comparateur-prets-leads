import { FileText, Building2, Mail, MapPin, Shield } from 'lucide-react';

export default function MentionsLegales() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mentions Légales</h1>
        <p className="text-gray-600">Informations légales et réglementaires</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-8">
        {/* Éditeur du site */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            1. Éditeur du site
          </h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Raison sociale :</strong> BUCHET WENDY</p>
            <p><strong>Forme juridique :</strong> Entrepreneur individuel</p>
            <p><strong>SIREN :</strong> 810 571 513</p>
            <p><strong>RCS :</strong> 810 571 513 R.C.S. Nancy</p>
            <p><strong>Code NAF/APE :</strong> 66.22Z - Activités des agents et courtiers d'assurances</p>
            <p className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <span><strong>Adresse du siège social :</strong> 15 ET17, 15 RUE PIERRE CURIE, 54110 VARANGEVILLE</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span><strong>Email :</strong> <a href="mailto:courtier972@gmail.com" className="text-blue-600 hover:underline">courtier972@gmail.com</a></span>
            </p>
            <p><strong>Directeur de publication :</strong> M. WENDY BUCHET</p>
          </div>
        </section>

        {/* Hébergement */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hébergement</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Hébergeur :</strong> Vercel Inc.</p>
            <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
            <p><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://vercel.com</a></p>
          </div>
        </section>

        {/* Activité professionnelle */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            3. Activité professionnelle
          </h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Activité principale :</strong> Courtier d'assurance ou de réassurance - Mandataire d'intermédiaire d'assurance (Mia)</p>
            <p><strong>Inscription ORIAS :</strong> Numéro 15005935</p>
            <p><strong>Statut :</strong> Courtier en Assurance (COA) sans maniement de fonds</p>
            <p className="mt-4">
              <strong>Autorité de contrôle :</strong> L'activité de courtage en assurance est réglementée par l'ORIAS (Organisme pour le Registre des Intermédiaires en Assurance).
            </p>
          </div>
        </section>

        {/* Propriété intellectuelle */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support électronique ou autre est formellement interdite sauf autorisation expresse de l'éditeur.
            </p>
          </div>
        </section>

        {/* Protection des données */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Protection des données personnelles</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), 
              vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse email : <a href="mailto:courtier972@gmail.com" className="text-blue-600 hover:underline">courtier972@gmail.com</a>
            </p>
            <p>
              Pour plus d'informations, consultez notre <a href="/confidentialite" className="text-blue-600 hover:underline">Politique de Confidentialité</a>.
            </p>
          </div>
        </section>

        {/* Responsabilité */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation de responsabilité</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
              mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
            </p>
            <p>
              L'éditeur ne pourra être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur, 
              lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications, 
              soit de l'apparition d'un bug ou d'une incompatibilité.
            </p>
            <p>
              L'éditeur ne pourra également être tenu responsable des dommages indirects consécutifs à l'utilisation du site.
            </p>
          </div>
        </section>

        {/* Liens hypertextes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Liens hypertextes</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Le site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. 
              Les liens vers ces autres ressources vous font quitter le site.
            </p>
            <p>
              Il est possible de créer un lien vers la page de présentation de ce site sans autorisation expresse de l'éditeur. 
              Aucune autorisation ni demande d'information préalable ne peut être exigée par l'éditeur à l'égard d'un site qui souhaite établir un lien vers le site de l'éditeur.
            </p>
          </div>
        </section>

        {/* Droit applicable */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Droit applicable</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Les présentes mentions légales sont régies par le droit français. 
              En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact</h2>
          <div className="space-y-2 text-gray-700">
            <p>Pour toute question concernant les présentes mentions légales, vous pouvez nous contacter :</p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
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
