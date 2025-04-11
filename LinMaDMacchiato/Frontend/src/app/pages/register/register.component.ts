import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { FirebaseAuthService } from '../../Service/firebase-auth.service';
import { FirestoreService } from '../../Service/firestore.service';
import { Router } from '@angular/router';
import { fetchSignInMethodsForEmail, getAuth } from 'firebase/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  role = 'cliente';

  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  emailExists = false;
  emailValid = false;

  constructor(
    private authService: FirebaseAuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async register() {
    this.errorMessage = '';

    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios.';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Correo electrónico no válido.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.phone && !/^\d{9}$/.test(this.phone)) {
      this.errorMessage = 'El teléfono debe tener 9 dígitos numéricos.';
      return;
    }

    try {
      const userCredential = await this.authService.register(this.email, this.password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        name: `${this.firstName} ${this.lastName}`,
        email: this.email,
        phone: this.phone,
        address: '',
        role: this.role,
        createdAt: new Date().toISOString()
      };

      await this.firestoreService.saveUser(userData);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
      this.errorMessage = 'Ocurrió un error al registrarse. Intenta nuevamente.';
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  togglePasswordVisibility(type: 'password' | 'confirm') {
    if (type === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async checkEmail() {
    this.emailValid = this.validateEmail(this.email);

    if (this.emailValid) {
      const methods = await this.getSignInMethodsForEmail(this.email);
      this.emailExists = methods && methods.length > 0;
    } else {
      this.emailExists = false;
    }
  }

  private getSignInMethodsForEmail(email: string) {
    const auth = getAuth();
    return fetchSignInMethodsForEmail(auth, email);
  }
}
