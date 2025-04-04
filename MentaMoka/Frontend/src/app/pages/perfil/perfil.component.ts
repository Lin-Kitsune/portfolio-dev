import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass, NgFor, DatePipe } from '@angular/common';
import { FirebaseAuthService } from '../../Service/firebase-auth.service';
import { FirestoreService } from '../../Service/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, NgFor, DatePipe],
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
  seccion: 'perfil' | 'historial' = 'perfil';
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  // Filtros
  filtroId: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  filtroTipoEntrega: string = '';
  ordenSeleccionado: string = '';

  constructor(
    private authService: FirebaseAuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const user = await this.authService.getCurrentUserPromise();
      if (user) {
        const data = await this.firestoreService.getUserById(user.uid);
        const [firstName, ...lastNameParts] = (data['name'] || '').split(' ');
        this.userData = {
          firstName,
          lastName: lastNameParts.join(' '),
          email: data['email'] || '',
          phone: data['phone'] || ''
        };

        this.pedidos = await this.firestoreService.getPedidosByUserId(user.uid);
        this.filtrarPedidos();
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario o pedidos', error);
    }
  }

  filtrarPedidos() {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      const idPedido = (pedido.numero || pedido.id)?.toString().toLowerCase();
      const matchId = this.filtroId ? idPedido?.includes(this.filtroId.toLowerCase()) : true;

      const fecha = pedido.createdAt?.toDate?.();
      const matchFechaInicio = this.fechaInicio ? new Date(this.fechaInicio) <= fecha : true;
      const matchFechaFin = this.fechaFin ? new Date(this.fechaFin) >= fecha : true;

      const matchTipo = this.filtroTipoEntrega ? pedido.tipoEntrega === this.filtroTipoEntrega : true;

      return matchId && matchFechaInicio && matchFechaFin && matchTipo;
    });

    this.ordenarPedidos();
  }

  ordenarPedidos() {
    if (this.ordenSeleccionado === 'precio-asc') {
      this.pedidosFiltrados.sort((a, b) => a.total - b.total);
    } else if (this.ordenSeleccionado === 'precio-desc') {
      this.pedidosFiltrados.sort((a, b) => b.total - a.total);
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
