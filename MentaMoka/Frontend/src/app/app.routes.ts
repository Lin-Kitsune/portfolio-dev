import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { HomeComponent } from './pages/Home/home.component';
import { AdminCreateUserComponent } from './pages/admin/admin-create-user.component';
import { ProductListComponent } from './pages/productos-clientes/product-list/product-list.component-client';
import { CalendarioComponent } from './pages/reservations/calendario.component';
import { ReservasListComponent } from './pages/reservations/reservas-list.component';
import { AuthGuard } from './guards/auth.guard';
import { SugerenciasComponent } from './pages/sugerencias/sugerencias.component'; // ✅ Importación agregada

export const appRoutes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent }, // Puedes cambiarlo a tu página de inicio real
  { path: 'productos-clientes', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reservas', component: ReservasListComponent },
  { path: 'calendario', component: CalendarioComponent },

  // ✅ Ruta agregada para sugerencias
  { path: 'sugerencias', component: SugerenciasComponent },

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

  // Gestión de productos
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
  {
    path: 'admin/products/edit/:id',
    loadComponent: () => import('./pages/productos/product-form.component').then(m => m.ProductFormComponent),
    canActivate: [AuthGuard]
  },

  // Gestión de Inventario
  {
    path: 'admin/inventory',
    loadComponent: () => import('./pages/inventario/inventory-list.component').then(m => m.InventoryListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/inventory/create',
    loadComponent: () => import('./pages/inventario/inventory-form.component').then(m => m.InventoryFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/inventory/edit/:id',
    loadComponent: () => import('./pages/inventario/inventory-form.component').then(m => m.InventoryFormComponent),
    canActivate: [AuthGuard]
  },

  // Gestión de Sugerencias

  {
    path: 'admin/suggestions',
    loadComponent: () => import('./pages/admin-suggestions/admin-suggestions.component').then(m => m.AdminSuggestionsComponent),
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: 'inicio' } // Redirección si la ruta no existe
];
