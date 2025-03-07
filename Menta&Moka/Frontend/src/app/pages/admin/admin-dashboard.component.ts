import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {

  constructor(private router: Router) {}

  crearUsuario(tipo: 'trabajador' | 'administrador') {
    this.router.navigate(['/admin/create-user'], { queryParams: { tipo } });
  }
}
