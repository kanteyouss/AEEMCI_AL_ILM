// ============================================
// PAGE CLASSEMENT PUBLIC - AL ILM 2026
// ============================================

let refreshInterval;
let currentFilters = {
    manche: '',
    rubrique: ''
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

document.addEventListener('DOMContentLoaded', async () => {
    await initClassement();
    initFilters();
    initPodiumCarousel();
    startAutoRefresh();
});

/**
 * Initialiser la page classement
 */
async function initClassement() {
    try {
        await Promise.all([
            loadManches(), // Charger les manches pour le carrousel
            loadClassement(),
            loadFiltersData(),
            loadStats()
        ]);
        updateLastRefreshTime();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showError('Impossible de charger le classement');
    }
}

/**
 * Charger le classement
 */
async function loadClassement() {
    try {
        // Construire l'URL avec les filtres
        let url = '/api/classement';
        const params = new URLSearchParams();
        
        if (currentFilters.manche) {
            params.append('manche_id', currentFilters.manche);
        }
        if (currentFilters.rubrique) {
            params.append('rubrique_id', currentFilters.rubrique);
        }
        
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        
        // Le podium est géré par le carrousel maintenant
        displayTableau(data.classement);
        displayCharts(data.classement);
        
    } catch (error) {
        console.error('Erreur lors du chargement du classement:', error);
        showError('Impossible de charger le classement');
    }
}

/**
 * Charger les manches pour le carrousel de podiums
 */
async function loadManches() {
    try {
        const response = await fetch('/api/manches');
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
            
            if (!manche.isGeneral) {
                url += `?manche_id=${manche.id}`;
            }
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erreur réseau');
            
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
        
        const symbol = equipesSymboles[equipe.nom_equipe] || '⭐';
        
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
        const label = manche.isGeneral ? '📊 Général' : `🎯 Manche ${manche.numero}`;
        
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
function displayTableau(classement) {
    const tbody = document.getElementById('classementTableBody');
    if (!tbody) return;

    if (!classement || classement.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    Aucune donnée de classement disponible
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = classement.map((equipe, index) => {
        const position = index + 1;
        const rankClass = position <= 3 ? `rank-${position}` : '';
        const rowClass = position <= 3 ? 'top-3' : '';
        const symbol = equipesSymboles[equipe.nom_equipe] || '⭐';
        const moyenne = equipe.nombre_manches > 0 
            ? (equipe.score_total / equipe.nombre_manches).toFixed(1)
            : '0.0';
        
        // Tendance (simulée pour l'instant)
        let trendIcon = '➡️';
        let trendClass = 'trend-stable';
        
        if (equipe.evolution) {
            if (equipe.evolution > 0) {
                trendIcon = '⬆️';
                trendClass = 'trend-up';
            } else if (equipe.evolution < 0) {
                trendIcon = '⬇️';
                trendClass = 'trend-down';
            }
        }

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
                <td class="score-cell">${equipe.score_total || 0}</td>
                <td class="manches-cell">${equipe.nombre_manches || 0}</td>
                <td class="moyenne-cell">${moyenne}</td>
                <td class="trend-cell ${trendClass}">${trendIcon}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Afficher les graphiques
 */
function displayCharts(classement) {
    if (!classement || classement.length === 0) return;

    // Graphique 1 : Évolution du Top 5
    drawEvolutionChart(classement.slice(0, 5));
    
    // Graphique 2 : Performance par rubrique (Top 3)
    drawRubriqueChart(classement.slice(0, 3));
    
    // Graphique 3 : Comparaison des équipes
    drawCompareChart(classement);
}

/**
 * Graphique d'évolution (simulé avec barres pour l'instant)
 */
function drawEvolutionChart(top5) {
    const canvas = document.getElementById('evolutionCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;
    
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32', '#2C5F2D', '#4A7C59'];
    const maxScore = Math.max(...top5.map(e => e.score_total || 0));
    const barWidth = canvas.width / (top5.length * 2);
    const barSpacing = barWidth / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    top5.forEach((equipe, index) => {
        const score = equipe.score_total || 0;
        const barHeight = (score / maxScore) * (canvas.height - 60);
        const x = (barWidth + barSpacing) * index + barSpacing;
        const y = canvas.height - barHeight - 40;
        
        // Barre
        ctx.fillStyle = colors[index];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Score en haut de la barre
        ctx.fillStyle = '#2C5F2D';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(score, x + barWidth / 2, y - 5);
        
        // Nom de l'équipe en bas
        ctx.fillStyle = '#4a5568';
        ctx.font = '11px Arial';
        ctx.save();
        ctx.translate(x + barWidth / 2, canvas.height - 10);
        ctx.rotate(-Math.PI / 6);
        ctx.fillText(equipe.nom_equipe, 0, 0);
        ctx.restore();
    });
}

/**
 * Graphique par rubrique (radar/barres horizontales)
 */
function drawRubriqueChart(top3) {
    const canvas = document.getElementById('rubriqueCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Placeholder - à compléter avec les données réelles
    ctx.fillStyle = '#2C5F2D';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Graphique des performances par rubrique', canvas.width / 2, canvas.height / 2);
    ctx.font = '12px Arial';
    ctx.fillStyle = '#718096';
    ctx.fillText('Nécessite les données détaillées par rubrique', canvas.width / 2, canvas.height / 2 + 25);
}

/**
 * Graphique de comparaison (barres empilées)
 */
function drawCompareChart(classement) {
    const canvas = document.getElementById('compareCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 350;
    
    const maxScore = Math.max(...classement.map(e => e.score_total || 0));
    const barHeight = 25;
    const barSpacing = 10;
    const leftMargin = 150;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    classement.forEach((equipe, index) => {
        const score = equipe.score_total || 0;
        const barWidth = (score / maxScore) * (canvas.width - leftMargin - 100);
        const y = index * (barHeight + barSpacing) + 10;
        
        // Nom de l'équipe
        ctx.fillStyle = '#2C5F2D';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(equipe.nom_equipe, leftMargin - 10, y + barHeight / 2 + 4);
        
        // Barre de progression
        const gradient = ctx.createLinearGradient(leftMargin, 0, leftMargin + barWidth, 0);
        gradient.addColorStop(0, '#2C5F2D');
        gradient.addColorStop(1, '#4A7C59');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(leftMargin, y, barWidth, barHeight);
        
        // Score
        ctx.fillStyle = '#2C5F2D';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(score, leftMargin + barWidth + 10, y + barHeight / 2 + 5);
    });
}

/**
 * Charger les données des filtres
 */
async function loadFiltersData() {
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
 * Charger les statistiques globales
 */
async function loadStats() {
    try {
        // Charger les statistiques
        const [manchesRes, scoresRes] = await Promise.all([
            fetch('/api/manches'),
            fetch('/api/scores')
        ]);

        if (manchesRes.ok) {
            const manchesData = await manchesRes.json();
            const totalManches = manchesData.manches ? manchesData.manches.length : 0;
            document.getElementById('totalManches').textContent = totalManches;
        }

        if (scoresRes.ok) {
            const scoresData = await scoresRes.json();
            const totalPoints = scoresData.scores 
                ? scoresData.scores.reduce((sum, score) => sum + (score.points || 0), 0)
                : 0;
            document.getElementById('totalPoints').textContent = totalPoints;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
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
