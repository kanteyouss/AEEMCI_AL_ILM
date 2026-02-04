const bcrypt = require('bcrypt');

async function generateHashes() {
    console.log('\n🔐 Génération des hash bcrypt...\n');
    
    const passwords = [
        { label: 'Admin123!', value: 'Admin123!' },
        { label: 'Admin456!', value: 'Admin456!' },
        { label: 'Admin789!', value: 'Admin789!' }
    ];
    
    for (const pwd of passwords) {
        const hash = await bcrypt.hash(pwd.value, 10);
        console.log(`${pwd.label} => ${hash}`);
    }
    
    console.log('\n✅ Hash générés !\n');
}

generateHashes();
