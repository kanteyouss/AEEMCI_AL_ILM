const bcrypt = require('bcrypt');

const password = 'Admin123!';
const hash = '$2b$10$8C2C7njxe6qfmJksK1SCfODaCWo/36gVO/rg2iz74KbmbVRKs6Hn2';

console.log('🔐 Test de comparaison bcrypt');
console.log('Password:', password);
console.log('Hash:', hash);

bcrypt.compare(password, hash).then(result => {
    console.log('\n✅ Résultat:', result ? 'MATCH ✅' : 'NO MATCH ❌');
    
    if (!result) {
        console.log('\n🔄 Génération d\'un nouveau hash...');
        return bcrypt.hash(password, 10);
    }
}).then(newHash => {
    if (newHash) {
        console.log('Nouveau hash:', newHash);
        console.log('\n📝 Commande SQL pour mettre à jour:');
        console.log(`UPDATE utilisateurs SET mot_de_passe_hash = '${newHash}' WHERE email = 'admin@alilm.ci';`);
    }
});
