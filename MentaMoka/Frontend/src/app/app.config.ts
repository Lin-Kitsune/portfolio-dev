import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

// Firebase
import { initializeApp, provideFirebaseApp, getApps, getApp, FirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth, initializeAuth, indexedDBLocalPersistence } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFunctions, getFunctions, connectFunctionsEmulator } from '@angular/fire/functions';

// Environment
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),

    provideFirebaseApp(() => {
      let app: FirebaseApp;
      if (!getApps().length) {
        console.log('🔥 Firebase NO estaba inicializado, inicializándolo ahora...');
        app = initializeApp(environment.firebaseConfig);

        // 🔥 🔥 🔥 Se inicializa `Auth` aquí, ANTES de que cualquier otro servicio lo use
        initializeAuth(app, { persistence: indexedDBLocalPersistence });

        console.log('✅ Firebase App inicializado:', app);
      } else {
        console.log('⚡ Firebase YA estaba inicializado, reutilizando instancia existente.');
        app = getApp();
      }
      return app;
    }),

    // 🔥 Ahora `Auth` se obtiene de la instancia correcta
    provideAuth(() => {
      console.log('✅ Registrando Firebase Auth...');
      return getAuth();
    }),

    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => {
        const functions = getFunctions(undefined, 'us-central1');
        if (environment.useEmulators) {
            connectFunctionsEmulator(functions, 'localhost', 5001);
            console.log('⚙️ Conectado al emulador de Functions');
        }
        return functions;
    }),
  ]
};
