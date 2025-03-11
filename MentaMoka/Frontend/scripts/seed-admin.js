const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function crearPrimerAdmin() {
    try {
        const user = await admin.auth().getUserByEmail('admin@mentaymoka.com');

        // 🔥 Asignar Custom Claims
        await admin.auth().setCustomUserClaims(user.uid, { role: 'administrador' });

        console.log(`✅ Claims asignados al usuario ${user.email}`);

    } catch (error) {
        console.error('❌ Error asignando claims:', error);
    }
}

crearPrimerAdmin();
