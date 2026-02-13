// ============================================
// PAGE DETAILS EQUIPE - AL ILM 2026
// ============================================

// Données des équipes avec leurs informations complètes
const EQUIPES_INFO = {
    'AS-SOLIHATE': {
        symbole: '🌸',
        couleur: '#E91E63',
        signification: 'Les Vertueuses',
        verset: {
            arabe: 'فَالصَّالِحَاتُ قَانِتَاتٌ حَافِظَاتٌ لِلْغَيْبِ بِمَا حَفِظَ اللَّهُ',
            traduction: 'Les femmes vertueuses sont obéissantes (à leurs maris), et protègent ce qui doit être protégé...',
            reference: 'Sourate An-Nisa (4:34)'
        },
        description: 'As-Solihate représente les vertueuses. Cette équipe incarne l\'excellence morale, la piété et les nobles caractères qui font la force d\'une communauté.'
    },
    'AT-TAWWABOUNE': {
        symbole: '🤲',
        couleur: '#607D8B',
        signification: 'Ceux qui implorent le pardon d\'Allah',
        verset: {
            arabe: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ',
            traduction: 'Certes, Allah aime ceux qui se repentent, et Il aime ceux qui se purifient',
            reference: 'Sourate Al-Baqara (2:222)'
        },
        description: 'At-Tawwaboune désigne ceux qui reviennent sans cesse vers Allah par le repentir. Cette équipe symbolise l\'humilité devant le Créateur et la volonté constante de s\'améliorer.'
    },
    'AZ-ZAKIROUNE': {
        symbole: '📿',
        couleur: '#795548',
        signification: 'Ceux qui se rappellent d\'Allah',
        verset: {
            arabe: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
            traduction: 'N\'est-ce pas par le rappel d\'Allah que les cœurs s\'apaisent ?',
            reference: 'Sourate Ar-Ra\'d (13:28)'
        },
        description: 'Az-Zakiroune représente ceux dont la langue et le cœur sont occupés par le rappel d\'Allah. Elle incarne la paix intérieure et la connexion spirituelle permanente.'
    },
    'AL YAQRA\'OUN': {
        symbole: '📖',
        couleur: '#4CAF50',
        signification: 'Les lecteurs du Coran',
        verset: {
            arabe: 'وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا',
            traduction: '...et la récitation du Coran à l\'aube, car la récitation du Coran à l\'aube porte témoignage',
            reference: 'Sourate Al-Isra (17:78)'
        },
        description: 'Al Yaqra\'oun désigne les lecteurs assidus du Livre Saint. Cette équipe symbolise l\'attachement au Coran, sa méditation et sa mise en pratique au quotidien.'
    },
    'AL MOUHTADOUNE': {
        symbole: '🧭',
        couleur: '#2196F3',
        signification: 'Les bien guidés',
        verset: {
            arabe: 'وَالَّذِينَ اهْتَدَوْا زَادَهُمْ هُدًى وَآتَاهُمْ تَقْوَاهُمْ',
            traduction: 'Quant à ceux qui se sont guidés, Il a accru leur guidance et leur a inspiré leur piété',
            reference: 'Sourate Muhammad (47:17)'
        },
        description: 'Al Mouhtadoune représente ceux qui marchent sur le droit chemin. Elle incarne la recherche de la vérité et la persévérance dans la guidance divine.'
    },
    'AL MOUDJAHIDOUNE': {
        symbole: '⚔️',
        couleur: '#F44336',
        signification: 'Les soldats',
        verset: {
            arabe: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا',
            traduction: 'Et quant à ceux qui luttent pour Notre cause, Nous les guiderons certes sur Nos sentiers',
            reference: 'Sourate Al-Ankabut (29:69)'
        },
        description: 'Al Moudjahidoune désigne les soldats qui luttent pour l\'excellence dans la voie d\'Allah. Elle symbolise le courage, l\'effort (jihad an-nafs) et la détermination.'
    },
    'AS SORBIROUNE': {
        symbole: '⏳',
        couleur: '#FF9800',
        signification: 'Les patients',
        verset: {
            arabe: 'وَبَشِّرِ الصَّابِرِينَ',
            traduction: 'Et annonce la bonne nouvelle aux endurants',
            reference: 'Sourate Al-Baqara (2:155)'
        },
        description: 'As Sorbiroune représente les patients et les endurants. Cette équipe incarne la résilience face aux épreuves et la constance dans l\'adoration.'
    },
    'ASH-SHAKIROUNE': {
        symbole: '🙌',
        couleur: '#FFEB3B',
        signification: 'Ceux qui sont reconnaissants',
        verset: {
            arabe: 'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
            traduction: 'Si vous êtes reconnaissants, J\'augmenterai certainement Mes bienfaits pour vous',
            reference: 'Sourate Ibrahim (14:7)'
        },
        description: 'Ash-Shakiroune désigne ceux qui pratiquent la gratitude infinie envers Allah. Elle symbolise le contentement et la reconnaissance des bienfaits divins.'
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    await loadEquipeDetails();
    initThreeJsAnimation();
});

