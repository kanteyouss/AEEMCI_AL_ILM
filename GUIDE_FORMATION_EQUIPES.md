# 👥 Guide de Formation des Équipes - AL ILM 2026

## 📌 Vue d'ensemble

Ce guide explique comment utiliser l'interface de formation des équipes pour les délégués culturels et administrateurs.

---

## 🎯 Objectifs

L'interface de formation des équipes permet de :
1. ✅ Visualiser tous les participants inscrits
2. ✅ Répartir les participants dans 10 équipes
3. ✅ Désigner un capitaine pour chaque équipe
4. ✅ Valider la composition finale
5. ✅ Générer automatiquement les codes d'accès
6. ✅ Télécharger les fiches PDF des équipes

---

## 📋 Étape par Étape

### 1️⃣ Accéder à la page de formation

**Chemin** : Dashboard Admin → Formation des Équipes

**URL** : `/admin/equipes.html`

**Prérequis** : Être connecté en tant qu'administrateur

---

### 2️⃣ Répartir les participants

#### A. Visualisation
- À gauche : **Pool de participants** (tous les inscrits)
- À droite : **10 équipes vides** avec symboles distinctifs

#### B. Méthodes de répartition

##### 🎲 Répartition Automatique (Recommandée)
1. Cliquez sur **"🎲 Répartition Automatique"**
2. L'algorithme répartit équitablement les participants
3. Prend en compte :
   - Équilibre homme/femme
   - Répartition par établissement (ESATIC/EMSP)
   - Taille des équipes (3-5 membres recommandés)

##### 🖱️ Répartition Manuelle (Drag & Drop)
1. **Glissez** un participant du pool
2. **Déposez-le** dans une équipe de votre choix
3. Répétez pour chaque participant

##### 🔍 Recherche de participants
- Utilisez la **barre de recherche** pour trouver un participant
- Tapez le nom, prénom ou établissement
- Les résultats s'affichent en temps réel

---

### 3️⃣ Désigner les capitaines

#### Pourquoi un capitaine ?
Le capitaine a des responsabilités spéciales :
- 🎖️ Coordonner l'équipe
- ✅ Valider les réponses collectives
- 📧 Recevoir les communications officielles
- 🔐 Gérer le code d'accès de l'équipe

#### Comment désigner un capitaine ?

##### Pour chaque équipe :
1. Trouvez le membre à désigner
2. Cliquez sur le bouton **"👑 Capitaine"** à côté de son nom
3. Le membre est immédiatement marqué comme capitaine
4. **Indicateur visuel** :
   - Badge **"👑 Capitaine"** en haut à droite
   - Carte mise en évidence (fond doré)
   - Bordure colorée distinctive

##### Changer de capitaine :
1. Cliquez sur **"👑 Capitaine"** sur un autre membre
2. Le nouveau capitaine remplace automatiquement l'ancien
3. Seul un capitaine par équipe est autorisé

##### Retirer un membre :
1. Cliquez sur **"❌ Retirer"**
2. Le membre retourne dans le pool
3. Si c'était le capitaine, l'équipe n'aura plus de capitaine

---

### 4️⃣ Valider la composition finale

#### Vérifications avant validation

Le système vérifie automatiquement :
- ✅ Chaque équipe a au moins 1 membre
- ✅ Chaque équipe avec des membres a un capitaine désigné
- ✅ Tous les participants sont assignés (optionnel)

#### Processus de validation

1. **Cliquez sur** : **"✅ Valider & Générer les Codes"**

2. **Modal de confirmation** s'affiche avec :
   - 📊 **Récapitulatif global** :
     - Nombre d'équipes formées
     - Total de participants assignés
     - Participants non assignés
   
   - ⚠️ **Avertissements** (si applicable) :
     - Équipes vides
     - Équipes sans capitaine
     - Participants non assignés
   
   - 📋 **Détail de chaque équipe** :
     - Nom et symbole
     - Nombre de membres
     - Nom du capitaine
     - Liste complète des membres

3. **Vérifiez les informations**
   - Parcourez chaque équipe
   - Vérifiez que les capitaines sont corrects
   - Notez les avertissements

4. **Confirmer ou Annuler**
   - **Annuler** : retour à l'édition
   - **Confirmer & Générer** : validation définitive

#### Après validation

Le système effectue automatiquement :
1. ✅ **Enregistrement** de la composition en base de données
2. 🔐 **Génération** d'un code d'accès unique par équipe
   - Format : 6 caractères alphanumériques
   - Exemple : `A7XK2P`
3. 📧 **Mise à jour** des profils participants
4. 🎯 **Activation** des espaces équipe

#### Notification de succès

Un message affiche :
- ✅ Nombre d'équipes validées
- 🔑 **Codes d'accès générés** pour chaque équipe
- 💡 Les codes sont disponibles dans les fiches PDF

---

### 5️⃣ Télécharger les fiches PDF

#### Générer le document PDF

1. **Cliquez sur** : **"📄 Télécharger Fiches PDF"**

2. Le système génère automatiquement :
   - **1 page par équipe** (10 pages au total)
   - Format professionnel A4
   - Prêt à imprimer

