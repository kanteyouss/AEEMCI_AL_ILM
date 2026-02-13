const bcrypt = require('bcrypt');
const db = require('../config/database');
const { generateToken } = require('../config/jwt');

/**
 * Connexion Admin ou Juré (email + password)
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Tentative de connexion:');
        console.log('   Email:', email);
        console.log('   Password:', JSON.stringify(password));
        console.log('   Password length:', password ? password.length : 0);
        console.log('   Password chars:', password ? password.split('').map((c, i) => `[${i}]='${c}' (code: ${c.charCodeAt(0)})`).join(' ') : 'N/A');

        // Rechercher l'utilisateur
        const query = `
            SELECT * FROM utilisateurs 
            WHERE email = $1 AND actif = true
        `;

        const result = await db.query(query, [email]);

        console.log('📊 Résultat requête DB:', result.rows.length, 'utilisateur(s) trouvé(s)');

        if (result.rows.length === 0) {
            console.log('❌ Aucun utilisateur trouvé avec cet email');
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        const user = result.rows[0];
        console.log('👤 Utilisateur trouvé:', user.email, '- Role:', user.role);
        console.log('🔐 Hash en DB:', user.mot_de_passe_hash ? user.mot_de_passe_hash.substring(0, 20) + '...' : 'NULL');

        // Vérifier le mot de passe
        console.log('🔄 Comparaison du mot de passe...');
        const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe_hash);

        console.log('✅ Résultat comparaison:', isPasswordValid ? 'VALID ✅' : 'INVALID ❌');

        if (!isPasswordValid) {
            console.log('❌ Mot de passe invalide');
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token JWT
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
            type: user.role // 'admin' ou 'jure'
        };

        const token = generateToken(tokenPayload);

        // Enregistrer la session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 jours

        await db.query(
            `INSERT INTO sessions (utilisateur_id, token, type, date_expiration) 
             VALUES ($1, $2, $3, $4)`,
            [user.id, token, user.role, expiresAt]
        );

        res.json({
            success: true,
            message: 'Connexion réussie',
            data: {
                token,
                user: {
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Connexion Équipe (code_acces uniquement)
 */
const loginEquipe = async (req, res, next) => {
    try {
        const { code_acces } = req.body;

        // Rechercher l'équipe
        // Rechercher l'équipe par code d'accès OU par nom
        const query = `SELECT * FROM equipes WHERE code_acces = $1 OR UPPER(nom) = UPPER($1)`;
        const result = await db.query(query, [code_acces]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Code d\'accès invalide'
            });
        }

        const equipe = result.rows[0];

        // Générer le token JWT
        const tokenPayload = {
            equipeId: equipe.id,
            nom: equipe.nom,
            type: 'equipe'
        };

        const token = generateToken(tokenPayload);

        // Enregistrer la session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 jours pour les équipes

        await db.query(
            `INSERT INTO sessions (equipe_id, token, type, date_expiration) 
             VALUES ($1, $2, $3, $4)`,
            [equipe.id, token, 'equipe', expiresAt]
        );

        res.json({
            success: true,
            message: 'Connexion équipe réussie',
            data: {
                token,
                equipe: {
                    id: equipe.id,
                    nom: equipe.nom,
                    couleur: equipe.couleur,
                    symbole: equipe.symbole
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Déconnexion (suppression de la session)
 */
const logout = async (req, res, next) => {
    try {
        const sessionId = req.sessionId;

        await db.query('DELETE FROM sessions WHERE id = $1', [sessionId]);

        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Vérifier le token (route protégée de test)
 */
const verifyAuth = (req, res) => {
    res.json({
        success: true,
        message: 'Token valide',
        data: {
            user: req.user
        }
    });
};

/**
 * Créer un utilisateur Admin ou Juré (réservé Admin)
 */
const createUser = async (req, res, next) => {
    try {
        const { nom, prenom, email, password, role } = req.body;

        // Vérifier que le rôle est valide
        if (!['admin', 'jure'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Rôle invalide (doit être "admin" ou "jure")'
            });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer l'utilisateur
        const query = `
            INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nom, prenom, email, role, created_at
        `;

        const result = await db.query(query, [nom, prenom, email, hashedPassword, role]);

        res.status(201).json({
            success: true,
            message: 'Utilisateur créé avec succès',
            data: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    loginUser,
    loginEquipe,
    logout,
    verifyAuth,
    createUser
};
