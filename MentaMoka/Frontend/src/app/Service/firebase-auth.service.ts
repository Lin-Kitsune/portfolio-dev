import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';
import { UserData } from '../models/user.model';
import { authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  
  private auth = inject(Auth); 
  authState$ = authState(this.auth); 
  private firestore = inject(Firestore); 


  constructor() {
    console.log('🔥 Auth inicializado en AuthService:', this.auth);  // Debugging clave
  }

  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
  
    // ✅ Con tipado limpio
  getUserRole(uid: string): Observable<string | null> {
    const docRef = doc(this.firestore, `users/${uid}`);
    return from(getDoc(docRef)).pipe(
      map(doc => {
        const data = doc.data() as UserData | undefined; // <-- Aquí usamos el tipo
        return data?.role ?? null;
      })
    );
  }
}
