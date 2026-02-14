# 🕌 JEU CONCOURS AL ILM - ÉDITION 2026

## Description

Plateforme web complète pour le **Jeu Concours Al Ilm**, organisé par l'**AEEMCI - Section ESATIC** pendant le mois béni de Ramadan 2026.

Ce projet digitalise l'intégralité du concours : inscription des participants, formation des équipes, compétition en temps réel, notation par jury, et proclamation des résultats.

## 🎯 Fonctionnalités principales

- ✅ **Gestion des participants** (import Google Forms)
- ✅ **Formation intelligente des équipes** (8 équipes)
- ✅ **Organisation des manches** avec génération automatique du programme
- ✅ **Rubriques du concours** : Adhan, Coran ouvert/fermé, Hadith, Jurisprudence, Culture générale, Questions Relais
- ✅ **Système de notation** avec jury
- ✅ **Classement en temps réel**
- ✅ **Interfaces différenciées** : Admin, Capitaine, Compétiteur, Public

## 🛠️ Stack Technique

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **Backend** : Node.js + Express.js
- **Base de données** : PostgreSQL
- **Authentification** : JWT
- **Upload** : Multer (fichiers audio)

## 📁 Structure du projet

```
alilm2026/
├── frontend/           # Application client (HTML/CSS/JS)
├── backend/            # Serveur API (Node.js/Express)
└── database/           # Scripts SQL
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Étapes

1. **Cloner le projet**
```bash
git clone https://github.com/aeemci/alilm2026.git
cd alilm2026
```

2. **Configurer la base de données**
```bash
# Créer la base de données
createdb alilm2026

# Exécuter le schéma
psql alilm2026 < database/schema.sql

# Insérer les données initiales
psql alilm2026 < database/seeds/01_noms_equipes.sql
psql alilm2026 < database/seeds/02_rubriques.sql
```

3. **Installer les dépendances backend**
```bash
cd backend
npm install
```

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env
nano .env  # Éditer avec vos valeurs
```

5. **Démarrer le serveur**
```bash
# Se placer dans le dossier backend
cd backend

# Développement (avec auto-reload)
npm run dev

# Production
npm start
```

6. **Accéder à l'application**
```
http://localhost:3000
```

**Note :** Le serveur doit être démarré depuis le dossier `backend/` car c'est là que se trouve `package.json`.

## 📚 Documentation

- **Architecture technique** : Voir `ARCHITECTURE_TECHNIQUE.md`
- **Idées de conception** : Voir `IDEES_CONCEPTION_SITE_AL_ILM.md`
- **API Documentation** : Voir `backend/API.md` (à venir)

## 👥 Rôles et accès

| Rôle | Accès |
|------|-------|
| **Admin** | Gestion complète du concours |
| **Jury** | Notation des soumissions |
| **Capitaine** | Gestion de son équipe |
| **Compétiteur** | Participation aux manches |
| **Public** | Consultation classement |

## 🎮 Équipes du concours

