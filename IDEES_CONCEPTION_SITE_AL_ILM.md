# 🕌 JEU CONCOURS AL ILM - ÉDITION 2026
## Idées de Conception du Site Web Interactif

---

## 📋 VISION GLOBALE

**Concept central** : Un site web complet qui digitalise l'intégralité du concours Al Ilm, de l'inscription à la proclamation des résultats, en respectant les valeurs islamiques de l'AEEMCI.

**Principe** : Le site n'est pas une simple vitrine, c'est l'outil de jeu lui-même. Toutes les interactions, évaluations, et progressions se font via l'interface web.

---

## 🎯 ARCHITECTURE DU SITE - MODULES PRINCIPAUX

### 1️⃣ MODULE ACCUEIL & PRÉSENTATION

#### Page d'accueil spirituelle
- **En-tête avec verset coranique** (Sourate Az-Zumar, 39:9)
- **Compteur en temps réel** jusqu'au début du Ramadan
- **Animation douce** rappelant le mois béni
- **Présentation de l'AEEMCI** et objectifs du concours
- **Vidéo de présentation** (optionnel)

#### Section informations
- Téléchargement des Termes de Référence (TDR)
- Document de révision avec questions types
- Planning complet des manches
- Règlement détaillé
- FAQ interactive

---

### 2️⃣ MODULE INSCRIPTION & FORMATION DES ÉQUIPES

#### 🔗 INTÉGRATION GOOGLE FORMS (Collecte externe)

> **Contexte** : L'AEEMCI utilise Google Forms pour la collecte initiale des inscriptions avant de les importer dans le site.

##### Formulaire Google Forms existant

**Champs collectés** :
- ✅ Nom
- ✅ Prénom
- ✅ Numéro de téléphone
- ✅ Établissement (ESATIC / EMSP)
- ✅ Niveau coranique (Ne sais pas lire / Débute / Lis aisément)
- ✅ Connaissance Hadiths An-Nawawi (OUI / NON / Moins de 5)
- ✅ Mémorisation Sourate 87-114 (OUI / NON / Un peu moins)
- ✅ Disponibilité 19h-20h pendant Ramadan (OUI / NON)

**Email de contact** : kanteyoussoufaziz@gmail.com

---

##### 📥 Import automatique des réponses dans le site

**Méthode 1 : Export manuel Google Sheets → Import CSV**

**Étape 1 : Exporter depuis Google Forms**
1. Google Forms → Réponses → Icône Google Sheets (vert)
2. Ouvrir le fichier Google Sheets généré
3. Télécharger : Fichier → Télécharger → .csv

**Étape 2 : Import dans le site Al Ilm**

Interface Admin :
```
┌─────────────────────────────────────────┐
│  📥 IMPORTATION DES INSCRIPTIONS        │
│                                         │
│  Source : Google Forms                  │
│                                         │
│  [ Parcourir... ] inscriptions.csv      │
│                                         │
│  Aperçu des colonnes détectées :        │
│  ✅ Horodateur                          │
│  ✅ Nom                                 │
│  ✅ Prénom                              │
│  ✅ Numéro de téléphone                 │
│  ✅ Établissement                       │
│  ✅ Niveau coranique                    │
│  ✅ Connaissance Hadiths                │
│  ✅ Mémorisation Sourate 87-114         │
│  ✅ Disponibilité 19h-20h               │
│                                         │
│  Correspondance des champs :            │
│  Google Forms    →    Site Al Ilm       │
│  ─────────────────────────────────      │
│  Nom             →    Nom ✓             │
│  Prénom          →    Prénom ✓          │
│  Téléphone       →    Téléphone ✓       │
│  Établissement   →    Institution ✓     │
│  Niveau coranique →   Profil religieux  │
│  Hadiths         →    Profil religieux  │
│  Sourate 87-114  →    Profil religieux  │
│  Disponibilité   →    Disponibilité ✓   │
│                                         │
│  120 lignes détectées                   │
│  [ Valider l'import ]                   │
└─────────────────────────────────────────┘
```

**Validation** :
- Vérification automatique des doublons (même nom + téléphone)
- Détection des champs manquants (alerte)
- Prévisualisation avant import final

**Résultat** :
```
✅ Import réussi !

120 participants importés :
- 85 ESATIC
- 35 EMSP

Profil coranique :
- 45 "Lis aisément"
- 60 "Débute"
- 15 "Ne sais pas lire"

Tous les participants sont maintenant disponibles 
pour la formation des équipes.

[ Créer les équipes maintenant → ]
```

---

**Méthode 2 : Synchronisation automatique (avancée)**

**Via Google Sheets API** :
- Connexion OAuth2 du site au compte Google
- Lecture automatique des nouvelles réponses toutes les heures
- Import incrémental (seulement les nouveaux)
- **Avantage** : Mise à jour en temps réel, pas d'export manuel

**Configuration Admin** :
```
┌─────────────────────────────────────────┐
│  🔗 SYNCHRONISATION GOOGLE FORMS        │
│                                         │
│  Statut : ✅ Connecté                   │
│                                         │
│  Feuille liée :                         │
│  "CONCOURS AL ILM - Inscriptions 2026"  │
│                                         │
│  Dernière synchro : Il y a 15 min       │
│  Nouvelles inscriptions : 3             │
│                                         │
│  [ Synchroniser maintenant ]           │
│  [ Déconnecter ]                       │
│  [ Configurer la fréquence ]           │
└─────────────────────────────────────────┘
```

---

##### 📊 Enrichissement des données importées

**Profil religieux automatique** :

Le site crée automatiquement un **profil de compétence** basé sur les réponses Google Forms :

```
Participant : Ahmed Ibrahim
─────────────────────────────

📖 Niveau Coran : ⭐⭐⭐ (Lis aisément)
   → Recommandé pour : Coran ouvert, Coran fermé

📚 Hadiths An-Nawawi : ✅ OUI (≥5 connus)
   → Recommandé pour : Rubrique Hadith

🕌 Mémorisation S87-114 : ✅ OUI
   → Recommandé pour : Coran fermé

⏰ Disponibilité : 19h-20h ✅
   → Compatible avec le planning

💡 Suggestion intelligente :
   Ahmed est un profil fort, idéal pour 
   capitaine ou lecteur principal.
```

---

##### 🎯 Formation intelligente des équipes (basée sur Google Forms)

**Algorithme d'équilibrage** :

1. **Répartition par niveau coranique** :
   - Chaque équipe a au moins 1 personne "Lis aisément"
   - Éviter les équipes avec que des "Ne sais pas lire"

2. **Diversité Hadiths** :
   - Au moins 1 personne connaissant ≥5 Hadiths par équipe

3. **Mixité ESATIC/EMSP** :
   - Favoriser la fraternité inter-établissements

4. **Disponibilité** :
   - Prioriser ceux disponibles 19h-20h

**Interface de suggestion automatique** :
```
┌─────────────────────────────────────────┐
│  🤖 FORMATION INTELLIGENTE              │
│                                         │
│  Algorithme : Équilibrage par compétences│
│                                         │
│  🌟 Équipe 1 - AL MOUHTADOUNE (Suggérée)│
│  ✅ Ahmed (ESATIC) - Niveau ⭐⭐⭐      │
│  ✅ Fatima (EMSP) - Niveau ⭐⭐         │
│  ✅ Ibrahim (ESATIC) - Niveau ⭐⭐      │
│  ✅ Khadija (EMSP) - Niveau ⭐          │
│  ... (12 membres au total)              │
│  Score équilibre : 85%                  │
│                                         │
│  📖 Équipe 2 - AL YAQRA'OUN (Suggérée) │
│  ✅ Omar (ESATIC) - Niveau ⭐⭐⭐       │
│  ✅ Aïcha (ESATIC) - Niveau ⭐⭐        │
│  ✅ Youssef (EMSP) - Niveau ⭐⭐        │
│  ... (12 membres au total)              │
│  Score équilibre : 88%                  │
│                                         │
│  🤲 Équipe 3 - AZ-ZAKIROUNE (Suggérée) │
│  ... (12 membres)                       │
│  Score équilibre : 82%                  │
│                                         │
│  ... (7 autres équipes)                 │
│                                         │
│  [ Accepter les suggestions ]          │
│  [ Ajuster manuellement ]              │
│  [ Régénérer ]                         │
└─────────────────────────────────────────┘
```

---

#### Interface d'inscription (si intégration directe au site)

> **Alternative** : Si vous souhaitez abandonner Google Forms et tout faire sur le site Al Ilm

**Formulaire d'inscription intégré au site** :
```
┌─────────────────────────────────────────┐
│  📝 INSCRIPTION JEU CONCOURS AL ILM     │
│                                         │
│  ✨ Allie savoir, spiritualité et       │
│     fraternité pendant Ramadan !        │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  👤 INFORMATIONS PERSONNELLES           │
│                                         │
│  Nom * : [____________]                 │
│  Prénom * : [____________]              │
│  Email étudiant * : [____________]      │
│  Téléphone * : [____________]           │
│                                         │
│  Établissement * :                      │
│  ○ ESATIC                               │
│  ○ EMSP                                 │
│                                         │
│  Niveau d'études :                      │
│  [Sélectionner▼] Licence 1, 2, 3...    │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  📖 PROFIL RELIGIEUX                    │
│                                         │
│  Quel est ton niveau coranique ? *      │
│  ○ Je ne sais pas lire                  │
│  ○ Je débute                            │
│  ○ Je lis aisément                      │
│                                         │
│  Connais-tu au moins 5 hadiths          │
│  d'An-Nawawi ? *                        │
│  ○ OUI                                  │
│  ○ NON                                  │
│  ○ Moins de 5 hadiths                   │
│                                         │
│  As-tu mémorisé de la sourate 87        │
│  (Al-A'la) à la sourate 114 (An-Nas)?*  │
│  ○ OUI                                  │
│  ○ NON                                  │
│  ○ UN PEU MOINS                         │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  ⏰ DISPONIBILITÉ                       │
│                                         │
│  Seras-tu disponible entre 19h et 20h   │
│  pendant le mois de Ramadan ? *         │
│  ○ Oui                                  │
│  ○ Non                                  │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  📸 PHOTO (optionnel)                   │
│  [ Parcourir... ]                       │
│                                         │
│  ─────────────────────────────────      │
│                                         │
│  ☑️ J'accepte le règlement du concours  │
│     et m'engage à participer avec       │
│     respect et fair-play.               │
│                                         │
│  [  S'INSCRIRE AU CONCOURS  ]          │
└─────────────────────────────────────────┘
```

**Validation automatique** :
- Email unique (pas de doublons)
- Téléphone au format ivoirien (+225...)
- Email étudiant vérifié (code envoyé par email)

