-- ============================================
-- JEU CONCOURS AL ILM 2026
-- Schéma de base de données PostgreSQL
-- AEEMCI - Section ESATIC
-- ============================================

-- ============================================
-- 1. TABLE PARTICIPANTS
-- ============================================
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telephone VARCHAR(20) NOT NULL UNIQUE,
    etablissement VARCHAR(50) NOT NULL CHECK (etablissement IN ('ESATIC', 'EMSP')),
    niveau_coranique VARCHAR(20) CHECK (niveau_coranique IN ('ne_sais_pas', 'debute', 'lis_aisement')),
    connaissance_hadiths VARCHAR(20) CHECK (connaissance_hadiths IN ('oui', 'non', 'moins_de_5')),
    memorisation_sourate VARCHAR(20) CHECK (memorisation_sourate IN ('oui', 'non', 'un_peu_moins')),
    disponibilite BOOLEAN DEFAULT true,
    photo_url VARCHAR(255),
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_participants_etablissement ON participants(etablissement);
CREATE INDEX idx_participants_email ON participants(email);

-- ============================================
-- 2. TABLE EQUIPES
-- ============================================
CREATE TABLE equipes (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    signification VARCHAR(200),
    couleur VARCHAR(50),
    symbole VARCHAR(100),
    code_acces VARCHAR(50) UNIQUE NOT NULL,
    qr_code_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_equipes_code_acces ON equipes(code_acces);

-- ============================================
-- 3. TABLE MEMBRES_EQUIPE (Relation N-N)
-- ============================================
CREATE TABLE membres_equipe (
    id SERIAL PRIMARY KEY,
    equipe_id INTEGER NOT NULL REFERENCES equipes(id) ON DELETE CASCADE,
    participant_id INTEGER NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
    est_capitaine BOOLEAN DEFAULT false,
    role_adhan BOOLEAN DEFAULT false,
    role_coran_ouvert BOOLEAN DEFAULT false,
    role_coran_ferme BOOLEAN DEFAULT false,
    role_hadith BOOLEAN DEFAULT false,
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(equipe_id, participant_id)
);

CREATE INDEX idx_membres_equipe_equipe ON membres_equipe(equipe_id);
CREATE INDEX idx_membres_equipe_participant ON membres_equipe(participant_id);

-- ============================================
-- 4. TABLE MANCHES
-- ============================================
CREATE TABLE manches (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('preliminaire', 'quart', 'demi', 'finale')),
    date_manche DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    statut VARCHAR(20) DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'publie', 'en_cours', 'termine')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_manches_date ON manches(date_manche);
CREATE INDEX idx_manches_type ON manches(type);

-- ============================================
-- 5. TABLE RUBRIQUES
-- ============================================
CREATE TABLE rubriques (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) CHECK (type IN ('recitation', 'questions_ecrites', 'relais', 'hadith')),
    points_max INTEGER NOT NULL,
    temps_par_question INTEGER,
    description TEXT,
    criteres_evaluation JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. TABLE RUBRIQUES_MANCHE
-- ============================================
CREATE TABLE rubriques_manche (
    id SERIAL PRIMARY KEY,
    manche_id INTEGER NOT NULL REFERENCES manches(id) ON DELETE CASCADE,
    rubrique_id INTEGER NOT NULL REFERENCES rubriques(id),
    ordre_passage INTEGER NOT NULL,
    actif BOOLEAN DEFAULT true,
    UNIQUE(manche_id, rubrique_id)
);

CREATE INDEX idx_rubriques_manche_manche ON rubriques_manche(manche_id);

-- ============================================
-- 7. TABLE QUESTIONS
-- ============================================
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    rubrique_id INTEGER NOT NULL REFERENCES rubriques(id),
    question_texte TEXT NOT NULL,
    reponse_correcte TEXT,
    type VARCHAR(20) CHECK (type IN ('qcm', 'texte_libre')),
    choix_a VARCHAR(255),
    choix_b VARCHAR(255),
    choix_c VARCHAR(255),
    choix_d VARCHAR(255),
    difficulte VARCHAR(20) CHECK (difficulte IN ('facile', 'moyen', 'difficile')),
    points INTEGER NOT NULL DEFAULT 1,
    reference VARCHAR(255),
    utilise BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_rubrique ON questions(rubrique_id);
CREATE INDEX idx_questions_utilise ON questions(utilise);

