// ============================================
// PAGE DETAILS EQUIPE - AL ILM 2026
// ============================================

// Données des équipes avec leurs informations complètes
const EQUIPES_INFO = {
    'AL-FURQAN': {
        symbole: '⚖️',
        couleur: '#FF5733',
        signification: 'Le discernement',
        verset: {
            arabe: 'تَبَارَكَ الَّذِي نَزَّلَ الْفُرْقَانَ عَلَىٰ عَبْدِهِ',
            traduction: 'Béni soit Celui qui a fait descendre le Furqan (le Critère) sur Son serviteur',
            reference: 'Sourate Al-Furqan (25:1)'
        },
        description: 'Al-Furqan signifie "Le Discernement" ou "Le Critère". C\'est le nom donné au Coran car il distingue le vrai du faux, la guidance de l\'égarement. Cette équipe incarne la sagesse, la clarté de jugement et la capacité à différencier le bien du mal à travers la lumière du Coran.'
    },
    'AS-SABIQUN': {
        symbole: '🏃',
        couleur: '#3498DB',
        signification: 'Les devanciers',
        verset: {
            arabe: 'وَالسَّابِقُونَ السَّابِقُونَ * أُولَٰئِكَ الْمُقَرَّبُونَ',
            traduction: 'Les premiers (à suivre les ordres d\'Allah sur la terre) ce sont eux qui seront les premiers (dans l\'au-delà). Ce sont ceux-là les plus rapprochés d\'Allah',
            reference: 'Sourate Al-Waqi\'a (56:10-11)'
        },
        description: 'As-Sabiqun désigne les devanciers, ceux qui sont les premiers à répondre à l\'appel d\'Allah. Cette équipe représente l\'excellence, l\'empressement dans le bien et la course vers les bonnes actions. Elle incarne l\'esprit de compétition positive dans la foi et les œuvres pieuses.'
    },
    'AL-MUJAHIDUN': {
        symbole: '⚔️',
        couleur: '#28A745',
        signification: 'Les combattants',
        verset: {
            arabe: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا',
            traduction: 'Et quant à ceux qui luttent pour Notre cause, Nous les guiderons certes sur Nos sentiers',
            reference: 'Sourate Al-Ankabut (29:69)'
        },
        description: 'Al-Mujahidun représente les combattants dans la voie d\'Allah. Cette équipe symbolise la persévérance, l\'effort constant (Jihad an-Nafs) contre ses propres passions et la lutte pour l\'acquisition du savoir islamique. Elle incarne la détermination et le courage dans la quête de la vérité.'
    },
    'AN-NUR': {
        symbole: '💡',
        couleur: '#FFD700',
        signification: 'La lumière',
        verset: {
            arabe: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
            traduction: 'Allah est la Lumière des cieux et de la terre',
            reference: 'Sourate An-Nur (24:35)'
        },
        description: 'An-Nur signifie "La Lumière". Cette équipe représente l\'illumination spirituelle et intellectuelle que procure le savoir islamique. Comme la lumière dissipe les ténèbres, cette équipe aspire à éclairer les esprits par la connaissance authentique du Coran et de la Sunna.'
    },
    'AL-HUDA': {
        symbole: '🧭',
        couleur: '#9B59B6',
        signification: 'La guidance',
        verset: {
            arabe: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ',
            traduction: 'C\'est le Livre au sujet duquel il n\'y a aucun doute, c\'est un guide pour les pieux',
            reference: 'Sourate Al-Baqara (2:2)'
        },
        description: 'Al-Huda désigne la guidance divine. Cette équipe symbolise la direction et l\'orientation vers le droit chemin. Elle représente ceux qui recherchent constamment la guidance d\'Allah et s\'efforcent de suivre le chemin tracé par le Prophète Muhammad (paix et bénédictions sur lui).'
    },
    'AL-BADR': {
        symbole: '🌕',
        couleur: '#E74C3C',
        signification: 'La pleine lune',
        verset: {
            arabe: 'وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ',
            traduction: 'Et la lune, Nous lui avons déterminé des phases',
            reference: 'Sourate Ya-Sin (36:39)'
        },
        description: 'Al-Badr fait référence à la pleine lune et rappelle la célèbre bataille de Badr. Cette équipe symbolise la brillance, la victoire et l\'accomplissement parfait. Comme la pleine lune illumine la nuit, cette équipe aspire à rayonner par ses connaissances et sa pratique de l\'Islam.'
    },
    'AL-FIRDAWS': {
        symbole: '🌴',
        couleur: '#1ABC9C',
        signification: 'Le paradis',
        verset: {
            arabe: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ كَانَتْ لَهُمْ جَنَّاتُ الْفِرْدَوْسِ نُزُلًا',
            traduction: 'Ceux qui croient et font de bonnes œuvres auront pour résidence les Jardins du Firdaws (Paradis)',
            reference: 'Sourate Al-Kahf (18:107)'
        },
        description: 'Al-Firdaws désigne le plus haut degré du Paradis. Cette équipe représente l\'aspiration à l\'excellence et à la perfection dans la foi et les actions. Elle incarne le désir de viser toujours plus haut dans l\'adoration et la connaissance d\'Allah.'
    },
    'AL-MUFLIHUN': {
        symbole: '🎯',
        couleur: '#F39C12',
        signification: 'Les bienheureux',
        verset: {
            arabe: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ',
            traduction: 'Bienheureux sont certes les croyants',
            reference: 'Sourate Al-Mu\'minun (23:1)'
        },
        description: 'Al-Muflihun signifie "Les Bienheureux" ou "Ceux qui réussissent". Cette équipe symbolise la réussite véritable, celle qui combine succès dans cette vie et dans l\'au-delà. Elle représente ceux qui ont atteint le vrai bonheur par la foi et les bonnes œuvres.'
    },
    'AS-SADIQUN': {
        symbole: '🤝',
        couleur: '#34495E',
        signification: 'Les véridiques',
        verset: {
            arabe: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ',
            traduction: 'Ô vous qui avez cru ! Craignez Allah et soyez avec les véridiques',
            reference: 'Sourate At-Tawba (9:119)'
        },
        description: 'As-Sadiqun désigne les véridiques, ceux qui sont sincères dans leur foi et leurs paroles. Cette équipe représente l\'honnêteté, l\'intégrité et la sincérité dans tous les aspects de la vie islamique. Elle incarne la noblesse de caractère et la droiture.'
    },
    'AL-IMAN': {
        symbole: '🕋',
        couleur: '#8E44AD',
        signification: 'La foi',
        verset: {
            arabe: 'وَلَٰكِنَّ اللَّهَ حَبَّبَ إِلَيْكُمُ الْإِيمَانَ وَزَيَّنَهُ فِي قُلُوبِكُمْ',
            traduction: 'Mais Allah vous a fait aimer la foi et l\'a embellie dans vos cœurs',
            reference: 'Sourate Al-Hujurat (49:7)'
        },
        description: 'Al-Iman signifie "La Foi", pilier fondamental de l\'Islam. Cette équipe représente la conviction profonde, la croyance ferme en Allah et en Ses enseignements. Elle symbolise l\'ancrage spirituel et la force que procure une foi solide et éclairée.'
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
    
    const nbMembres = data ? data.nb_membres : 0;
    const statut = data && nbMembres > 0 ? 'Constituee' : 'En formation';
    
    header.innerHTML = `
        <div class="equipe-header-content">
            <div class="equipe-symbole-large">${info.symbole}</div>
            <div class="equipe-header-info">
                <h1>${nom}</h1>
                <p class="equipe-signification">${info.signification}</p>
                <div class="equipe-stats">
                    <div class="stat-badge">
                        <span>👥</span>
                        <strong>${nbMembres}</strong>
                        <span>membre${nbMembres > 1 ? 's' : ''}</span>
                    </div>
                    <div class="stat-badge">
                        <span>${statut === 'Constituee' ? '✅' : '⏳'}</span>
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
        <h2>A propos de l'equipe</h2>
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
                Impossible de charger la liste complete des membres
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
        <h2>👑 Capitaine de l'equipe</h2>
        <div class="capitaine-card">
            <div class="capitaine-avatar">${initiales}</div>
            <div class="capitaine-info">
                <h3>${capitaine.prenom} ${capitaine.nom}</h3>
                <p><strong>Etablissement:</strong> ${capitaine.etablissement}</p>
                <span class="capitaine-badge">CAPITAINE</span>
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
                    <p><strong>📚</strong> ${membre.etablissement}</p>
                    ${membre.niveau_coranique ? `<p><strong>📖</strong> Niveau: ${membre.niveau_coranique}</p>` : ''}
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
