import { Component } from '@angular/core';
import { CommonModule, NgIf   } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../Service/firebase-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';
  emailError = false;
  passwordError = false;

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  async login() {
    this.errorMessage = '';
    this.emailError = false;
    this.passwordError = false;

   try {
      const userCredential = await this.authService.login(this.email, this.password);
      const uid = userCredential.user.uid;
      await userCredential.user.getIdToken(true);
      const role = await this.authService.getUserRole();

      if (role === 'administrador') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    } catch (err: any) {
      this.errorMessage = 'Correo o contraseña incorrectos.';
      this.emailError = true;
      this.passwordError = true;
    }
  }
}

