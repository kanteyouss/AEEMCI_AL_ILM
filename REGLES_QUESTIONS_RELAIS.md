# 📝 Règles des Questions Relais - AL ILM 2026

## 🎯 Principe Général

La rubrique **Questions relais** est une épreuve dynamique où l'équipe progresse question par question, **mais s'arrête immédiatement en cas d'erreur**.

---

## 👥 Déroulement

### Configuration
- **Participants** : Maximum 4 personnes de l'équipe
- **Questions** : 1 question par personne (maximum 4 questions)
- **Temps** : 15 secondes par question
- **Points** : 10 points par bonne réponse
- **Score maximum** : 40 points (4 × 10 pts)

### Processus
1. **Premier participant** : L'équipe désigne un premier membre
2. **Question posée** : Le jury pose une question
3. **Réponse donnée** :
   - ✅ **Bonne réponse** → +10 points + passage au participant suivant
   - ❌ **Mauvaise réponse** → 0 point + **FIN DU RELAIS** pour cette équipe

4. Si bonne réponse, **répéter** avec un nouveau participant (jusqu'à 4 max)

---

## 📊 Scénarios Possibles

### Scénario 1 : Relais complet (40 pts)
```
Participant 1 : ✅ Bonne réponse → +10 pts (Total: 10)
Participant 2 : ✅ Bonne réponse → +10 pts (Total: 20)
Participant 3 : ✅ Bonne réponse → +10 pts (Total: 30)
Participant 4 : ✅ Bonne réponse → +10 pts (Total: 40)
🏆 SCORE FINAL : 40/40
```

### Scénario 2 : Arrêt à la 3ème question (20 pts)
```
Participant 1 : ✅ Bonne réponse → +10 pts (Total: 10)
Participant 2 : ✅ Bonne réponse → +10 pts (Total: 20)
Participant 3 : ❌ Mauvaise réponse → 0 pt
🛑 FIN DU RELAIS
📊 SCORE FINAL : 20/40
```

### Scénario 3 : Arrêt dès la 1ère question (0 pt)
```
Participant 1 : ❌ Mauvaise réponse → 0 pt
🛑 FIN DU RELAIS
📊 SCORE FINAL : 0/40
```

---

## 🎮 Interface de Notation

### Mode Questions (comme les autres rubriques)
L'interface fonctionne comme pour les autres rubriques à questions :
- Génération de la question
- Chronomètre de 15 secondes
- Boutons "Bonne réponse" / "Mauvaise réponse"

### Spécificité Relais
Après chaque validation :
- **Bonne réponse** : 
  - +10 points au score
  - Progression : "1/4" → "2/4" → "3/4" → "4/4"
  - Génération automatique de la question suivante
  - **Maximum 4 questions**

- **Mauvaise réponse** :
  - 0 point pour cette question
  - **Blocage immédiat** : plus de génération de question
  - Message : "❌ Relais terminé ! Score final : X/40"
  - Passage au bouton "Enregistrer"

---

## 💡 Conseils Jury

1. **Vérifier l'ordre** : Demander à l'équipe qui commence
2. **Être clair** : Annoncer "Bonne réponse, on continue" ou "Mauvaise réponse, le relais s'arrête"
3. **Chronomètre strict** : 15 secondes par question
4. **Ne pas révéler la réponse** : En cas d'erreur, simplement arrêter le relais
5. **Encourager** : Féliciter les équipes qui vont loin dans le relais

---

## 📈 Stratégie Équipe

- **Ordre tactique** : Mettre les membres les plus solides au début pour sécuriser des points
- **Ou inverse** : Mettre les plus forts à la fin pour maximiser le score si tout va bien
- **Gestion du stress** : Chaque participant sait qu'une erreur arrête tout

---

## 🔧 Données Techniques

```json
{
  "nom": "Questions relais",
  "type": "relais",
  "points_max": 40,
  "temps_par_question": 15,
  "criteres_evaluation": {"exactitude": 10},
  "nombre_questions_max": 4
}
```

### Calcul du Score
```javascript
score_final = nombre_bonnes_reponses × 10
// Minimum : 0 (arrêt immédiat)
// Maximum : 40 (4 bonnes réponses)
```

---

## ⚖️ Impact sur le Classement

Avec 40 points maximum, cette rubrique représente **14% du total d'une manche** (sur 280 points).

C'est une rubrique à **haut risque / haute récompense** :
- Équipe solide → 40 points assurés
- Équipe fragile → Peut perdre tous les points dès la 1ère question

**Équilibre compétitif** : Les équipes faibles peuvent marquer quelques points (10-20) même sans finir le relais.
