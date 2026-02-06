// ============================================
// NOTATION - AL ILM 2026 (Question par Question)
// ============================================

let manches = [];
let rubriques = [];
let equipes = [];
let currentManche = null;
let currentRubrique = null;
let currentEquipe = null;

// État de la session de notation
let notationSession = {
    questions: [],
    currentQuestionIndex: 0,
    totalQuestions: 0,
    pointsPerQuestion: 0,
    timePerQuestion: 0,
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    timer: null,
    timeRemaining: 0
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation page notation');
    
    const user = getUser();
    if (!user || (user.role !== 'admin' && user.role !== 'jury')) {
        window.location.href = '/login.html';
        return;
    }
    
    document.getElementById('userName').textContent = `${user.prenom} ${user.nom}`;
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        clearAuthToken();
        window.location.href = '/login.html';
    });
    
    await loadManches();
    initEventListeners();
});

/**
 * Charger les manches disponibles
 */
async function loadManches() {
    try {
        console.log('📡 Tentative de chargement des manches depuis /api/manches...');
        const response = await fetch('/api/manches');
        
        console.log('📊 Statut de la réponse:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Erreur serveur:', errorText);
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📦 Données reçues:', result);
        
        manches = result.data || [];
        console.log(`📋 Nombre de manches: ${manches.length}`);
        
        const select = document.getElementById('mancheSelect');
        
        if (!select) {
            console.error('❌ Élément mancheSelect non trouvé dans le DOM');
            return;
        }
        
        if (manches.length === 0) {
            console.warn('⚠️ Aucune manche trouvée dans la base de données');
            select.innerHTML = '<option value="">Aucune manche programmée</option>';
            const alertDiv = document.getElementById('noSessionAlert');
            if (alertDiv) {
                alertDiv.style.display = 'block';
            }
            console.warn('⚠️ Aucune manche programmée. Veuillez créer des manches dans le dashboard.');
            return;
        }
        
        select.innerHTML = '<option value="">-- Sélectionnez une manche --</option>';
        
        manches.forEach(manche => {
            const option = document.createElement('option');
            option.value = manche.id;
            const date = new Date(manche.date_manche).toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            });
            option.textContent = `${manche.nom} - ${date}`;
            option.dataset.manche = JSON.stringify(manche);
            select.appendChild(option);
        });
        
        console.log(`✅ ${manches.length} manche(s) chargée(s)`);
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des manches:', error);
        console.error('Stack trace:', error.stack);
        alert(`Erreur: ${error.message}. Vérifiez que le serveur backend est démarré.`);
        
        // Afficher un message dans le select
        const select = document.getElementById('mancheSelect');
        if (select) {
            select.innerHTML = '<option value="">❌ Erreur de chargement - Serveur inaccessible</option>';
        }
    }
}

/**
 * Charger les rubriques pour une manche
 */
