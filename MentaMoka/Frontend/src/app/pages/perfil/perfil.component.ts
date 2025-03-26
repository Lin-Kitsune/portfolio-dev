import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { FirebaseAuthService } from '../../Service/firebase-auth.service';
import { FirestoreService } from '../../Service/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null = null;

  modoEdicion = false;
  errorMessage = '';

  constructor(
    private authService: FirebaseAuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        const data = await this.firestoreService.getUserById(user.uid);
        const [firstName, ...lastNameParts] = (data['name'] || '').split(' ');
        this.userData = {
          firstName,
          lastName: lastNameParts.join(' '),
          email: data['email'] || '',
          phone: data['phone'] || ''
        };
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario', error);
    }
  }

  async guardarCambios() {
    if (!this.userData) return;

    try {
      const user = await this.authService.getCurrentUser();
      if (!user) return;

      const fullName = `${this.userData.firstName} ${this.userData.lastName}`;
      await this.firestoreService.updateUser(user.uid, {
        name: fullName,
        phone: this.userData.phone
      });

      this.modoEdicion = false;
    } catch (error) {
      console.error('Error al guardar cambios', error);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
