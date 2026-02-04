# 📋 Structure des Manches - AL ILM 2026

## Vue d'ensemble

Le jeu concours AL ILM 2026 se déroule en **4 phases progressives**, avec un nombre d'équipes qui diminue à chaque étape jusqu'à la grande finale.

---

## 🎯 Les 4 Phases du Concours

### 1️⃣ Phase Préliminaire (Manches 1-4)
**Équipes en lice :** 10 équipes  
**Durée :** 3 jours  
**Objectif :** Départager toutes les équipes

| Jour | Rubriques | Date |
|------|-----------|------|
| Jour 1 | Coran • Hadith | À définir |
| Jour 2 | Fiqh • Sira | À définir |
| Jour 3 | Langue arabe • Culture islamique | À définir |

**Podium :** Top 3 de la phase préliminaire

---

### 2️⃣ Quarts de Finale (Manches 5-6)
**Équipes qualifiées :** 8 meilleures équipes  
**Durée :** 3 jours  
**Objectif :** Sélectionner les 4 demi-finalistes

| Jour | Rubriques | Date |
|------|-----------|------|
| Jour 1 | Coran • Hadith | À définir |
| Jour 2 | Fiqh • Sira | À définir |
| Jour 3 | Langue arabe • Culture islamique | À définir |

**Podium :** Top 3 des quarts de finale

---

### 3️⃣ Demi-Finale (Manches 7-8)
**Équipes qualifiées :** 4 meilleures équipes  
**Durée :** 2 jours  
**Objectif :** Désigner les 2 finalistes

| Jour | Rubriques | Date |
|------|-----------|------|
| Jour 1 | Coran • Hadith • Fiqh | À définir |
| Jour 2 | Sira • Langue arabe • Culture islamique | À définir |

**Podium :** Top 3 des demi-finales

---

### 4️⃣ Finale (Manche 9+)
**Équipes qualifiées :** 2 meilleures équipes  
**Durée :** 1 jour (apothéose)  
**Objectif :** Désigner le grand vainqueur

| Jour | Rubriques | Date |
|------|-----------|------|
| Jour de la finale | Toutes les rubriques | À définir |

**Podium :** Le grand podium final ! 🏆

---

## 📊 Système de Classement par Podium

### Carrousel de Podiums

La **page classement** affiche maintenant un **carrousel de podiums** :

1. **Podium Général** 📊
   - Cumul de **toutes les manches** jouées
   - Classement global des 10 équipes
   - Affiché par défaut

2. **Podium par Manche** 🎯
   - Un podium pour **chaque manche** (Préliminaire 1, 2, 3, 4, Quart 1, 2, etc.)
   - Résultats spécifiques de cette manche uniquement
   - Navigation avec boutons ⬅️ ➡️
   - Indicateurs cliquables (Général • Manche 1 • Manche 2...)

### Navigation

- **Boutons flèches** : Passer d'un podium à l'autre
- **Indicateurs** : Cliquer directement sur "📊 Général" ou "🎯 Manche X"
- **Par défaut** : Le dernier podium (dernière manche jouée) est affiché
- **Sur mobile** : Swipe tactile entre les podiums (indicateurs uniquement)

---

## 🏅 Les 8 Rubriques

1. **📖 Coran** - Récitation, mémorisation, exégèse
2. **📚 Hadith** - Science du hadith, authentification
3. **⚖️ Fiqh** - Jurisprudence islamique
4. **🕌 Sira** - Biographie du Prophète ﷺ
5. **🇸🇦 Langue arabe** - Grammaire, vocabulaire, conjugaison
6. **🌍 Culture islamique** - Histoire, civilisation
7. **🎨 Créativité** - Calligraphie, chants
8. **🤝 Esprit d'équipe** - Cohésion, solidarité

---

## 👥 Les 10 Équipes

| # | Nom | Symbole | Couleur |
|---|-----|---------|---------|
| 1 | AL-FURQAN | ⚖️ | Bleu nuit |
| 2 | AS-SABIQUN | 🏃 | Vert émeraude |
| 3 | AL-MUJAHIDUN | ⚔️ | Rouge cardinal |
| 4 | AN-NUR | 💡 | Jaune doré |
| 5 | AL-HUDA | 🧭 | Turquoise |
| 6 | AL-BADR | 🌕 | Argent |
| 7 | AL-FIRDAWS | 🌴 | Vert olive |
| 8 | AL-MUFLIHUN | 🎯 | Orange |
| 9 | AS-SADIQUN | 🤝 | Violet |
| 10 | AL-IMAN | 🕋 | Noir et or |

