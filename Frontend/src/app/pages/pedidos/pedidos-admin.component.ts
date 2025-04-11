import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, EstadoPedidoExtendido } from '../../models/order.model';
import { OrderService } from '../../Service/order.service';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos-admin.component.html',
  styleUrls: ['./pedidos-admin.component.scss']
})
export class PedidosAdminComponent implements OnInit {
  pedidos: Order[] = [];
  objectKeys = Object.keys;
    estados: string[] = ['pagado', 'en preparacion', 'listo', 'entregado'];
    selectedTipo: string = '';
    selectedEstado: string = '';
    pedidosFiltrados: Order[] = [];

    currentPage = 1;
    itemsPerPage = 5;

    pedidoSeleccionado: Order | null = null;

    fechaInicio: string = '';
    fechaFin: string = '';

    orden: 'fecha' | 'total' = 'fecha';
    direccion: 'asc' | 'desc' = 'desc';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.obtenerPedidosTiempoReal().subscribe(data => {
      this.pedidos = data;
      this.applyFilters();
    });

    this.corregirPedidosPendientes();
  }

  avanzarEstado(pedido: Order) {
    const siguiente = this.obtenerSiguienteEstado(pedido.status);
    if (siguiente) {
      this.orderService.cambiarEstadoPedido(pedido.id!, siguiente);
    } else {
      alert('Este pedido ya está en su último estado.');
    }
  }   

  obtenerSiguienteEstado(actual: EstadoPedidoExtendido): EstadoPedidoExtendido | null {
    const flujo: EstadoPedidoExtendido[] = ['pagado', 'en preparacion', 'listo', 'entregado'];
    const index = flujo.indexOf(actual);
    return index >= 0 && index < flujo.length - 1 ? flujo[index + 1] : null;
  }  

  applyFilters() {
    this.pedidosFiltrados = this.pedidos.filter((pedido: Order) => {
      const coincideTipo = this.selectedTipo ? pedido.tipoEntrega === this.selectedTipo : true;
      const coincideEstado = this.selectedEstado ? pedido.status === this.selectedEstado : true;
      return coincideTipo && coincideEstado;
    });
  
    const fechaInicioMs = this.fechaInicio ? new Date(this.fechaInicio).getTime() : null;
    const fechaFinMs = this.fechaFin ? new Date(this.fechaFin).getTime() : null;
  
    if (fechaInicioMs || fechaFinMs) {
      this.pedidosFiltrados = this.pedidosFiltrados.filter((p: Order) => {
        const fechaPedido = p.createdAt.toDate().getTime();
        return (!fechaInicioMs || fechaPedido >= fechaInicioMs) &&
               (!fechaFinMs || fechaPedido <= fechaFinMs);
      });
    }
  
    this.currentPage = 1;
  
    this.pedidosFiltrados.sort((a, b) => {
      let valA = this.orden === 'total' ? a.total : a.createdAt.toDate().getTime();
      let valB = this.orden === 'total' ? b.total : b.createdAt.toDate().getTime();
      return this.direccion === 'asc' ? valA - valB : valB - valA;
    });
  }   

  corregirPedidosPendientes() {
    this.orderService.obtenerPedidosTiempoReal().subscribe(pedidos => {
      pedidos.forEach(pedido => {
        if (pedido.status === 'pendiente') {
          this.orderService.cambiarEstadoPedido(pedido.id!, 'pagado');
        }
      });
    });
  }

  get totalPages(): number {
    return Math.ceil(this.pedidosFiltrados.length / this.itemsPerPage);
  }
  
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  get paginatedPedidos(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.pedidosFiltrados.slice(start, end);
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
  
  abrirDetalle(pedido: Order) {
    this.pedidoSeleccionado = pedido;
  }
  
  cerrarModal() {
    this.pedidoSeleccionado = null;
  }
  
  
}