**Confirmation** :
```
✅ Inscription réussie, Ahmed !

Un email de confirmation a été envoyé à :
ahmed.ibrahim@esatic.edu.ci

Prochaine étape :
Les équipes seront formées par la Délégation
Culturelle avant le début du Ramadan.

Tu recevras un email avec :
- Le nom de ton équipe
- Tes coéquipiers
- Ton code d'accès à l'espace équipe

📚 En attendant, prépare-toi :
[ Télécharger le document de révision ]

Qu'Allah te facilite l'apprentissage ! 🤲
```

---

##### 📧 Emails automatiques post-inscription

**Email 1 : Confirmation d'inscription**
```
Objet : ✅ Inscription confirmée - Jeu Concours Al Ilm 2026

Assalamu alaykum Ahmed,

Nous avons le plaisir de confirmer ton inscription au 
Jeu Concours Al Ilm – Édition 2026 !

📋 Tes informations :
- Nom : Ahmed Ibrahim
- Établissement : ESATIC
- Niveau coranique : Lis aisément ⭐⭐⭐
- Disponibilité : 19h-20h ✅

🔜 Prochaines étapes :
1. Formation des équipes (avant le Ramadan)
2. Réception de ton code d'accès équipe
3. Révision avec le document fourni
4. Début du concours (1er Ramadan 1447)

📎 Document de révision : [Télécharger]

Pour toute question : kanteyoussoufaziz@gmail.com
Ou appelle : 05-00-01-74-05

Qu'Allah bénisse ta participation !

AEEMCI - Section ESATIC
"Pour une identité islamique !"
```

**Email 2 : Attribution à une équipe**
```
Objet : 🎉 Bienvenue dans l'Équipe AL MOUHTADOUNE !

Assalamu alaykum Ahmed,

Les équipes sont formées ! Tu fais partie de :

🌟 ÉQUIPE AL MOUHTADOUNE (Les Biens Guidés)

Tes coéquipiers :
👑 Ahmed Ibrahim (Capitaine) - ESATIC
👤 Fatima Koné - EMSP
👤 Ibrahim Traoré - ESATIC
👤 Khadija Diallo - EMSP
👤 Omar Coulibaly - ESATIC
👤 Aïcha Touré - EMSP
👤 Youssef Sanogo - ESATIC
👤 Mariam Bamba - EMSP
👤 Moussa Konaté - ESATIC
👤 Zeinab Keita - EMSP
👤 Bilal Fofana - ESATIC
👤 Safiya Ouattara - EMSP

🔑 Code d'accès équipe : ALILM2026-MOUHTADOUNE

📱 Accède à ton espace équipe :
[Lien : https://alilm2026.aeemci.ci/login]

📎 Fiche équipe complète (PDF) : [Télécharger]

💬 Chat équipe activé : échangez, révisez ensemble !

📅 Première manche : [Date] à 19h

🎨 Couleur de votre équipe : Vert émeraude 🌟

Bonne préparation et qu'Allah vous accorde la victoire !

AEEMCI - Section ESATIC
"Pour une identité islamique !"
```

---

##### 🔄 Workflow complet : Google Forms → Site Al Ilm

```
┌─────────────────────────────────────────┐
│  ÉTAPE 1 : COLLECTE                     │
│  Google Forms ouvert                    │
│  → 120 étudiants s'inscrivent           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ÉTAPE 2 : EXPORT                       │
│  Admin télécharge Google Sheets en CSV  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ÉTAPE 3 : IMPORT SITE AL ILM           │
│  Upload CSV → Validation → Import       │
│  120 participants créés dans la BDD     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ÉTAPE 4 : ENRICHISSEMENT               │
│  Profil religieux généré automatiquement│
│  (basé sur niveau coran, hadiths...)    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ÉTAPE 5 : FORMATION ÉQUIPES            │
│  Algorithme ou manuel (drag & drop)     │
│  → 10 équipes de 12 membres             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ÉTAPE 6 : NOTIFICATION                 │
│  Email automatique à chaque participant │
│  avec nom équipe + code d'accès         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  ÉTAPE 7 : ACTIVATION                   │
│  Les équipes accèdent à leur espace     │
│  Révision, chat, préparation...         │
│  ✅ Prêt pour le concours !             │
└─────────────────────────────────────────┘
```

---

##### 📋 Modèle CSV pour import (format attendu)

**Fichier : inscriptions_alilm2026.csv**

```csv
Horodateur,Nom,Prénom,Numéro de téléphone,Établissement,Niveau coranique,Hadiths AN NAWAWI,Mémorisation S87-114,Disponibilité 19h-20h
2026-01-15 14:23:10,Ibrahim,Ahmed,+225 07 12 34 56 78,ESATIC,je lis aisément,OUI,OUI,Oui
2026-01-15 14:25:30,Koné,Fatima,+225 05 98 76 54 32,EMSP,je débute,Moins de 5 hadiths,UN PEU MOINS,Oui
2026-01-15 14:27:45,Traoré,Ibrahim,+225 01 23 45 67 89,ESATIC,je lis aisément,OUI,NON,Oui
...
```

**Mapping automatique** :
- `Nom` → `last_name`
- `Prénom` → `first_name`
- `Numéro de téléphone` → `phone`
- `Établissement` → `institution` (ESATIC/EMSP)
- `Niveau coranique` → `quran_level` (beginner/intermediate/advanced)
- `Hadiths AN NAWAWI` → `hadith_knowledge` (yes/partial/no)
- `Mémorisation S87-114` → `quran_memorization` (yes/partial/no)
- `Disponibilité 19h-20h` → `availability` (available/unavailable)

---

##### 💡 Recommandations
**Formulaire d'inscription individuelle** :
- Nom complet
- Email étudiant
- Numéro de téléphone
- Institution (ESATIC / EMSP)
- Niveau d'études
- Photo (optionnel)

#### Tableau de bord délégués culturels
**Espace réservé aux délégués** pour :
- Visualiser tous les inscrits
- Créer les 10 équipes (drag & drop)
- Attribuer un nom à chaque équipe
- Désigner le capitaine
- Valider la composition finale
- Générer automatiquement les codes d'accès par équipe

#### Profil équipe
Chaque équipe dispose de :
- **Espace privé** avec code d'accès unique
- **Composition de l'équipe** (noms, photos)
- **Statistiques** (préparation, points accumulés)
- **Document de révision** téléchargeable
- **Messagerie interne** entre coéquipiers

---

### 2️⃣ BIS - ESPACE CAPITAINE D'ÉQUIPE

#### 🎖️ Tableau de bord Capitaine

