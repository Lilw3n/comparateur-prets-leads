# Configuration de l'envoi d'emails

## Problème résolu

Les corrections suivantes ont été apportées :
1. ✅ Support du type `CONTACT_GENERAL` dans la validation
2. ✅ Correction de l'URL API pour utiliser `/api` en production
3. ✅ Amélioration de la gestion des erreurs SMTP

## Configuration requise pour l'envoi d'emails

Pour que les emails soient réellement envoyés à `courtier972@gmail.com`, vous devez configurer les variables d'environnement SMTP sur Vercel.

### Option 1 : Gmail SMTP (Recommandé)

1. **Créer un mot de passe d'application Gmail** :
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "App" : "Mail" et "Device" : "Other"
   - Entrez "Vercel" comme nom
   - Copiez le mot de passe généré (16 caractères)

2. **Configurer les variables d'environnement sur Vercel** :
   - Allez sur https://vercel.com/lilw3ns-projects/comparateur-prets-leads/settings/environment-variables
   - Ajoutez les variables suivantes :
     ```
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=votre_email@gmail.com
     SMTP_PASS=votre_mot_de_passe_application_16_caracteres
     EMAIL_FROM=votre_email@gmail.com
     COURTIER_EMAIL=courtier972@gmail.com
     ```

3. **Redéployer** :
   - Les variables d'environnement seront prises en compte au prochain déploiement

### Option 2 : Service d'email tiers (SendGrid, Resend, etc.)

Pour un service plus professionnel, vous pouvez utiliser :
- **SendGrid** : https://sendgrid.com/
- **Resend** : https://resend.com/
- **Mailgun** : https://www.mailgun.com/

Configurez les variables d'environnement selon la documentation du service choisi.

## Vérification

Pour vérifier que l'envoi fonctionne :
1. Testez le formulaire de contact sur le site
2. Vérifiez les logs Vercel : https://vercel.com/lilw3ns-projects/comparateur-prets-leads
3. Vérifiez votre boîte mail `courtier972@gmail.com`

## Note importante

**Sans configuration SMTP**, les emails sont seulement loggés dans la console Vercel mais ne sont **pas envoyés**. Le lead est quand même créé dans la base de données.