#### Contenu de chaque fiche

**En-tête** :
- 🕌 Logo AL ILM 2026
- Titre "FICHE ÉQUIPE"

**Informations de l'équipe** :
- 🔖 **Nom et symbole** de l'équipe
- 🔐 **Code d'accès** (encadré en évidence)
- 👑 **Capitaine** avec nom et établissement
- 👥 **Liste des membres** :
  - Prénom et nom
  - Établissement
  - Indication si capitaine

**Pied de page** :
- Copyright AL ILM 2026
- Numéro de page

#### Utilisation des fiches

**Distribution** :
- Imprimez les fiches
- Remettez chaque fiche au capitaine de l'équipe
- Le capitaine partage le code d'accès avec son équipe

**Conservation** :
- Gardez une copie numérique
- Sauvegardez le PDF pour référence
- Les codes sont également visibles dans le dashboard

---

## 🔄 Réinitialisation

### Tout réinitialiser

**Si vous voulez recommencer** :
1. Cliquez sur **"🔄 Tout Réinitialiser"**
2. **Confirmation requise**
3. Tous les participants retournent dans le pool
4. Les équipes sont vidées
5. Les capitaines sont réinitialisés

**⚠️ Attention** : Cette action est irréversible localement (avant validation)

---

## 💡 Conseils et bonnes pratiques

### Formation des équipes

✅ **Équilibre** :
- 3-5 membres par équipe idéalement
- Mixité homme/femme recommandée
- Représentation ESATIC/EMSP équilibrée

✅ **Choix du capitaine** :
- Choisissez un membre fiable et organisé
- De préférence avec un bon niveau en Islam
- Capable de coordonner et communiquer
- Disponible pendant tout le Ramadan

✅ **Vérification** :
- Vérifiez toujours le récapitulatif avant validation
- Assurez-vous que chaque équipe a un capitaine
- Confirmez que tous les participants sont assignés

### Après validation

✅ **Communication** :
- Informez immédiatement les capitaines
- Partagez les fiches PDF
- Expliquez l'importance du code d'accès

✅ **Sécurité** :
- Ne partagez pas les codes publiquement
- Chaque équipe doit garder son code confidentiel
- Les codes permettent l'accès aux espaces privés

### Gestion des codes

✅ **En cas de perte** :
- Les codes sont toujours visibles dans le dashboard admin
- Vous pouvez régénérer le PDF à tout moment
- Les codes ne changent pas après génération

---

## 🆘 Résolution de problèmes

### Problème : Impossible de désigner un capitaine

**Solution** :
1. Vérifiez que le membre est bien dans l'équipe
2. Rechargez la page si nécessaire
3. Essayez un autre navigateur

### Problème : Validation bloquée

**Causes possibles** :
- Équipes sans capitaine
- Données manquantes

**Solution** :
1. Lisez attentivement les avertissements
2. Corrigez les problèmes signalés
3. Réessayez la validation

### Problème : PDF ne se télécharge pas

**Solution** :
1. Vérifiez votre connexion internet
2. Autorisez les téléchargements dans votre navigateur
3. Désactivez temporairement le bloqueur de pop-up
4. Utilisez un navigateur récent (Chrome, Firefox, Edge)

### Problème : Participants manquants

**Solution** :
1. Vérifiez que les participants sont bien importés
2. Utilisez la recherche pour les trouver
3. Rechargez la page
4. Vérifiez les logs d'import dans le dashboard

---

## 📊 Statistiques et suivi

### Dashboard de formation

**Indicateurs en temps réel** :
- 📊 Participants dans le pool
- ✅ Participants assignés
- 👥 Nombre d'équipes formées
- 👑 Capitaines désignés

### Export des données

**Formats disponibles** :
- 📄 PDF (fiches équipes)
- 📧 Liste emails capitaines (à venir)
- 📊 Statistiques Excel (à venir)

---

## 🔐 Sécurité et confidentialité

### Codes d'accès

- **Uniques** : chaque équipe a un code différent
- **Aléatoires** : générés automatiquement
- **Permanents** : ne changent pas après génération
- **Confidentiels** : ne pas partager publiquement

### Données personnelles

- Les informations des participants sont protégées
- Accès réservé aux administrateurs
- Respect du RGPD et de la vie privée

---

## 📞 Support

**En cas de problème** :
- Consultez ce guide
- Vérifiez la section résolution de problèmes
- Contactez l'équipe technique AL ILM

**Contacts** :
- Email : support@alilm.aeemci.org (exemple)
- Documentation : `/docs`

---

## 🎉 Félicitations !

Vous savez maintenant comment :
- ✅ Répartir les participants en équipes
- ✅ Désigner les capitaines
- ✅ Valider la composition
- ✅ Générer les codes d'accès
- ✅ Télécharger les fiches PDF

**Prochaines étapes** :
1. Former toutes les équipes
2. Communiquer avec les capitaines
3. Lancer le concours AL ILM 2026

---

**🕌 Qu'Allah bénisse cette compétition et guide tous les participants ! 🌙**

---

*Guide rédigé pour AL ILM 2026 - AEEMCI*  
*Dernière mise à jour : 4 février 2026*
