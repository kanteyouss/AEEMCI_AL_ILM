// ============================================
// GESTION DES RÉSULTATS - AL ILM 2026
// ============================================

let manchesParEtape = [];
let classement = [];
let notationsData = {};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🏆 Initialisation page résultats');

    // Vérifier l'authentification (profonde)
    // const isAuthenticated = await checkAuth();
    // const user = getUser();

    // if (!isAuthenticated || !user || user.role !== 'admin') {
    //     window.location.href = '/login.html';
    //     return;
    // }

    // Authentification facultative (Mode ouvert)
    // await checkAuth();
    // if (!getAuthToken()) window.location.href = '/login.html';
    const user = getUser() || { prenom: 'Admin', nom: 'Public', role: 'admin' };

    // Charger les données utilisateur
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

    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await logout();
    });

    // Charger les données
    await loadAllData();
});

// ============================================
// CHARGEMENT DES DONNÉES
// ============================================

async function loadAllData() {
    try {
        showNotification('📊 Chargement des données...', 'info');

        // Charger les manches groupées par étape
        const manchesRes = await apiRequest('/manches/par-etape');
        manchesParEtape = manchesRes.data || [];

        // Charger les notations pour chaque manche
        for (const etape of manchesParEtape) {
            for (const manche of etape.manches) {
                const notations = await apiRequest(`/notation/manche/${manche.id}`);
                notationsData[manche.id] = notations.data || [];
            }
        }

        // Charger la configuration d'affichage public
        await chargerConfiguration();

        // Afficher les données
        displayEtapes();
        await renderEliminationGrid();

        showNotification('✅ Données chargées', 'success');

    } catch (error) {
        console.error('❌ Erreur chargement:', error);
        showNotification('❌ Erreur de chargement', 'error');
    }
}

// ============================================
// AFFICHAGE STATISTIQUES
// ============================================

function displayStats() {
    const totalEquipes = classement.length;
    const totalManches = manches.length;

    let totalNotations = 0;
    let notationsCompletes = 0;

    Object.values(notationsData).forEach(notations => {
        totalNotations += notations.length;
    });

    // Calculer les notations attendues (nombre d'équipes × manches × rubriques)
    const rubriquesParManche = 9; // AL ILM a 9 rubriques
    const notationsAttendues = totalEquipes * totalManches * rubriquesParManche;
    const completionPercent = notationsAttendues > 0 ? (totalNotations / notationsAttendues * 100) : 0;

    // Mettre à jour la barre de progression
    document.getElementById('progressFill').style.width = `${completionPercent}%`;
    document.getElementById('progressPercent').textContent = `${Math.round(completionPercent)}%`;
    document.getElementById('progressText').textContent = `${totalNotations}/${notationsAttendues} notations`;

    // Afficher les stats
    const container = document.getElementById('statsSummary');
    container.innerHTML = `
        <div class="stat-box">
            <div class="value">${totalEquipes}</div>
            <div class="label">Équipes</div>
        </div>
        <div class="stat-box">
            <div class="value">${totalManches}</div>
            <div class="label">Manches</div>
        </div>
        <div class="stat-box">
            <div class="value">${totalNotations}</div>
            <div class="label">Notations</div>
        </div>
        <div class="stat-box">
            <div class="value">${Math.round(completionPercent)}%</div>
            <div class="label">Complété</div>
        </div>
    `;
}

// ============================================
// AFFICHAGE MANCHES
// ============================================

// ============================================
// AFFICHAGE DES ÉTAPES
// ============================================

