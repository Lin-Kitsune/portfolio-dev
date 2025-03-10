import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, UserCredential, getAuth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { UserData } from '../models/user.model';
import { authState } from '@angular/fire/auth';
import { initializeApp, getApps, getApp, FirebaseApp } from '@angular/fire/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  
  private auth!: Auth;
  private firestore: Firestore;
  authState$!: Observable<User | null>;

  constructor() {
    // ✅ Aseguramos que Firebase está inicializado
    let app: FirebaseApp;
    if (!getApps().length) {
      console.log('🔥 Firebase NO estaba inicializado, inicializándolo ahora en AuthService...');
      app = initializeApp(environment.firebaseConfig);
    } else {
      console.log('⚡ Firebase YA estaba inicializado, reutilizando instancia existente.');
      app = getApp();
    }

    this.auth = getAuth(app); // ✅ Ahora tomamos Auth solo después de la inicialización
    this.authState$ = authState(this.auth);
    this.firestore = inject(Firestore);

    console.log('✅ Auth inicializado correctamente:', this.auth);
  }

  async register(email: string, password: string): Promise<UserCredential> {
    await this.ensureAuthInitialized();
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string): Promise<UserCredential> {
    await this.ensureAuthInitialized();
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await this.ensureAuthInitialized();
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth?.currentUser ?? null;
  }

  getUserRole(uid: string): Observable<string | null> {
    const docRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(docRef)).pipe(
      map(doc => {
        const data = doc.data() as UserData | undefined;
        return data?.role ?? null;
      })
    );
  }

  private async ensureAuthInitialized(): Promise<void> {
    return new Promise(resolve => {
      if (this.auth) {
        resolve();
      } else {
        console.log('⏳ Esperando que Auth se inicialice...');
        setTimeout(() => {
          this.auth = getAuth(getApp());
          resolve();
        }, 500); // Esperar 500ms para asegurar inicialización
      }
    });
  }
}
