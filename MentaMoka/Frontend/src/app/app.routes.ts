import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { AdminCreateUserComponent } from './pages/admin/admin-create-user.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas del admin
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/create-user',
    component: AdminCreateUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./pages/productos/product-list.component').then(m => m.ProductListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/products/create',
    loadComponent: () => import('./pages/productos/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: '' }
];