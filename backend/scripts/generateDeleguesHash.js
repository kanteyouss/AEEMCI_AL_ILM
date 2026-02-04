/**
 * Script pour générer le hash du mot de passe des délégués culturels
 * Mot de passe : AlIlm2026!
 */

const bcrypt = require('bcrypt');

const password = 'AlIlm2026!';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.error('❌ Erreur lors du hashage:', err);
        return;
    }
    
    console.log('\n🔐 ========================================');
    console.log('   HASH DU MOT DE PASSE GÉNÉRÉ');
    console.log('========================================\n');
    console.log('Mot de passe :', password);
    console.log('Hash bcrypt  :', hash);
    console.log('\n⚠️  À copier dans 04_delegues_culturels.sql');
    console.log('========================================\n');
});
