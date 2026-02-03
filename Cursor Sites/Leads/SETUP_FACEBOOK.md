# Configuration Facebook pour Publication d'Articles et Génération de Leads

## 📋 Prérequis

1. Avoir créé une page Facebook sur https://www.facebook.com/pages/creation/
2. Être administrateur de la page
3. Avoir un compte développeur Facebook

## 🔑 Obtenir un Token d'Accès Facebook

### Étape 1 : Créer une Application Facebook

1. Allez sur https://developers.facebook.com/
2. Cliquez sur "Mes Applications" → "Créer une application"
3. Choisissez le type "Aucun" ou "Entreprise"
4. Remplissez les informations de base

### Étape 2 : Ajouter le Produit "Facebook Login"

1. Dans votre application, allez dans "Ajouter un produit"
2. Ajoutez "Facebook Login"
3. Configurez les paramètres de base

### Étape 3 : Obtenir le Token d'Accès de la Page

#### Méthode 1 : Graph API Explorer (Recommandé)

1. Allez sur https://developers.facebook.com/tools/explorer/
2. Sélectionnez votre application dans le menu déroulant
3. Cliquez sur "Obtenir un jeton" → "Obtenir un jeton d'accès utilisateur"
4. Sélectionnez les permissions suivantes :
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_read_user_content`
5. Cliquez sur "Obtenir un jeton"
6. Une fois le token obtenu, utilisez-le pour obtenir le token de la page :
   - Dans Graph API Explorer, tapez : `me/accounts`
   - Vous verrez la liste de vos pages avec leurs tokens d'accès

#### Méthode 2 : Token Longue Durée

Pour un token qui ne expire pas (ou expire après 60 jours) :

1. Obtenez d'abord un token court (méthode 1)
2. Utilisez cet endpoint :
   ```
   GET https://graph.facebook.com/v18.0/oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={app-id}&
     client_secret={app-secret}&
     fb_exchange_token={short-lived-token}
   ```
3. Utilisez ce token pour obtenir le token de la page (comme méthode 1)

### Étape 4 : Obtenir l'ID de la Page

1. Allez sur votre page Facebook
2. Cliquez sur "À propos" dans le menu de gauche
3. Faites défiler jusqu'à "ID de la page" - c'est votre `pageId`

Ou utilisez Graph API Explorer avec `me/accounts` pour voir l'ID de chaque page.

## 🔗 Connecter la Page dans l'Application

1. Allez sur `/facebook-manager` dans votre application
2. Cliquez sur "Connecter une Page"
3. Remplissez le formulaire :
   - **ID de la Page** : L'ID trouvé à l'étape 4
   - **Nom de la Page** : Le nom de votre page Facebook
   - **Token d'Accès** : Le token de la page obtenu à l'étape 3
   - **Catégorie** : (Optionnel) Catégorie de votre page

## 📝 Publier un Article

1. Dans `/facebook-manager`, cliquez sur "Nouveau Post"
2. Sélectionnez un article depuis la liste (optionnel)
3. Remplissez le message
4. Ajoutez un lien vers votre article (généré automatiquement si vous sélectionnez un article)
5. Optionnel : Ajoutez une image URL
6. Optionnel : Programmez la publication avec une date/heure
7. Cliquez sur "Publier"

## 📊 Générer des Leads depuis Facebook

### Créer un Formulaire de Lead sur Facebook

1. Allez sur votre page Facebook
2. Cliquez sur "Créer" → "Formulaire de génération de leads"
3. Configurez votre formulaire avec les champs souhaités
4. Créez une annonce Facebook qui utilise ce formulaire

### Récupérer les Leads

Les leads générés via les formulaires Facebook apparaîtront automatiquement dans la section "Leads Facebook" de `/facebook-manager`.

Pour importer un lead dans votre système :
1. Cliquez sur "Importer" à côté du lead
2. Le lead sera créé dans votre système avec la source "FACEBOOK"

## 🔄 Synchronisation des Métriques

Les métriques (likes, commentaires, partages, portée) peuvent être synchronisées manuellement pour chaque post.

## ⚠️ Notes Importantes

- Les tokens d'accès peuvent expirer. Vous devrez peut-être les renouveler périodiquement.
- Assurez-vous que votre application Facebook est en mode "Production" pour un usage réel.
- Respectez les politiques de Facebook concernant la publication automatisée.
- Les formulaires de leads nécessitent une annonce Facebook active pour générer des leads.

## 📚 Ressources

- [Documentation Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Guide des Permissions Facebook](https://developers.facebook.com/docs/permissions/reference)
- [API de Publication Facebook](https://developers.facebook.com/docs/graph-api/reference/page/feed)
