// ============================================
// PAGE ACCUEIL - AL ILM 2026
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    initVersetsRotation();
    await initAccueil();
    await loadEquipes();
    initRubriquesModal();
    initHeroAnimation();
});

/**
 * Initialiser la page d'accueil en fonction de la configuration admin
 */
async function initAccueil() {
    try {
        const configRes = await fetch('/api/classement-config');
        const configData = await configRes.json();
        let config = {};

        if (configData.success && configData.data) {
            config = configData.data;
        }

        const isFinRamadanActive = config.fin_ramadan === true || config.fin_ramadan === 'true';
        const isModeAidActive = config.mode_aid === true || config.mode_aid === 'true';
        console.log('🕌 [CONFIG] Mode:', { fin_ramadan: isFinRamadanActive, mode_aid: isModeAidActive });

        if (isModeAidActive || isFinRamadanActive) {
            // Mode Aïd ou Clôture
            const wisdomSection = document.getElementById('wisdomSection');
            const ramadanSection = document.getElementById('ramadanCountdownSection');
            const podiumSection = document.getElementById('podiumSection');
            const heroTitle = document.getElementById('heroTitle');
            const heroSubtitle = document.getElementById('heroSubtitle');
            const ctaActive = document.getElementById('ctaSectionActive');
            const ctaClosed = document.getElementById('ctaSectionClosed');

            if (wisdomSection) wisdomSection.style.display = 'none';
            if (ramadanSection) ramadanSection.style.display = 'none';
            if (podiumSection) podiumSection.style.display = 'block';

            if (heroTitle) {
                if (isModeAidActive) {
                    heroTitle.innerHTML = 'Aïd Moubarak Saïd ! <span class="eid-emoji">🌙✨</span>';
                    document.body.classList.add('theme-aid');
                } else {
                    heroTitle.textContent = "Clôture de l'Édition 2026 - AL ILM";
                    document.body.classList.remove('theme-aid');
                }
                initTypewriterEffect();
            }

            if (heroSubtitle) {
                if (isModeAidActive) {
                    heroSubtitle.textContent = "Toute l'équipe d'AL ILM vous souhaite une excellente fête. Félicitations aux vainqueurs !";
                } else {
                    heroSubtitle.textContent = "Merci à tous les participants. Retrouvez le classement de la Finale ci-dessous ";
                }
                heroSubtitle.style.animation = 'none';
                heroSubtitle.offsetHeight; // force reflow
                heroSubtitle.style.animation = 'fadeInUp 0.8s ease 0.2s both';
            }

            if (ctaActive) ctaActive.style.display = 'none';
            if (ctaClosed) ctaClosed.style.display = 'block';

            if (config.afficher_podium === true || config.afficher_podium === 'true') {
                await loadPodiumFinale();
            } else {
                if (podiumSection) podiumSection.style.display = 'none';
            }
        } else {
            // Mode Normal (Pendant Ramadan) => Revenir à l'état initial
            const wisdomSection = document.getElementById('wisdomSection');
            const ramadanSection = document.getElementById('ramadanCountdownSection');
            const podiumSection = document.getElementById('podiumSection');
            const heroTitle = document.getElementById('heroTitle');
            const heroSubtitle = document.getElementById('heroSubtitle');
            const ctaActive = document.getElementById('ctaSectionActive');
            const ctaClosed = document.getElementById('ctaSectionClosed');

            if (wisdomSection) wisdomSection.style.display = 'block';
            if (ramadanSection) ramadanSection.style.display = 'block';
            if (podiumSection) podiumSection.style.display = 'none';

            if (heroTitle) {
                heroTitle.textContent = "Marhaba au Jeu Concours AL ILM - Édition 2026";
                initTypewriterEffect();
            }
            if (heroSubtitle) {
                heroSubtitle.textContent = "Concours de connaissances islamiques organisé par l'AEEMCI - Section ESATIC";
                heroSubtitle.style.animation = 'fadeInUp 0.8s ease 0.2s both';
            }

            if (ctaActive) ctaActive.style.display = 'block';
            if (ctaClosed) ctaClosed.style.display = 'none';

            initCountdown();
        }
    } catch (error) {
        console.error('Erreur initialisation accueil:', error);
        initCountdown(); // Fallback
    }
}

