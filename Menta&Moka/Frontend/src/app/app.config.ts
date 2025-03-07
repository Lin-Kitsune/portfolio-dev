import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

// Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { connectFunctionsEmulator, getFunctions, provideFunctions } from '@angular/fire/functions';

// Environment
import { environment } from '../environments/environment';

console.log('🔗 Firebase Config:', environment.firebaseConfig);  // Esto es solo para debug

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),


    // Configuración Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideFunctions(() => {
        const functions = getFunctions(undefined, 'us-central1');  // 👈 Ajusta la región si es necesario
        if (environment.useEmulators) {                            // 👈 Control de emulador
            connectFunctionsEmulator(functions, 'localhost', 5001);
            console.log('⚙️ Conectado al emulador de Functions');
        }
        return functions;
    })
  ]
};