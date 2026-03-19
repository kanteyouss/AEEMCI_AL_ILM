// ============================================
// GESTION DES QUESTIONS - AL ILM 2026
// ============================================

let currentRubrique = null;
let questions = [];
let rubriques = [];
let csvData = [];

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation de la page Questions...');

    // Authentification facultative
    // await checkAuth();
    // if (!getAuthToken()) window.location.href = '/login.html';
    const user = getUser() || { prenom: 'Admin', nom: 'Public', role: 'admin' };

    displayUserInfo();
    await loadRubriques();
    await loadQuestions();
    initEventListeners();
    console.log('✅ Page Questions initialisée');
});

/**
 * Initialiser les écouteurs d'événements
 */
function initEventListeners() {
    console.log('🔧 Initialisation des écouteurs...');

    // Bouton nouvelle question
    const addBtn = document.getElementById('addQuestionBtn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            console.log('✅ Bouton "Nouvelle Question" cliqué');
            openQuestionModal();
        });
        console.log('✅ Écouteur ajouté sur le bouton "Nouvelle Question"');
    } else {
        console.error('❌ Bouton "addQuestionBtn" non trouvé');
    }

    // Bouton import CSV
    const importBtn = document.getElementById('importCsvBtn');
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            console.log('✅ Bouton "Import CSV" cliqué');
            openImportModal();
        });
    }

    // Fermeture modal question
    const modal = document.getElementById('questionModal');
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    cancelBtn.addEventListener('click', () => modal.style.display = 'none');

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === document.getElementById('importModal')) {
            document.getElementById('importModal').style.display = 'none';
        }
    });

    // Fermeture modal import
    const importModal = document.getElementById('importModal');
    const importCloseBtn = importModal.querySelector('.modal-close');
    const importCancelBtn = importModal.querySelector('.modal-cancel');

    importCloseBtn.addEventListener('click', () => importModal.style.display = 'none');
    importCancelBtn.addEventListener('click', () => importModal.style.display = 'none');

    // Fichier CSV
    document.getElementById('csvFile').addEventListener('change', handleCsvFile);
    document.getElementById('downloadTemplateBtn').addEventListener('click', downloadTemplate);
    document.getElementById('confirmImportBtn').addEventListener('click', confirmImport);

    // Type de question - afficher/masquer options
    document.getElementById('typeQuestion').addEventListener('change', (e) => {
        const type = e.target.value;
        const optionsGroup = document.getElementById('optionsGroup');
        const reponseGroup = document.getElementById('reponseGroup');

        if (type === 'qcm') {
            optionsGroup.style.display = 'flex';
            reponseGroup.style.display = 'none';
        } else if (type === 'texte_libre') {
            optionsGroup.style.display = 'none';
            reponseGroup.style.display = 'flex';
        } else {
            optionsGroup.style.display = 'none';
            reponseGroup.style.display = 'none';
        }
    });

    // Rubrique sélectionnée - mettre à jour les points et temps automatiquement
    document.getElementById('rubriqueSelect').addEventListener('change', (e) => {
        const rubriqueId = parseInt(e.target.value);
        if (!rubriqueId) return;

        const rubrique = rubriques.find(r => r.id === rubriqueId);
        if (!rubrique) return;

        // Points par question (pour UNE question)
        const pointsParQuestion = {
            'Vie du Prophète': 15,
            'Jurisprudence': 25,
            'Culture générale': 25,
            'Hadith': 20,
            'Questions relais': 5
        };

        // Mettre à jour les points (pour UNE question)
        const points = pointsParQuestion[rubrique.nom] || 10;
        document.getElementById('points').value = points;

        // Mettre à jour le temps limite si défini
        if (rubrique.temps_par_question) {
            document.getElementById('tempsLimite').value = rubrique.temps_par_question;
        }

        console.log(`📝 Points automatiques: ${points} pts pour 1 question de ${rubrique.nom}`);
    });

    // Formulaire
    document.getElementById('questionForm').addEventListener('submit', handleSubmitQuestion);

    // Filtres
    document.getElementById('searchInput').addEventListener('input', filterQuestions);
    document.getElementById('difficultyFilter').addEventListener('change', filterQuestions);
    document.getElementById('utiliseeFilter').addEventListener('change', filterQuestions);

    // Déconnexion
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Export listeners
    const excelBtn = document.getElementById('exportExcelBtn');
    const pdfBtn = document.getElementById('exportPdfBtn');

    if (excelBtn) excelBtn.addEventListener('click', exportQuestionsExcel);
    if (pdfBtn) pdfBtn.addEventListener('click', exportQuestionsPDF);
}