/**
 * Charger et afficher le podium de la Finale
 */
async function loadPodiumFinale() {
    try {
        let res = await fetch('/api/classement/etape/finale');
        let data = await res.json();

        // Si pas de données pour la finale, tenter le classement général
        if (!data.success || !data.classement || data.classement.length === 0) {
            console.log('🏆 [INFO] Pas de résultats pour la Finale, basculement sur le Classement Général.');
            res = await fetch('/api/classement/general');
            data = await res.json();
        }

        if (data.success && data.classement && data.classement.length > 0) {
            const podiumContainer = document.getElementById('podiumContainer');
            if (!podiumContainer) return;

            const top3 = data.classement.slice(0, 3);

            const displayOrder = [];
            if (top3.length > 1) displayOrder.push({ ...top3[1], pos: 2 });
            if (top3.length > 0) displayOrder.push({ ...top3[0], pos: 1 });
            if (top3.length > 2) displayOrder.push({ ...top3[2], pos: 3 });

            const html = displayOrder.map(team => {
                const score = parseFloat(team.score_total || 0).toFixed(1);
                const medalIcon = team.pos === 1 ? '🥇' : team.pos === 2 ? '🥈' : '🥉';
                const posClass = team.pos === 1 ? 'podium-first spotlight-winner' : team.pos === 2 ? 'podium-second' : 'podium-third';

                return `
                    <div class="podium-step-wrapper ${posClass}" style="--team-color: ${team.couleur || '#D4AF37'};">
                        <div class="podium-medal">${medalIcon}</div>
                        <div class="podium-team-logo">
                            <img src="/assets/images/equipes/${team.nom_equipe.toLowerCase().replace('-', '_')}.png" 
                                 alt="Logo ${team.nom_equipe}"
                                 onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="equipe-symbole" style="display:none; color: ${team.couleur}; font-size: 2.5rem; justify-content: center; align-items: center; border-radius: 50%; width: 100%; height: 100%; background: #f8fafc;">${team.symbole || '🏴'}</div>
                        </div>
                        <div class="podium-box">
                            ${team.pos === 1 ? '<div class="champion-badge">Grand Vainqueur</div>' : ''}
                            <div class="podium-rank">#${team.pos}</div>
                            <h3 class="podium-name">${team.nom_equipe}</h3>
                            <div class="podium-score">${score} pts</div>
                        </div>
                    </div>
                `;
            }).join('');

            podiumContainer.innerHTML = html;

            // Déclencher les confettis quand la section est visible
            const podiumSection = document.getElementById('podiumSection');
            if (podiumSection && typeof confetti === 'function') {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !podiumSection.dataset.confettiFired) {
                            triggerVictoryConfetti();
                            podiumSection.dataset.confettiFired = 'true';
                        }
                    });
                }, { threshold: 0.5 });
                observer.observe(podiumSection);
            }
        }
    } catch (e) {
        console.error('Erreur chargement podium:', e);
    }
}

/**
 * Déclenche une pluie de confettis dorés
 */
