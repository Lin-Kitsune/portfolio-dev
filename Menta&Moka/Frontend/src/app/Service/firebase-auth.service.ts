import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  
  private auth = inject(Auth);

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
}
