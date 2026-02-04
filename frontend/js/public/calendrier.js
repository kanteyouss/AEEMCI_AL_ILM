// ============================================
// PAGE CALENDRIER RAMADAN - AL ILM 2026
// ============================================

let currentDate = new Date(2026, 1, 18); // 18 Février 2026 (mois indexé à 0)
let manches = [];

// Conversion grégorien vers hégirien (simplifié)
function gregorianToHijri(gregorianDate) {
    // Ramadan 2026 commence le 18 février 2026 = 1 Ramadan 1447
    const ramadanStart = new Date(2026, 1, 18); // 18 Février 2026
    const diffDays = Math.floor((gregorianDate - ramadanStart) / (1000 * 60 * 60 * 24));
    const hijriDay = 1 + diffDays;
    
    if (hijriDay >= 1 && hijriDay <= 30) {
        return `${hijriDay} Ramadan 1447`;
    } else if (hijriDay < 1) {
        return `${30 + hijriDay} Chaabane 1447`;
    } else {
        return `${hijriDay - 30} Chawwal 1447`;
    }
}

// Jours de la semaine
const joursAbrev = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const moisNoms = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

document.addEventListener('DOMContentLoaded', async () => {
    await initCalendrier();
});

/**
 * Initialiser la page calendrier
 */
async function initCalendrier() {
    try {
        console.log('🚀 Initialisation du calendrier...');
        await loadManches();
        console.log('📊 Rendu du calendrier...');
        renderCalendar();
        console.log('📋 Rendu de la liste des manches...');
        renderManchesList();
        console.log('📅 Mise à jour de l\'affichage de la date...');
        updateDateDisplay();
        console.log('📈 Mise à jour des statistiques...');
        updateStats();
        console.log('🔧 Initialisation de la navigation...');
        initNavigation();
        console.log('🔧 Initialisation du modal...');
        initModal();
        console.log('✅ Calendrier initialisé avec succès !');
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Impossible de charger le calendrier');
    }
}

/**
 * Charger les manches depuis l'API
 */
async function loadManches() {
    try {
        console.log('📅 Chargement des manches depuis /api/manches...');
        const response = await fetch('/api/manches');
        console.log('📡 Réponse HTTP:', response.status, response.statusText);
        
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        console.log('📦 Données reçues:', data);
        
        manches = data.data || data.manches || [];
        
        console.log('✅ Manches chargées:', manches.length, manches);
    } catch (error) {
        console.error('❌ Erreur lors du chargement des manches:', error);
        manches = [];
    }
}

/**
 * Afficher le calendrier du mois
 */
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Titre du mois
    const monthTitle = document.getElementById('currentMonth');
    if (monthTitle) {
        const hijriMonth = gregorianToHijri(currentDate).split(' ').slice(1).join(' ');
        monthTitle.textContent = `${hijriMonth} - ${moisNoms[month]} ${year}`;
    }

    // Début et fin du mois
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startDayOfWeek;

    // Vider le calendrier
    calendarGrid.innerHTML = '';

    // En-têtes des jours
    joursAbrev.forEach(jour => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = jour;
        calendarGrid.appendChild(header);
    });

    // Jours du mois précédent
    for (let i = prevMonthDays - 1; i >= 0; i--) {
        const dayNum = prevMonthLastDay - i;
        const dayDate = new Date(year, month - 1, dayNum);
        calendarGrid.appendChild(createDayCell(dayDate, true));
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        calendarGrid.appendChild(createDayCell(dayDate, false));
    }

    // Jours du mois suivant
    const totalCells = prevMonthDays + daysInMonth;
    const nextMonthDays = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    
    for (let day = 1; day <= nextMonthDays; day++) {
        const dayDate = new Date(year, month + 1, day);
        calendarGrid.appendChild(createDayCell(dayDate, true));
    }
}

/**
 * Créer une cellule de jour
 */
function createDayCell(date, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    
    if (isOtherMonth) {
        cell.classList.add('other-month');
    }

    // Vérifier si c'est aujourd'hui
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
        cell.classList.add('today');
    }

    // Numéro du jour
    const dayNumber = document.createElement('span');
    dayNumber.className = 'day-number';
    dayNumber.textContent = date.getDate();
    cell.appendChild(dayNumber);

    // Date hijri
    const dayHijri = document.createElement('span');
    dayHijri.className = 'day-hijri';
    dayHijri.textContent = gregorianToHijri(date);
    cell.appendChild(dayHijri);

    // Manches du jour
    const dayManches = getManchesForDate(date);
    if (dayManches.length > 0) {
        const manchesContainer = document.createElement('div');
        manchesContainer.className = 'day-manches';
        
        dayManches.forEach(manche => {
            const indicator = document.createElement('div');
            indicator.className = `manche-indicator manche-${manche.type || 'preliminaire'}`;
            indicator.textContent = `M${manche.numero}`;
            indicator.addEventListener('click', (e) => {
                e.stopPropagation();
                openMancheModal(manche);
            });
            manchesContainer.appendChild(indicator);
        });
        
        cell.appendChild(manchesContainer);
    }

    return cell;
}