async function loadRubriques(mancheId) {
    try {
        const response = await fetch(`/api/notation/sessions?manche_id=${mancheId}`);
        
        if (!response.ok) throw new Error('Erreur chargement rubriques');
        
        const result = await response.json();
        const sessions = result.data || [];
        
        // Extraire les rubriques uniques avec leur session_id
        const rubriquesMap = new Map();
        sessions.forEach(session => {
            if (!rubriquesMap.has(session.rubrique_id)) {
                rubriquesMap.set(session.rubrique_id, {
                    id: session.rubrique_id,
                    session_id: session.session_id,
                    nom: session.rubrique_nom,
                    type: session.rubrique_type,
                    points_max: session.points_max,
                    criteres_evaluation: session.criteres_evaluation,
                    description: session.description || ''
                });
            }
        });
        
        rubriques = Array.from(rubriquesMap.values());
        
        const select = document.getElementById('rubriqueSelect');
        select.disabled = false;
        select.innerHTML = '<option value="">-- Sélectionnez une rubrique --</option>';
        
        rubriques.forEach(rubrique => {
            const option = document.createElement('option');
            option.value = rubrique.id;
            option.textContent = `${rubrique.nom} (${rubrique.points_max} pts)`;
            option.dataset.rubrique = JSON.stringify(rubrique);
            select.appendChild(option);
        });
        
        console.log(`✅ ${rubriques.length} rubrique(s) chargée(s)`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification('Erreur lors du chargement des rubriques', 'error');
    }
}

/**
 * Charger les équipes pour la session sélectionnée
 */
async function loadEquipes(mancheId) {
    try {
        const response = await fetch(`/api/notation/equipes/${mancheId}`);
        
        if (!response.ok) throw new Error('Erreur chargement équipes');
        
        const result = await response.json();
        equipes = result.data || [];
        
        const select = document.getElementById('equipeSelect');
        select.disabled = false;
        select.innerHTML = '<option value="">-- Sélectionnez une équipe --</option>';
        
        equipes.forEach(equipe => {
            const option = document.createElement('option');
            option.value = equipe.id;
            option.textContent = `${equipe.nom} (${equipe.nb_membres} membres)`;
            option.dataset.equipe = JSON.stringify(equipe);
            select.appendChild(option);
        });
        
        console.log(`✅ ${equipes.length} équipe(s) chargée(s)`);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification('Erreur lors du chargement des équipes', 'error');
    }
}

/**
 * Initialiser les écouteurs d'événements
 */
function initEventListeners() {
    // Changement de manche
    document.getElementById('mancheSelect').addEventListener('change', async (e) => {
        const option = e.target.options[e.target.selectedIndex];
        
        if (!option.dataset.manche) {
            currentManche = null;
            document.getElementById('rubriqueSelect').disabled = true;
            document.getElementById('equipeSelect').disabled = true;
            document.getElementById('notationForm').classList.remove('visible');
            return;
        }
        
        currentManche = JSON.parse(option.dataset.manche);
        
        // Réinitialiser les selects suivants
        document.getElementById('rubriqueSelect').innerHTML = '<option value="">Chargement...</option>';
        document.getElementById('equipeSelect').disabled = true;
        document.getElementById('notationForm').classList.remove('visible');
        
        // Charger les rubriques
        await loadRubriques(currentManche.id);
        
        // Charger les équipes
        await loadEquipes(currentManche.id);
    });
    
    // Changement de rubrique
    document.getElementById('rubriqueSelect').addEventListener('change', async (e) => {
        const option = e.target.options[e.target.selectedIndex];
        
        if (!option.dataset.rubrique) {
            currentRubrique = null;
            document.getElementById('notationForm').classList.remove('visible');
            document.getElementById('equipeSelect').disabled = true;
            return;
        }
        
        currentRubrique = JSON.parse(option.dataset.rubrique);
        
        // Activer le select équipe
        document.getElementById('equipeSelect').disabled = false;
        
        // Si une équipe est déjà sélectionnée, recharger le formulaire
        if (currentEquipe) {
            await initNotationSession();
        }
    });
    
    // Changement d'équipe
    document.getElementById('equipeSelect').addEventListener('change', async (e) => {
        const option = e.target.options[e.target.selectedIndex];
        
        if (!option.dataset.equipe) {
            currentEquipe = null;
            document.getElementById('notationForm').classList.remove('visible');
            return;
        }
        
        currentEquipe = JSON.parse(option.dataset.equipe);
        
        // Initialiser la session de notation
        await initNotationSession();
    });
    
    // Bouton générer question
    document.getElementById('generateBtn').addEventListener('click', generateQuestion);
    
    // Boutons de réponse
    document.getElementById('correctBtn').addEventListener('click', () => validateAnswer(true));
    document.getElementById('incorrectBtn').addEventListener('click', () => validateAnswer(false));
    
    // Bouton sauvegarder
    document.getElementById('saveBtn').addEventListener('click', saveNotation);
    
    // Bouton réinitialiser
    document.getElementById('resetBtn').addEventListener('click', resetNotation);
}

/**
 * Vérifier si une notation existe déjà pour cette équipe/rubrique/manche
 */
async function checkNotationExistante() {
    try {
        const response = await fetch(
            `/api/notation/check?equipe_id=${currentEquipe.id}&manche_id=${currentManche.id}&rubrique_id=${currentRubrique.id}`
        );
        
        const result = await response.json();
        
        if (result.existe) {
            // Afficher un message avec le score existant
            const message = `✅ Cette équipe a déjà été notée pour cette rubrique !\n\n` +
                `Score obtenu : ${result.notation.note_totale} / ${currentRubrique.points_max} pts\n\n` +
                `Voulez-vous modifier cette notation ?`;
            
            if (confirm(message)) {
                // L'utilisateur veut modifier - charger les données existantes
                await loadExistingNotation(result.notation);
                return false; // Continuer avec la session
            } else {
                // L'utilisateur ne veut pas modifier
                showNotification('⚠️ Équipe déjà notée. Sélectionnez une autre équipe.', 'warning');
                document.getElementById('notationForm').classList.remove('visible');
                return true; // Bloquer la session
            }
        }
        
        return false; // Pas de notation existante
        
    } catch (error) {
        console.error('❌ Erreur vérification notation:', error);
        return false; // En cas d'erreur, permettre la notation
    }
}

/**
 * Charger une notation existante pour modification
 */
async function loadExistingNotation(notation) {
    // Pour l'instant, on affiche juste les infos
    // Dans une version future, on pourrait permettre la modification
    showNotification(`📊 Notation existante : ${notation.note_totale} pts`, 'info');
    
    // Désactiver le formulaire pour éviter la double notation
    document.getElementById('notationForm').classList.remove('visible');
}

/**
 * Initialiser la session de notation
 */
async function initNotationSession() {
    if (!currentManche || !currentRubrique || !currentEquipe) return;
    
    // Nettoyer le formulaire avant de commencer
    cleanupNotationForm();
    
    // Vérifier si une notation existe déjà
    const notationExists = await checkNotationExistante();
    if (notationExists) {
        return; // Ne pas continuer si déjà noté
    }
    
    // Détecter le type de notation selon les critères
    const useCriteria = currentRubrique.criteres_evaluation && 
                        typeof currentRubrique.criteres_evaluation === 'object' &&
                        (currentRubrique.criteres_evaluation.voix !== undefined ||
                         currentRubrique.criteres_evaluation.prononciation !== undefined);
    
    if (useCriteria) {
        // Notation par critères (Adhan, Coran ouvert, Coran fermé)
        await initCriteriaNotation();
    } else {
        // Notation par questions (Questions Coran, Vie du Prophète, etc.)
        await initQuestionNotation();
    }
}

/**
 * Initialiser la notation par critères (sliders)
 */
async function initCriteriaNotation() {
    const badge = document.getElementById('equipeNom');
    badge.textContent = currentEquipe.nom;
    badge.style.background = currentEquipe.couleur || 'var(--primary-color)';
    badge.style.color = 'white';
    
    document.getElementById('maxScore').textContent = currentRubrique.points_max;
    document.getElementById('progressText').textContent = 'Notation par critères';
    document.getElementById('currentScore').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    
    // Masquer la zone de questions
    document.getElementById('questionBox').style.display = 'none';
    document.getElementById('questionsList').style.display = 'none';
    document.getElementById('scoreSummary').style.display = 'none';
    
    // Créer la zone de critères seulement si elle n'existe pas déjà
    let criteresContainer = document.getElementById('criteresSliders');
    if (criteresContainer) {
        criteresContainer.remove(); // Supprimer l'ancien s'il existe
    }
    
    criteresContainer = document.createElement('div');
    criteresContainer.id = 'criteresSliders';
    criteresContainer.style.cssText = 'background: white; padding: 2rem; border-radius: 8px; margin: 2rem 0;';
    
    let totalScore = 0;
    const criteres = currentRubrique.criteres_evaluation;
    
    let html = '<h4 style="margin-bottom: 1.5rem;">Évaluation par critères</h4>';
    
    Object.entries(criteres).forEach(([nom, maxPoints]) => {
        html += `
            <div class="critere-item" style="background: #f7fafc; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-weight: 600; text-transform: capitalize;">${nom}</span>
                    <span style="color: #718096;">Max: ${maxPoints} pts</span>
                </div>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <input type="range" 
                           class="critere-slider" 
                           data-critere="${nom}"
                           min="0" 
                           max="${maxPoints}" 
                           value="0"
                           step="0.5"
                           style="flex: 1; height: 8px;">
                    <span class="critere-value" style="min-width: 60px; text-align: center; font-weight: 600; color: var(--primary-color);">0 pts</span>
                </div>
            </div>
        `;
    });
    
    criteresContainer.innerHTML = html;
    
    // Insérer avant la section finale
    const notationForm = document.getElementById('notationForm');
    const finalSection = document.getElementById('finalSection');
    notationForm.insertBefore(criteresContainer, finalSection);
    
    // Ajouter les événements aux sliders
    document.querySelectorAll('.critere-slider').forEach(slider => {
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            const valueSpan = e.target.nextElementSibling;
            valueSpan.textContent = `${value} pts`;
            
            // Calculer le total
            let total = 0;
            document.querySelectorAll('.critere-slider').forEach(s => {
                total += parseFloat(s.value);
            });
            document.getElementById('currentScore').textContent = total.toFixed(1);
        });
    });
    
    // Afficher le formulaire et la section finale
    document.getElementById('notationForm').classList.add('visible');
    document.getElementById('finalSection').style.display = 'block';
    
    console.log('🎯 Notation par critères initialisée');
}

