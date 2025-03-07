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
      const uid = userCredential.user.uid;

      // 🔥 Al loguear, traemos el rol desde Firestore
      this.authService.getUserRole(uid).subscribe(role => {
        if (role === 'administrador') {
          console.log('👑 Admin detectado, redirigiendo al panel de admin');
          this.router.navigate(['/admin']);
        } else if (role === 'cliente') {
          console.log('👤 Cliente detectado, redirigiendo al home');
          this.router.navigate(['/']);
        } else {
          console.warn('⚠️ Usuario con rol desconocido, redirigiendo al home por defecto');
          this.router.navigate(['/']);
        }
      });

    } catch (err) {
      console.error('❌ Error al iniciar sesión:', err);
    }
  }
}
