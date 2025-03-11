const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json'); // Asegúrate de que el archivo esté en la misma carpeta

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function checkUserClaims(email) {
    try {
        const user = await admin.auth().getUserByEmail(email);
        console.log(`✅ Claims del usuario ${email}:`, user.customClaims);
    } catch (error) {
        console.error(`❌ Error obteniendo claims para ${email}:`, error);
    }
}

// Llamar la función con el email del admin
checkUserClaims('admin@mentaymoka.com');