function displayEtapes() {
    const container = document.getElementById('etapesContainer');

    if (!container) {
        console.error('Container etapesContainer introuvable');
        return;
    }

    if (manchesParEtape.length === 0) {
        container.innerHTML = `
            <p style="color: #6b7280; text-align: center; padding: 2rem;">
                Aucune manche créée. Allez dans le Dashboard pour créer des manches.
            </p>
        `;
        return;
    }

    const etapeIcons = {
        preliminaire: '🎯',
        quart: '⚡',
        demi: '🔥',
        finale: '👑'
    };

    container.innerHTML = manchesParEtape.map(etape => {
        const totalManches = etape.manches.length;
        let totalNotations = 0;

        etape.manches.forEach(manche => {
            const notations = notationsData[manche.id] || [];
            totalNotations += notations.length;
        });

        // Une étape est considérée complète si elle a au moins une notation
        const isEtapeComplete = totalNotations > 0;
        const icon = etapeIcons[etape.code] || '';

        return `
            <section style="margin-bottom: 3rem;">
                <h2 style="margin-bottom: 1.5rem;">${icon} ${etape.nom}</h2>
                
                <!-- Manches de l'étape -->
                <div class="results-grid">
                    ${etape.manches.map(manche => {
            const notations = notationsData[manche.id] || [];
            const equipes = manche.nombre_equipes || 0;
            const rubriques = manche.nombre_rubriques || 0;
            const notationsAttendues = equipes * rubriques;
            const isMancheComplete = notations.length >= notationsAttendues && notationsAttendues > 0;

            return `
                            <div class="result-card">
                                <h3>
                                    <span></span>
                                    ${manche.nom || `Manche ${manche.numero}`}
                                </h3>
                                <p style="color: #6b7280; font-size: 0.9rem; margin: 0.5rem 0;">
                                    ${new Date(manche.date_manche).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })}
                                </p>
                                
                                <div class="verification-list" style="margin: 1rem 0;">
                                    <div class="verification-item ${manche.nombre_equipes > 0 ? 'ok' : 'error'}">
                                        ${manche.nombre_equipes || 0} équipe(s) inscrites
                                    </div>
                                    <div class="verification-item ${manche.nombre_rubriques > 0 ? 'ok' : 'error'}">
                                        ${manche.nombre_rubriques || 0} rubrique(s) configurées
                                    </div>
                                    <div class="verification-item ${isMancheComplete ? 'ok' : 'error'}">
                                        ${notations.length}/${notationsAttendues} notations
                                    </div>
                                </div>
                                
                                <div class="actions-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                                    <button class="btn-publish btn-preview" onclick="previewManche(${manche.id})" style="grid-column: span 2;">
                                        👁️ Voir Classement
                                    </button>
                                    <button class="btn-publish" onclick="exportManche(${manche.id}, 'excel')" style="background: #27ae60; font-size: 0.8rem; padding: 0.5rem;">
                                        <i class="fas fa-file-excel"></i> Excel
                                    </button>
                                    <button class="btn-publish" onclick="exportManche(${manche.id}, 'pdf')" style="background: #e74c3c; font-size: 0.8rem; padding: 0.5rem;">
                                        <i class="fas fa-file-pdf"></i> PDF
                                    </button>
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
                
                <!-- Classement cumulé de l'étape -->
                <div class="result-card" style="margin-top: 1.5rem; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);">
                    <h3>
                        <span></span>
                        Classement ${etape.nom}
                    </h3>
                    <p style="color: #6b7280; margin-bottom: 1rem;">
                        Résultat cumulé des ${totalManches} manche(s) de cette étape
                    </p>
                    
                    <div class="verification-list" style="margin: 1rem 0;">
                        <div class="verification-item ${totalNotations > 0 ? 'ok' : 'error'}">
                            ${totalNotations} notation(s) enregistrée(s)
                        </div>
                        <div class="verification-item ${isEtapeComplete ? 'ok' : 'warning'}">
                            ${isEtapeComplete ? 'Étape complète' : 'Notations en cours'}
                        </div>
                    </div>
                    
                    <div class="actions-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.8rem;">
                        <button class="btn-publish btn-preview" onclick="previewEtape('${etape.code}')">
                            👁️ Prévisualiser
                        </button>
                        <button class="btn-publish" onclick="publierEtape('${etape.code}')" ${!isEtapeComplete ? 'disabled' : ''}>
                            🌐 Publier ${etape.nom}
                        </button>
                        <button class="btn-publish" onclick="exportEtape('${etape.code}', 'excel')" style="background: #27ae60;">
                            <i class="fas fa-file-excel"></i> Excel
                        </button>
                        <button class="btn-publish" onclick="exportEtape('${etape.code}', 'pdf')" style="background: #e74c3c;">
                            <i class="fas fa-file-pdf"></i> PDF
                        </button>
                    </div>
                    
                    <div id="preview-${etape.code}" style="display: none; margin-top: 1.5rem;"></div>
                </div>
            </section>
        `;
    }).join('');
}

// ============================================
// FONCTIONS DE PRÉVISUALISATION ET PUBLICATION
// ============================================

async function previewManche(mancheId) {
    try {
        const response = await apiRequest(`/classement/manche/${mancheId}`);
        // Le backend renvoie 'classement', pas 'data'
        const results = response.classement || [];

        if (results.length === 0) {
            showNotification(' Aucun résultat pour cette manche', 'warning');
            return;
        }

        // Trouver le nom de la manche pour le titre
        let mancheName = `Manche ${mancheId}`;
        for (const etape of manchesParEtape) {
            const manche = etape.manches.find(m => m.id === mancheId);
            if (manche) {
                mancheName = `${manche.nom || `Manche ${manche.numero}`}`;
                break;
            }
        }

        showClassementModal(
            `Résultats - ${mancheName}`,
            results
        );

    } catch (error) {
        console.error(' Erreur prévisualisation manche:', error);
        showNotification(' Erreur lors du chargement du classement', 'error');
    }
}

async function previewEtape(etapeCode) {
    try {
        const response = await apiRequest(`/classement/etape/${etapeCode}`);
        const classement = response.classement || [];

        const etapeNom = manchesParEtape.find(e => e.code === etapeCode)?.nom || etapeCode;
        showClassementModal(etapeNom, classement);
    } catch (error) {
        console.error('Erreur prévisualisation étape:', error);
        showNotification(' Erreur lors de la prévisualisation', 'error');
    }
}

function showClassementModal(titre, classement) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
    `;

    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; max-width: 900px; width: 100%; max-height: 85vh; overflow-y: auto; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); animation: modalFadeIn 0.3s ease-out;">
            <style>
                @keyframes modalFadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .classement-header th {
                    background: linear-gradient(135deg, var(--primary-color) 0%, #1e4620 100%);
                    color: white;
                    padding: 1rem 0.75rem;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 0.05em;
                    border-bottom: 3px solid var(--secondary-color);
                }
            </style>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem;">
                <h2 style="margin: 0; color: var(--primary-color); font-weight: 800; display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 1.5rem;">📊</span> ${titre}
                </h2>
                <button onclick="this.closest('div[style*=fixed]').remove()" style="background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;">&times;</button>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden;">
                <thead>
                    <tr class="classement-header">
                        <th style="text-align: center; width: 80px;">Rang</th>
                        <th style="text-align: left;">Équipe</th>
                        <th style="text-align: center;">Score Total</th>
                        <th style="text-align: center;">Manches</th>
                        <th style="text-align: center;">Moyenne</th>
                    </tr>
                </thead>
                <tbody>
                    ${classement.map((equipe, index) => {
        // Gérer les différents formats d'API (manche vs étape)
        const equipeNom = equipe.nom_equipe || equipe.equipe || 'Équipe inconnue';
        const score = equipe.score_total || equipe.points_totaux || 0;
        const scoreNum = parseFloat(score) || 0;
        const nombreManches = equipe.nombre_manches || 1;

        const position = index + 1;
        const moyenne = nombreManches > 0
            ? (scoreNum / nombreManches).toFixed(1)
            : '0.0';
        const bgColor = position <= 3 ?
            (position === 1 ? '#fef3c7' : position === 2 ? '#e5e7eb' : '#fed7aa')
            : 'white';

        return `
                            <tr style="background: ${bgColor}; border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 0.75rem; text-align: center; font-weight: bold; font-size: 1.2rem;">
                                    ${position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : position}
                                </td>
                                <td style="padding: 0.75rem;">
                                    <strong>${equipeNom}</strong>
                                </td>
                                <td style="padding: 0.75rem; text-align: center; font-weight: bold; font-size: 1.1rem; color: var(--primary-color);">
                                    ${scoreNum.toFixed(1)}
                                </td>
                                <td style="padding: 0.75rem; text-align: center;">
                                    ${nombreManches}
                                </td>
                                <td style="padding: 0.75rem; text-align: center;">
                                    ${moyenne}
                                </td>
                            </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
        </div>
    `;

    document.body.appendChild(modal);
}

async function publierEtape(etapeCode) {
    const etapeNom = manchesParEtape.find(e => e.code === etapeCode)?.nom || etapeCode;

    if (!confirm(`Voulez-vous publier les résultats de "${etapeNom}" sur la page publique ?`)) {
        return;
    }

    try {
        // Mettre à jour la config pour afficher cette étape
        await apiRequest('/classement-config/batch', {
            method: 'PUT',
            body: JSON.stringify({
                classement_publie: true,
                etape_publiee: etapeCode,
                derniere_publication: new Date().toISOString()
            })
        });

        showNotification(` ${etapeNom} publiée !`, 'success');
    } catch (error) {
        console.error('Erreur publication:', error);
        showNotification(' Erreur lors de la publication', 'error');
    }
}

async function exportEtape(etapeCode, format = 'excel') {
    try {
        showNotification(` Préparation de l'export ${format.toUpperCase()} détaillé...`, 'info');
        const response = await apiRequest(`/classement/etape/${etapeCode}`);
        const classement = response.classement || [];
        const rubriquesList = response.rubriques || [];

        if (classement.length === 0) {
            showNotification(' Aucun résultat à exporter', 'warning');
            return;
        }

        const etapeNom = manchesParEtape.find(e => e.code === etapeCode)?.nom || etapeCode;
        const fileName = `AL_ILM_2026_Classement_${etapeNom.replace(/\s+/g, '_')}`;

        if (format === 'excel') {
            exportDetailedToExcel(classement, rubriquesList, fileName, `Classement ${etapeNom}`);
        } else {
            exportDetailedToPDF(classement, rubriquesList, fileName, `CLASSEMENT ${etapeNom.toUpperCase()}`);
        }
    } catch (error) {
        console.error('Erreur export étape:', error);
        showNotification(' Erreur lors de l\'export', 'error');
    }
}

async function exportManche(mancheId, format = 'excel') {
    try {
        showNotification(`Préparation de l'export ${format.toUpperCase()} détaillé...`, 'info');
        const response = await apiRequest(`/classement/manche/${mancheId}`);
        const classement = response.classement || [];
        const rubriquesList = response.rubriques || [];

        if (classement.length === 0) {
            showNotification(' Aucun résultat à exporter', 'warning');
            return;
        }

        // Trouver le nom de la manche
        let mancheNom = `Manche_${mancheId}`;
        for (const etape of manchesParEtape) {
            const m = etape.manches.find(manche => manche.id === parseInt(mancheId));
            if (m) {
                mancheNom = (m.nom || `Manche_${m.numero}`).replace(/\s+/g, '_');
                break;
            }
        }

        const fileName = `AL_ILM_2026_${mancheNom}`;

        if (format === 'excel') {
            exportDetailedToExcel(classement, rubriquesList, fileName, `Résultats ${mancheNom.replace(/_/g, ' ')}`);
        } else {
            exportDetailedToPDF(classement, rubriquesList, fileName, `RÉSULTATS ${mancheNom.replace(/_/g, ' ').toUpperCase()}`);
        }
    } catch (error) {
        console.error('Erreur export manche:', error);
        showNotification(' Erreur lors de l\'export', 'error');
    }
}

async function exportClassementGlobal(format = 'excel') {
    try {
        showNotification(` Préparation de l'export GLOBAL ${format.toUpperCase()}...`, 'info');
        const response = await apiRequest('/classement/general');
        const classement = response.classement || [];

        if (classement.length === 0) {
            showNotification(' Aucun résultat à exporter', 'warning');
            return;
        }

        const fileName = `AL_ILM_2026_Classement_GENERAL`;

        if (format === 'excel') {
            exportToExcel(classement, fileName, 'Classement Général AL ILM 2026');
        } else {
            exportToPDF(classement, fileName, 'CLASSEMENT GÉNÉRAL - AL ILM 2026');
        }
    } catch (error) {
        console.error('Erreur export global:', error);
        showNotification(' Erreur lors de l\'export', 'error');
    }
}

/**
 * UTILS EXPORT DÉTAILLÉ (AVEC RUBRIQUES)
 */
function exportDetailedToExcel(data, rubriques, fileName, sheetName) {
    const formattedData = data.map((item, index) => {
        const row = {
            'Rang': index + 1,
            'Équipe': item.nom_equipe || item.equipe || 'N/A'
        };

        // Ajouter chaque rubrique
        rubriques.forEach(r => {
            const score = item.details_rubriques ? (item.details_rubriques[r.nom] || 0) : 0;
            row[`${r.nom} (max ${r.points_max})`] = score;
        });

        row['Score Total'] = parseFloat(item.score_total || item.points_totaux || 0).toFixed(1);
        return row;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Résultats Détaillés");
    XLSX.writeFile(wb, `${fileName}_Detail_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('Export Excel détaillé réussi', 'success');
}

function exportDetailedToPDF(data, rubriques, fileName, title) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // Paysage pour plus de colonnes

    doc.setFontSize(18);
    doc.setTextColor(45, 106, 79);
    doc.text(title, 148, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`AL ILM 2026 - Résultats Détaillés | Généré le: ${new Date().toLocaleString()}`, 148, 28, { align: 'center' });

    // Colonnes dynamiques
    const columns = [
        { header: 'Rang', dataKey: 'rang' },
        { header: 'Équipe', dataKey: 'equipe' }
    ];

    rubriques.forEach(r => {
        columns.push({ header: r.nom, dataKey: r.nom });
    });

    columns.push({ header: 'TOTAL', dataKey: 'total' });

    const rows = data.map((item, index) => {
        const rowData = {
            rang: index + 1,
            equipe: item.nom_equipe || item.equipe || 'N/A',
            total: parseFloat(item.score_total || item.points_totaux || 0).toFixed(1)
        };

        rubriques.forEach(r => {
            rowData[r.nom] = item.details_rubriques ? (item.details_rubriques[r.nom] || 0) : 0;
        });

        return rowData;
    });

    doc.autoTable({
        columns: columns,
        body: rows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [45, 106, 79] },
        styles: { fontSize: 8, cellPadding: 2 }
    });

    doc.save(`${fileName}_Detail_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification('Export PDF détaillé réussi', 'success');
}

/**
 * Utilitaires d'export génériques
 */
function exportToExcel(data, fileName, sheetName) {
    const formattedData = data.map((item, index) => {
        const score = parseFloat(item.score_total || item.points_totaux || 0);
        const nManches = parseInt(item.nombre_manches || 0);
        return {
            'Rang': index + 1,
            'Équipe': item.nom_equipe || item.equipe || 'N/A',
            'Score Total': score.toFixed(1),
            'Manches': nManches,
            'Moyenne (/20)': nManches > 0 ? ((score / nManches) / 5).toFixed(2) : "0.00"
        };
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Résultats");
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification(' Export Excel réussi', 'success');
}

function exportToPDF(data, fileName, title) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(45, 106, 79);
    doc.text(title, 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`AL ILM 2026 - Administration | Généré le: ${new Date().toLocaleString()}`, 105, 28, { align: 'center' });

    const columns = [
        { header: 'Rang', dataKey: 'rang' },
        { header: 'Équipe', dataKey: 'equipe' },
        { header: 'Score Total', dataKey: 'score' },
        { header: 'Manches', dataKey: 'manches' },
        { header: 'Moyenne (/20)', dataKey: 'moyenne' }
    ];

    const rows = data.map((item, index) => {
        const score = parseFloat(item.score_total || item.points_totaux || 0);
        const nManches = parseInt(item.nombre_manches || 0);
        return {
            rang: index + 1,
            equipe: item.nom_equipe || item.equipe || 'N/A',
            score: score.toFixed(1),
            manches: nManches,
            moyenne: nManches > 0 ? ((score / nManches) / 5).toFixed(2) : "0.00"
        };
    });

    doc.autoTable({
        columns: columns,
        body: rows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [45, 106, 79] },
        styles: { fontSize: 10 }
    });

    doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotification(' Export PDF réussi', 'success');
}

function displayManches() {
    // Fonction supprimée - remplacée par displayEtapes()
}

function getMancheIcon(type) {
    const icons = {
        'preliminaire': '🎯',
        'quart': '⚡',
        'demi': '🔥',
        'finale': '👑'
    };
    return icons[type] || '📅';
}

function displayClassementStatus() {
    // Fonction supprimée - intégrée dans displayEtapes()
}

function displayFinalVerification() {
    // Fonction supprimée
}

// Les fonctions triées/fusionnées sont déplacées vers le haut pour éviter les écrasements

// ============================================
// EXPORT
// ============================================

// Export en développement

// ============================================
// UTILITAIRES
// ============================================

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    };

    const response = await fetch(`/api${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur API');
    }

    return response.json();
}

function showModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').innerHTML = message;

    const confirmBtn = document.getElementById('modalConfirm');
    confirmBtn.onclick = onConfirm || (() => closeModal());

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function showNotification(message, type = 'info') {
    // Supprimer les anciennes notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

// ============================================
// CONFIGURATION AFFICHAGE PUBLIC
// ============================================

// ...existing code...
async function chargerConfiguration() {
    try {
        const response = await apiRequest('/classement-config');
        const config = response.data;

        // Stocker la config pour usage ultérieur
        window.currentConfig = config;

        // Remplir les champs avec les valeurs actuelles
        document.getElementById('configAfficherPodium').checked = config.afficher_podium || false;
        if (document.getElementById('configFinRamadan')) {
            document.getElementById('configFinRamadan').checked = config.fin_ramadan || false;
        }
        if (document.getElementById('configModeAid')) {
            document.getElementById('configModeAid').checked = config.mode_aid || false;
        }
        document.getElementById('configAfficherStatistiques').checked = config.afficher_statistiques || false;
        document.getElementById('configAfficherFiltres').checked = config.afficher_filtres || false;
        document.getElementById('configAfficherClassementComplet').checked = config.afficher_classement_complet || false;

        // Message général (global)
        if (document.getElementById('configMessagePersonnalise'))
            document.getElementById('configMessagePersonnalise').value = config.message_personnalise || '';

        // Messages personnalisés par phase
        if (document.getElementById('configMessagePreliminaire'))
            document.getElementById('configMessagePreliminaire').value = config.message_preliminaire || '';
        if (document.getElementById('configMessageQuart'))
            document.getElementById('configMessageQuart').value = config.message_quart || '';
        if (document.getElementById('configMessageDemi'))
            document.getElementById('configMessageDemi').value = config.message_demi || '';
        if (document.getElementById('configMessageFinale'))
            document.getElementById('configMessageFinale').value = config.message_finale || '';

        // Configurations des phases
        if (document.getElementById('configAfficherPhasePreliminaire'))
            document.getElementById('configAfficherPhasePreliminaire').checked = config.afficher_phase_preliminaire !== false;
        if (document.getElementById('configAfficherPhaseQuart'))
            document.getElementById('configAfficherPhaseQuart').checked = config.afficher_phase_quart !== false;
        if (document.getElementById('configAfficherPhaseDemi'))
            document.getElementById('configAfficherPhaseDemi').checked = config.afficher_phase_demi !== false;
        if (document.getElementById('configAfficherPhaseFinale'))
            document.getElementById('configAfficherPhaseFinale').checked = config.afficher_phase_finale !== false;

        // Configurations de la navigation
        if (document.getElementById('configAfficherNavCalendrier'))
            document.getElementById('configAfficherNavCalendrier').checked = config.afficher_nav_calendrier !== false;
        if (document.getElementById('configAfficherNavClassement'))
            document.getElementById('configAfficherNavClassement').checked = config.afficher_nav_classement !== false;
        if (document.getElementById('configAfficherNavInscription'))
            document.getElementById('configAfficherNavInscription').checked = config.afficher_nav_inscription !== false;
        if (document.getElementById('configAfficherNavConnexion'))
            document.getElementById('configAfficherNavConnexion').checked = config.afficher_nav_connexion !== false;

        console.log(' Configuration chargée:', config);
    } catch (error) {
        console.error(' Erreur chargement configuration:', error);
        showNotification('Erreur lors du chargement de la configuration', 'error');
    }
}

async function sauvegarderConfiguration() {
    try {
        showNotification(' Sauvegarde de la configuration...', 'info');

        // Récupérer les valeurs des champs
        const config = {
            afficher_podium: document.getElementById('configAfficherPodium').checked,
            fin_ramadan: document.getElementById('configFinRamadan') ? document.getElementById('configFinRamadan').checked : false,
            mode_aid: document.getElementById('configModeAid') ? document.getElementById('configModeAid').checked : false,
            afficher_statistiques: document.getElementById('configAfficherStatistiques').checked,
            afficher_filtres: document.getElementById('configAfficherFiltres').checked,
            afficher_classement_complet: document.getElementById('configAfficherClassementComplet').checked,

            // Message général (global)
            message_personnalise: document.getElementById('configMessagePersonnalise').value.trim(),

            // Messages personnalisés par phase
            message_preliminaire: document.getElementById('configMessagePreliminaire').value.trim(),
            message_quart: document.getElementById('configMessageQuart').value.trim(),
            message_demi: document.getElementById('configMessageDemi').value.trim(),
            message_finale: document.getElementById('configMessageFinale').value.trim(),

            // Nouvelles configs de phases
            afficher_phase_preliminaire: document.getElementById('configAfficherPhasePreliminaire').checked,
            afficher_phase_quart: document.getElementById('configAfficherPhaseQuart').checked,
            afficher_phase_demi: document.getElementById('configAfficherPhaseDemi').checked,
            afficher_phase_finale: document.getElementById('configAfficherPhaseFinale').checked,

            // Nouvelles configs de navigation
            afficher_nav_calendrier: document.getElementById('configAfficherNavCalendrier').checked,
            afficher_nav_classement: document.getElementById('configAfficherNavClassement').checked,
            afficher_nav_inscription: document.getElementById('configAfficherNavInscription').checked,
            afficher_nav_connexion: document.getElementById('configAfficherNavConnexion').checked,

            // Éliminations
            equipes_eliminees: JSON.stringify(Array.from(document.querySelectorAll('.elimination-checkbox:checked')).map(cb => cb.value))
        };

        // Envoyer au serveur
        const response = await apiRequest('/classement-config/batch', {
            method: 'PUT',
            body: JSON.stringify(config)
        });

        if (response.success) {
            showNotification(' Configuration sauvegardée avec succès', 'success');
            console.log(' Configuration mise à jour:', config);
        } else {
            throw new Error(response.message || 'Erreur lors de la sauvegarde');
        }
    } catch (error) {
        console.error(' Erreur sauvegarde configuration:', error);
        showNotification(' Erreur lors de la sauvegarde: ' + error.message, 'error');
    }
}

// ============================================
// GESTION DES ÉLIMINATIONS
// ============================================

async function renderEliminationGrid() {
    const grid = document.getElementById('eliminationGrid');
    if (!grid) return;

    try {
        // Charger les équipes
        const response = await apiRequest('/equipes');
        const equipes = response.data || [];

        // Récupérer les éliminées depuis la config chargée
        let eliminees = [];
        try {
            eliminees = JSON.parse(window.currentConfig.equipes_eliminees || '[]');
        } catch (e) {
            console.error('Erreur parse equipes_eliminees:', e);
            eliminees = [];
        }

        if (equipes.length === 0) {
            grid.innerHTML = '<p style="color: #94a3b8;">Aucune équipe trouvée.</p>';
            return;
        }

        grid.innerHTML = equipes.map(eq => {
            const isEliminated = eliminees.includes(eq.nom);
            return `
                <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; background: ${isEliminated ? '#fff1f2' : 'white'};" class="elimination-item">
                    <input type="checkbox" 
                           class="elimination-checkbox" 
                           value="${eq.nom}" 
                           ${isEliminated ? 'checked' : ''}
                           onchange="this.parentElement.style.background = this.checked ? '#fff1f2' : 'white'; this.parentElement.querySelector('span').style.color = this.checked ? '#be123c' : '#1e293b'">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600; color: ${isEliminated ? '#be123c' : '#1e293b'}; transition: color 0.2s;">${eq.nom}</span>
                        <span style="font-size: 0.75rem; color: #64748b;">${eq.signification || ''}</span>
                    </div>
                </label>
            `;
        }).join('');

    } catch (error) {
        console.error('Erreur renderEliminationGrid:', error);
        grid.innerHTML = '<p style="color: #ef4444;">Erreur lors du chargement des équipes.</p>';
    }
}
