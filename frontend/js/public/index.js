// ============================================
// PAGE ACCUEIL - AL ILM 2026
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    initTypewriterEffect();
    initVersetsRotation();
    initCountdown();
    await loadEquipes();
    initRubriquesModal();
});

/**
 * Effet machine à écrire pour le titre hero
 */
function initTypewriterEffect() {
    const heroTitle = document.getElementById('heroTitle');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.visibility = 'visible';
    
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 80); // 80ms entre chaque lettre
        }
    }
    
    typeWriter();
}

/**
 * Rotation automatique des versets coraniques
 */
function initVersetsRotation() {
    const versets = [
        {
            arabe: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
            traduction: "Lis, au nom de ton Seigneur qui a créé",
            reference: "Sourate Al-Alaq (96:1)"
        },
        {
            arabe: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
            traduction: "Dis : « Sont-ils égaux, ceux qui savent et ceux qui ne savent pas ? »",
            reference: "Sourate Az-Zumar (39:9)"
        },
        {
            arabe: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
            traduction: "Allah élèvera en degrés ceux d'entre vous qui auront cru et ceux qui auront reçu le savoir",
            reference: "Sourate Al-Mujadila (58:11)"
        },
        {
            arabe: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
            traduction: "Et dis : « Ô mon Seigneur, accroît mes connaissances ! »",
            reference: "Sourate Ta-Ha (20:114)"
        }
    ];
    
    let currentIndex = 0;
    
    function changeVerset() {
        const versetArabe = document.getElementById('versetArabe');
        const versetTraduction = document.getElementById('versetTraduction');
        const versetReference = document.getElementById('versetReference');
        
        if (!versetArabe || !versetTraduction || !versetReference) return;
        
        // Effet de fondu sortant
        versetArabe.style.opacity = '0';
        versetTraduction.style.opacity = '0';
        versetReference.style.opacity = '0';
        
        setTimeout(() => {
            // Changer le contenu
            const verset = versets[currentIndex];
            versetArabe.textContent = verset.arabe;
            versetTraduction.textContent = `"${verset.traduction}"`;
            versetReference.textContent = verset.reference;
            
            // Effet de fondu entrant
            versetArabe.style.opacity = '1';
            versetTraduction.style.opacity = '1';
            versetReference.style.opacity = '1';
            
            // Passer au verset suivant
            currentIndex = (currentIndex + 1) % versets.length;
        }, 500);
    }
    
    // Afficher le premier verset immédiatement
    changeVerset();
    
    // Changer de verset toutes les 10 secondes
    setInterval(changeVerset, 10000);
}

/**
 * Initialiser le compte à rebours jusqu'au Ramadan
 */
