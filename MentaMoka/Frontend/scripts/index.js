const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json'); // Ruta al archivo JSON de credenciales

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function asignarRolCliente() {
  try {
    // Aquí usas el correo del usuario o el UID del usuario para asignarle el rol de cliente
    const user = await admin.auth().getUserByEmail('valentina@gmail.com');  // O utiliza getUserByUid si usas UID

    // Asignar el rol 'cliente' al usuario
    await admin.auth().setCustomUserClaims(user.uid, { role: 'cliente' });

    console.log(`✅ Rol 'cliente' asignado al usuario ${user.email}`);

  } catch (error) {
    console.error('❌ Error asignando el rol de cliente:', error);
  }
}

// Llamada a la función para asignar el rol
asignarRolCliente();
