import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthService } from '../Service/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    if (!user) {
      console.log("⛔ No hay usuario autenticado, redirigiendo a login...");
      this.router.navigate(['/login']);
      return false;
    }

    // 🔄 🔥 Refrescar token antes de obtener los Custom Claims
    await user.getIdToken(true);

    const role = await this.authService.getUserRole();
    console.log("🔍 Rol obtenido en AuthGuard:", role);
    
    if (role !== 'administrador') {
      console.log("⛔ Usuario no autorizado, redirigiendo al home...");
      this.router.navigate(['/']);
      return false;
    }

    console.log("✅ Usuario autorizado como administrador.");
    return true;
  }
}
