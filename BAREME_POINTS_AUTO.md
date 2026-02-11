# 📊 SYSTÈME DE POINTS AUTOMATIQUES - AL ILM 2026

## 🎯 Attribution Automatique des Points

Le système attribue **automatiquement** les points corrects à chaque question en fonction de sa rubrique.

### 📖 Barème par Rubrique

| Rubrique | Points par Question | Temps Limite |
|----------|-------------------|--------------|
| **Vie du Prophète ﷺ** | 15 pts | 15 sec |
| **Jurisprudence (Fiqh)** | 25 pts | 15 sec |
| **Culture générale** | 25 pts | 15 sec |
| **Hadith** | 20 pts | 20 sec |
| **Questions relais** | 5 pts | 15 sec |
| **Adhan** | 10 pts | 180 sec (3 min) |
| **Coran ouvert** | 15 pts | N/A |
| **Coran fermé** | 15 pts | N/A |

---

## 🔧 Fonctionnement Technique

### Lors de la création d'une question :

1. **L'admin sélectionne une rubrique** dans le formulaire
2. Le système **détecte automatiquement** la rubrique choisie
3. Les **points et temps** sont **pré-remplis** selon le barème
4. L'admin peut **modifier** si nécessaire (cas exceptionnels)

### Code JavaScript (questions.js)

```javascript
// Points par défaut selon la rubrique
const pointsParQuestion = {
    'Adhan': 10,
    'Coran ouvert': 15,
    'Coran fermé': 15,
    'Vie du Prophète': 15,
    'Jurisprudence': 25,
    'Culture générale': 25,
    'Hadith': 20,
    'Questions relais': 5
};

// Mise à jour automatique lors du changement de rubrique
document.getElementById('rubriqueSelect').addEventListener('change', (e) => {
    const rubrique = rubriques.find(r => r.id === parseInt(e.target.value));
    if (rubrique) {
        const points = pointsParQuestion[rubrique.nom] || 10;
        document.getElementById('points').value = points;
        
        if (rubrique.temps_par_question) {
            document.getElementById('tempsLimite').value = rubrique.temps_par_question;
        }
    }
});
```

---

## 📝 Détails des Rubriques

### 1️⃣ Adhan (10 pts total)
- **Type** : Récitation
- **Description** : Adhan normal ou Fajr
- **Participants** : 1 par équipe
- **Temps** : 3 min max
- **Critères** : Voix (3 pts) + Prononciation (7 pts)

### 2️⃣ Coran ouvert (15 pts total)
- **Type** : Récitation
- **Description** : Juz Amma (sourates 78 à 114)
- **Temps** : Pas de limite
- **Critères** : Voix (5 pts) + Prononciation (10 pts)

### 3️⃣ Coran fermé (15 pts total)
- **Type** : Récitation de mémoire
- **Description** : Sourates 87 à 114
- **Temps** : Pas de limite
- **Critères** : Voix (5 pts) + Prononciation (10 pts)

### 4️⃣ Vie du Prophète ﷺ (30 pts total = 2 questions × 15 pts)
- **Type** : Questions écrites/QCM
- **Questions** : 2 questions
- **Points** : 15 pts par question
- **Temps** : 15 sec par question

### 6️⃣ Jurisprudence (50 pts total = 2 questions × 25 pts)
- **Type** : Questions écrites/QCM
- **Questions** : 2 questions
- **Points** : 25 pts par question
- **Temps** : 15 sec par question

### 7️⃣ Culture générale (100 pts total = 4 questions × 25 pts)
- **Type** : Questions écrites/QCM
- **Questions** : 4 questions
- **Points** : 25 pts par question
- **Temps** : 15 sec par question

### 7️⃣ Hadith (20 pts total = 1 question × 20 pts)
- **Type** : Récitation
- **Questions** : 1 question
- **Points** : 20 pts par question
- **Temps** : 20 sec par question

### 8️⃣ Questions relais (10 pts total = 2 questions × 5 pts)
- **Type** : Relais rapide
- **Questions** : 2 questions
- **Points** : 5 pts par question
- **Temps** : 15 sec par question

---

## 💯 Total Maximum

**240 points** par manche

### Répartition :
- Questions écrites : **180 pts** (Vie: 30, Fiqh: 50, Culture: 100)
- Récitations : **40 pts** (Adhan: 10, Coran ouvert: 15, Coran fermé: 15)
- Hadith : **20 pts**
- Questions relais : **10 pts**

---

## ✅ Avantages du Système Automatique

1. **Cohérence** : Tous les admins utilisent le même barème
2. **Rapidité** : Pas besoin de se rappeler les points de chaque rubrique
3. **Fiabilité** : Moins d'erreurs de saisie
4. **Flexibilité** : Possibilité de modifier si cas exceptionnel
5. **Traçabilité** : Le barème est centralisé dans le code

---

## 🔄 Mise à Jour du Barème

Pour modifier le barème, il faut :

1. Mettre à jour la base de données (`02_rubriques.sql`)
2. Mettre à jour le JavaScript (`questions.js`)
3. Réexécuter la migration
4. Redémarrer le serveur backend

**Fichiers concernés** :
- `/database/seeds/02_rubriques.sql`
- `/database/migrations/update_rubriques_bareme_officiel.sql`
- `/frontend/js/admin/questions.js`