1. 🌟 **AL MOUHTADOUNE** (Les Biens Guidés)
2. 📖 **AL YAQRA'OUN** (Les Lecteurs du Coran)
3. 🤲 **AZ-ZAKIROUNE** (Ceux qui se rappellent d'Allah)
4. 💚 **AT-TAWWABOUNE** (Ceux qui implorent le pardon)
5. ⏳ **AS-SABIROUNE** (Les Patients)
6. 🕌 **AL MOUTAQOUNE** (Les Pieux)
7. ✨ **AS-SALIHOUNE** (Les Vertueux)
8. ⚔️ **AL MOUDJAHIDOUNE** (Les Soldats d'Allah)
9. 🙏 **ASH-SHAKIROUNE** (Les Reconnaissants)

## 📞 Contact

**AEEMCI - Délégation Culturelle**
- 📧 Email : kanteyoussoufaziz@gmail.com
- 📱 Téléphone : 05-00-01-74-05 / 07-06-47-11-85 / 05-84-83-05-98

---

**AEEMCI - Section ESATIC**  
*"Pour une identité islamique !"*

🌙 **Ramadan Mubarak** 🌙
# AEEMCI_AL_ILM





Parfait, je comprends maintenant **où le scénario IA est faux** et **quelle est ta vraie logique**.
Je vais **tout corriger** et te donner **un scénario propre, cohérent et fidèle à ton idée**, sans invention inutile.

---

# ✅ SCÉNARIO CORRIGÉ — LOGIQUE RÉELLE DU SYSTÈME

**Interaction entre `jeu.html` (candidat) et `notation.html` (jury)**

---

## 🎯 PRINCIPE CLÉ (CORRECTION MAJEURE)

❌ **Ancienne logique (fausse)**

> Le jury ou l’animateur génère la question et la montre au candidat.

✅ **Nouvelle logique (la bonne)**

> 👉 **C’est le candidat qui clique sur “Générer la question” dans `jeu.html`.**
> 👉 La question :

* s’affiche **chez le candidat SANS la réponse**
* s’affiche **en même temps chez le jury AVEC la réponse**
* la notation se fait **uniquement dans `notation.html`**
* **pas de fiche de notation visible dans `jeu.html`**

⚠️ **Important**
Toutes les rubriques **ne génèrent pas de questions**
(ex : Adhan, récitation → pas de génération)

---

## 📋 CONTEXTE DU CONCOURS

* **Événement** : Concours AL ILM 2026
* **Phase** : Quart de finale
* **Équipes** : AL-FURQAN vs AS-SABIQUN
* **Pages utilisées** :

  * `jeu.html` → **page du candidat**
  * `notation.html` → **page du jury**

---

## 🧩 RÔLES CLAIRS

### 🎮 `jeu.html` — CANDIDAT

* Clique sur **Générer la question**
* Voit la **question uniquement**
* Donne sa réponse oralement
* Ne voit **jamais la bonne réponse**
* Ne note rien

### 📝 `notation.html` — JURY

* Voit la **même question en temps réel**
* Voit la **bonne réponse**
* Évalue la réponse du candidat
* Attribue les points
* Certaines rubriques → sliders
* D’autres → boutons Bonne / Mauvaise réponse

---

## 🎬 SCÉNARIO RÉEL — DÉROULEMENT

---

## 🏁 PHASE 1 : PRÉPARATION

### 19h00

* Le jury ouvre `notation.html`
* Sélection :

  * Manche : Quart de finale
  * Rubrique : (en attente)
* Statut : **Aucune question active**



* Les candidats sont installés
* Chaque équipe a accès à `jeu.html`
* Bouton **“Générer la question”** désactivé tant que la rubrique n’est pas active

---

## 🎯 PHASE 2 : RUBRIQUE À QUESTIONS

(ex : Culture générale, Fiqh, Coran, Hadith)

---

### 🟢 Étape 1 — Activation de la rubrique

* Le jury choisit la rubrique dans `notation.html`
* Le système autorise la génération

---

### 🟢 Étape 2 — Génération par le candidat

👉 **Dans `jeu.html` (candidat)**
Le candidat clique sur :

```
[ 🎲 Générer la question ]
```

---

### 🟢 Étape 3 — Synchronisation automatique

🖥️ **jeu.html (candidat)**

```
Question :
Quel est le premier calife de l’Islam ?
⏱️ Temps : 15 secondes
```

❌ **Aucune réponse affichée**

---

📝 **notation.html (jury)**

```
Question :
Quel est le premier calife de l’Islam ?

✔ Réponse correcte :
Abu Bakr As-Siddiq
```

⏱️ Timer synchronisé

---

### 🟢 Étape 4 — Réponse du candidat

* Le candidat répond oralement
* Le jury écoute

---

### 🟢 Étape 5 — Notation par le jury

Dans `notation.html` :

```
[ ✅ Bonne réponse ]   [ ❌ Mauvaise réponse ]
```

➡️ Le score est enregistré
➡️ La progression se met à jour
➡️ Le candidat ne voit que le résultat final, pas la correction

---

## 🔁 PHASE 3 : RUBRIQUES SANS QUESTIONS

(ex : Adhan, récitation)

### ⚠️ Règle

* ❌ Aucun bouton “Générer la question”
* ❌ Aucune synchronisation question/réponse

---

### 📝 `notation.html` (jury)

```
Rubrique : Adhan
Critères :
- Voix ( /3 )
- Prononciation ( /7 )
```

🎚️ Sliders uniquement
📝 Commentaire facultatif

---

### 🎮 `jeu.html` (candidat)

* Page passive
* Aucun bouton actif
* Attend la fin de la notation

---

## 🧠 LOGIQUE TECHNIQUE (SIMPLIFIÉE)

### 📡 Quand le candidat clique sur “Générer”

```
jeu.html
   ↓
API : /generate-question
   ↓
Base de données
   ↓
notation.html reçoit :
- question
- réponse
```

---

### 🔒 Sécurité

* `jeu.html` → **jamais la réponse**
* `notation.html` → **toujours la réponse**
* Une seule génération par question

---

## 🏁 FIN DE RUBRIQUE

* Quand le nombre de questions est atteint :

  * Bouton désactivé dans `jeu.html`
  * Rubrique marquée comme **terminée**
* Passage à la rubrique suivante

---

## 🏆 AVANTAGES DE TA LOGIQUE

✅ Le candidat est **acteur**, pas passif
✅ Aucun risque de triche
✅ Jury totalement indépendant
✅ Synchronisation propre
✅ Logique claire pour le développement
✅ UX simple et fluide

---

## 🎯 CONCLUSION CORRIGÉE

> **`jeu.html` ne contrôle rien sauf la génération.**
> **`notation.html` contrôle l’évaluation.**
> **La vérité (bonne réponse) n’est visible que par le jury.**
> **Toutes les rubriques ne génèrent pas des questions.**

Si tu veux, au prochain message je peux :

* transformer ce scénario en **diagramme UML**
* écrire le **prompt IA parfait** pour générer ce scénario correctement
* te donner la **logique backend/API exacte**
* ou écrire les **règles métier formelles**

Dis-moi 👍




Pour rendre votre application AL ILM 2026 accessible en ligne rapidement (et gratuitement pour commencer), la plateforme la plus simple est Render.com.

Voici les étapes précises à suivre :

1. Mettre votre code sur GitHub
Si ce n'est pas déjà fait, créez un dépôt (privé ou public) sur GitHub et poussez votre code. Render se connectera à ce dépôt pour lire votre code.

2. Créer la Base de Données (PostgreSQL) sur Render
Connectez-vous sur Render.com.
Cliquez sur New + > PostgreSQL.
Donnez-lui un nom (ex: alilm-db).
Choisissez le plan Free (Gratuit).
Une fois créée, copiez l'Internal Database URL (elle servira pour l'étape suivante).
3. Créer le Serveur (Web Service) sur Render
Cliquez sur New + > Web Service.
Connectez votre dépôt GitHub.
Donnez un nom (ex: alilm-2026).
Root Directory : Laissez vide ou mettez le chemin si vous avez une structure particulière (ici, le 
package.json
 est dans /backend, donc mettez backend).
Runtime : Node.
Build Command : npm install
Start Command : node server.js
4. Configurer les Variables d'Environnement
Dans l'onglet Environment de votre Web Service sur Render, ajoutez les variables suivantes :

Clé	Valeur
DATABASE_URL	(L'URL que vous avez copiée à l'étape 2)
JWT_SECRET	(Une phrase secrète au hasard)
NODE_ENV	production
PORT	3000
5. Initialiser les données (Schéma SQL)
La base de données sur Render sera vide au départ. Pour y injecter vos tables :

Sur Render, allez dans l'onglet Dashboard de votre PostgreSQL.
Utilisez l'outil External Connection String avec un logiciel comme DBeaver ou pgAdmin sur votre PC pour vous connecter à distance.
Copiez-collez le contenu de votre fichier database/schema.sql et exécutez-le.



AL MOUDJAHIDOUNE : MOUDJAHIDOUNE024
AL MOUHTADOUNE : MOUHTADOUNE024
AL YAQRA'OUN : YAQRAOUN024
ASH-SHAKIROUNE : SHAKIROUNE024
AS-SOLIHATE : SOLIHATE024
AS SORBIROUNE : SORBIROUNE024
AT-TAWWABOUNE : TAWWABOUNE024
AZ-ZAKIROUNE : ZAKIROUNE024



database  : alilm_db 
username :alilm_db_user
MP : hMC1CSOEv5QZ67NbJ6Sk4b76iZFRBMdf

Internal Database URLpostgresql://alilm_db_user:hMC1CSOEv5QZ67NbJ6Sk4b76iZFRBMdf@dpg-d669dknpm1nc73b6opog-a/alilm_db

External Database URL : postgresql://alilm_db_user:hMC1CSOEv5QZ67NbJ6Sk4b76iZFRBMdf@dpg-d669dknpm1nc73b6opog-a.oregon-postgres.render.com/alilm_db

PSQL Command :  PGPASSWORD=hMC1CSOEv5QZ67NbJ6Sk4b76iZFRBMdf psql -h dpg-d669dknpm1nc73b6opog-a.oregon-postgres.render.com -U alilm_db_user alilm_db




Variable 1 : DATABASE_URL
Key : DATABASE_URL
Value : postgresql://alilm_db_user:hMC1CSOEv5QZ67NbJ6Sk4b76iZFRBMdf@dpg-d669dknpm1nc73b6opog-a.oregon-postgres.render.com/alilm_db
Variable 2 : NODE_ENV
Key : NODE_ENV
Value : production
Variable 3 : JWT_SECRET
Key : JWT_SECRET
Value : ramadan2026-aeemci-esatic (Vous pouvez mettre n'importe quelle phrase secrète, c'est pour sécuriser les connexions)
Variable 4 : FRONTEND_URL
Key : FRONTEND_URL
Value : * (Pour l'instant, on autorise toutes les origines. On affinera plus tard)
