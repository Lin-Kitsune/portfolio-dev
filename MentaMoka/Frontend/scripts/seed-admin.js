const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function crearPrimerAdmin() {
    const user = await admin.auth().createUser({
        email: 'admin@mentaymoka.com',
        password: 'Admin1234',
        displayName: 'Admin Principal',
    });

    await admin.firestore().collection('users').doc(user.uid).set({
        uid: user.uid,
        email: 'admin@mentaymoka.com',
        name: 'Admin Principal',
        role: 'administrador',
        createdAt: new Date().toISOString()
    });

    console.log('✅ Admin creado:', user.uid);
}

crearPrimerAdmin().catch(console.error);