/**
 * Initialiser la notation par questions
 */
async function initQuestionNotation() {
    // Extraire le nombre de questions depuis la description
    console.log('📝 Description de la rubrique:', currentRubrique.description);
    const nbQuestions = extractQuestionCount(currentRubrique.description);
    console.log('🔢 Nombre de questions détecté:', nbQuestions);
    const pointsParQuestion = nbQuestions > 0 ? currentRubrique.points_max / nbQuestions : currentRubrique.points_max;
    
    notationSession = {
        questions: [],
        currentQuestionIndex: 0,
        totalQuestions: nbQuestions,
        pointsPerQuestion: pointsParQuestion,
        timePerQuestion: currentRubrique.temps_par_question || 15,
        score: 0,
        correctCount: 0,
        incorrectCount: 0,
        timer: null,
        timeRemaining: 0
    };
    
    // Afficher le nom de l'équipe
    const badge = document.getElementById('equipeNom');
    badge.textContent = currentEquipe.nom;
    badge.style.background = currentEquipe.couleur || 'var(--primary-color)';
    badge.style.color = 'white';
    
    // Mettre à jour l'affichage
    document.getElementById('maxScore').textContent = currentRubrique.points_max;
    document.getElementById('progressText').textContent = `0/${nbQuestions}`;
    document.getElementById('currentScore').textContent = '0';
    document.getElementById('progressFill').style.width = '0%';
    
    // Afficher le formulaire
    document.getElementById('notationForm').classList.add('visible');
    document.getElementById('questionBox').style.display = 'block';
    document.getElementById('scoreSummary').style.display = 'none';
    document.getElementById('questionsList').style.display = 'none';
    document.getElementById('finalSection').style.display = 'none';
    
    // Réinitialiser l'affichage
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('answerButtons').style.display = 'none';
    document.getElementById('questionText').textContent = 'Cliquez sur "Générer la question" pour commencer';
    document.getElementById('timer').textContent = '--';
    document.getElementById('questionsHistory').innerHTML = '';
    
    console.log(`🎯 Session initialisée: ${nbQuestions} questions × ${pointsParQuestion} pts`);
}

