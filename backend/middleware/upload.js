const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Dossier de destination des uploads
const UPLOAD_DIR = path.join(__dirname, '../../frontend/assets/uploads');

// S'assurer que les dossiers existent
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Configuration du stockage en mémoire pour les CSV
const memoryStorage = multer.memoryStorage();

// Configuration du stockage sur disque pour les fichiers audio
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subfolder = 'autres';
        
        // Déterminer le sous-dossier selon le type de fichier
        if (req.body.type || req.query.type) {
            const type = req.body.type || req.query.type;
            
            if (['adhan', 'coran', 'hadith'].includes(type)) {
                subfolder = type;
            }
        }
        
        const destPath = path.join(UPLOAD_DIR, subfolder);
        ensureDirectoryExists(destPath);
        
        cb(null, destPath);
    },
    
    filename: (req, file, cb) => {
        // Générer un nom unique : equipe_rubrique_timestamp.ext
        const equipeId = req.body.equipeId || req.user?.equipeId || 'unknown';
        const rubriqueId = req.body.rubriqueId || 'unknown';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        
        const filename = `equipe${equipeId}_rubrique${rubriqueId}_${timestamp}${ext}`;
        
        cb(null, filename);
    }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
    // Pour les CSV
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
        return cb(null, true);
    }
    
    // Extensions audio autorisées
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Format de fichier non autorisé. Formats acceptés : ${allowedExtensions.join(', ')}`), false);
    }
};

// Limite de taille : 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Configuration de Multer pour fichiers audio (sur disque)
const uploadAudio = multer({
    storage: diskStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

// Configuration de Multer pour CSV (en mémoire)
const uploadCSV = multer({
    storage: memoryStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB pour les CSV
    }
});

// Export par défaut pour compatibilité
const upload = uploadCSV;

// Middleware pour gérer les erreurs Multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: `Fichier trop volumineux. Taille maximale : ${MAX_FILE_SIZE / (1024 * 1024)} MB`
            });
        }
        
        return res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'upload du fichier',
            error: err.message
        });
    }
    
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    
    next();
};

module.exports = {
    upload,
    uploadAudio,
    uploadCSV,
    handleMulterError,
    UPLOAD_DIR
};