---

## 🔧 Utilisation Technique

### Backend - API Classement

```javascript
// Classement général (cumul de toutes les manches)
GET /api/classement

// Classement d'une manche spécifique
GET /api/classement?manche_id=2

// Classement par rubrique
GET /api/classement?rubrique_id=3

// Combiné
GET /api/classement?manche_id=2&rubrique_id=3
```

### Frontend - Carrousel de Podiums

```javascript
// Charger toutes les manches
await loadManches();

// Créer les podiums (1 podium général + 1 par manche)
await loadAllPodiums();

// Naviguer entre les podiums
goToPodiumSlide(index);

// Par défaut : afficher le dernier podium
podiumCarousel.currentIndex = podiumCarousel.manches.length - 1;
```

### SQL - Agrégation Multi-Manches

```sql
SELECT 
    e.nom AS nom_equipe,
    SUM(s.points_obtenus) AS score_total,
    COUNT(DISTINCT s.manche_id) AS nombre_manches,
    COUNT(DISTINCT p.id) AS nombre_participants,
    RANK() OVER (ORDER BY SUM(s.points_obtenus) DESC) AS rang
FROM equipes e
LEFT JOIN participants p ON e.id = p.equipe_id
LEFT JOIN soumissions s ON p.id = s.participant_id
WHERE s.manche_id = ? -- Optionnel : filtrer par manche
GROUP BY e.id, e.nom, e.couleur, e.symbole
ORDER BY score_total DESC;
```

---

## 📅 Calendrier Type (Ramadan 1447 - 2026)

**Ramadan 2026 :** Du mercredi **18 février** au jeudi **19 mars**

### Exemple de Planification

| Phase | Dates | Manches | Équipes |
|-------|-------|---------|---------|
| Préliminaires | 18-20 fév | 1-4 | 10 → 8 |
| Quarts | 25-27 fév | 5-6 | 8 → 4 |
| Demi-finales | 4-5 mars | 7-8 | 4 → 2 |
| Finale | 12 mars | 9 | 2 → 1 |

---

## ✅ Fonctionnalités du Carrousel

### ✓ Implémenté

- [x] Podium général (cumul toutes manches)
- [x] Podium par manche (résultats spécifiques)
- [x] Navigation avec boutons flèches ⬅️ ➡️
- [x] Indicateurs cliquables (Général • Manche 1-9)
- [x] Animations fluides (slide + cubic-bezier)
- [x] Affichage par défaut : dernière manche
- [x] Informations contextuelles (nom manche, date)
- [x] Responsive mobile (indicateurs uniquement)
- [x] Top 3 avec couronnes 👑 🥈 🥉
- [x] Scores et symboles d'équipes

### 🚀 Prochaines Étapes

1. **Créer les manches** dans le dashboard admin
2. **Ajouter les scores** pour chaque manche
3. **Tester le carrousel** avec des données réelles
4. **Vérifier le classement général** (cumul correct)
5. **Valider les filtres** (manche + rubrique)

---

## 📝 Notes Importantes

1. **Ordre des podiums** : Général d'abord, puis chronologique (Manche 1 → 9)
2. **Affichage par défaut** : Dernière manche jouée (index max)
3. **Données manquantes** : Podium vide avec "❓" si < 3 équipes
4. **Performance** : Toutes les manches chargées au démarrage (1 seul appel API)
5. **Cache** : Pas de cache côté client, rafraîchissement auto toutes les 30s

---

## 🎨 Design du Carrousel

```
┌─────────────────────────────────────────┐
│   ⬅️      📊 Podium Général       ➡️    │
├─────────────────────────────────────────┤
│  [📊 Général] [🎯 M1] [🎯 M2] [🎯 M3]   │
├─────────────────────────────────────────┤
│                                         │
│     🥈          👑          🥉          │
│   2ème Place   1ère Place   3ème Place  │
│   [Équipe B]   [Équipe A]   [Équipe C] │
│    450 pts     620 pts      380 pts    │
│                                         │
└─────────────────────────────────────────┘
```

---

**Contactez AEEMCI pour toute question !**  
📧 Email : contact@aeemci.org  
📱 Tél : 05-00-01-74-05 / 07-06-47-11-85