/**
 * Extraire le nombre de questions depuis la description
 */
function extractQuestionCount(description) {
    if (!description) return 1;
    
    // Cas spécial pour Questions relais : "4 participants max"
    if (description.includes('participants max')) {
        const match = description.match(/(\d+)\s+participants max/i);
        return match ? parseInt(match[1]) : 4;
    }
    
    // Chercher "X questions" dans la description (ex: "2 questions", "4 questions")
    const questionMatch = description.match(/(\d+)\s+questions?/i);
    if (questionMatch) {
        return parseInt(questionMatch[1]);
    }
    
    // Chercher "1 question = X pts" (si c'est une seule question)
    if (description.includes('1 question =')) {
        return 1;
    }
    
    // Par défaut
    return 1;
}

/**
 * Générer une question aléatoire
 */
async function generateQuestion() {
    try {
        document.getElementById('generateBtn').disabled = true;
        document.getElementById('questionText').textContent = 'Chargement de la question...';
        
        // Appeler l'API pour obtenir une question
        const response = await fetch(`/api/questions/random?rubrique_id=${currentRubrique.id}`);
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Erreur lors de la génération de la question');
        }
        
        if (!result.data) {
            throw new Error('Aucune question disponible pour cette rubrique');
        }
        
        const question = result.data;
        
        // Afficher la question avec la réponse
        const questionDisplay = document.getElementById('questionText');
        questionDisplay.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <strong style="color: #2d3748;">Question :</strong><br/>
                ${question.question_texte}
            </div>
            <div style="background: #e6ffed; padding: 1rem; border-radius: 6px; border-left: 4px solid #10b981;">
                <strong style="color: #065f46;">✓ Réponse attendue :</strong><br/>
                <span style="color: #047857;">${question.reponse_correcte}</span>
            </div>
        `;
        document.getElementById('questionNum').textContent = notationSession.currentQuestionIndex + 1;
        
        // Afficher les boutons de réponse
        document.getElementById('answerButtons').style.display = 'grid';
        
        // Démarrer le chronomètre
        startTimer();
        
        // Stocker la question
        notationSession.questions.push({
            question: question,
            answered: false,
            correct: null,
            timeSpent: 0
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        document.getElementById('questionText').innerHTML = `
            <div style="background: #fee2e2; padding: 1.5rem; border-radius: 6px; border-left: 4px solid #dc2626;">
                <strong style="color: #991b1b;">❌ Erreur</strong><br/>
                <span style="color: #7f1d1d;">${error.message}</span>
                <br/><br/>
                <small style="color: #991b1b;">
                    ${currentRubrique.nom === 'Questions relais' 
                        ? 'Aucune question disponible pour Questions relais. Veuillez exécuter le script: <code>node backend/scripts/generateQuestionsRelais.js</code>' 
                        : 'Veuillez vérifier que des questions existent pour cette rubrique.'}
                </small>
            </div>
        `;
        document.getElementById('generateBtn').disabled = false;
    }
}

/**
 * Démarrer le chronomètre
 */
function startTimer() {
    notationSession.timeRemaining = notationSession.timePerQuestion;
    updateTimerDisplay();
    
    if (notationSession.timer) {
        clearInterval(notationSession.timer);
    }
    
    notationSession.timer = setInterval(() => {
        notationSession.timeRemaining--;
        updateTimerDisplay();
        
        if (notationSession.timeRemaining <= 0) {
            clearInterval(notationSession.timer);
            // Temps écoulé - considérer comme mauvaise réponse
            showNotification('⏰ Temps écoulé !', 'warning');
        }
    }, 1000);
}

/**
 * Mettre à jour l'affichage du chronomètre
 */
function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `${notationSession.timeRemaining}s`;
    
    if (notationSession.timeRemaining <= 5) {
        timerEl.classList.add('warning');
    } else {
        timerEl.classList.remove('warning');
    }
}

/**
 * Valider la réponse
 */
function validateAnswer(isCorrect) {
    // Arrêter le chronomètre
    if (notationSession.timer) {
        clearInterval(notationSession.timer);
    }
    
    // Enregistrer la réponse
    const currentQuestion = notationSession.questions[notationSession.currentQuestionIndex];
    currentQuestion.answered = true;
    currentQuestion.correct = isCorrect;
    currentQuestion.timeSpent = notationSession.timePerQuestion - notationSession.timeRemaining;
    
    // Mettre à jour le score
    if (isCorrect) {
        notationSession.score += notationSession.pointsPerQuestion;
        notationSession.correctCount++;
    } else {
        notationSession.incorrectCount++;
    }
    
    // Mettre à jour l'affichage
    updateProgress();
    addToHistory(currentQuestion);
    
    // RÈGLE SPÉCIALE POUR QUESTIONS RELAIS : Arrêt en cas d'erreur
    const isRelais = currentRubrique.nom === 'Questions relais' || 
                     (currentRubrique.description && currentRubrique.description.includes('participants max'));
    
    if (isRelais && !isCorrect) {
        // Arrêt du relais en cas de mauvaise réponse
        console.log('🛑 Relais arrêté : mauvaise réponse');
        showNotification('🛑 Relais arrêté ! Mauvaise réponse = fin du relais.', 'warning');
        finishNotation();
        return;
    }
    
    // Passer à la question suivante
    notationSession.currentQuestionIndex++;
    
    if (notationSession.currentQuestionIndex < notationSession.totalQuestions) {
        // Préparer la question suivante
        document.getElementById('answerButtons').style.display = 'none';
        document.getElementById('generateBtn').disabled = false;
        document.getElementById('questionText').textContent = `Question ${notationSession.currentQuestionIndex + 1} - Cliquez sur "Générer la question"`;
        document.getElementById('timer').textContent = '--';
    } else {
        // Toutes les questions sont terminées
        finishNotation();
    }
}

/**
 * Mettre à jour la progression
 */
function updateProgress() {
    const progress = (notationSession.currentQuestionIndex + 1) / notationSession.totalQuestions * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${notationSession.currentQuestionIndex + 1}/${notationSession.totalQuestions}`;
    document.getElementById('currentScore').textContent = notationSession.score.toFixed(1);
}

