// ============================================
// PAGE ACCUEIL - AL ILM 2026
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    initTypewriterEffect();
    initVersetsRotation();
    initCountdown();
    await loadEquipes();
    initRubriquesModal();
    initHeroAnimation();
});

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
            const countdownEl = document.getElementById('countdown');
            // Message de bienvenue
            countdownEl.innerHTML = '<div style="font-size: 3rem; font-weight: bold; text-shadow: 0 4px 6px rgba(0,0,0,0.3);"> Ramadan Mubarak ! </div>';

            // Afficher le verset du jour (remplace la date)
            const section = document.querySelector('.countdown-section');
            if (section) {
                const title = section.querySelector('h2');
                const dateText = section.querySelector('.countdown-date');
                if (title) title.textContent = "Le mois sacré est arrivé !";
                if (dateText) {
                    // Liste de 20 versets (exemple, peut être étendue)
                    const ramadanVersets = [
                        { arabe: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", traduction: "Le mois de Ramadan au cours duquel le Coran a été révélé", reference: "Sourate Al-Baqara (2:185)" },
                        { arabe: "إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ", traduction: "Ce Coran guide vers ce qu'il y a de plus droit", reference: "Sourate Al-Isra (17:9)" },
                        { arabe: "وَأَقِمِ الصَّلَاةَ إِنَّ الصَّلَاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنكَرِ", traduction: "Accomplis la prière, car la prière éloigne de la turpitude et du blâmable", reference: "Sourate Al-Ankabut (29:45)" },
                        { arabe: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ", traduction: "Ô vous qui avez cru! Le jeûne vous a été prescrit", reference: "Sourate Al-Baqara (2:183)" },
                        { arabe: "وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ", traduction: "Rappelle, car le rappel profite aux croyants", reference: "Sourate Adh-Dhariyat (51:55)" },
                        { arabe: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", traduction: "Allah est avec les endurants", reference: "Sourate Al-Baqara (2:153)" },
                        { arabe: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى", traduction: "Aidez-vous dans la bonté et la piété", reference: "Sourate Al-Maida (5:2)" },
                        { arabe: "إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ", traduction: "Allah aime les bienfaisants", reference: "Sourate Al-Baqara (2:195)" },
                        { arabe: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", traduction: "Quand Mes serviteurs t'interrogent à Mon sujet... Je suis tout proche", reference: "Sourate Al-Baqara (2:186)" },
                        { arabe: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا", traduction: "Tenez fermement ensemble à la corde d'Allah", reference: "Sourate Al-Imran (3:103)" },
                        { arabe: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ", traduction: "Allah est Pardonneur et Miséricordieux", reference: "Sourate Al-Baqara (2:199)" },
                        { arabe: "وَأَنفِقُوا مِمَّا رَزَقْنَاكُم", traduction: "Dépensez de ce que Nous vous avons octroyé", reference: "Sourate Al-Baqara (2:254)" },
                        { arabe: "إِنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", traduction: "Allah est capable de toute chose", reference: "Sourate Al-Baqara (2:284)" },
                        { arabe: "وَإِنَّ رَبَّكَ لَذُو فَضْلٍ عَلَى النَّاسِ", traduction: "Ton Seigneur est plein de grâce envers les gens", reference: "Sourate An-Naml (27:73)" },
                        { arabe: "وَإِنَّ اللَّهَ لَهُوَ الْغَنِيُّ الْحَمِيدُ", traduction: "Allah est le Riche, le Digne de louange", reference: "Sourate Al-Baqara (2:267)" },
                        { arabe: "وَإِنَّ اللَّهَ لَهُوَ الْقَوِيُّ الْعَزِيزُ", traduction: "Allah est le Fort, le Puissant", reference: "Sourate Al-Baqara (2:220)" },
                        { arabe: "وَإِنَّ اللَّهَ لَهُوَ الْحَلِيمُ الْغَفُورُ", traduction: "Allah est le Doux, le Pardonneur", reference: "Sourate Al-Baqara (2:225)" },
                        { arabe: "وَإِنَّ اللَّهَ لَهُوَ الْعَلِيمُ الْحَكِيمُ", traduction: "Allah est le Savant, le Sage", reference: "Sourate Al-Baqara (2:228)" },
                        { arabe: "وَإِنَّ اللَّهَ لَهُوَ السَّمِيعُ الْبَصِيرُ", traduction: "Allah est l'Audient, le Clairvoyant", reference: "Sourate Al-Baqara (2:233)" },
                        { arabe: "وَإِنَّ اللَّهَ لَهُوَ الرَّؤُوفُ الرَّحِيمُ", traduction: "Allah est le Compatissant, le Miséricordieux", reference: "Sourate Al-Baqara (2:143)" }
                    ];
                    // Verset du jour (change toutes les 10 heures)
                    const now = new Date();
                    const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 10)) % ramadanVersets.length;
                    const v = ramadanVersets[dayIndex];
                    dateText.style.display = 'block';
                    dateText.innerHTML = `<div style="margin-top:1rem; padding:1rem; background:#f3f4f6; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.07);">
                        <div style="font-size:1.3rem; color:#2C5F2D; font-weight:700;">${v.arabe}</div>
                        <div style="font-size:1.1rem; color:#2C3E50; margin-top:0.5rem;">${v.traduction}</div>
                        <div style="font-size:0.95rem; color:#718096; margin-top:0.5rem;">${v.reference}</div>
                    </div>`;
                }
            }
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

    try {
        console.log('\n🔄 === CHARGEMENT DES ÉQUIPES ===');
        console.log('⏰ Timestamp:', new Date().toLocaleTimeString());

        // 1. Charger TOUTES les équipes d'abord
        const allEquipesRes = await fetch('/api/equipes');
        const allEquipesResult = await allEquipesRes.json();

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

                console.log(`\n🏆 ${equipe.nom}:`);
                console.log(`   Validée:`, isValidated);
                console.log(`   Membres:`, validated ? validated.nb_membres : 0);
                console.log(`   A des membres:`, hasMembers);

                return `
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
               style="border-left: 5px solid ${equipe.couleur}; text-decoration: none; color: inherit;">
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
            </a>
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
                        <li><strong>Format :</strong> 50 questions à choix multiples (QCM).</li>
                        <li><strong>Barème :</strong> 6 points par bonne réponse (Total 300 pts).</li>
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
                        <li><strong>Relais :</strong> Transmission immédiate du tour au membre suivant après réponse.</li>
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