-- ============================================
-- 8. TABLE SOUMISSIONS
-- ============================================
CREATE TABLE soumissions (
    id SERIAL PRIMARY KEY,
    equipe_id INTEGER NOT NULL REFERENCES equipes(id),
    manche_id INTEGER NOT NULL REFERENCES manches(id),
    rubrique_id INTEGER NOT NULL REFERENCES rubriques(id),
    question_id INTEGER REFERENCES questions(id),
    participant_id INTEGER NOT NULL REFERENCES participants(id),
    reponse_texte TEXT,
    fichier_audio_url VARCHAR(255),
    temps_reponse INTEGER,
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_soumissions_equipe ON soumissions(equipe_id);
CREATE INDEX idx_soumissions_manche ON soumissions(manche_id);
CREATE INDEX idx_soumissions_rubrique ON soumissions(rubrique_id);

-- ============================================
-- 9. TABLE EVALUATIONS
-- ============================================
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    soumission_id INTEGER NOT NULL REFERENCES soumissions(id) ON DELETE CASCADE,
    jure_id INTEGER REFERENCES utilisateurs(id),
    note_voix INTEGER,
    note_tajwid INTEGER,
    note_prononciation INTEGER,
    note_totale INTEGER NOT NULL,
    commentaire TEXT,
    statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'conteste')),
    date_evaluation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_evaluations_soumission ON evaluations(soumission_id);
CREATE INDEX idx_evaluations_jure ON evaluations(jure_id);

-- ============================================
-- 10. TABLE SCORES (Consolidé)
-- ============================================
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    equipe_id INTEGER NOT NULL REFERENCES equipes(id),
    manche_id INTEGER NOT NULL REFERENCES manches(id),
    rubrique_id INTEGER NOT NULL REFERENCES rubriques(id),
    points_obtenus INTEGER NOT NULL DEFAULT 0,
    points_max INTEGER NOT NULL,
    date_calcul TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(equipe_id, manche_id, rubrique_id)
);

CREATE INDEX idx_scores_equipe ON scores(equipe_id);
CREATE INDEX idx_scores_manche ON scores(manche_id);

-- ============================================
-- 11. TABLE UTILISATEURS (Admin, Jury)
-- ============================================
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'jure')),
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);

-- ============================================
-- 12. TABLE SESSIONS (Authentification)
-- ============================================
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    equipe_id INTEGER REFERENCES equipes(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('admin', 'jure', 'equipe')),
    date_expiration TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_utilisateur ON sessions(utilisateur_id);
CREATE INDEX idx_sessions_equipe ON sessions(equipe_id);

-- ============================================
-- 13. TABLE LOGS (Audit Trail)
-- ============================================
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(50),
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_utilisateur ON logs(utilisateur_id);
CREATE INDEX idx_logs_date ON logs(date_action);

-- ============================================
-- TRIGGERS (Mise à jour automatique)
-- ============================================

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipes_updated_at BEFORE UPDATE ON equipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manches_updated_at BEFORE UPDATE ON manches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_utilisateurs_updated_at BEFORE UPDATE ON utilisateurs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VUES (Views utiles)
-- ============================================

-- Vue : Classement général
CREATE OR REPLACE VIEW classement_general AS
SELECT 
    e.id,
    e.nom AS equipe,
    e.couleur,
    e.symbole,
    COALESCE(SUM(s.points_obtenus), 0) AS points_totaux,
    COUNT(DISTINCT s.manche_id) AS nb_manches_jouees,
    RANK() OVER (ORDER BY COALESCE(SUM(s.points_obtenus), 0) DESC) AS rang
FROM equipes e
LEFT JOIN scores s ON e.id = s.equipe_id
GROUP BY e.id, e.nom, e.couleur, e.symbole
ORDER BY points_totaux DESC;

-- Vue : Détail équipe avec membres
CREATE OR REPLACE VIEW equipes_avec_membres AS
SELECT 
    e.id AS equipe_id,
    e.nom AS equipe_nom,
    e.couleur,
    e.symbole,
    p.id AS participant_id,
    p.nom,
    p.prenom,
    p.telephone,
    p.etablissement,
    me.est_capitaine,
    me.role_adhan,
    me.role_coran_ouvert,
    me.role_coran_ferme,
    me.role_hadith
FROM equipes e
JOIN membres_equipe me ON e.id = me.equipe_id
JOIN participants p ON me.participant_id = p.id;

-- Vue : Statistiques par rubrique
CREATE OR REPLACE VIEW stats_rubriques AS
SELECT 
    r.id,
    r.nom AS rubrique,
    COUNT(DISTINCT s.equipe_id) AS nb_equipes_participantes,
    AVG(s.points_obtenus) AS moyenne_points,
    MAX(s.points_obtenus) AS meilleur_score,
    MIN(s.points_obtenus) AS score_min
FROM rubriques r
LEFT JOIN scores s ON r.id = s.rubrique_id
GROUP BY r.id, r.nom;

-- ============================================
-- MESSAGE DE CONFIRMATION
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Schéma de base de données créé avec succès !';
    RAISE NOTICE '📊 13 tables créées';
    RAISE NOTICE '🔍 Indexes et triggers configurés';
    RAISE NOTICE '👁️ 3 vues créées';
    RAISE NOTICE '';
    RAISE NOTICE '🕌 JEU CONCOURS AL ILM 2026 - AEEMCI';
    RAISE NOTICE '"Pour une identité islamique !"';
END $$;