/**
 * Obtenir les manches d'une date
 */
function getManchesForDate(date) {
    return manches.filter(manche => {
        const mancheDate = new Date(manche.date_manche || manche.date);
        return mancheDate.toDateString() === date.toDateString();
    });
}

/**
 * Déterminer le type de manche
 */
function getMancheType(numero) {
    if (numero <= 4) return 'preliminaire';
    if (numero <= 6) return 'quart';
    if (numero <= 8) return 'demi';
    return 'finale';
}

/**
 * Afficher la liste des manches
 */
function renderManchesList() {
    const manchesList = document.getElementById('manchesList');
    if (!manchesList) return;

    if (manches.length === 0) {
        manchesList.innerHTML = `
            <div class="loading-container">
                <p>Aucune manche planifiée pour le moment</p>
            </div>
        `;
        return;
    }

    // Trier les manches par numéro (1, 2, 3...) puis par date si même numéro
    const sortedManches = [...manches].sort((a, b) => {
        // D'abord par numéro
        const numeroA = a.numero || 0;
        const numeroB = b.numero || 0;
        
        if (numeroA !== numeroB) {
            return numeroA - numeroB;
        }
        
        // Si même numéro (ou pas de numéro), trier par date
        return new Date(a.date_manche || a.date) - new Date(b.date_manche || b.date);
    });

    manchesList.innerHTML = sortedManches.map(manche => {
        const mancheDate = new Date(manche.date_manche || manche.date);
        const mancheType = manche.type || getMancheType(manche.numero);
        const isCompleted = mancheDate < new Date();
        
        const dateStr = mancheDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Utiliser heure_debut si disponible
        const timeStr = manche.heure_debut || mancheDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const hijriDate = gregorianToHijri(mancheDate);

        return `
            <div class="manche-timeline-item">
                <div class="timeline-marker ${isCompleted ? 'completed' : ''}"></div>
                <div class="manche-card type-${mancheType}" onclick="openMancheModalById(${manche.id})">
                    <div class="manche-header">
                        <h3 class="manche-title">Manche ${manche.numero}</h3>
                        <span class="manche-type-badge badge-${mancheType}">
                            ${getMancheTypeLabel(mancheType)}
                        </span>
                    </div>
                    <div class="manche-details">
                        <div class="manche-detail-item">
                            <span class="detail-icon">📅</span>
                            <span class="detail-text">${dateStr}</span>
                        </div>
                        <div class="manche-detail-item">
                            <span class="detail-icon">🕐</span>
                            <span class="detail-text">${timeStr}</span>
                        </div>
                        <div class="manche-detail-item">
                            <span class="detail-icon">🌙</span>
                            <span class="detail-text">${hijriDate}</span>
                        </div>
                        ${manche.lieu ? `
                        <div class="manche-detail-item">
                            <span class="detail-icon">📍</span>
                            <span class="detail-text">${manche.lieu}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Obtenir le label du type de manche
 */
function getMancheTypeLabel(type) {
    const labels = {
        'preliminaire': 'Préliminaire',
        'quart': 'Quart de finale',
        'demi': 'Demi-finale',
        'finale': 'Grande Finale'
    };
    return labels[type] || 'Préliminaire';
}

/**
 * Mettre à jour l'affichage des dates
 */
function updateDateDisplay() {
    const dateGregorienElem = document.getElementById('dateGregorien');
    const dateHijriElem = document.getElementById('dateHijri');

    if (dateGregorienElem) {
        const ramadanStart = new Date(2026, 1, 18);
        const dateStr = ramadanStart.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateGregorienElem.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }

    if (dateHijriElem) {
        dateHijriElem.textContent = '1 Ramadan 1447';
    }
}

/**
 * Mettre à jour les statistiques
 */
function updateStats() {
    console.log('📊 Mise à jour des statistiques avec', manches.length, 'manches');
    
    // Jours restants jusqu'au Ramadan
    const ramadanStart = new Date(2026, 1, 18);
    const today = new Date();
    const daysRemaining = Math.ceil((ramadanStart - today) / (1000 * 60 * 60 * 24));
    
    const joursRestantsElem = document.getElementById('joursRestants');
    if (joursRestantsElem) {
        joursRestantsElem.textContent = daysRemaining > 0 ? daysRemaining : 0;
        console.log('📅 Jours restants:', daysRemaining);
    }

    // Manches totales
    const manchesTotalesElem = document.getElementById('manchesTotales');
    if (manchesTotalesElem) {
        manchesTotalesElem.textContent = manches.length;
        console.log('🎯 Manches totales:', manches.length);
    }

    // Manches terminées (statut = 'termine')
    const manchesTerminees = manches.filter(m => m.statut === 'termine').length;
    const manchesTermineesElem = document.getElementById('manchesTerminees');
    if (manchesTermineesElem) {
        manchesTermineesElem.textContent = manchesTerminees;
        console.log('✅ Manches terminées:', manchesTerminees);
    }

    // Manches à venir (statut = 'publie' ou 'brouillon')
    const manchesAVenir = manches.filter(m => m.statut === 'publie' || m.statut === 'brouillon').length;
    const manchesAVenirElem = document.getElementById('manchesAVenir');
    if (manchesAVenirElem) {
        manchesAVenirElem.textContent = manchesAVenir;
        console.log('⏳ Manches à venir:', manchesAVenir);
    }
}

/**
 * Initialiser la navigation du calendrier
 */
function initNavigation() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
}

/**
 * Initialiser le modal
 */
function initModal() {
    const modal = document.getElementById('mancheModal');
    const closeBtn = modal?.querySelector('.modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

/**
 * Ouvrir le modal d'une manche par ID
 */
window.openMancheModalById = function(mancheId) {
    const manche = manches.find(m => m.id === mancheId);
    if (manche) {
        openMancheModal(manche);
    }
};

/**
 * Ouvrir le modal de détails d'une manche
 */
function openMancheModal(manche) {
    const modal = document.getElementById('mancheModal');
    const modalBody = document.getElementById('mancheModalBody');
    
    if (!modal || !modalBody) return;

    const mancheDate = new Date(manche.date_manche || manche.date);
    const mancheType = manche.type || getMancheType(manche.numero);
    
    const dateStr = mancheDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Utiliser heure_debut et heure_fin si disponibles
    const timeStr = manche.heure_debut && manche.heure_fin 
        ? `${manche.heure_debut} - ${manche.heure_fin}`
        : mancheDate.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

    const hijriDate = gregorianToHijri(mancheDate);
    
    // Préparer l'affichage des rubriques
    const rubriquesHTML = manche.rubriques && manche.rubriques.length > 0
        ? `<ul style="margin: 0; padding-left: 1.5rem;">
            ${manche.rubriques.map(r => `<li>${r.nom}</li>`).join('')}
           </ul>`
        : '<p>Toutes les rubriques (8 au total)</p>';

    modalBody.innerHTML = `
        <h2 class="modal-manche-title">
            Manche ${manche.numero} - ${getMancheTypeLabel(mancheType)}
        </h2>
        
        <div class="modal-info-grid">
            <div class="modal-info-item">
                <span class="modal-info-icon">📅</span>
                <div class="modal-info-content">
                    <h4>Date (Grégorien)</h4>
                    <p>${dateStr}</p>
                </div>
            </div>
            
            <div class="modal-info-item">
                <span class="modal-info-icon">🌙</span>
                <div class="modal-info-content">
                    <h4>Date (Hégirien)</h4>
                    <p>${hijriDate}</p>
                </div>
            </div>
            
            <div class="modal-info-item">
                <span class="modal-info-icon">🕐</span>
                <div class="modal-info-content">
                    <h4>Horaire</h4>
                    <p>${timeStr}</p>
                </div>
            </div>
            
            ${manche.lieu ? `
            <div class="modal-info-item">
                <span class="modal-info-icon">📍</span>
                <div class="modal-info-content">
                    <h4>Lieu</h4>
                    <p>${manche.lieu}</p>
                </div>
            </div>
            ` : ''}
            
            <div class="modal-info-item">
                <span class="modal-info-icon">🎯</span>
                <div class="modal-info-content">
                    <h4>Type de manche</h4>
                    <p>${getMancheTypeLabel(mancheType)}</p>
                </div>
            </div>
            
            <div class="modal-info-item">
                <span class="modal-info-icon">📚</span>
                <div class="modal-info-content">
                    <h4>Rubriques</h4>
                    ${rubriquesHTML}
                </div>
            </div>
            
            ${manche.description ? `
            <div class="modal-info-item" style="grid-column: 1 / -1;">
                <span class="modal-info-icon">📝</span>
                <div class="modal-info-content">
                    <h4>Description</h4>
                    <p>${manche.description}</p>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * Afficher un message d'erreur
 */
function showError(message) {
    const manchesList = document.getElementById('manchesList');
    if (manchesList) {
        manchesList.innerHTML = `
            <div class="loading-container">
                <p style="color: var(--error-color);">⚠️ ${message}</p>
            </div>
        `;
    }
}
