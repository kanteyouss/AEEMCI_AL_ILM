// ============================================
// PAGE CLASSEMENT PUBLIC - AL ILM 2026
// ============================================

let refreshInterval;
let currentFilters = {
    manche: '',
    rubrique: ''
};

// Configuration de l'affichage (chargée depuis le serveur)
let displayConfig = {
    afficher_podium: true,
    afficher_statistiques: true,
    afficher_classement_complet: true,
    afficher_filtres: true,
    nombre_equipes_affichees: 0,
    classement_publie: false,
    etape_publiee: null, // 'preliminaire', 'quart', 'demi', 'finale'
    message_personnalise: '',
    message_preliminaire: '',
    message_quart: '',
    message_demi: '',
    message_finale: ''
};

// État du carrousel de podiums
let podiumCarousel = {
    manches: [], // Liste des manches avec leurs podiums
    currentIndex: 0, // Index du podium actuellement affiché
    autoRotate: null
};

// Symboles des équipes
const equipesSymboles = {
    'AL-FURQAN': '⚖️',
    'AS-SABIQUN': '🏃',
    'AL-MUJAHIDUN': '⚔️',
    'AN-NUR': '💡',
    'AL-HUDA': '🧭',
    'AL-BADR': '🌕',
    'AL-FIRDAWS': '🌴',
    'AL-MUFLIHUN': '🎯',
    'AS-SADIQUN': '🤝',
    'AL-IMAN': '🕋'
};

const etapesNoms = {
    'preliminaire': 'Phase Préliminaire',
    'quart': 'Quart de Finale',
    'demi': 'Demi-Finale',
    'finale': 'Finale'
};

let currentPhase = 'finale'; //Priorité à la Phase Finale par défaut

document.addEventListener('DOMContentLoaded', async () => {
    await loadDisplayConfig(); // Charger la config d'abord

    // Initialiser la phase courante basée sur la config (si définie) ou rester sur 'finale'
    if (displayConfig.etape_publiee) {
        currentPhase = displayConfig.etape_publiee;
    }
    updateActiveTab(currentPhase);
    initPhaseTabs();

    await initClassement();
    initFilters();
    initPodiumCarousel();
    startAutoRefresh();
});

/**
 * Charger la configuration d'affichage
 */
async function loadDisplayConfig() {
    try {
        const response = await fetch('/api/classement-config');
        if (!response.ok) throw new Error('Erreur chargement config');

        const result = await response.json();
        displayConfig = { ...displayConfig, ...result.data };

        // Mettre à jour la phase courante immédiatement si définie dans la config
        if (displayConfig.etape_publiee) {
            currentPhase = displayConfig.etape_publiee;
        }

        console.log('✅ Configuration chargée:', displayConfig);

        // Appliquer la configuration
        applyDisplayConfig();
    } catch (error) {
        console.error('❌ Erreur chargement configuration:', error);
        // Continuer avec la config par défaut
    }
}

/**
 * Appliquer la configuration d'affichage
 */
function applyDisplayConfig() {
    // Masquer/Afficher le podium (Uniquement pour la Grande Finale)
    const podiumSection = document.querySelector('.podium-section');
    if (podiumSection) {
        const isFinale = currentPhase === 'finale';
        podiumSection.style.display = (displayConfig.afficher_podium && isFinale) ? 'block' : 'none';
        console.log(`🏆 Podium visibility: ${isFinale ? 'VISIBLE (Finale)' : 'HIDDEN (Hors-Finale)'}`);
    }

    // Masquer/Afficher les filtres
    const filtersSection = document.querySelector('.filters-section');
    if (filtersSection) {
        filtersSection.style.display = displayConfig.afficher_filtres ? 'block' : 'none';
    }

    // Masquer/Afficher les statistiques
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsSection.style.display = displayConfig.afficher_statistiques ? 'block' : 'none';
    }

    // Afficher le message personnalisé si présent
    updateCustomMessage(currentPhase);

    // Gestion de l'affichage des onglets de phases
    document.querySelectorAll('.phase-tab').forEach(tab => {
        const phase = tab.dataset.phase;
        const configKey = `afficher_phase_${phase}`;
        // Si la config est explicitement false, on cache, sinon on affiche (par défaut true)
        if (displayConfig[configKey] === false) {
            tab.style.display = 'none';
        } else {
            tab.style.display = 'inline-block';
        }
    });

    // Mettre à jour le titre en fonction de l'étape publiée
    if (displayConfig.etape_publiee) {
        const titleElement = document.querySelector('.hero-classement h1');
        const subtitleElement = document.querySelector('.hero-classement .subtitle');

        if (titleElement) {
            const etapeNom = etapesNoms[displayConfig.etape_publiee] || 'Compétition';
            titleElement.textContent = `🏆 Classement - ${etapeNom}`;
        }

        if (subtitleElement) {
            subtitleElement.textContent = 'Résultats officiels en temps réel';
        }
    }
}