/**
 * Ajouter à l'historique
 */
function addToHistory(questionData) {
    const historyContainer = document.getElementById('questionsHistory');
    document.getElementById('questionsList').style.display = 'block';
    
    const item = document.createElement('div');
    item.className = 'question-item';
    item.innerHTML = `
        <div>
            <strong>Question ${notationSession.currentQuestionIndex + 1}</strong>
            <div style="color: #718096; font-size: 0.9rem;">${questionData.question.question_texte.substring(0, 60)}...</div>
        </div>
        <span class="question-status ${questionData.correct ? 'correct' : 'incorrect'}">
            ${questionData.correct ? '✓ Correcte' : '✗ Incorrecte'}
        </span>
    `;
    historyContainer.appendChild(item);
}

/**
 * Terminer la notation
 */
function finishNotation() {
    // Masquer la zone de question
    document.getElementById('questionBox').style.display = 'none';
    
    // Afficher le résumé
    document.getElementById('scoreSummary').style.display = 'grid';
    document.getElementById('correctCount').textContent = notationSession.correctCount;
    document.getElementById('incorrectCount').textContent = notationSession.incorrectCount;
    document.getElementById('finalScore').textContent = notationSession.score.toFixed(1);
    
    // Afficher la section finale
    document.getElementById('finalSection').style.display = 'block';
    
    showNotification('✅ Toutes les questions ont été traitées !', 'success');
}

