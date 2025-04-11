import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../Service/firestore.service';
import { DatePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-historial',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, NgFor, DatePipe],
  templateUrl: './admin-historial.component.html',
  styleUrls: ['./admin-historial.component.scss']
})
export class AdminHistorialComponent implements OnInit {
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  filtroId: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';
  filtroTipoEntrega: string = '';
  ordenSeleccionado: string = '';

  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;

  modalAbierto: boolean = false;
  pedidoSeleccionado: any = null;
  nombreComprador: string = '';

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    try {
      this.pedidos = await this.firestoreService.getAllPedidos();
      this.filtrarPedidos();
    } catch (error) {
      console.error('Error al cargar los pedidos del historial', error);
    }
  }

  filtrarPedidos() {
    let resultado = this.pedidos.filter(pedido => {
      const idPedido = (pedido.numero || pedido.id)?.toString().toLowerCase();
      const matchId = this.filtroId ? idPedido?.includes(this.filtroId.toLowerCase()) : true;

      const fecha = pedido.createdAt?.toDate?.();
      const matchFechaInicio = this.fechaInicio ? new Date(this.fechaInicio) <= fecha : true;
      const matchFechaFin = this.fechaFin ? new Date(this.fechaFin) >= fecha : true;

      const matchTipo = this.filtroTipoEntrega ? pedido.tipoEntrega === this.filtroTipoEntrega : true;

      return matchId && matchFechaInicio && matchFechaFin && matchTipo;
    });

    if (this.ordenSeleccionado === 'precio-asc') {
      resultado.sort((a, b) => a.total - b.total);
    } else if (this.ordenSeleccionado === 'precio-desc') {
      resultado.sort((a, b) => b.total - a.total);
    } else if (this.ordenSeleccionado === 'id-asc') {
      resultado.sort((a, b) => Number(a.numero || a.id) - Number(b.numero || b.id));
    } else if (this.ordenSeleccionado === 'id-desc') {
      resultado.sort((a, b) => Number(b.numero || b.id) - Number(a.numero || a.id));
    }

    this.paginaActual = 1;
    this.pedidosFiltrados = resultado;
    this.totalPaginas = Math.ceil(this.pedidosFiltrados.length / this.itemsPorPagina);
  }

  get pedidosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.pedidosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  async abrirModal(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.modalAbierto = true;

    try {
      const userData = await this.firestoreService.getUserById(pedido.userId);
      this.nombreComprador = userData?.name || 'Desconocido';
    } catch (error) {
      console.error('No se pudo obtener el nombre del comprador', error);
      this.nombreComprador = 'Desconocido';
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.pedidoSeleccionado = null;
    this.nombreComprador = '';
  }
}