/**
 * Initialiser la page classement
 */
async function initClassement() {
    try {
        await Promise.all([
            loadManches(), // Charger les manches pour le carrousel
            loadClassement(),
            loadFiltersData()
        ]);
        updateLastRefreshTime();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Impossible de charger le classement');
    }
}

/**
 * Initialiser les onglets de phases
 */
function initPhaseTabs() {
    const tabs = document.querySelectorAll('.phase-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const phase = e.target.dataset.phase;
            if (phase && phase !== currentPhase) {
                switchPhase(phase);
            }
        });
    });
}

/**
 * Changer de phase active
 */
async function switchPhase(phase) {
    currentPhase = phase;
    updateActiveTab(phase);

    // Mettre à jour la config d'affichage locale pour refléter le changement
    displayConfig.etape_publiee = phase;

    // Recharger les données
    showLoader();
    await Promise.all([
        loadManches(),
        loadClassement()
    ]);

    // Mettre à jour le titre
    updateEtapeTitle(phase);

    // Mettre à jour le message personnalisé
    updateCustomMessage(phase);

    // Rafraîchir l'affichage global (Podium, Filtres, etc.)
    applyDisplayConfig();
}

/**
 * Mettre à jour le message personnalisé en fonction de la phase
 */
function updateCustomMessage(phase) {
    const heroSection = document.querySelector('.hero-classement .container');

    // Nettoyer les messages existants pour réaffichage ordonné
    const existingCustomMsg = document.querySelector('.custom-message');
    if (existingCustomMsg) existingCustomMsg.remove();

    const existingPhaseMsg = document.querySelector('.phase-message');
    if (existingPhaseMsg) existingPhaseMsg.remove();

    // Masquer l'ancienne zone de notification en bas de page pour éviter les doublons
    const noteBasPage = document.getElementById('noteBasPage');
    if (noteBasPage) noteBasPage.style.display = 'none';

    if (!heroSection) return;

    // --- 1. Message Général (.custom-message) ---
    const generalMessage = displayConfig.message_personnalise;

    if (generalMessage && generalMessage.trim() !== '') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'custom-message';
        messageDiv.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            margin: 1rem 0 0.5rem 0;
            text-align: center;
            font-size: 1.1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        messageDiv.textContent = generalMessage;
        heroSection.appendChild(messageDiv);
    }

    // --- 2. Message Spécifique à la Phase (.phase-message) ---
    // S'affiche juste en dessous du message général
    let specificMessage = '';
    if (phase) {
        specificMessage = displayConfig[`message_${phase}`];
    }

    if (specificMessage && specificMessage.trim() !== '') {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'phase-message';
        phaseDiv.style.cssText = `
            background-color: #fff3cd; /* Jaune pâle style 'Avertissement/Note' */
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 1rem;
            border-radius: 12px;
            margin: 0.5rem 0 1rem 0; /* Marge haut réduite pour coller au message précédent */
            text-align: center;
            font-size: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        `;

        // On ajoute le nom de la phase pour un contexte clair
        const phaseName = etapesNoms[phase] || phase;
        phaseDiv.innerHTML = `<strong>${phaseName} :</strong> ${specificMessage}`;

        heroSection.appendChild(phaseDiv);
    }
}

