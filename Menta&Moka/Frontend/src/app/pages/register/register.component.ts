import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

import { FirebaseAuthService } from '../../Service/firebase-auth.service';
import { FirestoreService } from '../../Service/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  name = '';
  email = '';
  password = '';
  role = 'cliente';

  constructor(
    private authService: FirebaseAuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    console.log('✅ RegisterComponent - AuthService:', this.authService);
  }

  async register() {
    try {
      const userCredential = await this.authService.register(this.email, this.password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        name: this.name,
        email: this.email,
        role: this.role,
        phone: '',
        address: '',
        createdAt: new Date().toISOString()
      };

      await this.firestoreService.saveUser(userData);
      console.log('✅ Usuario registrado y guardado en Firestore');
      this.router.navigate(['/']);
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
    }
  }
}