/**
 * Exporter en Excel (XLSX)
 */
function exportQuestionsExcel() {
    if (questions.length === 0) {
        showNotification('Aucune question à exporter', 'warning');
        return;
    }

    // Préparer les données
    const data = questions.map(q => {
        const rubrique = rubriques.find(r => r.id === q.rubrique_id);

        let row = {
            'Rubrique': rubrique?.nom || 'N/A',
            'Question': q.question_texte,
            'Type': getTypeLabel(q.type),
            'Difficulté': q.difficulte,
            'Points': q.points,
            'Temps Limite': q.temps_limite ? `${q.temps_limite}s` : 'N/A',
            'Référence': q.reference || 'N/A'
        };

        if (q.type === 'qcm' && q.options) {
            row['Option A'] = q.options.A || '';
            row['Option B'] = q.options.B || '';
            row['Option C'] = q.options.C || '';
            row['Option D'] = q.options.D || '';
            row['Réponse Correcte'] = q.reponse_correcte;
        } else {
            row['Réponse'] = q.reponse_correcte || 'N/A';
        }

        return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, `AL_ILM_2026_Banque_Questions_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('✅ Export Excel réussi', 'success');
}

/**
 * Exporter en PDF (Tableau)
 */
function exportQuestionsPDF() {
    if (questions.length === 0) {
        showNotification('Aucune question à exporter', 'warning');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Paysage

    doc.setFontSize(18);
    doc.setTextColor(45, 106, 79);
    doc.text('AL ILM 2026 - Banque de Questions', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total: ${questions.length} questions | Généré le: ${new Date().toLocaleString()}`, 14, 28);

    const columns = [
        { header: 'Rubrique', dataKey: 'rubrique' },
        { header: 'Question', dataKey: 'question' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Diff.', dataKey: 'diff' },
        { header: 'Pts', dataKey: 'pts' },
        { header: 'Réponse', dataKey: 'reponse' }
    ];

    const rows = questions.map(q => {
        const rubrique = rubriques.find(r => r.id === q.rubrique_id);
        let reponseText = q.reponse_correcte || '';
        if (q.type === 'qcm' && q.options) {
            reponseText = `${q.reponse_correcte} (${q.options[q.reponse_correcte] || ''})`;
        }

        return {
            rubrique: rubrique?.nom || 'N/A',
            question: q.question_texte,
            type: getTypeLabel(q.type),
            diff: q.difficulte,
            pts: q.points,
            reponse: reponseText
        };
    });

    doc.autoTable({
        columns: columns,
        body: rows,
        startY: 35,
        theme: 'striped',
        headStyles: { fillColor: [45, 106, 79] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
            question: { cellWidth: 80 },
            reponse: { cellWidth: 50 }
        }
    });

    doc.save(`AL_ILM_2026_Banque_Questions_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('✅ Export PDF réussi', 'success');
}

/**
 * Charger les rubriques
 */
async function loadRubriques() {
    console.log('📥 Chargement des rubriques...');

    try {
        const result = await apiRequest('/rubriques');
        rubriques = result.data || [];

        console.log(`✅ ${rubriques.length} rubrique(s) chargée(s):`, rubriques.map(r => r.nom));

        // Afficher les onglets
        displayRubriqueTabs();

        // Remplir le select
        const select = document.getElementById('rubriqueSelect');
        select.innerHTML = '<option value="">-- Sélectionner une rubrique --</option>';
        rubriques.forEach(rubrique => {
            const option = document.createElement('option');
            option.value = rubrique.id;

            // Points par question selon la rubrique
            const pointsParQuestion = {
                'Vie du Prophète': 15,
                'Jurisprudence': 25,
                'Culture générale': 25,
                'Hadith': 20,
                'Questions relais': 5
            };

            const points = pointsParQuestion[rubrique.nom];

            // N'afficher que les rubriques avec des questions à créer
            if (points) {
                option.textContent = `${rubrique.nom} (${points} pts/question)`;
                select.appendChild(option);
            }
        });

        // Ne pas sélectionner de rubrique par défaut (afficher "Toutes")
        console.log('🎯 Affichage de toutes les rubriques par défaut');

    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification('Erreur lors du chargement des rubriques', 'error');
    }
}

/**
 * Afficher les onglets des rubriques
 */
function displayRubriqueTabs() {
    const container = document.getElementById('rubriqueTabs');

    console.log('📑 Affichage des onglets pour', rubriques.length, 'rubriques');

    // Ajouter l'onglet "Toutes"
    let tabsHTML = `
        <button class="rubrique-tab ${currentRubrique === null ? 'active' : ''}" 
                data-rubrique-id="all">
            📚 Toutes
        </button>
    `;

    // Ajouter les onglets par rubrique
    tabsHTML += rubriques.map(rubrique => `
        <button class="rubrique-tab ${rubrique.id === currentRubrique ? 'active' : ''}" 
                data-rubrique-id="${rubrique.id}">
            ${rubrique.nom}
        </button>
    `).join('');

    container.innerHTML = tabsHTML;

    // Ajouter les événements
    container.querySelectorAll('.rubrique-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const rubriqueId = tab.dataset.rubriqueId;
            currentRubrique = rubriqueId === 'all' ? null : parseInt(rubriqueId);

            console.log(`🔄 Changement de rubrique: ${currentRubrique === null ? 'Toutes' : currentRubrique}`);

            // Mettre à jour l'UI
            container.querySelectorAll('.rubrique-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Recharger les questions
            displayQuestions();
        });
    });
}

/**
 * Charger les questions
 */
async function loadQuestions() {
    console.log('📥 Chargement des questions...');

    try {
        const result = await apiRequest('/questions');
        questions = result.data || [];

        console.log(`✅ ${questions.length} question(s) chargée(s)`);

        displayQuestions();
        updateStats();

    } catch (error) {
        console.error('❌ Erreur:', error);
        showNotification('Erreur lors du chargement des questions', 'error');
    }
}

/**
 * Afficher les questions
 */
function displayQuestions() {
    const container = document.getElementById('questionsList');

    // Filtrer par rubrique (si null, afficher toutes)
    const filteredQuestions = currentRubrique === null
        ? questions
        : questions.filter(q => q.rubrique_id === currentRubrique);

    console.log(`📋 Affichage de ${filteredQuestions.length} question(s)${currentRubrique ? ` pour la rubrique ${currentRubrique}` : ' (toutes rubriques)'}`);

    if (filteredQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Aucune question${currentRubrique ? ' pour cette rubrique' : ''}</p>
                <p style="margin-top: 0.5rem;">Cliquez sur "Nouvelle Question" pour commencer</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredQuestions.map(q => {
        const rubrique = rubriques.find(r => r.id === q.rubrique_id);
        return `
        <div class="question-card" data-question-id="${q.id}">
            <div class="question-header">
                <div>
                    ${currentRubrique === null ? `<span style="display: inline-block; background: var(--primary-color); color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-bottom: 0.5rem;">${rubrique?.nom || 'N/A'}</span><br>` : ''}
                    <div class="question-text">${escapeHtml(q.question_texte)}</div>
                </div>
                <div class="question-actions">
                    <button class="btn-secondary" onclick="editQuestion(${q.id})">Modifier</button>
                    <button class="btn-danger" onclick="deleteQuestion(${q.id})" style="background: #dc3545;">Supprimer</button>
                </div>
            </div>
            
            <div class="question-details">
                <div class="question-detail">
                    <label>Type</label>
                    <div class="value">${getTypeLabel(q.type)}</div>
                </div>
                <div class="question-detail">
                    <label>Difficulté</label>
                    <div class="value">${getDifficultyBadge(q.difficulte)}</div>
                </div>
                <div class="question-detail">
                    <label>Points</label>
                    <div class="value">${q.points} pts</div>
                </div>
                ${q.temps_limite ? `
                    <div class="question-detail">
                        <label>Temps limite</label>
                        <div class="value">${q.temps_limite}s</div>
                    </div>
                ` : ''}
            </div>

            ${q.type === 'qcm' && q.options ? `
                <div style="margin-top: 1rem;">
                    <strong>Options:</strong>
                    <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                        ${Object.entries(q.options).map(([key, value]) => `
                            <li class="${q.reponse_correcte === key ? 'reponse-correcte' : ''}">
                                ${value} ${q.reponse_correcte === key ? '✓' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            ${q.reference ? `
                <div style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                    📖 Référence: ${escapeHtml(q.reference)}
                </div>
            ` : ''}
        </div>
    `;
    }).join('');
}

/**
 * Filtrer les questions
 */
function filterQuestions() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const difficulty = document.getElementById('difficultyFilter').value;
    const utilisee = document.getElementById('utiliseeFilter').value;

    const container = document.getElementById('questionsList');
    const cards = container.querySelectorAll('.question-card');

    let visibleCount = 0;

    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchesSearch = text.includes(searchTerm);
        const difficultyDiv = card.querySelector('.question-detail .value');
        const cardDifficulty = difficultyDiv ? difficultyDiv.textContent.toLowerCase() : '';
        const matchesDifficulty = !difficulty || cardDifficulty.includes(difficulty);

        // Note: Pour l'instant, toutes les questions sont considérées comme non utilisées
        // Cette fonctionnalité sera complétée lors de l'implémentation du jeu
        const matchesUtilisee = !utilisee;

        if (matchesSearch && matchesDifficulty && matchesUtilisee) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (visibleCount === 0 && (searchTerm || difficulty || utilisee)) {
        container.innerHTML = '<div class="empty-state"><p>Aucune question ne correspond aux critères de recherche</p></div>';
    }
}

/**
 * Mettre à jour les statistiques
 */
function updateStats() {
    const totalElement = document.getElementById('totalQuestions');
    if (!totalElement) {
        console.warn('⚠️ Élément totalQuestions non trouvé, stats ignorées');
        return;
    }

    totalElement.textContent = questions.length;

    // Créer des statistiques par rubrique
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) {
        console.warn('⚠️ Élément statsContainer non trouvé');
        return;
    }

    const rubriqueStats = {};

    rubriques.forEach(r => {
        rubriqueStats[r.id] = {
            nom: r.nom,
            count: questions.filter(q => q.rubrique_id === r.id).length
        };
    });

    let statsHTML = `
        <div class="stat-badge">
            <div class="number">${questions.length}</div>
            <div class="label">Total Questions</div>
        </div>
    `;

    Object.values(rubriqueStats).forEach(stat => {
        statsHTML += `
            <div class="stat-badge">
                <div class="number">${stat.count}</div>
                <div class="label">${stat.nom}</div>
            </div>
        `;
    });

    statsContainer.innerHTML = statsHTML;
}

/**
 * Ouvrir le modal de question
 */
function openQuestionModal(question = null) {
    console.log('🔓 Ouverture du modal', question ? `(édition ID: ${question.id})` : '(nouvelle question)');

    const modal = document.getElementById('questionModal');
    const form = document.getElementById('questionForm');

    form.reset();
    document.getElementById('questionId').value = '';
    document.getElementById('modalTitle').textContent = question ? 'Modifier la Question' : 'Nouvelle Question';

    if (question) {
        document.getElementById('questionId').value = question.id;
        document.getElementById('rubriqueSelect').value = question.rubrique_id;
        document.getElementById('questionText').value = question.question;
        document.getElementById('typeQuestion').value = question.type;
        document.getElementById('difficulte').value = question.difficulte;
        document.getElementById('points').value = question.points;
        document.getElementById('tempsLimite').value = question.temps_limite || '';
        document.getElementById('reference').value = question.reference || '';

        // Déclencher le changement de type
        document.getElementById('typeQuestion').dispatchEvent(new Event('change'));

        if (question.type === 'qcm' && question.options) {
            Object.entries(question.options).forEach(([key, value], index) => {
                document.getElementById(`option${index + 1}`).value = value;
                if (question.reponse_correcte === key) {
                    document.getElementById(`correct${index + 1}`).checked = true;
                }
            });
        } else if (question.type === 'texte_libre') {
            document.getElementById('reponseText').value = question.reponse_correcte || '';
        }
    } else {
        // Pré-sélectionner la rubrique courante
        if (currentRubrique) {
            document.getElementById('rubriqueSelect').value = currentRubrique;

            // Appliquer automatiquement les points par défaut
            const rubrique = rubriques.find(r => r.id === currentRubrique);
            if (rubrique) {
                // Points par question (pour UNE question)
                const pointsParQuestion = {
                    'Vie du Prophète': 15,
                    'Jurisprudence': 25,
                    'Culture générale': 25,
                    'Hadith': 20,
                    'Questions relais': 5
                };

                const points = pointsParQuestion[rubrique.nom] || 10;
                document.getElementById('points').value = points;

                if (rubrique.temps_par_question) {
                    document.getElementById('tempsLimite').value = rubrique.temps_par_question;
                }
            }

            console.log(`✅ Rubrique ${currentRubrique} pré-sélectionnée`);
        }
    }

    modal.style.display = 'flex';
    console.log('✅ Modal affiché');
}

/**
 * Soumettre le formulaire
 */
async function handleSubmitQuestion(e) {
    e.preventDefault();

    const questionId = document.getElementById('questionId').value;
    const type = document.getElementById('typeQuestion').value;

    const data = {
        rubrique_id: parseInt(document.getElementById('rubriqueSelect').value),
        question_texte: document.getElementById('questionText').value,
        type: type,
        difficulte: document.getElementById('difficulte').value,
        points: parseInt(document.getElementById('points').value),
        temps_limite: document.getElementById('tempsLimite').value ? parseInt(document.getElementById('tempsLimite').value) : null,
        reference: document.getElementById('reference').value || null
    };

    // Gérer les réponses selon le type
    if (type === 'qcm') {
        const options = {
            A: document.getElementById('option1').value,
            B: document.getElementById('option2').value,
            C: document.getElementById('option3').value,
            D: document.getElementById('option4').value
        };

        const correctOption = document.querySelector('input[name="correctOption"]:checked');
        if (!correctOption) {
            showNotification('Veuillez sélectionner la bonne réponse', 'error');
            return;
        }

        const correctKey = ['A', 'B', 'C', 'D'][parseInt(correctOption.value) - 1];

        data.options = options;
        data.reponse_correcte = correctKey;

    } else if (type === 'texte_libre') {
        data.reponse_correcte = document.getElementById('reponseText').value;
    } else if (type === 'vrai_faux') {
        data.options = { A: 'Vrai', B: 'Faux' };
    }

    try {
        const endpoint = questionId ? `/questions/${questionId}` : '/questions';
        const method = questionId ? 'PUT' : 'POST';

        console.log('📤 Envoi de la question:', data);

        const result = await apiRequest(endpoint, {
            method: method,
            body: JSON.stringify(data)
        });

        console.log('📥 Réponse serveur:', result);

        showNotification(questionId ? 'Question modifiée avec succès' : 'Question créée avec succès', 'success');
        document.getElementById('questionModal').style.display = 'none';
        await loadQuestions();

    } catch (error) {
        console.error('Erreur:', error);
        showNotification(`Erreur: ${error.message}`, 'error');
    }
}

/**
 * Modifier une question
 */
async function editQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (question) {
        openQuestionModal(question);
    }
}

/**
 * Supprimer une question
 */
async function deleteQuestion(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;

    try {
        await apiRequest(`/questions/${id}`, {
            method: 'DELETE'
        });

        showNotification('Question supprimée', 'success');
        await loadQuestions();

    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

/**
 * Ouvrir le modal d'import CSV
 */
function openImportModal() {
    const modal = document.getElementById('importModal');
    document.getElementById('csvFile').value = '';
    document.getElementById('fileName').textContent = '';
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('confirmImportBtn').disabled = true;
    csvData = [];
    modal.style.display = 'flex';
}

/**
 * Télécharger un modèle CSV
 */
function downloadTemplate() {
    const template = `rubrique,question,type,optionA,optionB,optionC,optionD,reponse,difficulte,points,temps_limite,reference
Vie du Prophète,En quelle année est né le Prophète Muhammad (ﷺ)?,texte_libre,,,,,,facile,15,15,Sira
Jurisprudence,Combien de Rakats dans Salat al-Fajr?,qcm,2,3,4,5,A,moyen,25,15,Fiqh
Culture générale,Quelle est la capitale de l'Arabie Saoudite?,qcm,Riyad,Jeddah,La Mecque,Médine,A,facile,25,15,
Hadith,Récitez le premier hadith de l'Imam An-Nawawi,recitation,,,,,,difficile,20,20,40 Hadith Nawawi
Questions relais,La prière est le pilier de l'Islam,vrai_faux,Vrai,Faux,,,A,facile,5,15,`;

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'questions_template_alilm2026.csv';
    link.click();
}

/**
 * Gérer le fichier CSV uploadé
 */
function handleCsvFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById('fileName').textContent = `📎 ${file.name}`;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const csv = event.target.result;
            csvData = parseCSV(csv);

            if (csvData.length === 0) {
                throw new Error('Aucune donnée valide trouvée dans le fichier');
            }

            displayPreview(csvData);
            document.getElementById('confirmImportBtn').disabled = false;

        } catch (error) {
            console.error('Erreur:', error);
            showNotification('Erreur lors de la lecture du fichier : ' + error.message, 'error');
            document.getElementById('confirmImportBtn').disabled = true;
        }
    };
    reader.readAsText(file);
}

/**
 * Parser le CSV
 */
function parseCSV(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());

    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);

        if (values.length < headers.length) continue;

        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ? values[index].trim() : '';
        });

        // Trouver l'ID de la rubrique
        const rubrique = rubriques.find(r =>
            r.nom.toLowerCase() === row.rubrique.toLowerCase()
        );

        if (!rubrique) {
            console.warn(`Rubrique non trouvée: ${row.rubrique}`);
            continue;
        }

        const question = {
            rubrique_id: rubrique.id,
            question: row.question,
            type: row.type,
            difficulte: row.difficulte || 'moyen',
            points: parseInt(row.points) || 10,
            temps_limite: row.temps_limite ? parseInt(row.temps_limite) : null,
            reference: row.reference || null
        };

        // Gérer les options selon le type
        if (row.type === 'qcm') {
            question.options = {
                A: row.optionA,
                B: row.optionB,
                C: row.optionC,
                D: row.optionD
            };
            question.reponse_correcte = row.reponse;
        } else if (row.type === 'vrai_faux') {
            question.options = { A: 'Vrai', B: 'Faux' };
            question.reponse_correcte = row.reponse;
        } else if (row.type === 'texte_libre') {
            question.reponse_correcte = row.reponse;
        }

        data.push(question);
    }

    return data;
}

