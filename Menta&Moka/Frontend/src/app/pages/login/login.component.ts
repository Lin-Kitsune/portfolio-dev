import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../Service/firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  async login() {
    try {
        const userCredential = await this.authService.login(this.email, this.password);
        console.log('✅ Usuario logueado:', userCredential.user);
        this.router.navigate(['/']);
      } catch (err) {
        console.error('❌ Error al iniciar sesión:', err);
      }      
  }
}