/**
 * Sauvegarder la notation
 */
async function saveNotation() {
    if (!currentManche || !currentRubrique || !currentEquipe) {
        showNotification('Informations manquantes', 'error');
        return;
    }
    
    try {
        let criteres = {};
        let note_totale = 0;
        
        // Déterminer le type de notation
        const criteresSliders = document.getElementById('criteresSliders');
        
        if (criteresSliders) {
            // Notation par critères (sliders)
            const sliders = document.querySelectorAll('.critere-slider');
            sliders.forEach(slider => {
                const nom = slider.dataset.critere;
                const valeur = parseFloat(slider.value);
                criteres[nom] = valeur;
                note_totale += valeur;
            });
        } else {
            // Notation par questions
            notationSession.questions.forEach((q, index) => {
                criteres[`question_${index + 1}`] = {
                    enonce: q.question.question_texte,
                    correct: q.correct,
                    points: q.correct ? notationSession.pointsPerQuestion : 0,
                    timeSpent: q.timeSpent
                };
            });
            note_totale = notationSession.score;
        }
        
        const data = {
            session_id: currentRubrique.session_id,
            equipe_id: currentEquipe.id,
            manche_id: currentManche.id,
            rubrique_id: currentRubrique.id,
            criteres: criteres,
            note_totale: note_totale,
            commentaire: document.getElementById('commentaire').value || null
        };
        
        console.log('📤 Envoi des données:', data);
        
        const response = await fetch('/api/notation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Erreur lors de l\'enregistrement');
        }
        
        showNotification('✅ Notation enregistrée avec succès', 'success');
        
        // Passer à l'équipe suivante automatiquement
        setTimeout(() => {
            selectNextEquipe();
        }, 1500);
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification(`Erreur: ${error.message}`, 'error');
    }
}

