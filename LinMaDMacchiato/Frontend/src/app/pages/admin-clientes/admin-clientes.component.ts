import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, Timestamp } from '@angular/fire/firestore';
import { FirestoreService } from '../../Service/firestore.service';
import { Order } from '../../models/order.model';

// imports de modal
import { ModalHistorialClienteComponent } from './modal-historial-cliente.component';
import { ModalDetallePedidoComponent } from './modal-detalle-pedido.component';
import { ModalDetalleClienteComponent } from './modal-detalle-cliente.component';

@Component({
    selector: 'app-admin-clientes',
    standalone: true,
    imports: [CommonModule, FormsModule, ModalHistorialClienteComponent, ModalDetallePedidoComponent,ModalDetalleClienteComponent,],
    templateUrl: './admin-clientes.component.html'
})
export class AdminClientesComponent implements OnInit {
  firestore = inject(Firestore);

  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  filtroNombre = '';
  filtroCorreo = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';

  modalHistorialAbierto = false;
  modalDetalleAbierto = false;
  clienteSeleccionado: any = null;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    const firestore = this.firestore;
  
    const ordersRef = collection(firestore, 'orders');
    const ordersSnap = await getDocs(ordersRef);
    const allOrders: Order[] = ordersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Order) }));
  
    // Agrupar por userId
    const grouped = new Map<string, any[]>();
    allOrders.forEach(order => {
      if (!grouped.has(order.userId)) grouped.set(order.userId, []);
      grouped.get(order.userId)?.push(order);
    });
  
    const usersRef = collection(firestore, 'users');
    const usersSnap = await getDocs(usersRef);
  
    const usersMap = new Map<string, any>();
    usersSnap.docs.forEach(doc => usersMap.set(doc.id, { ...doc.data(), uid: doc.id }));
  
    // Construir array de clientes con pedidos
    this.clientes = Array.from(grouped.entries()).map(([uid, pedidos]) => {
      const user = usersMap.get(uid);
      if (!user) return null;
  
      // Ordenar pedidos por fecha (para obtener última compra)
      pedidos.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
  
      const totalGastado = pedidos.reduce((acc, o) => acc + (o.total || 0), 0);
      const ultimaCompra = pedidos[0].createdAt instanceof Timestamp
        ? pedidos[0].createdAt.toDate()
        : new Date(pedidos[0].createdAt);
  
      return {
        ...user,
        pedidos,
        totalGastado,
        ultimaCompra
      };
    }).filter(Boolean); // Eliminar posibles nulls
  
    this.applyFilters();
  }  

  applyFilters() {
    this.clientesFiltrados = this.clientes.filter(cliente => {
      const nombreMatch = cliente.name?.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const correoMatch = cliente.email?.toLowerCase().includes(this.filtroCorreo.toLowerCase());

      let fechaMatch = true;
      const fecha = cliente.ultimaCompra instanceof Timestamp
        ? cliente.ultimaCompra.toDate()
        : new Date(cliente.ultimaCompra);

      if (this.filtroFechaDesde) {
        fechaMatch = fechaMatch && fecha >= new Date(this.filtroFechaDesde);
      }

      if (this.filtroFechaHasta) {
        const hasta = new Date(this.filtroFechaHasta);
        hasta.setDate(hasta.getDate() + 1);
        fechaMatch = fechaMatch && fecha <= hasta;
      }

      return nombreMatch && correoMatch && fechaMatch;
    });
  }

  verHistorial(cliente: any) {
    this.clienteSeleccionado = cliente;
    this.modalHistorialAbierto = true;
  }  

  verDetalle(cliente: any) {
    this.clienteSeleccionado = cliente;
    this.modalDetalleAbierto = true;
  }

  verContacto(cliente: any) {
    this.clienteSeleccionado = cliente;
    this.modalDetalleAbierto = true;
  }

  get totalPages(): number {
    return Math.ceil(this.clientesFiltrados.length / this.itemsPerPage);
  }
  
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  get paginatedClientes(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.clientesFiltrados.slice(start, end);
  }
  
  goToPage(page: number) {
    this.currentPage = page;
  }
  
  goToPreviousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
  
  goToNextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }
  
}