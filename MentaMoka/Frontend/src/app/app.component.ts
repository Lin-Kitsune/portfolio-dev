import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // ✅ Importar CommonModule
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // ✅ Agregar CommonModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private app = inject(FirebaseApp);
  isLoggedIn: boolean = false; // ✅ Estado de autenticación
  private auth = getAuth(); // Obtener autenticación de Firebase

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('🔥 Firebase App:', this.app);
    
    // ✅ Detectar cambios en el estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    signOut(this.auth).then(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/inicio']); // ✅ Redirigir a inicio tras cerrar sesión
    });
  }
}
