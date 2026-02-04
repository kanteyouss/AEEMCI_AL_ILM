# 🕌 JEU CONCOURS AL ILM - ÉDITION 2026

## Description

Plateforme web complète pour le **Jeu Concours Al Ilm**, organisé par l'**AEEMCI - Section ESATIC** pendant le mois béni de Ramadan 2026.

Ce projet digitalise l'intégralité du concours : inscription des participants, formation des équipes, compétition en temps réel, notation par jury, et proclamation des résultats.

## 🎯 Fonctionnalités principales

- ✅ **Gestion des participants** (import Google Forms)
- ✅ **Formation intelligente des équipes** (10 équipes)
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
