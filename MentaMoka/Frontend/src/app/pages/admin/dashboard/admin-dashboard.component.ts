import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: 
  [
    RouterModule, 
    CommonModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  activeTab: 'operativo' | 'gestion' = 'operativo';

  constructor(private router: Router) {}

  setActiveTab(tab: 'operativo' | 'gestion') {
    this.activeTab = tab;
  }

  crearUsuario(tipo: 'trabajador' | 'administrador') {
    this.router.navigate(['/admin/create-user'], { queryParams: { tipo } });
  }
}