import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthService } from '../Service/firebase-auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: FirebaseAuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await firstValueFrom(this.authService.authState$);
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = await firstValueFrom(this.authService.getUserRole(user.uid));
    if (role !== 'administrador') {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