##### Vue d'ensemble de l'équipe
- **Carte d'identité équipe** :
  - Nom de l'équipe (ex: 🌟 AL MOUHTADOUNE)
  - Signification (ex: "Les Biens Guidés")
  - Logo/Symbole (⭐ Étoile guidant)
  - Couleur (Vert émeraude #2ECC71)
  - Code d'accès (visible/masquable : ALILM2026-MOUHTADOUNE)
  - Nombre de membres
- **Liste des membres** avec photos et contacts
- **Progression globale** : barre de niveau, points totaux
- **Prochaine manche** : compte à rebours + détails

##### Gestion des membres
**Répartition des rôles par rubrique** :
- **Désigner le lecteur** pour Coran ouvert
- **Désigner le lecteur** pour Coran fermé
- **Désigner le muezzin** pour Adhan
- **Désigner le récitateur** pour Hadith
- **Pour les questions** : tous les membres participent

**Interface de désignation** :
- Liste déroulante ou bouton radio par membre
- Validation avec confirmation
- Possibilité de changer avant la manche
- Notification automatique au membre désigné

##### Coordination de l'équipe
**Planification** :
- Calendrier partagé : sessions de révision
- Rappels automatiques : "Révision Jurisprudence ce soir 19h"
- To-do list collaborative

**Communication** :
- **Chat privé équipe** : fil de discussion
- **Annonces du capitaine** : messages épinglés
- **Partage de ressources** : upload de documents (notes, audio Tajwid...)

##### Suivi de la préparation
**Statistiques de révision par membre** :
- Temps passé sur la plateforme
- Quiz complétés
- Score moyen aux entraînements
- Points forts / Points faibles

**Alertes du capitaine** :
- ⚠️ Membre X n'a pas révisé depuis 3 jours
- 💡 Suggestion : "Concentrez-vous sur la Jurisprudence (score équipe: 60%)"

##### Soumission des réponses (pendant le concours)
**Pour les rubriques collectives** (Questions écrites) :
- **Consultation en temps réel** des réponses des membres
- **Validation finale** : le capitaine valide avant soumission officielle
- **Modification possible** si désaccord (avec justification)

**Pour les rubriques individuelles** :
- Vérification que le membre désigné a bien soumis
- Rappel si oubli (notification push)

##### Consultation des résultats
**Résultats détaillés** :
- Score par rubrique avec détail
- Comparaison avec les autres équipes
- Feedback du jury (si disponible)
- Évolution du classement (graphique)

**Export** :
- Bulletin de performance (PDF)
- Certificats de participation pour tous les membres

---

### 2️⃣ TER - ESPACE COMPÉTITEUR (Membre d'équipe)

#### 👤 Interface Compétiteur

##### Tableau de bord personnel
- **Carte de profil** :
  - Photo, nom, équipe
  - Rôle(s) assigné(s) (ex: Lecteur Coran fermé)
- **Prochaine action** : "Tu récites Coran fermé demain à 15h20"
- **Progression personnelle** :
  - Quiz d'entraînement réussis
  - Temps de révision
  - Niveau par rubrique

##### Page Mon équipe
- **Liste des coéquipiers** avec moyens de contact
- **Chat d'équipe** : participation aux discussions
- **Calendrier partagé** : voir les sessions de révision
- **Contributions** : documents partagés

##### Espace de révision personnel
**Accès à toutes les ressources** :
- Bibliothèque de questions
- Quiz personnalisés selon le rôle assigné
- Guides Tajwid (si lecteur Coran)
- Hadiths d'An-Nawawi (si récitateur Hadith)
- Entraînement Adhan (si muezzin)

**Suivi de progression** :
- Score aux quiz
- Temps passé par rubrique
- Recommandations : "Révise encore la Jurisprudence"

##### Participation aux manches
**Notification de convocation** :
- "C'est ton tour dans 30 min - Rubrique: Coran fermé"
- Accès direct au lien de la session

**Interface de soumission** :
- **Pour Coran/Adhan/Hadith** : enregistrement audio/vidéo
- **Pour questions collectives** : réponse collaborative visible par l'équipe
- Chronomètre et instructions claires

**Statut de participation** :
- ✅ Soumis
- ⏳ En attente d'évaluation
- 🏆 Résultat reçu

##### Résultats personnels
- **Performance par rubrique** où il a participé
- **Note du jury** (pour récitations)
- **Contribution au score total** de l'équipe
- **Statistiques** : comparaison avec la moyenne

##### Gamification personnelle
- **Badges individuels** :
  - 🎤 Meilleur Adhan de l'équipe
  - 📖 Expert Coran
  - 🧠 Champion quiz
- **Niveaux** : Débutant → Intermédiaire → Expert → Maître
- **Points d'expérience** (XP) gagnés par activité

---

### 2️⃣ QUATER - ESPACE PUBLIC (Spectateur)

#### 🌍 Pages accessibles sans connexion

##### Page d'accueil publique
- **Présentation du concours** Al Ilm 2026
- **Verset et citation** inspirants
- **Compteur** jusqu'au Ramadan / prochaine manche
- **Actualités** : dernières nouvelles du concours
- **Bouton d'inscription** bien visible (si période ouverte)

##### Informations générales
- **À propos de l'AEEMCI** : mission, valeurs, contact
- **Règlement complet** : TDR téléchargeable
- **FAQ interactive** : questions fréquentes
- **Galerie** : photos des éditions précédentes

##### Calendrier public
- **Vue des manches** :
  - Dates des phases (Préliminaire, Quarts, Demi, Finale)
  - Nombre d'équipes participantes
  - **Pas de détails horaires précis** (éviter afflux spectateurs physiques)
- **Compte à rebours** jusqu'à la prochaine manche

##### 🏆 Classement en temps réel
**Tableau de classement public** :
- **Nom des équipes** (ou numéros si anonymat souhaité)
- **Points totaux** (cumul)
- **Évolution** : ↗️ ↘️ →
- **Podium animé** : top 3 mis en avant
- **Rafraîchissement automatique** toutes les 5 min (pendant compétition)

**Statistiques publiques** :
- Équipe avec le meilleur Adhan
- Record de points en une manche
- Performance moyenne par rubrique

##### 📺 Live et rediffusion (si activé)
- **Streaming de la finale** : lecteur vidéo intégré
- **Chat public modéré** : encouragements respectueux
- **Replay** : revoir les moments forts

##### Galerie médias
- **Photos officielles** du concours
- **Vidéos best-of** : meilleurs Adhans, récitations...
- **Témoignages** : interviews de participants

##### Actualités et blog
- **Articles** sur le déroulement du concours
  - "Jour 1 : Une première journée sous le signe de la fraternité"
  - "Portrait d'équipe : Rencontre avec l'Équipe Al-Fatiha"
- **Conseils spirituels** pour le Ramadan
- **Rappels islamiques** quotidiens

##### Partage social
**Boutons de partage** :
- Facebook, Twitter, WhatsApp, LinkedIn
- Hashtags : #AlIlm2026 #AEEMCI #RamadanESATIC
- **Génération d'images** : "Soutenez l'Équipe X !"

##### Contact et support
- **Formulaire de contact** : questions du public
- **Email** : info@aeemci-alilm.org
- **Téléphones** de la délégation culturelle
- **Réseaux sociaux** : liens Instagram, Facebook, YouTube AEEMCI

---

#### 🔐 Gestion des accès par rôle

##### Matrice des permissions

| Fonctionnalité | Admin | Capitaine | Compétiteur | Public |
|----------------|-------|-----------|-------------|--------|
| **Inscription au concours** | ✅ | ❌ | ❌ | ✅ |
| **Création d'équipes** | ✅ | ❌ | ❌ | ❌ |
| **Désignation de rôles** | ✅ | ✅ | ❌ | ❌ |
| **Gestion des questions** | ✅ | ❌ | ❌ | ❌ |
| **Révision (bibliothèque)** | ✅ | ✅ | ✅ | ❌ |
| **Participation aux manches** | ✅ | ✅ | ✅ | ❌ |
| **Soumission réponses** | ✅ | ✅ (validation) | ✅ | ❌ |
| **Notation** | ✅ | ❌ | ❌ | ❌ |
| **Consultation résultats détaillés** | ✅ | ✅ (équipe) | ✅ (perso) | ❌ |
| **Classement général** | ✅ | ✅ | ✅ | ✅ |
| **Chat équipe** | ✅ | ✅ | ✅ | ❌ |
| **Publication résultats** | ✅ | ❌ | ❌ | ❌ |
| **Consultation live/replay** | ✅ | ✅ | ✅ | ✅ (si public) |
| **Téléchargement certificats** | ✅ | ✅ | ✅ | ❌ |

##### Système de connexion

**Inscription** :
- Public → Formulaire d'inscription → **Compétiteur**
- Admin crée les équipes → désigne les **Capitaines**

**Connexion** :
- **Compétiteur/Capitaine** : Email + Mot de passe OU Code équipe
- **Admin** : Identifiants sécurisés (2FA optionnel)
- **Public** : Pas de connexion nécessaire (accès libre aux pages publiques)

**Première connexion** :
- Configuration du profil (photo, bio courte)
- Acceptation de la charte du concours
- Visite guidée de l'interface (tutoriel interactif)

---

### 3️⃣ MODULE PRÉPARATION & RÉVISION

#### Bibliothèque de révision interactive
- **Questions types classées par rubrique** :
  - Coran ouvert / fermé
  - Jurisprudence
  - Vie du Prophète (ﷺ) et Compagnons
  - Culture générale
  - Hadith (10 premiers d'An-Nawawi)

#### Quiz d'entraînement
- **Mode simulation** : chaque équipe peut s'entraîner
- **Chronomètre intégré** pour habituer aux contraintes de temps
- **Scores de révision** (ne comptent pas pour le concours)
- **Corrections automatiques** avec explications

#### Espace d'apprentissage Tajwid
- **Guides audio** pour Coran ouvert/fermé
- **Vidéos explicatives** des règles de Tajwid
- **Récitations modèles** de Juz Amma et sourates 87-114

---

### 4️⃣ MODULE PLANIFICATION & CALENDRIER

#### Calendrier interactif du Ramadan
- **Vue mensuelle** avec dates hijri et grégorienne
- **Marqueurs colorés** pour chaque phase :
  - 🟢 Phase préliminaire (Jour 1, 2, 3)
  - 🟡 Quarts de finale (Jour 1, 2, 3)
  - 🟠 Demi-finales (Jour 1, 2)
  - 🔴 Finale

#### Notifications automatiques
- **Rappels par email/SMS** :
  - 48h avant chaque manche
  - 24h avant
  - 2h avant
- **Notifications in-app** dans l'espace équipe

#### 📅 GÉNÉRATEUR AUTOMATIQUE DE PROGRAMME

##### Interface de programmation (réservée aux délégués)
**Paramètres configurables** :
- **Sélection des dates** pour chaque phase (via calendrier)
- **Horaires de début/fin** de chaque journée
- **Durée estimée** par rubrique :
  - Adhan : 5 min par équipe
  - Coran ouvert : 10 min par équipe
  - Coran fermé : 8 min par équipe
  - Questions Coran : 15 min pour toutes les équipes
  - Questions Prophète : 15 min pour toutes les équipes
  - Jurisprudence : 15 min pour toutes les équipes
  - Culture générale : 20 min pour toutes les équipes
  - Questions relais : 20 min pour toutes les équipes
  - Hadith : 10 min par équipe
- **Temps de pause** entre rubriques (5-10 min)
- **Nombre d'équipes** par session

##### Génération intelligente du planning
**Algorithme de répartition** :
1. **Calcul automatique** du temps total nécessaire
2. **Distribution équitable** des équipes sur les jours disponibles
3. **Alternance des rubriques** pour éviter la monotonie
4. **Gestion des contraintes** :
   - Respect des horaires de prière
   - Pause déjeuner (si concours en journée)
   - Temps de préparation entre équipes
5. **Optimisation** : éviter les temps morts

##### Résultat : Programme généré automatiquement

**Format de sortie** :
```
📅 PHASE PRÉLIMINAIRE
──────────────────────────────────

🗓️ Jour 1 - [Date] Ramadan 1447
⏰ 14h00 - 18h30

14h00-14h05 | Ouverture & Invocation
14h05-14h20 | ADHAN - Équipes 1, 2, 3
14h20-14h35 | CORAN OUVERT - Équipes 1, 2, 3
14h35-14h50 | CORAN FERMÉ - Équipes 1, 2, 3
14h50-15h00 | ☕ PAUSE
15h00-15h15 | QUESTIONS CORAN - Toutes équipes
15h15-15h30 | JURISPRUDENCE - Toutes équipes
15h30-15h35 | 🕌 PAUSE PRIÈRE (si nécessaire)
15h35-16h00 | CULTURE GÉNÉRALE - Toutes équipes
16h00-16h25 | QUESTIONS RELAIS - Toutes équipes
16h25-16h45 | HADITH - Équipes 1, 2, 3
16h45-17h00 | ☕ PAUSE
17h00-17h30 | Délibération jury
17h30-18h00 | Proclamation résultats J1
18h00-18h30 | Clôture & Invocation
```

**Tableau détaillé par équipe** :
- **Chaque équipe** reçoit son horaire personnalisé
- **Notifications** automatiques 30 min avant leur passage
- **Code couleur** : 🟢 Passage terminé | 🟡 En cours | 🔴 À venir

##### Export et partage du programme
- **PDF téléchargeable** : programme complet imprimable
- **iCal/Google Calendar** : ajout automatique au calendrier
- **Affichage sur le site** : page dédiée accessible à tous
- **Envoi par email** : programme personnalisé par équipe
- **QR Code** : accès rapide au programme mobile

##### Modifications en temps réel
**Gestion des imprévus** :
- **Décalage d'horaires** (retard, absence)
- **Ajustement automatique** des créneaux suivants
- **Alerte aux équipes concernées** par SMS/notification
- **Historique des modifications** pour traçabilité

#### Tableau de programmation détaillé
Pour chaque jour de compétition :
- **Rubriques du jour** (générées automatiquement)
- **Horaire de passage par équipe** (calculé selon durées)
- **Lien de connexion** à la session
- **Statut** (en attente / en cours / terminé)
- **Temps restant** avant le début (compte à rebours)

---

### 5️⃣ MODULE JEU RÉEL - INTERFACE DE COMPÉTITION

#### Salle d'attente virtuelle
Avant chaque manche :
- **Écran de bienvenue** avec ambiance Ramadan
- **Compte à rebours** avant le début
- **Liste des équipes participantes**
- **Règles rappelées**
- **Invocations de début** (Dua)

---

#### 🎤 RUBRIQUE ADHAN

**Interface de soumission** :
- **Enregistrement audio en direct** (3 min max)
- OU **Upload fichier audio** pré-enregistré
- **Timer visible** pendant l'enregistrement
- **Possibilité de réécoute** avant soumission
- **Validation finale** par le capitaine

**Tableau de bord jury** :
- **Lecture de tous les Adhans**
- **Grille de notation** :
  - Voix : /3 pts (curseur ou sélection)
  - Prononciation : /7 pts
- **Calcul automatique** du total /10
- **Commentaires** (optionnel)

---

#### 📖 RUBRIQUE CORAN OUVERT

**Interface participant** :
- **Partie imposée affichée** (ex: Sourate An-Naba, versets X-Y)
- **Enregistrement audio/vidéo** de la récitation
- **Affichage du Mushaf** en parallèle (optionnel, pour référence)
- **Timer** pour mesurer la rapidité de recherche

**Grille d'évaluation jury** :
- Rapidité de recherche : indicateur visuel
- Voix : /5 pts
- Tajwid : /10 pts
- **Total : /15 pts**

---

#### 📗 RUBRIQUE CORAN FERMÉ

**Interface simplifiée** :
- **Portion imposée** (Sourate 87-114)
- **Enregistrement audio** uniquement
- **Pas de consultation** du Mushaf

**Grille jury** :
- Voix : /5 pts
- Tajwid : /10 pts
- **Total : /15 pts**

---

#### ❓ RUBRIQUE QUESTIONS (Coran, Prophète, Jurisprudence, Culture générale)

**Interface de jeu en temps réel** :

##### Mode question-réponse
- **Affichage de la question** en grand
- **Chronomètre visible** (15 sec par question)
- **Zone de réponse** :
  - Champ texte libre
  - OU QCM (selon type de question)
- **Validation dans le temps imparti**
- **Indicateur de temps écoulé** (barre de progression)

##### Système de points en direct
- **Affichage immédiat** : bonne réponse = +points
- **Leaderboard en temps réel** visible par toutes les équipes
- **Animation de points** (+5, +15, +25 selon la rubrique)

##### Feuille de réponse numérique
- **Nom de l'équipe** pré-rempli
- **Questions numérotées**
- **Réponses enregistrées automatiquement**
- **Horodatage** de chaque soumission

---

#### 🏃 RUBRIQUE QUESTIONS RELAIS

**Mécanisme de jeu dynamique** :

1. **Désignation du 1er participant** par l'équipe
2. **Question posée** avec chronomètre
3. **Soumission de la réponse**
4. **Résultat instantané** :
   - ✅ **Bonne réponse** → Points gagnés → Relais au coéquipier suivant
   - ❌ **Mauvaise réponse** → Fin du relais pour l'équipe
5. **Tableau de suivi** : nombre de relais réussis par équipe

**Affichage spectaculaire** :
- Animation de passage de relais
- Son de validation/échec
- Classement en direct

---

#### 📚 RUBRIQUE HADITH

**Interface de tirage au sort** :
- **Affichage de 10 cartes virtuelles** numérotées (1-10)
- **Participant clique** sur une carte
- **Révélation du numéro** (animation de retournement)
- **Affichage du hadith** correspondant (texte arabe + numéro)

**Enregistrement de la récitation** :
- **Chronomètre** (temps limité, ex: 2 min)
- **Enregistrement audio**
- **Possibilité de réécoute**

**Évaluation jury** :
- **Exactitude** : 20 pts si correct, 0 sinon
- **Option** : points partiels selon la précision

---

### 6️⃣ MODULE ÉVALUATION & NOTATION

#### Tableau de bord Jury
**Accès réservé** aux délégués culturels et jury :

##### Vue d'ensemble
- **Liste des équipes** avec statut
- **Rubriques à évaluer** par jour
- **Priorisation** (en attente d'évaluation en rouge)

##### Interface de notation par rubrique
- **Lecture/écoute** des soumissions
- **Grille de notation** selon le barème :
  - Adhan : Voix /3 + Prononciation /7
  - Coran : Voix /5 + Tajwid /10
  - Questions : validation automatique ou manuelle
  - Hadith : /20 pts

##### Calcul automatique
- **Total par rubrique**
- **Total par manche**
- **Cumul depuis le début** du concours

##### Export des notes
- **Tableau Excel** téléchargeable
- **PDF** pour archivage

---

#### Système de double vérification
- **Notation par 2 jurés** minimum
- **Moyenne automatique**
- **Alerte** si écart important entre jurés
- **Délibération** possible via commentaires

---

### 7️⃣ MODULE PROGRESSION & CLASSEMENT

#### Tableau de classement en temps réel

##### Vue publique (pour les équipes)
- **Classement général** après chaque manche
- **Points par rubrique**
- **Évolution** (↗️ progression, ↘️ régression)
- **Graphiques** de performance

##### Vue détaillée (pour chaque équipe)
- **Historique de toutes les manches**
- **Points gagnés par rubrique**
- **Comparaison** avec les autres équipes
- **Points forts** et axes d'amélioration

#### Qualification automatique
- **Algorithme de sélection** selon le barème
- **Annonce des qualifiés** :
  - Phase préliminaire → Quarts de finale
  - Quarts → Demi-finales
  - Demi-finales → Finale

#### Badges et récompenses virtuelles
- 🏅 Meilleure récitation Coran
- 🎯 Meilleur Adhan
- 📚 Expert en Hadith
- 🧠 Champion de culture générale
- ⚡ Roi du relais

---

### 8️⃣ MODULE PROCLAMATION DES RÉSULTATS

#### Page de résultats finale

##### Podium interactif
- 🥇 **1ère place** : Animation dorée
- 🥈 **2ème place** : Animation argentée
- 🥉 **3ème place** : Animation bronze
- **Noms des équipes** et membres
- **Points totaux**

##### Palmarès complet
- **Classement des 10 équipes**
- **Statistiques globales** :
  - Meilleure performance par rubrique
  - Record de points en une manche
  - Équipe la plus régulière

##### Certificats numériques
- **Génération automatique** de certificats PDF :
  - Certificat de participation (toutes les équipes)
  - Certificat de mérite (finalistes)
  - Certificat d'excellence (podium)
- **Logo AEEMCI** et signature digitale
- **Téléchargement instantané**

##### Galerie photos/vidéos
- **Best moments** du concours
- **Photos d'équipes**
- **Témoignages** des participants

---

### 9️⃣ MODULE COMMUNICATION & COMMUNITY

#### Fil d'actualités
- **Annonces officielles** des délégués
- **Encouragements** entre équipes
- **Citations islamiques** quotidiennes pendant le Ramadan
- **Invocations** et rappels spirituels

#### Messagerie
- **Chat intra-équipe** (privé)
- **Forum général** (respectueux et modéré)
- **Messages des délégués** (diffusion)

#### Partage social
- **Génération de visuels** à partager :
  - "Mon équipe participe à Al Ilm 2026"
  - Résultats de manche
  - Citation + logo AEEMCI
- **Hashtags** : #AlIlm2026 #AEEMCI #RamadanESATIC

---

### 🔟 MODULE ADMINISTRATION

#### 👨‍💼 RÔLES ET PERMISSIONS

Le site gère **4 types d'utilisateurs** avec des accès différenciés :

---

##### 🔴 Administrateur (Délégation Culturelle)
**Accès complet** avec droits exclusifs :
- Gestion des utilisateurs
- Gestion des questions
- Création des équipes
- Organisation des manches
- Attribution et validation des scores
- Publication des résultats
- Paramétrage global du site

##### 🟡 Capitaine d'équipe
**Accès étendu** pour gérer son équipe :
- Visualisation complète de l'équipe
- Désignation des participants par rubrique
- Soumission des réponses au nom de l'équipe
- Validation finale avant envoi
- Communication avec les coéquipiers
- Consultation des résultats détaillés de son équipe

##### 🟢 Compétiteur (Membre d'équipe)
**Accès de base** pour participer :
- Visualisation de son équipe
- Accès à la bibliothèque de révision
- Participation aux rubriques assignées
- Soumission de réponses individuelles (Adhan, Coran, Hadith)
- Consultation des résultats personnels
- Chat avec les coéquipiers

##### 🔵 Public (Spectateur)
**Accès lecture seule** :
- Page d'accueil et présentation
- Règlement et TDR
- Calendrier public des manches
- Classement général en temps réel
- Galerie photos/vidéos (si autorisé)
- FAQ et informations générales
- **Pas d'inscription requise** pour consulter

---

#### 1️⃣ GESTION DES UTILISATEURS

##### Interface de gestion complète
**Tableau de bord utilisateurs** :
- **Liste paginée** de tous les inscrits (recherche, filtre, tri)
- **Colonnes** : Nom, Email, Téléphone, Institution, Date inscription, Statut
- **Actions individuelles** :
  - ✏️ Modifier les informations
  - 🗑️ Supprimer un compte
  - 🔒 Bloquer/Débloquer un utilisateur
  - 📧 Envoyer un email
  - 📱 Envoyer un SMS
- **Actions groupées** :
  - Sélection multiple pour envoi massif
  - Export Excel/CSV de la liste
  - Import en masse (fichier CSV)

##### Statistiques utilisateurs
- **Nombre total d'inscrits**
- **Répartition** : ESATIC vs EMSP
- **Graphique** : inscriptions par jour
- **Taux d'activation** des comptes (email confirmé)

##### Gestion du jury
- **Création de comptes jury** (identifiants spéciaux)
- **Attribution des permissions** :
  - Évaluation uniquement
  - Évaluation + consultation
  - Accès complet
- **Liste des jurés** avec statut (actif/inactif)
- **Historique des notations** par juré

---

#### 2️⃣ GESTION DES QUESTIONS

##### Banque de questions centralisée

**Interface de création de questions** :
- **Formulaire dynamique** par rubrique :
  - **Questions Coran** : Question + Réponse + Verset de référence
  - **Jurisprudence** : Question + Réponse + Source (madhab, savant)
  - **Vie du Prophète (ﷺ)** : Question + Réponse + Référence (Sîra)
  - **Culture générale** : Question + Réponse + Catégorie
  - **Hadith** : Texte arabe + Traduction + Narrateur + Référence
- **Type de question** : QCM (4 choix) OU Texte libre
- **Niveau de difficulté** : Facile / Moyen / Difficile
- **Points attribués** : configurable
- **Ajout de médias** : image, audio (pour récitations)

**Gestion de la bibliothèque** :
- **Vue liste** : toutes les questions avec filtres
  - Par rubrique
  - Par difficulté
  - Par statut (validée, en attente, rejetée)
- **Recherche avancée** : mots-clés, tags
- **Actions** :
  - ✏️ Modifier une question
  - 🗑️ Supprimer
  - 📋 Dupliquer
  - ✅ Valider (question prête pour le concours)
  - 🔒 Marquer comme "utilisée" (éviter répétition)

**Import/Export massif** :
- **Import Excel/CSV** : modèle fourni pour ajout en masse
- **Export** : sauvegarde complète de la banque
- **Import depuis éditions précédentes** : réutiliser questions 2025, 2024...

**Attribution aux manches** :
- **Glisser-déposer** des questions vers une manche spécifique
- **Sélection aléatoire** : "Tirer X questions de niveau Moyen en Jurisprudence"
- **Prévisualisation** : voir toutes les questions d'une manche avant activation

**Validation collaborative** :
- **Soumission de questions** par des contributeurs (imams, savants)
- **Workflow de validation** : En attente → Relecture → Approuvée → Publiée
- **Commentaires** et suggestions d'amélioration

---

#### 3️⃣ CRÉATION DES ÉQUIPES

##### Assistant de formation d'équipes

**Étape 1 : Visualisation des inscrits**
- **Liste complète** des participants disponibles
- **Filtres** : Institution, niveau, disponibilité
- **Indicateur** : "Déjà assigné" ou "Disponible"

**Étape 2 : Création manuelle**
- **Interface drag & drop** :
  - Colonne gauche : participants disponibles
  - 10 colonnes droites : équipes (1 à 10)
  - Glisser un participant vers une équipe
- **Informations par équipe** :
  - Nom de l'équipe (modifiable)
  - Liste des membres (minimum 3)
  - Désignation du capitaine (étoile ⭐)
- **Validation automatique** :
  - ⚠️ Alerte si équipe < 3 membres
  - ⚠️ Alerte si participant assigné 2 fois

**Étape 3 : Attribution automatique (optionnel)**
- **Algorithme équitable** :
  - Répartition aléatoire
  - OU Répartition selon niveau (équilibrage)
- **Aperçu** avant validation
- **Possibilité d'ajustement** manuel après

**Étape 4 : Configuration des équipes**

##### Noms d'équipes officiels (prédéfinis)

**Liste des 9 équipes principales** avec signification :

1. **🌟 AL MOUHTADOUNE** (Les Biens Guidés)
   - Couleur : Vert émeraude
   - Symbole : Étoile guidant

2. **📖 AL YAQRA'OUN** (Les Lecteurs du Coran)
   - Couleur : Bleu nuit
   - Symbole : Mushaf ouvert

3. **🤲 AZ-ZAKIROUNE** (Ceux qui se rappellent d'Allah)
   - Couleur : Or
   - Symbole : Chapelet (Tasbih)

4. **💚 AT-TAWWABOUNE** (Ceux qui implorent le pardon d'Allah)
   - Couleur : Vert clair
   - Symbole : Mains en invocation

5. **⏳ AS-SABIROUNE** (Les Patients)
   - Couleur : Beige
   - Symbole : Sablier

6. **🕌 AL MOUTAQOUNE** (Les Pieux)
   - Couleur : Blanc pur
   - Symbole : Mosquée

7. **✨ AS-SALIHOUNE** (Les Vertueux)
   - Couleur : Argent
   - Symbole : Lumière rayonnante

8. **⚔️ AL MOUDJAHIDOUNE** (Les Soldats d'Allah)
   - Couleur : Rouge foncé
   - Symbole : Bouclier

9. **🙏 ASH-SHAKIROUNE** (Ceux qui sont reconnaissants)
   - Couleur : Orange doré
   - Symbole : Cœur rayonnant

**Équipes supplémentaires (si plus de 9)** :

10. **🌙 AL KHACHIOUN** (Les Humbles)
    - Couleur : Gris perle
    - Symbole : Croissant de lune

11. **📚 AL ALIMOUN** (Les Savants)
    - Couleur : Bleu roi
    - Symbole : Plume et encrier

12. **🌺 AL MOUHSINOUN** (Les Bienfaisants)
    - Couleur : Rose pâle
    - Symbole : Main offrant

13. **🔥 AL MOUKHLISOUN** (Les Sincères)
    - Couleur : Violet
    - Symbole : Flamme pure

14. **🌟 AN-NASIHOUN** (Les Conseillers sincères)
    - Couleur : Turquoise
    - Symbole : Lanterne

15. **⚡ AL MOUSTAJIBOUNE** (Ceux qui répondent à l'appel)
    - Couleur : Jaune vif
    - Symbole : Éclair

---

##### Attribution automatique ou manuelle

**Mode 1 : Attribution automatique**
```
┌─────────────────────────────────────────┐
│  🎲 ATTRIBUTION AUTOMATIQUE             │
│                                         │
│  120 participants inscrits              │
│  → Création de 10 équipes               │
│                                         │
│  Équipes attribuées :                   │
│  1. AL MOUHTADOUNE (12 membres)         │
│  2. AL YAQRA'OUN (12 membres)           │
│  3. AZ-ZAKIROUNE (12 membres)           │
│  4. AT-TAWWABOUNE (12 membres)          │
│  5. AS-SABIROUNE (12 membres)           │
│  6. AL MOUTAQOUNE (12 membres)          │
│  7. AS-SALIHOUNE (12 membres)           │
│  8. AL MOUDJAHIDOUNE (12 membres)       │
│  9. ASH-SHAKIROUNE (12 membres)         │
│  10. AL KHACHIOUN (12 membres)          │
│                                         │
│  [ Valider l'attribution ]             │
│  [ Modifier manuellement ]             │
└─────────────────────────────────────────┘
```

**Mode 2 : Choix manuel par les délégués**
```
┌─────────────────────────────────────────┐
│  ✏️ ATTRIBUTION MANUELLE                │
│                                         │
│  Équipe : [Sélectionner ▼]              │
│           • AL MOUHTADOUNE              │
│           • AL YAQRA'OUN                │
│           • AZ-ZAKIROUNE                │
│           • AT-TAWWABOUNE               │
│           • AS-SABIROUNE                │
│           • AL MOUTAQOUNE               │
│           • AS-SALIHOUNE                │
│           • AL MOUDJAHIDOUNE            │
│           • ASH-SHAKIROUNE              │
│           • + Autre équipe...           │
│                                         │
│  Membres (drag & drop) :                │
│  [Ahmed] [Fatima] [Ibrahim]...          │
│                                         │
│  [ Créer l'équipe ]                    │
└─────────────────────────────────────────┘
```

---

##### Génération automatique des identifiants

**Pour chaque équipe**, le système génère :

**Exemple : Équipe AL MOUHTADOUNE**
```
┌─────────────────────────────────────────┐
│  🌟 AL MOUHTADOUNE                      │
│  (Les Biens Guidés)                     │
│                                         │
│  🔑 Code d'accès unique :               │
│     ALILM2026-MOUHTADOUNE               │
│                                         │
│  📱 QR Code de connexion :              │
│  ┌─────────────┐                        │
│  │ ▓▓░░▓▓▓▓░░▓ │                        │
│  │ ░▓▓░░▓░▓▓▓░ │  [Scanner pour]        │
│  │ ▓░▓▓▓░░▓▓░▓ │  [se connecter]        │
│  │ ░░▓░▓▓▓░▓▓░ │                        │
│  └─────────────┘                        │
│                                         │
│  🎨 Couleur : Vert émeraude #2ECC71     │
│  ✨ Symbole : ⭐ Étoile guidant         │
│                                         │
│  👥 Membres : 12                        │
│  👑 Capitaine : Ahmed Ibrahim           │
│                                         │
│  [ Télécharger la fiche équipe (PDF) ] │
└─────────────────────────────────────────┘
```

**Fiche équipe PDF générée** :
```
╔═══════════════════════════════════════╗
║   🕌 JEU CONCOURS AL ILM 2026        ║
║                                       ║
║   🌟 ÉQUIPE AL MOUHTADOUNE            ║
║      (Les Biens Guidés)               ║
╚═══════════════════════════════════════╝

┌────────────────────────────────────────┐
│ 🔑 CODE D'ACCÈS                        │
│    ALILM2026-MOUHTADOUNE               │
│                                        │
│ 📱 [QR CODE]                           │
│                                        │
│ 🌐 Lien de connexion :                 │
│    alilm2026.aeemci.ci/login           │
└────────────────────────────────────────┘

👥 COMPOSITION DE L'ÉQUIPE (12 membres)

👑 Capitaine
   Ahmed Ibrahim - ESATIC - 07 12 34 56 78

📖 Membres
1. Fatima Koné - EMSP - 05 98 76 54 32
2. Ibrahim Traoré - ESATIC - 01 23 45 67 89
3. Khadija Diallo - EMSP - 07 11 22 33 44
4. Omar Coulibaly - ESATIC - 05 44 55 66 77
5. Aïcha Touré - EMSP - 01 88 99 00 11
6. Youssef Sanogo - ESATIC - 07 22 33 44 55
7. Mariam Bamba - EMSP - 05 66 77 88 99
8. Moussa Konaté - ESATIC - 01 11 22 33 44
9. Zeinab Keita - EMSP - 07 55 66 77 88
10. Bilal Fofana - ESATIC - 05 99 00 11 22
11. Safiya Ouattara - EMSP - 01 44 55 66 77

🎯 RÔLES SUGGÉRÉS (selon profil)

📖 Coran ouvert : Ahmed (Niveau ⭐⭐⭐)
📗 Coran fermé : Fatima (Mémorisation ✅)
🎤 Adhan : Omar (Voix recommandée)
📚 Hadith : Ibrahim (Connaît ≥5 Hadiths)

─────────────────────────────────────────

📅 PROCHAINES ÉTAPES

1. Connexion à l'espace équipe
2. Révision collective (document fourni)
3. Première manche : [Date] à 19h

📞 CONTACT DÉLÉGATION CULTURELLE
   05-00-01-74-05 / 07-06-47-11-85
   kanteyoussoufaziz@gmail.com

Qu'Allah bénisse votre équipe ! 🤲

AEEMCI - Section ESATIC
"Pour une identité islamique !"
```

---

- **Génération automatique** :
  - Nom d'équipe sélectionné dans la liste officielle
  - Code d'accès unique (ex: ALILM2026-MOUHTADOUNE)
  - QR Code de connexion rapide
- **Couleur distinctive** par équipe (prédéfinie)
- **Symbole/Logo** par équipe (prédéfini)

**Étape 5 : Notification et activation**
- **Email automatique** à chaque membre :
  - Félicitations pour l'assignation
  - Nom de l'équipe et coéquipiers
  - Code d'accès
  - Lien vers espace équipe
- **SMS de confirmation** au capitaine
- **Activation** : équipes prêtes à réviser et participer

**Gestion post-création** :
- **Modification des équipes** :
  - Ajouter/Retirer un membre
  - Changer le capitaine
  - Fusionner deux équipes
  - Dissoudre une équipe
- **Remplacement** en cas de désistement
- **Historique** des changements

---

#### 4️⃣ ORGANISATION DES MANCHES

##### Planificateur de compétition

**Création d'une nouvelle manche** :
- **Nom de la manche** : Phase préliminaire Jour 1, Quart de finale Jour 2...
- **Type** : Éliminatoire (sélection X équipes) OU Classement (toutes jouent)
- **Date et horaire** : sélection via calendrier
- **Équipes participantes** :
  - Toutes les équipes
  - OU Sélection manuelle (qualifiées de la manche précédente)
  - OU Import automatique (résultats de la manche N-1)

**Configuration des rubriques** :
- **Sélection des rubriques actives** :
  - ☑️ Adhan
  - ☑️ Coran ouvert
  - ☑️ Coran fermé
  - ☑️ Questions Coran
  - ☑️ Questions Prophète (ﷺ)
  - ☑️ Jurisprudence
  - ☑️ Culture générale
  - ☑️ Questions relais
  - ☑️ Hadith
- **Ordre des rubriques** : glisser-déposer pour réorganiser
- **Temps alloué** par rubrique (modifiable)
- **Points** : utiliser le barème par défaut ou personnaliser

**Génération du programme horaire** :
- **Assistant intelligent** (cf. Module 4) :
  - Entrée : date, heure début/fin, équipes, rubriques
  - Sortie : planning minute par minute
- **Ajustements manuels** possibles
- **Visualisation Gantt** : timeline interactive

**Paramètres avancés** :
- **Mode de jeu** :
  - Simultané (toutes les équipes en même temps pour questions écrites)
  - Séquentiel (équipe par équipe pour récitations)
- **Activation différée** : programmer l'ouverture automatique de la manche
- **Fermeture automatique** : date limite de soumission
- **Pause/Reprise** : suspendre une manche en cours (technique, incident)

**Publication** :
- **Brouillon** : manche créée mais invisible pour les équipes
- **Publier** : rendre visible + envoi notifications
- **Archiver** : manche terminée, en lecture seule

---

#### 5️⃣ ATTRIBUTION ET VALIDATION DES SCORES

##### Interface de notation centralisée

**Vue d'ensemble des évaluations** :
- **Tableau récapitulatif** :
  - Lignes : Équipes
  - Colonnes : Rubriques
  - Cellules : Statut (✅ Noté | ⏳ En attente | 🔍 En cours)
- **Progression** : barre de pourcentage (ex: 75% des notations complètes)

**Évaluation par rubrique** :

##### A) Rubriques automatiques (Questions écrites)
- **Correction automatique** pour QCM
- **Validation admin** pour questions à texte libre :
  - Affichage réponse équipe / réponse correcte
  - Bouton ✅ Correct (+points) ❌ Incorrect (0 point)
  - Zone commentaire (optionnel)

##### B) Rubriques avec jury (Récitations, Adhan, Hadith)
**Workflow de notation** :
1. **Assignation** : délégué assigne les soumissions à 2 jurés
2. **Évaluation individuelle** : chaque juré note indépendamment
3. **Consolidation admin** :
   - Affichage des 2 notes
   - Si écart < 3 points → moyenne automatique
   - Si écart ≥ 3 points → alerte pour délibération
4. **Validation finale** par l'admin

**Interface de validation** :
- **Lecteur audio/vidéo** intégré :
  - Lecture des récitations
  - Contrôles : play, pause, vitesse
  - Marqueurs temporels (pour commenter un passage précis)
- **Grille de notation affichée** :
  - Critères avec curseurs (Voix /3, Tajwid /10...)
  - Calcul automatique du total
- **Notes des jurés** visibles côte à côte
- **Actions** :
  - ✅ Valider la moyenne
  - ✏️ Ajuster manuellement
  - 🔄 Demander re-évaluation
  - 💬 Ajouter un commentaire

**Gestion des contestations** :
- **Système de réclamation** : équipes peuvent contester un score (délai 24h)
- **Interface de traitement** :
  - Visualisation de la réclamation
  - Historique de la notation
  - Ré-écoute de la soumission
  - Décision : Maintenue OU Révisée
- **Notification** de la décision à l'équipe

**Outils de vérification** :
- **Détection d'incohérences** :
  - Score > maximum possible
  - Notes manquantes
  - Doublons
- **Audit trail** : qui a noté quoi, quand
- **Export pour archivage** : toutes les notes en Excel

---

#### 6️⃣ PUBLICATION DES RÉSULTATS

##### Gestionnaire de publication

**Préparation des résultats** :
- **Calcul automatique** :
  - Total par équipe et par manche
  - Classement général (cumul toutes manches)
  - Statistiques (meilleure performance par rubrique)
- **Vérification pré-publication** :
  - ✅ Toutes les notes saisies ?
  - ✅ Pas d'erreur de calcul ?
  - ✅ Validations complètes ?
- **Prévisualisation** du classement avant publication

**Mode de publication** :

##### Publication progressive (recommandé)
- **Par manche** : publier résultats Jour 1, puis Jour 2...
- **Calendrier de publication** :
  - Immédiatement après validation
  - OU Programmation (ex: chaque soir à 20h)
- **Notification automatique** aux équipes

##### Publication finale (en une fois)
- **Révélation spectaculaire** : animation de défilement du classement
- **Compte à rebours** : "Résultats dans 3... 2... 1..."
- **Confettis virtuels** pour le podium

**Formats de publication** :
- **Page web dédiée** : classement interactif
- **PDF officiel** : document certifié AEEMCI
- **Infographie** : visuel à partager sur réseaux sociaux
- **Email personnalisé** : chaque équipe reçoit son bulletin

**Gestion de la cérémonie virtuelle** (Finale) :
- **Live streaming** : diffusion en direct de la proclamation
- **Chat modéré** : réactions du public
- **Intervention des délégués** : discours de clôture
- **Remise virtuelle** des certificats

**Post-publication** :
- **Archives publiques** : résultats consultables même après le concours
- **Statistiques globales** :
  - Équipe la plus régulière
  - Meilleure progression
  - Records par rubrique
- **Galerie des champions** : Hall of Fame

---

#### 7️⃣ AUTRES FONCTIONS ADMINISTRATIVES

##### Gestion globale
- **Vue d'ensemble** de toutes les manches
- **Statut en temps réel** (combien d'équipes ont joué, combien restent)
- **Contrôle des accès** (activer/désactiver une manche)
- **Tableau de bord dynamique** :
  - Inscriptions : 120 étudiants
  - Équipes formées : 10/10
  - Manches complétées : 3/9
  - Notations en attente : 5

##### Paramètres du concours
- **Dates et horaires** des manches
- **Activation/désactivation** de rubriques
- **Modification du barème** (si nécessaire)
- **Configuration générale** :
  - Logo AEEMCI
  - Couleurs du thème
  - Messages de bienvenue
  - Contacts support

##### Monitoring
- **Logs d'activité** :
  - Connexions (qui, quand)
  - Actions critiques (modification scores, suppression...)
  - Erreurs système
- **Statistiques de participation** :
  - Taux de connexion par équipe
  - Temps moyen par rubrique
  - Taux d'abandon
- **Détection d'anomalies** :
  - Tentative de triche
  - Accès non autorisés
  - Comportements suspects

##### Support technique
- **Messagerie intégrée** : répondre aux questions des équipes
- **FAQ dynamique** : ajouter/modifier les réponses
- **Annonces** : diffusion de messages importants
- **Assistance en direct** : chat admin-équipe (pendant le concours)

---

## 🎬 SCÉNARIOS D'UTILISATION - EXEMPLES CONCRETS

### 📊 SCÉNARIO 1 : Rubrique Culture Générale (Mode Séquentiel)

> **Contexte** : Phase préliminaire - Jour 1 - 10 équipes participent  
> **Rubrique active** : Culture générale (4 questions × 25 pts = 100 pts)  
> **Mode** : Séquentiel (équipe par équipe)

---

#### 🎯 ÉTAPE 1 : PRÉPARATION DE LA RUBRIQUE

##### Interface Admin (Délégation Culturelle)
1. **Accès** : Tableau de bord → Manche en cours → Rubrique Culture générale
2. **Activation** : Bouton "Démarrer la rubrique Culture générale"
3. **Configuration affichée** :
   - ✅ 4 questions préparées
   - ✅ 25 points par question
   - ✅ 15 secondes par question
   - ✅ 10 équipes en attente
4. **Ordre de passage** : généré automatiquement ou personnalisable
   ```
   1. Équipe A
   2. Équipe B
   3. Équipe C
   ...
   10. Équipe J
   ```
5. **Lancement** : Clic sur "Commencer" → Notifications envoyées aux équipes

---

#### 🏁 ÉTAPE 2 : PASSAGE DE L'ÉQUIPE A

##### Interface visible par l'Équipe A (Capitaine + Membres)

**Écran d'attente** :
```
┌─────────────────────────────────────────┐
│  🕌 JEU CONCOURS AL ILM 2026           │
│                                         │
│  📋 Rubrique : CULTURE GÉNÉRALE         │
│  🏆 4 questions × 25 pts = 100 pts max  │
│                                         │
│  ⏰ Votre équipe passe dans : 00:45     │
│                                         │
│  💡 Conseil : Désignez vos participants │
│     pour chaque question à l'avance     │
│                                         │
│  [  Équipe prête ✓  ]                  │
└─────────────────────────────────────────┘
```

##### Le jury appelle l'Équipe A

**Interface Admin** :
- Clic sur "Appeler Équipe A"
- **Notification envoyée** : "C'est à vous ! Rejoignez la salle de compétition"

**Interface Équipe A activée** :
```
┌─────────────────────────────────────────┐
│  🎤 C'EST À VOUS !                      │
│                                         │
│  Équipe A - Culture Générale            │
│                                         │
│  [ Rejoindre la session → ]            │
└─────────────────────────────────────────┘
```

---

#### ❓ QUESTION 1

##### A) Désignation du participant

**Interface Capitaine** (visible uniquement par le capitaine) :
```
┌─────────────────────────────────────────┐
│  Question 1 / 4                         │
│                                         │
│  👥 Désignez le participant :           │
│                                         │
│  ○ Participant 1 - Ahmed               │
│  ○ Participant 2 - Fatima              │
│  ○ Participant 3 - Ibrahim             │
│  ○ Participant 4 - Khadija             │
│                                         │
│  [ Valider la désignation ]            │
└─────────────────────────────────────────┘
```

**Action** : Le capitaine sélectionne **Participant 1 (Ahmed)**

**Notification au Participant 1** :
```
✅ Tu as été désigné pour répondre à la Question 1
   Prépare-toi !
```

---

##### B) Affichage de la question

**Interface Équipe A** (tous les membres voient) :
```
┌─────────────────────────────────────────┐
│  Question 1 / 4                  ⏱️ 15s │
│                                         │
│  🎯 Participant : Ahmed                 │
│                                         │
│  📝 QUESTION :                          │
│                                         │
│  Quel est le premier pilier de l'Islam ?│
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ [Zone de réponse - Ahmed seul]  │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Temps restant : ████████░░ (12s)      │
└─────────────────────────────────────────┘
```

---

##### C) Le chronomètre démarre (15 secondes)

**Système** :
- **Démarrage automatique** dès l'affichage de la question
- **Barre de progression** visuelle rouge/verte
- **Son d'alerte** à 5 secondes restantes (optionnel)
- **Blocage de la saisie** après 15 secondes

**Ahmed saisit** : `La Shahada (attestation de foi)`

**À 10 secondes** : Ahmed clique sur "Soumettre"

```
┌─────────────────────────────────────────┐
│  ✅ Réponse soumise !                   │
│                                         │
│  Temps utilisé : 10 secondes            │
│                                         │
│  En attente de validation du jury...    │
└─────────────────────────────────────────┘
```

---

##### D) Le jury valide la réponse

**Interface Jury/Admin** :
```
┌─────────────────────────────────────────┐
│  Question 1 - Équipe A                  │
│                                         │
│  👤 Participant : Ahmed                 │
│                                         │
│  ❓ Question :                          │
│  Quel est le premier pilier de l'Islam ?│
│                                         │
│  📝 Réponse soumise :                   │
│  "La Shahada (attestation de foi)"     │
│                                         │
│  ✅ Réponse correcte :                  │
│  "La Shahada / Attestation de foi"     │
│                                         │
│  [ ✓ Correct (+25 pts) ]               │
│  [ ✗ Incorrect (0 pt)  ]               │
└─────────────────────────────────────────┘
```

**Le jury clique** : ✓ Correct

**Système** :
- **+25 points** ajoutés au score Équipe A
- **Animation de validation** : ✅ + confettis verts
- **Son de succès** : "Ding !"

**Interface Équipe A** :
```
┌─────────────────────────────────────────┐
│  ✅ BONNE RÉPONSE !                     │
│                                         │
│  +25 points                             │
│                                         │
│  Score Équipe A : 25 pts                │
│                                         │
│  Question suivante dans 3... 2... 1...  │
└─────────────────────────────────────────┘
```

---

#### ❓ QUESTION 2

##### Même processus, participant différent

**Capitaine désigne** : **Participant 2 (Fatima)**

**Question affichée** :
```
Question 2 / 4                       ⏱️ 15s

🎯 Participant : Fatima

📝 En quelle année de l'Hégire a eu lieu 
   la bataille de Badr ?

[Zone de réponse - Fatima]
```

**Fatima répond** : `An 2 de l'Hégire`  
**Temps utilisé** : 12 secondes

**Jury valide** : ✓ Correct  
**+25 points** → Score Équipe A : **50 pts**

---

#### ❓ QUESTION 3

**Capitaine désigne** : **Participant 3 (Ibrahim)**

**Question** : `Combien de sourates compte le Coran ?`

**Ibrahim répond** : `114`  
**Temps** : 8 secondes

**Jury valide** : ✓ Correct  
**+25 points** → Score Équipe A : **75 pts**

---

#### ❓ QUESTION 4

**Capitaine désigne** : **Participant 4 (Khadija)**

**Question** : `Quelle est la capitale de l'Arabie Saoudite ?`

**Khadija répond** : `Riyad`  
**Temps** : 6 secondes

**Jury valide** : ✓ Correct  
**+25 points** → Score Équipe A : **100 pts** ✨

---

#### 🎉 ÉTAPE 3 : FIN DE RUBRIQUE POUR L'ÉQUIPE A

**Écran récapitulatif Équipe A** :
```
┌─────────────────────────────────────────┐
│  🎊 RUBRIQUE TERMINÉE !                 │
│                                         │
│  Équipe A - Culture Générale            │
│                                         │
│  ✅ Question 1 : +25 pts (Ahmed)        │
│  ✅ Question 2 : +25 pts (Fatima)       │
│  ✅ Question 3 : +25 pts (Ibrahim)      │
│  ✅ Question 4 : +25 pts (Khadija)      │
│                                         │
│  🏆 SCORE RUBRIQUE : 100 / 100 pts      │
│                                         │
│  💯 SCORE TOTAL ÉQUIPE : 125 pts        │
│     (25 pts d'autres rubriques)         │
│                                         │
│  👏 Excellent travail d'équipe !        │
│                                         │
│  [ Retour au tableau de bord ]         │
└─────────────────────────────────────────┘
```

---

#### 🔄 ÉTAPE 4 : CALCUL AUTOMATIQUE ET MISE À JOUR

**Système effectue automatiquement** :

1. **Calcul du score rubrique** :
   - Culture générale Équipe A = 100 pts

2. **Ajout au score total** :
   - Score total Équipe A avant : 25 pts (autres rubriques)
   - + 100 pts (Culture générale)
   - **= 125 pts total**

3. **Mise à jour du classement** :
   ```
   Classement général (mis à jour en temps réel)
   
   1. Équipe A - 125 pts ↗️ (nouveau leader)
   2. Équipe D - 120 pts
   3. Équipe F - 115 pts
   ...
   ```

4. **Notification publique** :
   ```
   📢 L'Équipe A termine Culture générale avec un SANS-FAUTE !
      100/100 pts 🎉
   ```

---

#### 🔁 ÉTAPE 5 : PASSAGE DES ÉQUIPES SUIVANTES

##### Le jury appelle l'Équipe B

**Interface Admin** :
- Clic sur "Appeler Équipe B"
- **Même processus** que pour l'Équipe A :
  1. Désignation des participants (1 par question)
  2. Affichage des 4 questions (une par une)
  3. Chronomètre 15 secondes par question
  4. Validation du jury
  5. Calcul du score

**Exemple de résultats Équipe B** :
- Question 1 : ✅ Correct (+25)
- Question 2 : ❌ Incorrect (0)
- Question 3 : ✅ Correct (+25)
- Question 4 : ✅ Correct (+25)
- **Score rubrique : 75 pts**

---

##### Puis Équipe C, D, E, F, G, H, I, J

**Processus identique** pour chaque équipe, séquentiellement.

**Interface Admin - Suivi global** :
```
┌─────────────────────────────────────────────────────┐
│  Rubrique : CULTURE GÉNÉRALE                        │
│  Progression : ████████░░ 8/10 équipes              │
│                                                     │
│  ✅ Équipe A : 100 pts (4/4 correctes)              │
│  ✅ Équipe B : 75 pts (3/4 correctes)               │
│  ✅ Équipe C : 50 pts (2/4 correctes)               │
│  ✅ Équipe D : 100 pts (4/4 correctes)              │
│  ✅ Équipe E : 75 pts (3/4 correctes)               │
│  ✅ Équipe F : 25 pts (1/4 correcte)                │
│  ✅ Équipe G : 50 pts (2/4 correctes)               │
│  ✅ Équipe H : 100 pts (4/4 correctes)              │
│  ⏳ Équipe I : En cours...                          │
│  ⏸️ Équipe J : En attente                           │
│                                                     │
│  Temps écoulé : 1h 12min                            │
│  Temps estimé restant : 18min                       │
└─────────────────────────────────────────────────────┘
```

---

#### ✅ ÉTAPE 6 : FIN DE LA RUBRIQUE (Toutes équipes passées)

**Interface Admin** :
```
┌─────────────────────────────────────────┐
│  ✅ RUBRIQUE TERMINÉE                   │
│                                         │
│  Culture Générale - 10/10 équipes       │
│                                         │
│  📊 Statistiques :                      │
│  • Score moyen : 72,5 pts               │
│  • 3 équipes à 100 pts (parfait)        │
│  • Question la plus ratée : Q2 (40%)    │
│                                         │
│  🏆 Meilleure performance :             │
│     Équipes A, D, H (100 pts)           │
│                                         │
│  [ Passer à la rubrique suivante ]     │
│  [ Proclamer les résultats partiels ]  │
│  [ Faire une pause (10 min) ]          │
└─────────────────────────────────────────┘
```

---

#### 🔄 ÉTAPE 7 : CHANGEMENT DE RUBRIQUE

**Admin clique** : "Passer à la rubrique suivante"

**Système propose** :
```
Rubrique suivante suggérée : QUESTIONS RELAIS

Programme du jour :
✅ Adhan (terminé)
✅ Coran ouvert (terminé)
✅ Culture générale (terminé)
⏳ Questions relais (en cours de sélection)
⏸️ Jurisprudence (à venir)
⏸️ Hadith (à venir)

[ Confirmer : Questions Relais ]
```

**Admin confirme** → Le système :
1. **Sauvegarde** les résultats Culture générale
2. **Archive** les données (backup automatique)
3. **Prépare** la rubrique Questions Relais
4. **Envoie notifications** : "Pause de 10 min, puis Questions Relais"

---

### 📊 TABLEAU RÉCAPITULATIF - RÉSULTATS CULTURE GÉNÉRALE

| Équipe | Q1 | Q2 | Q3 | Q4 | Score | Classement |
|--------|----|----|----|----|-------|------------|
| **A**  | ✅ | ✅ | ✅ | ✅ | **100** | 🥇 1er |
| **D**  | ✅ | ✅ | ✅ | ✅ | **100** | 🥇 1er ex |
| **H**  | ✅ | ✅ | ✅ | ✅ | **100** | 🥇 1er ex |
| **B**  | ✅ | ❌ | ✅ | ✅ | 75 | 4e |
| **E**  | ✅ | ✅ | ❌ | ✅ | 75 | 4e ex |
| **C**  | ✅ | ❌ | ✅ | ❌ | 50 | 6e |
| **G**  | ❌ | ✅ | ❌ | ✅ | 50 | 6e ex |
| **I**  | ✅ | ❌ | ❌ | ✅ | 50 | 6e ex |
| **F**  | ❌ | ❌ | ❌ | ✅ | 25 | 9e |
| **J**  | ❌ | ❌ | ❌ | ❌ | 0 | 10e |

**Classement général mis à jour** après ajout des points Culture Générale à chaque équipe.

---

### 🎯 POINTS CLÉS DU SCÉNARIO

#### ✅ Avantages du mode séquentiel

1. **Équité** : Toutes les équipes passent dans les mêmes conditions
2. **Concentration** : Une équipe à la fois, atmosphère de compétition
3. **Validation humaine** : Le jury contrôle chaque réponse
4. **Désignation flexible** : Chaque équipe choisit ses participants
5. **Engagement** : Autres équipes peuvent suivre en spectateur
6. **Gestion du temps** : Chronomètre strict, pas de débordement

#### 🔧 Fonctionnalités techniques utilisées

- **Désignation de participants** par le capitaine
- **Chronomètre automatique** 15 secondes
- **Validation jury** en temps réel
- **Calcul automatique** des scores
- **Mise à jour** du classement général
- **Notifications** à chaque étape
- **Interface différenciée** : Admin / Capitaine / Participant / Public
- **Statistiques** en fin de rubrique

#### 📱 Expérience utilisateur

**Pour l'équipe qui joue** :
- Interface claire et guidée
- Stress positif (chronomètre)
- Feedback immédiat (correct/incorrect)
- Transparence (voir le score en direct)

**Pour les équipes en attente** :
- Compte à rebours jusqu'à leur tour
- Possibilité de réviser
- Voir le classement évoluer (motivation)

**Pour le public** :
- Suivre le live (si diffusion activée)
- Voir le classement général
- Encourager les équipes (chat modéré)

---

### 🎬 VARIANTE : Mode Simultané (Alternative)

> **Différence** : Toutes les équipes répondent en même temps aux mêmes questions  
> **Cas d'usage** : Rubriques purement écrites (pas de récitation)

#### Processus simplifié

1. **Question 1 affichée** à toutes les équipes simultanément
2. **Chronomètre 15 sec** pour tout le monde
3. **Chaque équipe soumet** sa réponse
4. **Validation automatique** (si QCM) ou **jury valide en lot**
5. **Répéter** pour Q2, Q3, Q4

**Avantages** :
- ⏱️ Plus rapide (10 équipes en 10 min au lieu de 1h)
- 🎮 Plus dynamique, sensation de "quiz live"

**Inconvénients** :
- ❌ Moins de contrôle sur la désignation des participants
- ❌ Risque de triche (copie entre équipes)

**Recommandation** : Mode séquentiel pour plus d'authenticité et de fair-play.

---

### Charte graphique islamique respectueuse

#### Palette de couleurs
- **Vert émeraude** : couleur de l'islam, paix, espoir
- **Or** : noblesse, excellence
- **Blanc** : pureté, clarté
- **Bleu nuit** : spiritualité du Ramadan
- **Touches de beige** : sobriété

#### Typographie
- **Polices arabes élégantes** pour les versets et hadiths
- **Polices modernes** et lisibles pour le contenu français
- **Hiérarchie claire** : titres, sous-titres, corps de texte

#### Éléments visuels
- **Motifs géométriques islamiques** en arrière-plan (subtils)
- **Croissant de lune** et étoiles (symboles du Ramadan)
- **Icônes personnalisées** pour chaque rubrique
- **Animations douces** (pas trop distrayantes)

---

### Ergonomie et accessibilité

#### Navigation intuitive
- **Menu principal** clair et fixe
- **Fil d'Ariane** pour se situer
- **Boutons d'action** bien visibles
- **Recherche** rapide (FAQ, règlement)

#### Responsive design
- **Optimisé mobile** (90% des étudiants utilisent leur smartphone)
- **Tablette** compatible
- **Desktop** pour le jury et délégués

#### Accessibilité
- **Contrastes** suffisants pour les malvoyants
- **Taille de texte** ajustable
- **Mode sombre** (confort visuel, surtout pendant Ramadan)
- **Support multilingue** : français + arabe (optionnel)

---

### Gamification et engagement

#### Éléments ludiques
- **Progression visuelle** : barre de niveau pour chaque équipe
- **Animations de victoire** (confettis, applaudissements)
- **Sons** discrets (validation, échec, chronomètre)
- **Émojis et icônes** pour dynamiser l'interface

#### Système de motivation
- **Objectifs quotidiens** de révision
- **Défis hebdomadaires** entre équipes (hors concours)
- **Leaderboard animé** avec changements en temps réel
- **Encouragements automatiques** ("Très bonne récitation !", "Continue comme ça !")

---

## 🔐 SÉCURITÉ & INTÉGRITÉ

### Authentification et accès

#### Système de comptes
- **Inscription sécurisée** avec validation email
- **Codes d'accès uniques** par équipe
- **Accès jury** avec identifiants séparés
- **Accès admin** pour délégués culturels

#### Protection des données
- **Chiffrement** des informations sensibles
- **RGPD/conformité** (même si local)
- **Anonymisation** des données après le concours (optionnel)

---

### Anti-triche

#### Mesures techniques
- **Détection de copier-coller** (pour questions textuelles)
- **Limitation des tentatives** (pas de rechargement infini)
- **Horodatage précis** des soumissions
- **Détection d'accès simultanés** (un seul appareil par équipe)

#### Modération
- **Validation manuelle** des enregistrements audio/vidéo
- **Signalement** possible par les équipes (fair-play)
- **Pénalités** en cas de tricherie avérée

---

## 📊 FONCTIONNALITÉS AVANCÉES (BONUS)

### Intelligence artificielle (optionnel)

#### Évaluation automatique du Tajwid
- **Reconnaissance vocale** pour détecter les erreurs de prononciation
- **Analyse de la mélodie** (Makhārij, Ṣifāt)
- **Score automatique** pour Coran ouvert/fermé
- **Vérification humaine** en cas de doute

#### Chatbot assistant
- **Réponses aux questions** fréquentes
- **Guide d'utilisation** du site
- **Rappels personnalisés** (prochaine manche, révision)

---

### Statistiques avancées

#### Analyse de performance
- **Graphiques individuels** par équipe :
  - Courbe de progression
  - Radar des compétences (Coran, Fiqh, Culture...)
  - Comparaison avec la moyenne
- **Prédictions** : chances de qualification (algorithme simple)

#### Tableaux de bord interactifs
- **Filtres** par rubrique, date, équipe
- **Export** en PDF, Excel
- **Partage** de statistiques publiques

---

### Intégrations externes

#### Notifications multicanaux
- **Email** (confirmation, rappels, résultats)
- **SMS** (pour urgences)
- **WhatsApp** (si API disponible)
- **Notifications push** (application web progressive)

#### Streaming en direct (optionnel)
- **Diffusion live** de la finale
- **Commentaires en direct** par les délégués
- **Chat modéré** pour les spectateurs

---

## 🛠️ TECHNOLOGIES RECOMMANDÉES (SUGGESTIONS)

### Frontend
- **HTML5 / CSS3** (base solide)
- **JavaScript** (interactivité)
- **Framework** : React.js, Vue.js ou Svelte (moderne et réactif)
- **UI Library** : TailwindCSS, Bootstrap (rapidité de design)

### Backend
- **Node.js** (Express.js) OU **Python** (Django/Flask)
- **Base de données** : PostgreSQL, MySQL ou MongoDB
- **API REST** ou **GraphQL** pour communication frontend-backend

### Hébergement
- **Cloud** : Vercel, Netlify (frontend) + Heroku, Railway (backend)
- **Serveur local** (ESATIC) pour éviter les coûts

### Sécurité
- **JWT** pour authentification
- **HTTPS** obligatoire
- **Rate limiting** contre les abus

---

## 📅 PLANNING DE DÉVELOPPEMENT SUGGÉRÉ

### Phase 1 : Préparation (avant Ramadan)
- ✅ Conception de la maquette (wireframes)
- ✅ Validation du design avec l'AEEMCI
- ✅ Développement du module inscription
- ✅ Développement du module formation des équipes
- ✅ Mise en ligne de la page d'accueil et informations

### Phase 2 : Révision (début Ramadan)
- ✅ Module bibliothèque de révision actif
- ✅ Quiz d'entraînement disponibles
- ✅ Calendrier finalisé et publié

### Phase 3 : Compétition (pendant Ramadan)
- ✅ Activation des modules de jeu jour par jour
- ✅ Évaluation en temps réel par le jury
- ✅ Mise à jour quotidienne du classement

### Phase 4 : Clôture (fin Ramadan)
- ✅ Proclamation des résultats
- ✅ Distribution des certificats
- ✅ Archivage des données
- ✅ Bilan et feedback pour édition 2027

---

## 🌟 IMPACT ATTENDU

### Pour les participants
- 📚 Apprentissage ludique et moderne
- 🤝 Renforcement de la fraternité
- 🏆 Reconnaissance de l'excellence
- 📱 Expérience digitale de qualité

### Pour l'AEEMCI
- 🎯 Attractivité accrue auprès des jeunes
- 💡 Innovation dans l'éducation islamique
- 📈 Scalabilité : réplicable dans d'autres sections
- 🌍 Rayonnement : potentiel national/régional

### Pour la communauté
- ✨ Valorisation du savoir islamique
- 🕌 Célébration du Ramadan de manière moderne
- 🤲 Inspiration pour d'autres initiatives

---

## 💡 IDÉES CRÉATIVES SUPPLÉMENTAIRES

### Mode hors ligne
- **Progressive Web App (PWA)** : utilisation sans internet
- **Synchronisation** dès que la connexion revient
- **Utile** pour les zones à faible débit

### Édition internationale
- **Ouverture** à d'autres universités ivoiriennes
- **Extension** à la sous-région (Afrique de l'Ouest)
- **Plateforme multilingue** (français, arabe, anglais)

### Archive historique
- **Galerie des éditions passées** (2026, 2027...)
- **Hall of Fame** : meilleurs participants de tous les temps
- **Évolution des questions** : bibliothèque grandissante

### Partenariats
- **Sponsoring** affiché sur le site (halal uniquement)
- **Collaboration** avec imams, savants pour validation des questions
- **Diffusion** sur médias islamiques (sites, radios)

---

## 📢 COMMUNICATION & PROMOTION DU SITE

### Avant le lancement
- 🎥 **Teaser vidéo** : "Al Ilm arrive bientôt..."
- 📱 **Campagne sur réseaux sociaux** : Instagram, Facebook, WhatsApp
- 📧 **Emailing** aux étudiants ESATIC/EMSP
- 🖼️ **Affiches** avec QR Code vers le site

### Pendant le concours
- 📊 **Publication quotidienne** des classements
- 🎤 **Interviews** des équipes leaders
- 📸 **Stories** des moments forts
- 🔔 **Notifications** push pour maintenir l'engagement

### Après le concours
- 🏆 **Cérémonie virtuelle** de remise des prix (en live)
- 📰 **Communiqué de presse** AEEMCI
- 📹 **Vidéo récapitulative** du concours
- 📝 **Article blog** : retour d'expérience

---

## ✅ CHECKLIST FINALE

### Fonctionnalités essentielles
- [ ] Inscription et formation des équipes ✅
- [ ] Bibliothèque de révision ✅
- [ ] Calendrier et programmation ✅
- [ ] Interface de jeu pour chaque rubrique ✅
- [ ] Système de notation et évaluation ✅
- [ ] Classement en temps réel ✅
- [ ] Proclamation des résultats ✅

### Qualité et conformité
- [ ] Design respectueux des valeurs islamiques ✅
- [ ] Responsive (mobile, tablette, desktop) ✅
- [ ] Sécurité et anti-triche ✅
- [ ] Tests utilisateurs (beta) ✅
- [ ] Validation par l'AEEMCI ✅

### Documentation
- [ ] Guide utilisateur (équipes) ✅
- [ ] Manuel jury/délégués ✅
- [ ] FAQ complète ✅
- [ ] Support technique prévu ✅

---

## 🤲 CONCLUSION

Ce site web pour le **Jeu Concours Al Ilm 2026** doit être :

✨ **Spirituel** : refléter la noblesse du Ramadan et l'éthique islamique  
🎮 **Ludique** : engager les étudiants avec une expérience moderne  
📚 **Éducatif** : favoriser l'apprentissage et l'excellence  
🤝 **Fraternel** : renforcer les liens entre participants  
🔧 **Technique** : robuste, sécurisé et évolutif  

Qu'Allah bénisse ce projet et le rende bénéfique pour tous les participants. Âmîn.

---

**Document préparé avec soin pour l'AEEMCI - Section ESATIC**  
*"Pour une identité islamique !"*

🕌 **#AlIlm2026** | **#AEEMCI** | **#Excellence** | **#Ramadan1447**