/**
 * Sélectionner l'équipe suivante dans la liste
 */
function selectNextEquipe() {
    const equipeSelect = document.getElementById('equipeSelect');
    const currentIndex = equipeSelect.selectedIndex;
    
    // Chercher la prochaine équipe dans la liste
    if (currentIndex < equipeSelect.options.length - 1) {
        // Il y a encore des équipes dans la liste
        equipeSelect.selectedIndex = currentIndex + 1;
        
        // Déclencher l'événement change pour charger l'équipe
        const option = equipeSelect.options[equipeSelect.selectedIndex];
        
        if (option.dataset.equipe) {
            currentEquipe = JSON.parse(option.dataset.equipe);
            cleanupNotationForm();
            initNotationSession();
            showNotification(`➡️ Équipe suivante : ${currentEquipe.nom}`, 'info');
        }
    } else {
        // Toutes les équipes ont été notées
        showNotification('🎉 Toutes les équipes ont été notées pour cette rubrique !', 'success');
        document.getElementById('equipeSelect').value = '';
        document.getElementById('notationForm').classList.remove('visible');
        cleanupNotationForm();
    }
}

/**
 * Nettoyer le formulaire de notation
 */
function cleanupNotationForm() {
    // Supprimer le container de critères s'il existe
    const criteresSliders = document.getElementById('criteresSliders');
    if (criteresSliders) {
        criteresSliders.remove();
    }
    
    // Réinitialiser l'historique des questions
    const questionsHistory = document.getElementById('questionsHistory');
    if (questionsHistory) {
        questionsHistory.innerHTML = '';
    }
    
    // Réinitialiser la zone de question
    const questionText = document.getElementById('questionText');
    if (questionText) {
        questionText.innerHTML = '';
    }
    
    // Réinitialiser le chronomètre
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.textContent = '--';
    }
    
    // Réinitialiser les commentaires
    const commentaires = document.getElementById('commentaires');
    if (commentaires) {
        commentaires.value = '';
    }
    
    // Arrêter le timer s'il existe
    if (notationSession && notationSession.timer) {
        clearInterval(notationSession.timer);
    }
    
    // Réinitialiser la session
    notationSession = null;
}

/**
 * Réinitialiser la notation
 */
function resetNotation() {
    if (!confirm('Êtes-vous sûr de vouloir recommencer ? Toutes les réponses seront perdues.')) {
        return;
    }
    
    // Arrêter le chronomètre
    if (notationSession.timer) {
        clearInterval(notationSession.timer);
    }
    
    // Nettoyer le formulaire
    cleanupNotationForm();
    
    // Réinitialiser la session
    initNotationSession();
}

/**
 * Afficher une notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}