function updateActiveTab(phase) {
    document.querySelectorAll('.phase-tab').forEach(tab => {
        if (tab.dataset.phase === phase) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

function showLoader() {
    // Simple loader feedback if needed
    const tbody = document.getElementById('classement-body');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading-row"><div class="loader"></div>Chargement...</td></tr>';
    }
}

/**
 * Charger le classement
 */
async function loadClassement() {
    try {
        let url = null;

        // Use currentPhase instead of displayConfig directly to allow overriding
        const phaseToLoad = currentPhase || displayConfig.etape_publiee;

        if (phaseToLoad) {
            url = `/api/classement/etape/${phaseToLoad}`;
        } else if (currentFilters.manche) {
            // Si une manche est sélectionnée manuellement
            url = `/api/classement/manche/${currentFilters.manche}`;
        } else {
            // Aucun classement à afficher
            displayTableau([]);
            displayCharts([]);
            showError('Aucun classement publié pour le moment');
            return;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur réseau');

        const data = await response.json();

        // Afficher le titre de l'étape si publiée
        updateEtapeTitle(displayConfig.etape_publiee);

        // Le podium est géré par le carrousel maintenant
        displayTableau(data.classement, data.rubriques);
        displayCharts(data.classement);

        // Afficher la note de bas de page si disponible (spécifique à une manche)
        const noteContainer = document.getElementById('noteBasPage');
        const noteContent = document.getElementById('noteBasPageContent');

        if (noteContainer && noteContent) {
            if (data.manche && data.manche.note_bas_page) {
                noteContent.textContent = data.manche.note_bas_page;
                noteContainer.style.display = 'block';
            } else {
                noteContainer.style.display = 'none';
                noteContent.textContent = '';
            }
        }

    } catch (error) {
        console.error('Erreur lors du chargement du classement:', error);
        showError('Impossible de charger le classement');
    }
}

/**
 * Mettre à jour le titre avec l'étape publiée
 */
function updateEtapeTitle(etapeCode) {
    const heroTitle = document.querySelector('.hero-section h1');
    if (!heroTitle) return;

    const etapeNoms = {
        'preliminaire': '🎯 Phase Préliminaire',
        'quart': '⚡ Quart de Finale',
        'demi': '🔥 Demi-Finale',
        'finale': '👑 Grande Finale'
    };

    if (etapeCode && etapeNoms[etapeCode]) {
        heroTitle.textContent = `Classement - ${etapeNoms[etapeCode]}`;
    } else {
        heroTitle.textContent = 'Classement Général AL-ILM 2026';
    }
}

/**
 * Charger les manches disponibles pour le carrousel de podiums
 */
async function loadManches() {
    // Ne pas charger si le podium est désactivé
    if (!displayConfig.afficher_podium) {
        console.log('Podium désactivé, chargement annulé');
        return;
    }

    try {
        // Ne charger que les manches de l'étape courante
        const url = currentPhase ? `/api/manches?etape=${currentPhase}` : '/api/manches';
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur réseau');

        const manches = await response.json();

        // Créer un podium pour le classement général
        podiumCarousel.manches = [{
            id: 'general',
            nom: 'Classement Général',
            description: 'Cumul de toutes les manches',
            isGeneral: true
        }];

        // Ajouter chaque manche
        if (manches && manches.length > 0) {
            manches.forEach(manche => {
                podiumCarousel.manches.push({
                    id: manche.id,
                    nom: `${manche.nom}`,
                    description: manche.description || '',
                    numero: manche.numero,
                    date: manche.date_heure
                });
            });
        }

        // Par défaut, afficher le dernier podium (dernière manche)
        podiumCarousel.currentIndex = podiumCarousel.manches.length - 1;

        // Charger les données de chaque podium
        await loadAllPodiums();

    } catch (error) {
        console.error('Erreur lors du chargement des manches:', error);
        // Si erreur, créer juste un podium général
        podiumCarousel.manches = [{
            id: 'general',
            nom: 'Classement Général',
            description: 'Cumul de toutes les manches',
            isGeneral: true
        }];
        podiumCarousel.currentIndex = 0;
        await loadAllPodiums();
    }
}

/**
 * Charger les données de tous les podiums
 */
async function loadAllPodiums() {
    for (let manche of podiumCarousel.manches) {
        try {
            let url = '/api/classement';

            if (manche.isGeneral) {
                // Pour le classement général du podium, filtrer par l'étape courante si elle existe
                url = '/api/classement/general';
                if (currentPhase) {
                    url += `?etape=${currentPhase}`;
                }
            } else {
                url = `/api/classement/manche/${manche.id}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);

            const data = await response.json();
            manche.classement = data.classement || [];

        } catch (error) {
            console.error(`Erreur lors du chargement du podium ${manche.nom}:`, error);
            manche.classement = [];
        }
    }

    // Générer les podiums HTML
    renderPodiumSlides();
    renderCarouselIndicators();
    showPodiumSlide(podiumCarousel.currentIndex);
}

/**
 * Générer les slides de podiums
 */
function renderPodiumSlides() {
    const carousel = document.getElementById('podiumCarousel');
    if (!carousel) return;

    carousel.innerHTML = podiumCarousel.manches.map((manche, index) => {
        const top3 = manche.classement.slice(0, 3);

        return `
            <div class="podium-slide ${index === podiumCarousel.currentIndex ? 'active' : ''}" 
                 data-manche-index="${index}">
                <div class="podium">
                    ${renderPodiumPositions(top3)}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Générer les 3 positions du podium
 */
function renderPodiumPositions(top3) {
    const positions = [
        { index: 1, place: 2, crown: '🥈', baseClass: 'podium-base-2' },
        { index: 0, place: 1, crown: '👑', baseClass: 'podium-base-1', winner: true },
        { index: 2, place: 3, crown: '🥉', baseClass: 'podium-base-3' }
    ];

    return positions.map(pos => {
        const equipe = top3[pos.index];

        if (!equipe) {
            return `
                <div class="podium-item podium-${pos.place}" data-place="${pos.place}">
                    <div class="podium-crown">${pos.crown}</div>
                    <div class="podium-card ${pos.winner ? 'winner' : ''}">
                        <div class="team-logo">
                            <span class="team-symbol">❓</span>
                        </div>
                        <h3 class="team-name">-</h3>
                        <p class="team-position">${pos.place === 1 ? '1ère' : pos.place + 'ème'} place</p>
                        <div class="team-score">
                            <span class="score-value">0</span>
                            <span class="score-label">points</span>
                        </div>
                    </div>
                    <div class="podium-base ${pos.baseClass}">
                        <span class="podium-number">${pos.place}</span>
                    </div>
                </div>
            `;
        }

        const symbol = equipesSymboles[equipe.nom_equipe] || '';

        return `
            <div class="podium-item podium-${pos.place}" data-place="${pos.place}">
                <div class="podium-crown">${pos.crown}</div>
                <div class="podium-card ${pos.winner ? 'winner' : ''}">
                    <div class="team-logo">
                        <span class="team-symbol">${symbol}</span>
                    </div>
                    <h3 class="team-name">${equipe.nom_equipe}</h3>
                    <p class="team-position">${pos.place === 1 ? '1ère' : pos.place + 'ème'} place</p>
                    <div class="team-score">
                        <span class="score-value">${equipe.score_total || 0}</span>
                        <span class="score-label">points</span>
                    </div>
                </div>
                <div class="podium-base ${pos.baseClass}">
                    <span class="podium-number">${pos.place}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Générer les indicateurs du carrousel
 */
function renderCarouselIndicators() {
    const indicators = document.getElementById('carouselIndicators');
    if (!indicators) return;

    indicators.innerHTML = podiumCarousel.manches.map((manche, index) => {
        const activeClass = index === podiumCarousel.currentIndex ? 'active' : '';
        const label = manche.isGeneral ? ' Général' : ` Manche ${manche.numero}`;

        return `
            <button class="carousel-indicator ${activeClass}" 
                    data-index="${index}"
                    onclick="goToPodiumSlide(${index})">
                ${label}
            </button>
        `;
    }).join('');
}

/**
 * Initialiser le carrousel de podiums
 */
function initPodiumCarousel() {
    const prevBtn = document.getElementById('prevPodium');
    const nextBtn = document.getElementById('nextPodium');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = podiumCarousel.currentIndex - 1;
            if (newIndex >= 0) {
                goToPodiumSlide(newIndex);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const newIndex = podiumCarousel.currentIndex + 1;
            if (newIndex < podiumCarousel.manches.length) {
                goToPodiumSlide(newIndex);
            }
        });
    }
}

/**
 * Aller à un slide de podium spécifique
 */
function goToPodiumSlide(index) {
    if (index < 0 || index >= podiumCarousel.manches.length) return;

    const oldIndex = podiumCarousel.currentIndex;
    podiumCarousel.currentIndex = index;

    showPodiumSlide(index, oldIndex);
    updateCarouselButtons();
    updateCarouselIndicators();
    updatePodiumInfo();
}

/**
 * Afficher un slide de podium
 */
function showPodiumSlide(newIndex, oldIndex = null) {
    const slides = document.querySelectorAll('.podium-slide');

    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev');

        if (index === newIndex) {
            slide.classList.add('active');
        } else if (oldIndex !== null && index === oldIndex) {
            slide.classList.add('prev');
        }
    });
}

/**
 * Mettre à jour les boutons du carrousel
 */
function updateCarouselButtons() {
    const prevBtn = document.getElementById('prevPodium');
    const nextBtn = document.getElementById('nextPodium');

    if (prevBtn) {
        prevBtn.disabled = podiumCarousel.currentIndex === 0;
    }

    if (nextBtn) {
        nextBtn.disabled = podiumCarousel.currentIndex === podiumCarousel.manches.length - 1;
    }
}

/**
 * Mettre à jour les indicateurs du carrousel
 */
function updateCarouselIndicators() {
    const indicators = document.querySelectorAll('.carousel-indicator');

    indicators.forEach((indicator, index) => {
        if (index === podiumCarousel.currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

/**
 * Mettre à jour les informations du podium affiché
 */
function updatePodiumInfo() {
    const infoElem = document.getElementById('podiumMancheInfo');
    if (!infoElem) return;

    const manche = podiumCarousel.manches[podiumCarousel.currentIndex];

    if (manche.isGeneral) {
        infoElem.textContent = 'Classement Général - Cumul de toutes les manches';
    } else {
        const date = manche.date ? new Date(manche.date).toLocaleDateString('fr-FR') : '';
        infoElem.textContent = `Manche ${manche.numero} - ${manche.nom}${date ? ' • ' + date : ''}`;
    }
}

/**
 * Afficher le tableau complet
 */
function displayTableau(classement, rubriquesData = []) {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;

    let table = document.querySelector('.classement-table');
    if (!classement || classement.length === 0) {
        if (table) table.querySelector('tbody').innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 2rem;">
                    Aucune donnée de classement disponible
                </td>
            </tr>
        `;
        return;
    }

    // Préparer la map des points max
    const rubriquesMap = {};
    let totalMaxScore = 0;
    if (Array.isArray(rubriquesData)) {
        rubriquesData.forEach(r => {
            const max = parseFloat(r.points_max) || 0;
            rubriquesMap[r.nom] = max;
            totalMaxScore += max;
        });
    }

    // Configuration des rubriques à afficher (Ordre et filtrage)
    const rubriquesConf = [
        { key: 'Coran ouvert', label: 'Coran ouvert' },
        { key: 'Coran fermé', label: 'Coran fermé' },
        { key: 'Adhan', label: 'Adhan' },
        { key: 'Jurisprudence', label: 'Jurisprudence' },
        { key: 'Questions relais', label: 'Questions relais' },
        { key: 'Vie du Prophète', label: 'Vie du Prophète (ﷺ) et des Compagnons' },
        { key: 'Culture générale', label: 'Culture générale' },
        { key: 'Hadith', label: 'Hadith' }
    ];

    // Récupérer les rubriques affichables
    // On utilise rubriquesData pour savoir quelles colonnes existent réellement dans la manche/étape,
    // même s'il n'y a pas encore de notes (scores).
    let availableRubrics = new Set();
    if (rubriquesData && rubriquesData.length > 0) {
        rubriquesData.forEach(r => availableRubrics.add(r.nom));
    } else {
        // Fallback: regarder dans les données de classement si rubriquesData est vide
        classement.forEach(eq => {
            if (eq.details_rubriques) {
                Object.keys(eq.details_rubriques).forEach(r => availableRubrics.add(r));
            }
        });
    }

    // Filtrer et trier selon la configuration
    const rubriquesList = rubriquesConf
        .filter(conf => availableRubrics.has(conf.key))
        .map(conf => conf.key);

    // Ajuster le total max score pour ne compter que les rubriques affichées
    // (Optionnel : si le client veut que le TOTAL affiché soit la somme des colonnes affichées uniquement)
    // Mais le score_total de l'équipe vient de la DB et inclut tout.
    // On laisse le scoreTotalHeader tel quel pour l'instant ou on le recalcule ?
    // Pour la cohérence, si on cache une colonne, le total / Max doit peut-être s'ajuster ?
    // Recalculons le totalMaxScore basé sur les rubriques affichées uniquement
    totalMaxScore = 0;
    rubriquesList.forEach(r => {
        if (rubriquesMap[r]) {
            totalMaxScore += rubriquesMap[r];
        }
    });

    // Header Score Total
    let scoreTotalHeader = 'Score Total';
    if (totalMaxScore > 0) {
        scoreTotalHeader += ` <span style="font-size: 0.8em; color: #718096;">/ ${totalMaxScore}</span>`;
    }

    // Reconstruire le header du tableau dynamiquement
    let theadHtml = `
        <thead>
            <tr>
                <th class="col-rank">Rang</th>
                <th>Équipe</th>
                <th class="col-score">${scoreTotalHeader}</th>
                ${rubriquesList.map(r => {
        // Trouver le label personnalisé
        const conf = rubriquesConf.find(c => c.key === r);
        let headerLabel = conf ? conf.label : r;

        if (rubriquesMap[r]) {
            headerLabel += ` <span style="font-size: 0.8em; color: #718096;">/ ${rubriquesMap[r]}</span>`;
        }
        return `<th class="col-rubrique" style="text-align:center; font-size:0.8rem;">${headerLabel}</th>`;
    }).join('')}
            </tr>
        </thead>
    `;

    // Limiter le nombre d'équipes affichées selon la config
    let equipesAffichees = classement;
    if (!displayConfig.afficher_classement_complet && displayConfig.nombre_equipes_affichees > 0) {
        equipesAffichees = classement.slice(0, displayConfig.nombre_equipes_affichees);
    }

    const tbodyHtml = equipesAffichees.map((equipe, index) => {
        // Recalculer le total basé uniquement sur les rubriques affichées
        let displayedTotal = 0;
        const rubriquesCells = rubriquesList.map(rubrique => {
            const score = equipe.details_rubriques ? (equipe.details_rubriques[rubrique] || 0) : 0;
            displayedTotal += score;
            return `<td style="text-align: center; color: #4a5568;">${score}</td>`;
        }).join('');

        // Nous trions l'affichage par le total recalculé, mais l'ordre du tableau (classement) 
        // est basé sur le score total DB. Si on veut être cohérent, on affiche le total recalculé.
        // Si le classement change à cause de ce filtrage, c'est plus complexe (il faudrait re-trier le tableau).
        // Supposons qu'une rubrique est négligeable ou 0 pour l'instant, 
        // ou que le client accepte que le rang soit basé sur le vrai total mais que l'affichage montre le sous-total.
        // Pour l'instant, on affiche le total recalculé pour que la somme soit correcte visuellement.

        const position = index + 1;
        const rankClass = position <= 3 ? `rank-${position}` : '';
        const rowClass = position <= 3 ? 'top-3' : '';
        const symbol = equipesSymboles[equipe.nom_equipe] || '';

        return `
            <tr class="${rowClass}">
                <td style="text-align: center;">
                    <span class="rank-badge ${rankClass}">${position}</span>
                </td>
                <td>
                    <div class="team-info">
                        <div class="team-avatar">${symbol}</div>
                        <div class="team-details">
                            <span class="team-name-table">${equipe.nom_equipe}</span>
                            <span class="team-subtitle">${equipe.nombre_participants || 0} participants</span>
                        </div>
                    </div>
                </td>
                <td class="score-cell">${displayedTotal}</td>
                ${rubriquesCells}
            </tr>
        `;
    }).join('');

    // Reconstruire la table entière pour mettre à jour les headers
    table.innerHTML = `${theadHtml}<tbody id="classementTableBody">${tbodyHtml}</tbody>`;

    // Ajouter un message de fin si nécessaire
    if (!displayConfig.afficher_classement_complet && displayConfig.nombre_equipes_affichees > 0 && classement.length > displayConfig.nombre_equipes_affichees) {
        const infoRow = document.createElement('tr');
        infoRow.innerHTML = `
            <td colspan="${3 + rubriquesList.length}" style="text-align: center; padding: 1rem; background: #f3f4f6; font-style: italic; color: #6b7280;">
                Top ${displayConfig.nombre_equipes_affichees} équipes affichées sur ${classement.length} au total
            </td>
        `;
        document.querySelector('#classementTableBody').appendChild(infoRow);
    }
}

/**
 * Afficher les graphiques
 * (Fonctionnalité désactivée)
 */
function displayCharts(classement) {
    // Les graphiques ont été supprimés de l'interface
    return;
}

/**
 * Graphique d'évolution (Désactivé)
 */
function drawEvolutionChart(top5) {
    // Supprimé
}

/**
 * Graphique par rubrique (Désactivé)
 */
function drawRubriqueChart(top3) {
    // Supprimé
}

/**
 * Graphique de comparaison (Désactivé)
 */
function drawCompareChart(classement) {
    // Supprimé
}

/**
 * Charger les données pour les filtres
 */
async function loadFiltersData() {
    // Ne pas charger si les filtres sont désactivés
    if (!displayConfig.afficher_filtres) {
        return;
    }

    try {
        // Charger les manches
        const manchesRes = await fetch('/api/manches');
        if (manchesRes.ok) {
            const manchesData = await manchesRes.json();
            const mancheSelect = document.getElementById('mancheFilter');

            if (mancheSelect && manchesData.manches) {
                manchesData.manches.forEach(manche => {
                    const option = document.createElement('option');
                    option.value = manche.id;
                    option.textContent = `Manche ${manche.numero} - ${new Date(manche.date).toLocaleDateString('fr-FR')}`;
                    mancheSelect.appendChild(option);
                });
            }
        }

        // Charger les rubriques
        const rubriquesRes = await fetch('/api/rubriques');
        if (rubriquesRes.ok) {
            const rubriquesData = await rubriquesRes.json();
            const rubriqueSelect = document.getElementById('rubriqueFilter');

            if (rubriqueSelect && rubriquesData.rubriques) {
                rubriquesData.rubriques.forEach(rubrique => {
                    const option = document.createElement('option');
                    option.value = rubrique.id;
                    option.textContent = rubrique.nom;
                    rubriqueSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
    }
}


/**
 * Initialiser les filtres
 */
function initFilters() {
    const mancheFilter = document.getElementById('mancheFilter');
    const rubriqueFilter = document.getElementById('rubriqueFilter');
    const resetBtn = document.getElementById('resetFilters');

    if (mancheFilter) {
        mancheFilter.addEventListener('change', (e) => {
            currentFilters.manche = e.target.value;
            loadClassement();
        });
    }

    if (rubriqueFilter) {
        rubriqueFilter.addEventListener('change', (e) => {
            currentFilters.rubrique = e.target.value;
            loadClassement();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            currentFilters = { manche: '', rubrique: '' };
            if (mancheFilter) mancheFilter.value = '';
            if (rubriqueFilter) rubriqueFilter.value = '';
            loadClassement();
        });
    }
}

/**
 * Démarrer le rafraîchissement automatique
 */
function startAutoRefresh() {
    // Rafraîchir toutes les 30 secondes
    refreshInterval = setInterval(() => {
        loadClassement();
        updateLastRefreshTime();
    }, 30000);
}

/**
 * Mettre à jour l'heure de la dernière mise à jour
 */
function updateLastRefreshTime() {
    const lastUpdateElem = document.getElementById('lastUpdate');
    if (lastUpdateElem) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdateElem.textContent = `Dernière mise à jour : ${timeString}`;
    }
}

/**
 * Afficher un message d'erreur
 */
function showError(message) {
    const tbody = document.getElementById('classementTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: var(--error-color);">
                    ⚠️ ${message}
                </td>
            </tr>
        `;
    }
}

/**
 * Nettoyer avant de quitter la page
 */
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});