function triggerVictoryConfetti() {
    const end = Date.now() + (3 * 1000);
    const colors = ['#D4AF37', '#FFD700', '#ffffff', '#2C5F2D'];

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

/**
 * Initialiser l'animation Three.js dans le hero
 */
function initHeroAnimation() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, 400);
    renderer.setClearColor(0x000000, 0);

    // Créer un champ d'étoiles
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.7,
        transparent: true,
        opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 200; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Créer des formes géométriques islamiques (étoile à 8 branches simplifiée)
    const shape = new THREE.Shape();
    const outerRadius = 2;
    const innerRadius = 1;
    const points = 8;

    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI / points) * i;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        if (i === 0) {
            shape.moveTo(x, y);
        } else {
            shape.lineTo(x, y);
        }
    }
    shape.closePath();

    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        wireframe: true,
        transparent: true,
        opacity: 1
    });
    const star = new THREE.Mesh(geometry, material);
    scene.add(star);

    camera.position.z = 15;

    // Animation
    let rotation = 0;
    function animate() {
        requestAnimationFrame(animate);

        rotation += 0.001;

        // Rotation de l'étoile
        star.rotation.x += 0.005;
        star.rotation.y += 0.01;

        // Rotation des étoiles
        stars.rotation.y += 0.0005;

        renderer.render(scene, camera);
    }

    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / 400;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, 400);
    });
}

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

    // Nettoyer toute animation précédente pour éviter les doublons
    if (heroTitle._typewriterTimeout) {
        clearTimeout(heroTitle._typewriterTimeout);
    }

    function typeWriter() {
        if (index < text.length) {
            heroTitle.textContent += text.charAt(index);
            index++;
            heroTitle._typewriterTimeout = setTimeout(typeWriter, 80); // 80ms entre chaque lettre
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
    function updateUI() {
        const now = new Date();
        const ramadanStartDate = new Date('2026-02-18T00:00:00');
        const diff = now - ramadanStartDate;

        // Heure du Maghrib (décalage de 5h30 : 24h - 18.5h)
        const maghribOffset = 5.5 * 60 * 60 * 1000;
        const isRamadanActive = (diff + maghribOffset) >= 0;

        // --- 1. GESTION DU CARROUSEL DE SAGESSE (HAUT) ---
        const wisdomCarousel = document.getElementById('wisdomCarousel');
        if (wisdomCarousel) {
            const wisdomVersets = [
                { arabe: "وَقُل رَّبِّ زِدْنِي عِلْمًا", traduction: "Et dis : « Ô mon Seigneur, accroît mes connaissances ! »", reference: "Sourate Ta-Ha (20:114)" },
                { arabe: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ", traduction: "Ô vous qui avez cru! Le jeûne vous a été prescrit comme il a été prescrit à ceux qui vous ont précédés, ainsi atteindrez-vous la piété.", reference: "Sourate Al-Baqara (2:183)" },
                { arabe: "أَيَّامًا مَّعْدُودَاتٍ ۚ فَمَن كَانَ مِنكُم مَّرِيضًا أَوْ عَلَىٰ سَفَرٍ فَعِدَّةٌ مِّنْ أَيَّامٍ أُخَرَ", traduction: "(Jeûnez) pendant des jours comptés. Quiconque d'entre vous est malade ou en voyage, devra jeûner un nombre égal d'autres jours.", reference: "Sourate Al-Baqara (2:184)" },
                { arabe: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ", traduction: "Le mois de Ramadan au cours duquel le Coran a été révélé comme guide pour les gens, et preuves claires de la bonne direction et du discernement.", reference: "Sourate Al-Baqara (2:185)" },
                { arabe: "وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ", traduction: "Et rappelle; car le rappel profite aux croyants.", reference: "Sourate Adh-Dhariyat (51:55)" },
                { arabe: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ", traduction: "Je n'ai créé les djinns et les hommes que pour qu'ils M'adorent.", reference: "Sourate Adh-Dhariyat (51:56)" }
            ];

            const index = Math.floor(now.getTime() / 13000) % wisdomVersets.length;
            const v = wisdomVersets[index];

            if (wisdomCarousel.getAttribute('data-current-verse') !== v.reference) {
                wisdomCarousel.setAttribute('data-current-verse', v.reference);
                wisdomCarousel.style.animation = 'none';
                wisdomCarousel.offsetHeight; // force reflow
                wisdomCarousel.style.animation = 'fadeInUp 1s ease-out';

                wisdomCarousel.innerHTML = `
                    <div class="wisdom-carousel-card">
                        <div style="font-size: 2rem; margin-bottom: 1.5rem; color: #D4AF37; filter: drop-shadow(0 0 5px rgba(212,175,55,0.2));"></div>
                        <div class="wisdom-arabe">${v.arabe}</div>
                        <div class="wisdom-traduction">"${v.traduction}"</div>
                        <div class="wisdom-ref"> ${v.reference} </div>
                    </div>
                `;
            }
        }

        // --- 2. GESTION DU TRACKER RAMADAN (BAS) ---
        const tracker = document.getElementById('ramadanTracker');
        const section = document.querySelector('.countdown-section');
        const sectionTitle = section ? section.querySelector('h2') : null;

        if (tracker) {
            if (!isRamadanActive) {
                if (sectionTitle) sectionTitle.textContent = "Compte à rebours jusqu'au Ramadan 2026";
                // Avant Ramadan : Affichage Compte à rebours classique
                const distance = ramadanStartDate - now;
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const countdownID = `${days} -${hours} -${minutes} -${seconds} `;
                if (tracker.getAttribute('data-last-countdown') === countdownID) return;
                tracker.setAttribute('data-last-countdown', countdownID);

                tracker.innerHTML = `
                    <div class="countdown" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; font-family: 'Outfit', sans-serif;">
                        <div class="countdown-item">
                            <span class="countdown-value">${String(days).padStart(2, '0')}</span>
                            <span class="countdown-label">Jours</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-value">${String(hours).padStart(2, '0')}</span>
                            <span class="countdown-label">Heures</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-value">${String(minutes).padStart(2, '0')}</span>
                            <span class="countdown-label">Min</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-value">${String(seconds).padStart(2, '0')}</span>
                            <span class="countdown-label">Sec</span>
                        </div>
                    </div>
                <p style="margin-top: 1.5rem; opacity: 0.8; font-style: italic; font-family: 'Outfit', sans-serif;">Préparez vos cœurs pour le mois sacré...</p>
            `;
            } else {
                // Pendant Ramadan : Affichage Tracker de Progression
                if (sectionTitle) sectionTitle.textContent = "Suivi de votre mois Béni";

                // LOGIQUE ISLAMIQUE : Le jour change au Maghrib (environ 18h30)
                // On ajoute un décalage de 5h30 (24h - 18.5h) pour que le jour "roule" à 18h30.
                const adjustedDiff = diff + maghribOffset;
                const dayOfRamadan = Math.floor(adjustedDiff / (1000 * 60 * 60 * 24)) + 1;

                // ANTIFLICKER : On ne met à jour que si nécessaire
                if (tracker.getAttribute('data-current-day') === String(dayOfRamadan)) {
                    return;
                }
                tracker.setAttribute('data-current-day', dayOfRamadan);

                // Progression basée sur les jours ENTIÈREMENT terminés (0% le premier jour, 100% à l'Aïd)
                const completedDays = dayOfRamadan - 1;
                const progressPercent = Math.min((completedDays / 30) * 100, 100);

                const phases = [
                    {
                        title: "Miséricorde",
                        detail: "Rahma",
                        days: "Jours 1 à 10",
                        goal: "Ouvrir son cœur à la clémence",
                        desc: "Une période pour solliciter la bonté infinie d'Allah sur nos vies.",
                        action: "Multiplier les invocations pour soi et ses proches."
                    },
                    {
                        title: "Pardon",
                        detail: "Maghfirah",
                        days: "Jours 11 à 20",
                        goal: "Purification de l'âme",
                        desc: "Le moment idéal pour regretter ses fautes et se purifier le cœur.",
                        action: "Multiplier l'Istighfar (demandes de pardon)."
                    },
                    {
                        title: "Salut",
                        detail: "Itqun minan-Nar",
                        days: "Jours 21 à 30",
                        goal: "Excellence et Sauvetage",
                        desc: "La quête de l'affranchissement du feu et la recherche de Laylat al-Qadr.",
                        action: "Intensifier les prières nocturnes et les bonnes œuvres."
                    }
                ];

                let currentIdx = 0;
                if (dayOfRamadan > 20) currentIdx = 2;
                else if (dayOfRamadan > 10) currentIdx = 1;

                tracker.innerHTML = `
                    <div class="ramadan-tracker-container">
                        <!-- En-tête : Jour Actuel -->
                        <div style="text-align: center; margin-bottom: 2rem;">
                            <div style="font-size: 0.9rem; text-transform: uppercase; opacity: 0.7; letter-spacing: 2px;">Aujourd'hui</div>
                            <div style="font-size: clamp(3rem, 8vw, 4.5rem); font-weight: 900; color: #FFD700; line-height: 1; margin: 10px 0;">Jour ${dayOfRamadan} <span style="font-size: 1.5rem; opacity: 0.5; font-weight: 400;">/ 30</span></div>
                            <div style="font-size: 1.1rem; font-weight: 600; color: white;">Phase active : <span style="color: #FFD700;">${phases[currentIdx].title} (${phases[currentIdx].detail})</span></div>
                        </div>

                        <!-- Timeline des Phases -->
                        <div class="ramadan-phases-grid">
                            ${phases.map((p, i) => `
                                <div class="phase-item ${i === currentIdx ? 'active' : ''} ${i < currentIdx ? 'past' : ''}">
                                    <div class="phase-title">${p.title}</div>
                                    <div class="phase-name" style="color: ${i === currentIdx ? '#FFD700' : 'white'};">${p.detail}</div>
                                    <div style="font-size: 0.75rem; font-weight: 700; color: #FFD700; margin-bottom: 8px;">${p.days}</div>
                                    <div class="phase-goal" style="font-size: 0.85rem; opacity: 1; margin-bottom: 10px;">"${p.goal}"</div>
                                    <div style="font-size: 0.75rem; opacity: 0.7; line-height: 1.4; margin-bottom: 10px;">${p.desc}</div>
                                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 8px; font-size: 0.7rem; font-weight: 600;">
                                        <span style="color: #FFD700;">Conseil :</span> ${p.action}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <!-- Barre de progression -->
                        <div style="margin-bottom: 12px;">
                            <div style="height: 12px; background: rgba(0,0,0,0.3); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                                <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37); box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); border-radius: 20px; transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                            </div>
                        </div>

                        <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 0.8rem; font-weight: 800; opacity: 0.8;">
                            <span style="color: #4CAF50;">1er RAMADAN</span>
                            <span style="color: #FFD700;">Progression : ${Math.round(progressPercent)}% terminé</span>
                            <span style="color: #D4AF37;">AÏD AL-FITR</span>
                        </div>
                    </div>
                `;
            }
        }
    }

    // Mettre à jour toutes les secondes
    updateUI();
    setInterval(updateUI, 1000);
}

/**
 * Charger et afficher les équipes
 */
async function loadEquipes() {
    const equipesGrid = document.getElementById('equipesGrid');

    if (!equipesGrid) return;

    try {
        console.log('\n🔄 === CHARGEMENT DES ÉQUIPES ===');
        console.log('⏰ Timestamp:', new Date().toLocaleTimeString());

        // 1. Charger TOUTES les équipes d'abord
        const allEquipesRes = await fetch('/api/equipes');
        const allEquipesResult = await allEquipesRes.json();

        // 1b. Charger la config pour les éliminations
        const configRes = await fetch('/api/classement-config');
        const configData = await configRes.json();
        let eliminees = [];
        try {
            eliminees = JSON.parse(configData.data.equipes_eliminees || '[]');
        } catch (e) { console.error('Erreur parse eliminees:', e); }

        if (!allEquipesResult.success) {
            throw new Error('Impossible de charger la liste des équipes');
        }

        const equipesData = allEquipesResult.data.map(eq => ({
            nom: eq.nom,
            signification: eq.signification || '',
            couleur: eq.couleur || '#2C5F2D',
            symbole: eq.symbole || '🏴'
        }));

        // 2. Charger les équipes validées pour le statut
        const timestamp = new Date().getTime();
        const url = `/api/equipes/public/validated?t=${timestamp}`;

        console.log('📡 Requête status:', url);

        const response = await fetch(url);
        const result = await response.json();

        let equipesValidees = {};
        if (result.success && result.data) {
            result.data.forEach(eq => {
                equipesValidees[eq.nom] = eq;
            });
            // Afficher toutes les équipes avec indication si validée ou non
            equipesGrid.innerHTML = equipesData.map(equipe => {
                const validated = equipesValidees[equipe.nom];
                const hasMembers = validated && validated.nb_membres > 0;
                const isValidated = !!validated; // A un code d'accès

                console.log(`\n🏆 ${equipe.nom}: `);
                console.log(`   Validée: `, isValidated);
                console.log(`   Membres: `, validated ? validated.nb_membres : 0);
                console.log(`   A des membres: `, hasMembers);

                return `
                <a href="/public/equipe-details.html?equipe=${encodeURIComponent(equipe.nom)}"
            class="equipe-card ${eliminees.includes(equipe.nom) ? 'is-eliminee' : ''}"
            style="--team-color: ${equipe.couleur};">
                    <div class="equipe-logo">
                        <img src="/assets/images/equipes/${equipe.nom.toLowerCase().replace('-', '_')}.png" 
                             alt="Logo ${equipe.nom}" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="equipe-symbole" style="color: ${equipe.couleur}; display:none;">${equipe.symbole}</div>
                        ${eliminees.includes(equipe.nom) ? '<div class="eliminee-badge">ÉLIMINÉ</div>' : ''}
                    </div>
                    <h3>${equipe.nom}</h3>
                    <p class="signification">${equipe.signification}</p>
                    
                    <div class="equipe-status">
                        ${hasMembers ? `
                            <span class="badge-validated">Équipe constituée</span>
                            <p class="equipe-info">${validated.nb_membres} membre${validated.nb_membres > 1 ? 's' : ''}</p>
                            ${validated.capitaine ? `
                                <div class="equipe-capitaine">
                                    <span class="capitaine-label">Capitaine</span><br>
                                    ${validated.capitaine.prenom} ${validated.capitaine.nom}
                                </div>
                            ` : ''}
                        ` : isValidated ? `
                            <span class="badge-pending">Validée - 0 membre</span>
                            <p class="equipe-info">En attente de membres</p>
                        ` : `
                            <span class="badge-pending">En formation</span>
                        `}
                    </div>

                    <div class="equipe-link">
                        Voir les détails <span>→</span>
                    </div>
                </a>
                `;
            }).join('');

            console.log('✅ Affichage mis à jour');
            console.log('=== FIN CHARGEMENT ===\n');
        } else {
            // Si la requête de statut échoue, afficher les équipes sans statut
            console.warn('⚠️ Impossible de charger le statut des équipes. Affichage sans statut.');
            equipesGrid.innerHTML = equipesData.map(equipe => `
                <a href="/public/equipe-details.html?equipe=${encodeURIComponent(equipe.nom)}"
            class="equipe-card"
            style="--team-color: ${equipe.couleur};">
                    <div class="equipe-logo">
                        <img src="/assets/images/equipes/${equipe.nom.toLowerCase().replace('-', '_')}.png" 
                             alt="Logo ${equipe.nom}" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="equipe-symbole" style="color: ${equipe.couleur}; display:none;">${equipe.symbole}</div>
                    </div>
                    <h3>${equipe.nom}</h3>
                    <p class="signification">${equipe.signification}</p>
                    <div class="equipe-link">
                        Voir les détails <span>→</span>
                    </div>
                </a>
                `).join('');
            console.log('✅ Affichage mis à jour (sans statut)');
            console.log('=== FIN CHARGEMENT ===\n');
        }

        // Auto-refresh désactivé pour éviter les boucles d'erreurs réseau infinies
        // setTimeout(loadEquipes, 10000);

    } catch (error) {
        console.error('❌ Erreur lors du chargement des équipes:', error);

        // Afficher les équipes sans statut en cas d'erreur
        // equipesData doit être accessible ici, donc elle doit être déclarée en dehors du try/catch ou gérée autrement
        // Pour l'instant, on suppose qu'elle est définie si le premier fetch a réussi.
        // Si le premier fetch échoue, equipesData ne sera pas définie, ce qui causera une erreur ici.
        // Une meilleure gestion serait de définir equipesData comme [] initialement.
        const equipesDataFallback = typeof equipesData !== 'undefined' ? equipesData : [];
        equipesGrid.innerHTML = equipesDataFallback.map(equipe => `
                <a href="/public/equipe-details.html?equipe=${encodeURIComponent(equipe.nom)}"
            class="equipe-card"
            style = "border-left: 5px solid ${equipe.couleur}; text-decoration: none; color: inherit;" >
                <div class="equipe-logo">
                    <img src="/assets/images/equipes/${equipe.nom.toLowerCase().replace('-', '_')}.png" 
                         alt="Logo ${equipe.nom}" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="equipe-symbole" style="color: ${equipe.couleur}; display:none;">${equipe.symbole}</div>
                </div>
                <h3>${equipe.nom}</h3>
                <p class="equipe-signification">${equipe.signification}</p>
                <div class="equipe-link">
                    Voir les details →
                </div>
            </a >
                `).join('');
    }
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
    // Données détaillées des rubriques
    const rubriquesDetails = {
        'coran-ouvert': {
            titre: 'Coran Ouvert',
            points: 15,
            couleur: '#fffbf0',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Cette épreuve consiste en une lecture psalmodiée du Saint Coran, effectuée directement depuis le Mushaf (support physique).</p>
                    
                    <h3>Méthodologie d'Évaluation</h3>
                    <ul>
                        <li><strong>Tajwid :</strong> Application rigoureuse des règles de psalmodie.</li>
                        <li><strong>Recherche :</strong> Rapidité et précision dans la localisation du passage imposé.</li>
                        <li><strong>Qualité Vocale :</strong> Clarté, timbre et maîtrise du souffle.</li>
                    </ul>
                    
                    <div class="info-box-minimal">
                        <strong>Référentiel</strong>
                        L'épreuve porte sur le Juz Amma (Sourates 78 à 114).
                    </div>
                </div>
                `
        },
        'coran-ferme': {
            titre: 'Coran Fermé',
            points: 15,
            couleur: '#fffbf0',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Épreuve d'Excellence consistant en la récitation mémorisée du Saint Coran, sans consultation de support écrit.</p>
                    
                    <h3>Critères de Performance</h3>
                    <ul>
                        <li><strong>Exactitude :</strong> Mémorisation parfaite et absence d'hésitation.</li>
                        <li><strong>Articulatoire :</strong> Maîtrise des points de sortie des lettres (Makharij).</li>
                        <li><strong>Sérénité :</strong> Assurance et fluidité de la récitation.</li>
                    </ul>
                    
                    <div class="info-box-minimal">
                        <strong>Référentiel</strong>
                        L'épreuve porte sur les sourates allant de Al-A'la (87) à An-Nas (114).
                    </div>
                </div>
                `
        },
        'adhan': {
            titre: 'Adhan',
            points: 10,
            couleur: '#f0fdf4',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Performance vocale technique portant sur l'appel à la prière, alliant justesse mélodique et rigueur liturgique.</p>
                    
                    <h3>Axes d'Évaluation</h3>
                    <ul>
                        <li><strong>Phonétique :</strong> Articulation précise des termes sacrés.</li>
                        <li><strong>Esthétique :</strong> Qualité de la mélodie et harmonie globale.</li>
                        <li><strong>Technique :</strong> Maîtrise de la projection vocale.</li>
                    </ul>
                    
                    <div class="warning-box-minimal">
                        <strong>Contrainte Temporelle</strong>
                        Durée maximale autorisée : 3 minutes.
                    </div>
                </div>
                `
        },

        'jurisprudence': {
            titre: 'Jurisprudence (Fiqh)',
            points: 50,
            couleur: '#fdf2f2',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Évaluation théorique collective portant sur les fondements du droit islamique et les pratiques cultuelles.</p>
                    
                    <h3>Organisation de l'Épreuve</h3>
                    <ul>
                        <li><strong>Format :</strong> 10 questions à choix multiples ou réponses courtes.</li>
                        <li><strong>Barème :</strong> 5 points par bonne réponse (Total 50 pts).</li>
                        <li><strong>Thématiques :</strong> Piliers de l'Islam (Salat, Sawm, Zakat, Hajj) et Purification.</li>
                    </ul>
                    
                    <div class="info-box-minimal">
                        <strong>Objectif</strong>
                        Valider la compréhension des règles régissant la vie du musulman.
                    </div>
                </div>
                `
        },
        'prophete': {
            titre: 'Vie du Prophète & Sîra',
            points: 300,
            couleur: '#faf5ff',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Grande épreuve QCM sur la biographie du Prophète ﷺ, de sa naissance à sa mort, ainsi que la vie des Compagnons.</p>
                    
                    <h3>Structure de l'Évaluation</h3>
                    <ul>
                        <li><strong>Format :</strong> 5 questions à choix multiples (QCM).</li>
                        <li><strong>Barème :</strong> 6 points par bonne réponse (Total 30 pts).</li>
                        <li><strong>Chronologie :</strong> Période Mecquoise et Médinoise.</li>
                    </ul>
                    
                    <div class="info-box-minimal">
                        <strong>Enjeu</strong>
                        Épreuve majeure déterminante pour le classement final.
                    </div>
                </div>
                `
        },
        'culture': {
            titre: 'Culture Générale Islamique',
            points: 100,
            couleur: '#f0fdfa',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Épreuve encyclopédique couvrant la diversité intellectuelle et civilisationnelle du monde musulman.</p>
                    
                    <h3>Composantes Clés</h3>
                    <ul>
                        <li><strong>Format :</strong> 10 questions variées.</li>
                        <li><strong>Barème :</strong> 10 points par bonne réponse (Total 100 pts).</li>
                        <li><strong>Sujets :</strong> Sciences, Géographie, Histoire et Patrimoine.</li>
                    </ul>
                    
                    <div class="info-box-minimal">
                        <strong>Conseil</strong>
                        Rubrique valorisant la curiosité intellectuelle et la culture transversale.
                    </div>
                </div>
                `
        },
        'relais': {
            titre: 'Questions Relais',
            points: 30,
            couleur: '#fefce8',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Épreuve de rapidité et d'endurance mentale sous forme de relais entre les membres de l'équipe.</p>
                    
                    <h3>Règles Fondamentales</h3>
                    <ul>
                        <li><strong>Format :</strong> 3 questions successives (1 par membre).</li>
                        <li><strong>Barème :</strong> 10 points par bonne réponse (Total 30 pts).</li>
                        <li><strong>Relais :</strong> Transmission immédiate du tour au membre suivant après une réponse correcte. En cas de réponse incorrecte, le relais s'arrête immédiatement et l'équipe ne marque aucun point pour les questions restantes.</li>
                    </ul>
                    
                    <div class="warning-box-minimal">
                        <strong>Engagement Maximum</strong>
                        Rubrique exigeant une coordination parfaite et une réactivité optimale du groupe.
                    </div>
                </div>
                `
        },
        'hadith': {
            titre: 'Hadith',
            points: 20,
            couleur: '#fff1f2',
            contenu: `
                <div class="rubrique-detail-container">
                    <h3>Description</h3>
                    <p>Épreuve de transmission orale portant sur les quarante Hadiths de l'Imam An-Nawawi.</p>
                    
                    <h3>Mode Opératoire</h3>
                    <ul>
                        <li><strong>Tirage :</strong> 1 Hadith tiré au sort parmi les 10 premiers.</li>
                        <li><strong>Barème :</strong> 20 points pour une restitution parfaite (Arabe & Français).</li>
                        <li><strong>Critères :</strong> Fidélité au texte, fluidité et prononciation.</li>
                    </ul>
                    
                    <div class="info-box-minimal">
                        <strong>Référence</strong>
                        Quarante Hadiths de l'An-Nawawi (Hadiths 1 à 10).
                    </div>
                </div>
                `
        }
    };

    // Function to open modal
    function openModal(rubriqueKey) {
        const rubrique = rubriquesDetails[rubriqueKey];

        if (rubrique) {
            modalBody.innerHTML = `
                <div class="modal-header-accent" style="background: ${rubrique.couleur};">
                    <h2>${rubrique.titre}</h2>
                    <div class="points-tag">
                        Points maximum : ${rubrique.points}
                    </div>
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
        card.addEventListener('click', function (e) {
            // Ne pas ouvrir si on clique directement sur le bouton
            if (!e.target.classList.contains('btn-details')) {
                openModal(rubriqueKey);
            }
        });

        // Click sur le bouton "En savoir plus"
        const btnDetails = card.querySelector('.btn-details');
        if (btnDetails) {
            btnDetails.addEventListener('click', function (e) {
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
