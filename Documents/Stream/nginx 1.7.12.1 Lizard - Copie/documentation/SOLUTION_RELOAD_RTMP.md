# ⚠️ Problème : Le rechargement RTMP ne fonctionne pas toujours

## 🐛 Le problème

Vous avez raison : **"Recharger" ne fonctionne pas toujours pour les changements de flux RTMP**.

### Pourquoi ?

Le module **nginx-rtmp-module** a une limitation connue :
- ✅ Il recharge bien `nginx.conf` et les fichiers HTTP
- ❌ Il **ne recharge PAS toujours** les directives `push` dans la configuration RTMP
- ⚠️ Le `nginx -s reload` peut sembler réussir mais ne pas appliquer les changements

**C'est un bug connu du module RTMP**, pas de votre configuration !

---

## ✅ SOLUTION 1 : Mode FFmpeg Proxy (RECOMMANDÉ)

### 🎯 Avantages

- ✅ **Pas de rechargement nécessaire** - Contrôle 100% dynamique
- ✅ **Aucune coupure** - Les autres streams continuent
- ✅ **Latence minimale** - FFmpeg en mode `copy` (pas de transcodage)
- ✅ **Fonctionne à chaque fois** - Pas de bug de rechargement

### 🔧 Comment activer ?

1. Dans l'interface web, dans la section **"Mode"**
2. Activez le toggle **"FFmpeg Proxy"**
3. Configurez le chemin vers `ffmpeg.exe` si nécessaire
4. Redémarrez Nginx une fois pour basculer en mode FFmpeg

### 💡 Comment ça fonctionne ?

```
OBS → Nginx (rtmp://localhost:1935/live)
      ↓
Nginx → Distribue toujours vers tous les streams activés
      ↓
FFmpeg → Relay individuel pour chaque stream (démarre/arrête dynamiquement)
      ↓
Plateformes (Facebook, TikTok, etc.)
```

**Quand vous activez/désactivez un stream :**
- En mode FFmpeg : FFmpeg démarre/arrête le relay instantanément ✅
- En mode Nginx Direct : Nginx doit recharger (et ça ne fonctionne pas toujours) ❌

---

## ✅ SOLUTION 2 : Redémarrer Nginx (Alternative)

Si vous préférez rester en mode **Nginx Direct** :

### Comment faire ?

1. Activez/Désactivez un stream
2. **Cliquez sur "Redémarrer"** (pas "Recharger")
3. ⚠️ **Attention : Cela coupe TOUS les streams actifs**

### Quand utiliser ?

- Si vous avez peu de streams et que les coupures ne posent pas problème
- Si vous préférez la simplicité du mode Nginx Direct
- Si FFmpeg n'est pas disponible

---

## 📊 Comparaison

| Critère | Mode Nginx Direct | Mode FFmpeg Proxy |
|---------|-------------------|-------------------|
| **Rechargement RTMP** | ❌ Ne fonctionne pas toujours | ✅ Pas nécessaire |
| **Contrôle dynamique** | ❌ Nécessite redémarrage | ✅ Instantané |
| **Coupure des streams** | ❌ Oui (redémarrage) | ✅ Non |
| **Latence** | ✅ Aucune (direct) | ✅ Minimale (copy) |
| **Complexité** | ✅ Simple | ⚠️ Nécessite FFmpeg |
| **Fiabilité** | ❌ Bug de rechargement | ✅ 100% fiable |

---

## 🎯 Recommandation

**Utilisez le mode FFmpeg Proxy** si :
- ✅ Vous avez plusieurs streams actifs simultanément
- ✅ Vous voulez activer/désactiver sans couper les autres
- ✅ Vous avez FFmpeg installé
- ✅ Vous voulez une solution fiable

**Utilisez le mode Nginx Direct** seulement si :
- ⚠️ Vous avez un seul stream
- ⚠️ Les coupures ne posent pas problème
- ⚠️ Vous ne pouvez pas installer FFmpeg

---

## 🔧 Activer le mode FFmpeg maintenant

1. **Vérifiez que FFmpeg est installé** :
   - Téléchargez depuis https://ffmpeg.org/download.html
   - Ou utilisez le chemin que vous avez déjà configuré

2. **Dans l'interface web** :
   - Section "Mode" → Activez le toggle "FFmpeg Proxy"
   - Si FFmpeg n'est pas détecté, cliquez sur "Spécifier le chemin FFmpeg"

3. **Redémarrez Nginx une fois** :
   - C'est la dernière fois que vous devrez redémarrer pour les changements de flux !

4. **Testez** :
   - Activez/Désactivez un stream
   - Ça devrait fonctionner instantanément sans redémarrage ✅

---

## 📝 Note technique

Le problème du rechargement RTMP est documenté dans plusieurs issues :
- Le module nginx-rtmp-module ne gère pas toujours correctement le reload des directives `push`
- C'est pourquoi la solution FFmpeg Proxy est recommandée pour un contrôle dynamique fiable

---

**En résumé : Passez en mode FFmpeg Proxy pour éviter ce problème !** 🎯