/**
 * Initialiser l'animation Three.js dans le header
 */
function initThreeJsAnimation() {
    const canvas = document.getElementById('headerCanvas');
    if (!canvas || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Créer des étoiles/particules
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Créer un tore géométrique
    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    camera.position.z = 5;

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        // Rotation du tore
        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;

        // Rotation des particules
        particlesMesh.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

    animate();

    // Responsive
    window.addEventListener('resize', () => {
        if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
}

/**
 * Charger les détails de l'équipe
 */
async function loadEquipeDetails() {
    // Récupérer le nom de l'équipe depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const equipeNom = urlParams.get('equipe');

    if (!equipeNom) {
        showError('Aucune equipe specifiee');
        return;
    }

    const equipeInfo = EQUIPES_INFO[equipeNom];

    if (!equipeInfo) {
        showError('Equipe introuvable');
        return;
    }

    try {
        // Appliquer la couleur de l'équipe au conteneur principal ou au body
        document.documentElement.style.setProperty('--team-color', equipeInfo.couleur);

        // Récupérer les données de l'équipe depuis l'API
        const response = await fetch('/api/equipes/public/validated');
        const result = await response.json();

        let equipeData = null;
        if (result.success && result.data) {
            equipeData = result.data.find(eq => eq.nom === equipeNom);
        }

        // Afficher le header
        displayEquipeHeader(equipeNom, equipeInfo, equipeData);

        // Afficher le verset
        displayEquipeVerset(equipeInfo);

        // Afficher la description
        displayEquipeDescription(equipeInfo);

        if (equipeData && equipeData.nb_membres > 0) {
            // Équipe validée - charger les membres
            await loadEquipeMembres(equipeNom, equipeData);
        } else {
            // Équipe non constituée
            showPendingMessage();
        }

    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        showError('Erreur lors du chargement des donnees');
    }
}

/**
 * Afficher le header de l'équipe
 */
function displayEquipeHeader(nom, info, data) {
    const header = document.getElementById('equipeHeader');
    header.style.setProperty('--team-color', info.couleur);

    const nbMembres = data ? data.nb_membres : 0;
    const statut = data && nbMembres > 0 ? 'Constituée' : 'En formation';

    header.innerHTML = `
        <div class="equipe-header-content">
            <div class="equipe-symbole-large">${info.symbole}</div>
            <div class="equipe-header-info">
                <h1>${nom}</h1>
                <p class="equipe-signification">${info.signification}</p>
                <div class="equipe-stats">
                    <div class="stat-badge">
                        <strong>${nbMembres}</strong>
                        <span>Membre${nbMembres > 1 ? 's' : ''}</span>
                    </div>
                    <div class="stat-badge">
                        <span>${statut}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Afficher le verset de l'équipe
 */
function displayEquipeVerset(info) {
    const versetSection = document.getElementById('equipeVerset');
    versetSection.style.setProperty('--team-color', info.couleur);

    if (info.verset) {
        versetSection.innerHTML = `
            <div class="verset-icon">📖</div>
            <p class="verset-arabe">${info.verset.arabe}</p>
            <p class="verset-traduction">"${info.verset.traduction}"</p>
            <p class="verset-reference">${info.verset.reference}</p>
        `;
    } else if (info.slogan) {
        versetSection.innerHTML = `
            <p class="equipe-slogan">"${info.slogan}"</p>
        `;
    }
}

/**
 * Afficher la description de l'équipe
 */
function displayEquipeDescription(info) {
    const descSection = document.getElementById('equipeDescription');

    descSection.innerHTML = `
        <h2>À propos de l'équipe</h2>
        <p>${info.description}</p>
    `;
}

/**
 * Charger les membres de l'équipe
 */
async function loadEquipeMembres(equipeNom, equipeData) {
    try {
        // Récupérer les détails complets de l'équipe avec ses membres
        const response = await fetch(`/api/equipes/public/${equipeNom}/membres`);
        const result = await response.json();

        if (!result.success || !result.data) {
            throw new Error('Impossible de charger les membres');
        }

        const membres = result.data.membres || [];
        const capitaine = equipeData.capitaine;

        // Afficher le capitaine
        if (capitaine) {
            displayCapitaine(capitaine);
        }

        // Afficher les membres
        displayMembres(membres, capitaine);

    } catch (error) {
        console.error('Erreur chargement membres:', error);
        // Afficher quand même la section avec le capitaine si disponible
        if (equipeData.capitaine) {
            displayCapitaine(equipeData.capitaine);
        }
        document.getElementById('membresList').innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: #718096;">
                Impossible de charger la liste complète des membres
            </p>
        `;
    }
}

/**
 * Afficher le capitaine
 */
function displayCapitaine(capitaine) {
    const section = document.getElementById('capitaineSection');
    const initiales = getInitiales(capitaine.prenom, capitaine.nom);

    section.innerHTML = `
        <h2>Capitaine de l'équipe</h2>
        <div class="capitaine-card">
            <div class="capitaine-avatar">${initiales}</div>
            <div class="capitaine-info">
                <h3>${capitaine.prenom} ${capitaine.nom}</h3>
                <p><strong>Établissement:</strong> ${capitaine.etablissement}</p>
                <div style="margin-top: 1rem;">
                    <span class="capitaine-badge">CAPITAINE</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Afficher les membres
 */
function displayMembres(membres, capitaine) {
    const membresList = document.getElementById('membresList');

    if (membres.length === 0) {
        membresList.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: #718096;">
                Aucun membre disponible
            </p>
        `;
        return;
    }

    membresList.innerHTML = membres.map(membre => {
        const isCapitaine = capitaine && membre.nom === capitaine.nom && membre.prenom === capitaine.prenom;
        const initiales = getInitiales(membre.prenom, membre.nom);

        return `
            <div class="membre-card ${isCapitaine ? 'is-capitaine' : ''}">
                <div class="membre-header">
                    <div class="membre-avatar">${initiales}</div>
                    <div class="membre-name">
                        <h3>${membre.prenom} ${membre.nom}</h3>
                        <span class="membre-role">${isCapitaine ? 'CAPITAINE' : 'MEMBRE'}</span>
                    </div>
                </div>
                <div class="membre-info">
                    <p><strong>Établissement:</strong> ${membre.etablissement}</p>
                    ${membre.niveau_coranique ? `<p><strong>Niveau Coranique:</strong> ${membre.niveau_coranique}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}


/**
 * Afficher le message d'équipe en attente
 */
function showPendingMessage() {
    document.getElementById('capitaineSection').style.display = 'none';
    document.getElementById('membresSection').style.display = 'none';
    document.getElementById('equipePending').style.display = 'block';
}

/**
 * Obtenir les initiales
 */
function getInitiales(prenom, nom) {
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
}

/**
 * Afficher une erreur
 */
function showError(message) {
    document.querySelector('main .container').innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2 style="color: #e53e3e; margin-bottom: 1rem;">❌ ${message}</h2>
            <a href="/index.html#equipes" class="btn-primary">Retour aux equipes</a>
        </div>
    `;
}