function initCountdown() {
    // Date de début du Ramadan 2026 (18 Février 2026)
    const ramadanDate = new Date('2026-02-18T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = ramadanDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<p style="font-size: 2rem;">🌙 Ramadan Mubarak ! 🕌</p>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // Mettre à jour toutes les secondes
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Charger et afficher les équipes
 */
async function loadEquipes() {
    const equipesGrid = document.getElementById('equipesGrid');
    
    if (!equipesGrid) return;
    
    // Équipes prédéfinies (10 équipes officielles)
    const equipes = [
        { nom: 'AL-FURQAN', signification: 'Le discernement', couleur: '#FF5733', symbole: '⚖️' },
        { nom: 'AS-SABIQUN', signification: 'Les devanciers', couleur: '#3498DB', symbole: '🏃' },
        { nom: 'AL-MUJAHIDUN', signification: 'Les combattants', couleur: '#28A745', symbole: '⚔️' },
        { nom: 'AN-NUR', signification: 'La lumière', couleur: '#FFD700', symbole: '💡' },
        { nom: 'AL-HUDA', signification: 'La guidance', couleur: '#9B59B6', symbole: '🧭' },
        { nom: 'AL-BADR', signification: 'La pleine lune', couleur: '#E74C3C', symbole: '🌕' },
        { nom: 'AL-FIRDAWS', signification: 'Le paradis', couleur: '#1ABC9C', symbole: '🌴' },
        { nom: 'AL-MUFLIHUN', signification: 'Les bienheureux', couleur: '#F39C12', symbole: '🎯' },
        { nom: 'AS-SADIQUN', signification: 'Les véridiques', couleur: '#34495E', symbole: '🤝' },
        { nom: 'AL-IMAN', signification: 'La foi', couleur: '#8E44AD', symbole: '🕋' }
    ];
    
    equipesGrid.innerHTML = equipes.map(equipe => `
        <div class="equipe-card" style="border-left: 5px solid ${equipe.couleur}">
            <div class="equipe-logo">
                <img src="/assets/images/equipes/${equipe.nom.toLowerCase().replace('-', '_')}.png" 
                     alt="Logo ${equipe.nom}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div class="equipe-symbole" style="color: ${equipe.couleur}; display:none;">${equipe.symbole}</div>
            </div>
            <h3>${equipe.nom}</h3>
            <p class="equipe-signification">${equipe.signification}</p>
        </div>
    `).join('');
}

/**
 * Initialiser le modal pour les détails des rubriques
 */
function initRubriquesModal() {
    const modal = document.getElementById('rubriqueModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!modal || !modalBody || !closeBtn) return;
    
    // Données détaillées des rubriques
    const rubriquesDetails = {
        'coran-ouvert': {
            titre: '📖 Coran Ouvert',
            points: 100,
            couleur: '#e8f5e9',
            contenu: `
                <h3>Description</h3>
                <p>Cette rubrique consiste à réciter le Coran en consultant directement le Mushaf.</p>
                <p>Chaque équipe est libre de désigner son lecteur.</p>
                
                <h3>Critères d'évaluation</h3>
                <p>Le candidat sera évalué sur :</p>
                <ul>
                    <li><strong>La rapidité et la précision</strong> dans la recherche de la partie à lire</li>
                    <li><strong>Le respect des règles de Tajwid</strong></li>
                    <li><strong>La qualité de la voix</strong></li>
                </ul>
                
                <div class="info-box">
                    <strong>📚 Portion du Coran retenue :</strong><br>
                    Juz Amma, allant de la sourate 78 (An-Naba) à la sourate 114 (An-Nas)
                </div>
            `
        },
        'coran-ferme': {
            titre: '📕 Coran Fermé',
            points: 150,
            couleur: '#fff3e0',
            contenu: `
                <h3>Description</h3>
                <p>Le principe est similaire à celui du Coran ouvert, à la différence que la récitation se fera <strong>sans consultation du Mushaf</strong>.</p>
                
                <h3>Critères d'évaluation</h3>
                <p>Le lecteur sera évalué sur :</p>
                <ul>
                    <li><strong>Le respect des règles de Tajwid</strong></li>
                    <li><strong>La qualité et la justesse de la voix</strong></li>
                    <li><strong>La mémorisation exacte</strong></li>
                </ul>
                
                <div class="info-box">
                    <strong>📚 Portion du Coran retenue :</strong><br>
                    De la sourate 87 (Al-A'la) à la sourate 114 (An-Nas)
                </div>
            `
        },
        'adhan': {
            titre: '📢 Adhan',
            points: 100,
            couleur: '#e3f2fd',
            contenu: `
                <h3>Description</h3>
                <p>Dans cette rubrique, il est demandé aux participants de prononcer l'Adhan en respectant scrupuleusement ses règles.</p>
                <p>Chaque équipe désignera un membre chargé de l'exécution.</p>
                
                <h3>Critères d'évaluation</h3>
                <ul>
                    <li><strong>Respect des règles de prononciation</strong></li>
                    <li><strong>Qualité de la voix</strong></li>
                    <li><strong>Justesse du Tajwid</strong></li>
                </ul>
                
                <div class="warning-box">
                    <strong>⏱️ Temps maximum :</strong> 3 minutes<br>
                    Tout dépassement de ce temps entraînera une pénalité pour l'équipe concernée.
                </div>
            `
        },
        'jurisprudence': {
            titre: '⚖️ Jurisprudence (Fiqh)',
            points: 100,
            couleur: '#f3e5f5',
            contenu: `
                <h3>Description</h3>
                <p>Cette rubrique porte sur des questions relatives au <strong>droit islamique (Fiqh)</strong>.</p>
                <p>Elle nécessite la <strong>participation simultanée de tous les membres de l'équipe</strong>.</p>
                
                <h3>Déroulement</h3>
                <ul>
                    <li>Un temps précis sera accordé pour chaque question posée</li>
                    <li>Des feuilles de réponses seront distribuées aux équipes</li>
                    <li>Les équipes inscriront :
                        <ul>
                            <li>Le nom de leur équipe</li>
                            <li>Les réponses correspondantes aux questions posées</li>
                        </ul>
                    </li>
                </ul>
                
                <div class="info-box">
                    <strong>📖 Thèmes abordés :</strong><br>
                    Prière, jeûne, purification, Zakat, Hajj, et autres règles du Fiqh
                </div>
            `
        },
        'prophete': {
            titre: '☪️ Vie du Prophète ﷺ et des Compagnons',
            points: 100,
            couleur: '#fce4ec',
            contenu: `
                <h3>Description</h3>
                <p>Cette rubrique suit le même principe que celle de la jurisprudence.</p>
                <p>Les questions porteront sur la <strong>Sîra du Prophète Muhammad (ﷺ)</strong> ainsi que sur la vie et les enseignements de ses Compagnons.</p>
                
                <h3>Déroulement</h3>
                <ul>
                    <li>Participation simultanée de tous les membres</li>
                    <li>Temps limité pour chaque question</li>
                    <li>Réponses écrites sur des feuilles distribuées</li>
                </ul>
                
                <div class="info-box">
                    <strong>📖 Sujets couverts :</strong><br>
                    Vie du Prophète Muhammad (ﷺ), ses enseignements, l'histoire de ses Compagnons (Sahaba), leurs vertus et leurs contributions à l'Islam
                </div>
            `
        },
        'culture': {
            titre: '🌍 Culture Générale Islamique',
            points: 100,
            couleur: '#e0f2f1',
            contenu: `
                <h3>Description</h3>
                <p>Dans cette partie, le principe reste identique aux rubriques précédentes.</p>
                <p>Cependant, les questions porteront sur la <strong>culture générale islamique</strong>, avec des thèmes variés.</p>
                
                <h3>Déroulement</h3>
                <ul>
                    <li>Questions écrites avec temps limité</li>
                    <li>Participation de toute l'équipe</li>
                    <li>Thématiques diverses autour de l'Islam</li>
                </ul>
                
                <div class="info-box">
                    <strong>📖 Thèmes possibles :</strong><br>
                    Histoire islamique, les califes, les savants, la civilisation musulmane, géographie des terres d'Islam, événements historiques marquants
                </div>
            `
        },
        'relais': {
            titre: '⚡ Questions Relais',
            points: 150,
            couleur: '#fff9c4',
            contenu: `
                <h3>Description</h3>
                <p>Cette rubrique se déroule sous forme de <strong>relais</strong>.</p>
                <p>Chaque équipe désigne un premier participant pour commencer.</p>
                
                <h3>Règles du jeu</h3>
                <ul>
                    <li><strong>Réponse correcte :</strong> L'équipe marque des points et le relais continue avec un autre membre de l'équipe</li>
                    <li><strong>Mauvaise réponse :</strong> Les points sont perdus et le relais prend fin pour l'équipe concernée</li>
                </ul>
                
                <div class="warning-box">
                    <strong>⚠️ Important :</strong><br>
                    Cette rubrique requiert rapidité, précision et une bonne coordination d'équipe. Tous les membres doivent être prêts à participer !
                </div>
                
                <div class="info-box">
                    <strong>💡 Stratégie :</strong><br>
                    Organisez l'ordre de passage en fonction des forces de chaque membre
                </div>
            `
        },
        'hadith': {
            titre: '📜 Hadith',
            points: 100,
            couleur: '#ffebee',
            contenu: `
                <h3>Description</h3>
                <p>Cette rubrique consiste à réciter les <strong>10 premiers hadiths de l'Imam An-Nawawi</strong>.</p>
                
                <h3>Déroulement</h3>
                <ul>
                    <li>Chaque groupe choisit un participant</li>
                    <li>Le participant tire au hasard un numéro correspondant à un hadith à partir de bouts de papier</li>
                    <li>Exemple : s'il tire le numéro 2, il doit réciter le hadith n°2</li>
                    <li>Chaque hadith doit être récité dans un <strong>temps limité</strong></li>
                </ul>
                
                <h3>Notation</h3>
                <ul>
                    <li><strong>Récitations correctes :</strong> Rapportent des points au groupe</li>
                    <li><strong>Récitations incorrectes :</strong> N'octroient aucun point</li>
                </ul>
                
                <div class="info-box">
                    <strong>📚 Référence :</strong><br>
                    Les 10 premiers hadiths des 40 Hadiths de l'Imam An-Nawawi (en arabe avec traduction française)
                </div>
                
                <div class="warning-box">
                    <strong>✅ Critères d'évaluation :</strong><br>
                    Mémorisation, prononciation correcte en arabe, compréhension du sens
                </div>
            `
        }
    };
    
    // Function to open modal
    function openModal(rubriqueKey) {
        const rubrique = rubriquesDetails[rubriqueKey];
        
        if (rubrique) {
            modalBody.innerHTML = `
                <div style="background: ${rubrique.couleur}; padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0;">${rubrique.titre}</h2>
                    <p style="color: var(--primary-color); font-weight: bold; font-size: 1.2rem; margin: 0.5rem 0 0 0;">
                        Points maximum : ${rubrique.points}
                    </p>
                </div>
                ${rubrique.contenu}
            `;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Event listener sur les cartes de rubrique
    document.querySelectorAll('.rubrique-card').forEach(card => {
        const rubriqueKey = card.dataset.rubrique;
        
        // Click sur la carte entière
        card.addEventListener('click', function(e) {
            // Ne pas ouvrir si on clique directement sur le bouton
            if (!e.target.classList.contains('btn-details')) {
                openModal(rubriqueKey);
            }
        });
        
        // Click sur le bouton "En savoir plus"
        const btnDetails = card.querySelector('.btn-details');
        if (btnDetails) {
            btnDetails.addEventListener('click', function(e) {
                e.stopPropagation();
                openModal(rubriqueKey);
            });
        }
    });
    
    // Fermer le modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    // Fermer en cliquant en dehors du modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}