/**
 * Parser une ligne CSV (gère les guillemets)
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);

    return result;
}

/**
 * Afficher l'aperçu des questions
 */
function displayPreview(data) {
    const container = document.getElementById('previewContent');

    container.innerHTML = data.slice(0, 10).map((q, index) => `
        <div style="padding: 0.75rem; background: var(--bg-primary); border-radius: 4px; margin-bottom: 0.5rem;">
            <strong>${index + 1}.</strong> ${escapeHtml(q.question)}
            <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">
                Type: ${getTypeLabel(q.type)} | Difficulté: ${q.difficulte} | Points: ${q.points}
            </div>
        </div>
    `).join('');

    if (data.length > 10) {
        container.innerHTML += `<div style="text-align: center; color: var(--text-secondary); padding: 0.5rem;">... et ${data.length - 10} autres questions</div>`;
    }

    document.getElementById('previewCount').textContent = `${data.length} question(s) prête(s) à être importée(s)`;
    document.getElementById('previewContainer').style.display = 'block';
}

/**
 * Confirmer l'import
 */
async function confirmImport() {
    if (csvData.length === 0) return;

    const confirmBtn = document.getElementById('confirmImportBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Import en cours...';

    let successCount = 0;
    let errorCount = 0;

    for (const question of csvData) {
        try {
            await apiRequest('/questions', {
                method: 'POST',
                body: JSON.stringify(question)
            });
            successCount++;
        } catch (error) {
            errorCount++;
            console.error('Erreur pour la question:', question.question, error);
        }
    }

    confirmBtn.textContent = '✅ Importer';
    confirmBtn.disabled = false;

    document.getElementById('importModal').style.display = 'none';

    showNotification(
        `Import terminé : ${successCount} question(s) importée(s), ${errorCount} erreur(s)`,
        errorCount === 0 ? 'success' : 'warning'
    );

    await loadQuestions();
}

/**
 * Utilitaires
 */
function getTypeLabel(type) {
    const types = {
        'qcm': 'QCM',
        'vrai_faux': 'Vrai/Faux',
        'texte_libre': 'Texte libre',
        'recitation': 'Récitation'
    };
    return types[type] || type;
}

function getDifficultyBadge(difficulte) {
    const colors = {
        'facile': 'green',
        'moyen': 'orange',
        'difficile': 'red'
    };
    const color = colors[difficulte] || 'gray';
    return `<span style="color: ${color}; font-weight: 600;">${difficulte.toUpperCase()}</span>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    alert(message);
}

function displayUserInfo() {
    const user = getUser() || { prenom: 'Admin', nom: 'Public', role: 'admin' };
    const userNameElement = document.getElementById('userName');
    const adminBadge = document.querySelector('.admin-badge');

    if (userNameElement) {
        const displayName = user.prenom ? `${user.prenom} ${user.nom}` : (user.nom || 'Utilisateur');
        userNameElement.textContent = displayName;
    }

    if (adminBadge && user.type === 'equipe') {
        adminBadge.textContent = 'Session Équipe';
        adminBadge.style.background = 'rgba(76, 175, 80, 0.1)';
        adminBadge.style.color = '#4caf50';
    }
}

// Redundant local auth functions removed. Using functions from api.js
