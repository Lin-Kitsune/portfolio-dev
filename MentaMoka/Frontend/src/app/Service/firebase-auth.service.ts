import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { UserData } from '../models/user.model';
import { IdTokenResult } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  authState$ = authState(this.auth);

  constructor() {
    console.log('✅ Auth inicializado correctamente:', this.auth);
  }

  /**
   * 🔄 Actualiza el token del usuario autenticado para asegurar que se reflejen los Custom Claims
   */
  async refreshToken(): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      console.log("🔄 Refrescando token de usuario...");
      await user.getIdToken(true); // 🔥 Fuerza la actualización del token
      const idTokenResult = await user.getIdTokenResult();
      console.log("✅ Token actualizado correctamente. Claims:", idTokenResult.claims);
    }
  }  
  
  /**
   * 📌 Registra un usuario y actualiza su token inmediatamente
   */
  async register(email: string, password: string): Promise<UserCredential> {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.refreshToken();
    return userCredential;
  }

  /**
   * 🔑 Inicia sesión y actualiza el token del usuario
   */
  async login(email: string, password: string): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    
    // 🔄 Forzar actualización del token para obtener los custom claims
    await userCredential.user.getIdToken(true);
    
    console.log('✅ Sesión iniciada, token actualizado.');
 
    return userCredential;
 }
 
  /**
   * 🚪 Cierra sesión del usuario
   */
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  /**
   * 🧑‍💻 Obtiene el usuario actual
   */
  getCurrentUser(): User | null {
    return this.auth?.currentUser ?? null;
  }

  /**
   * 🔍 Obtiene el rol del usuario autenticado desde los Custom Claims del token
   */
  async getUserRole(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
        const idTokenResult: IdTokenResult = await user.getIdTokenResult(true); // 🔥 Forzar actualización del token
        console.log("🔍 Claims obtenidos:", idTokenResult.claims); // Debug para verificar qué claims tiene
        return (idTokenResult.claims as any).role ?? null; // 👈 Cast para evitar error de TypeScript
    }
    return null;
 } 
}
