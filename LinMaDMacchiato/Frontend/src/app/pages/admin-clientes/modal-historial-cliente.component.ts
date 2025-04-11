import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalDetallePedidoComponent } from './modal-detalle-pedido.component'; 
import { FirestoreService } from '../../Service/firestore.service';

@Component({
  selector: 'app-modal-historial-cliente',
  standalone: true,
  imports: [CommonModule, ModalDetallePedidoComponent],
  templateUrl: './modal-historial-cliente.component.html',
})
export class ModalHistorialClienteComponent implements OnChanges {
  @Input() cliente: any;
  @Output() cerrar = new EventEmitter<void>();

  pedidos: any[] = [];
  detallePedidoOpen = false;
  pedidoSeleccionado: any = null;

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private firestoreService: FirestoreService) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['cliente'] && this.cliente?.uid) {
      this.pedidos = await this.firestoreService.getPedidosByUserId(this.cliente.uid);
    }
  }

  verDetalle(pedido: any) {
    this.pedidoSeleccionado = pedido;
    this.detallePedidoOpen = true;
  }

  cerrarDetallePedido() {
    this.pedidoSeleccionado = null;
    this.detallePedidoOpen = false;
  }


  get totalPages(): number {
    return Math.ceil(this.pedidos.length / this.itemsPerPage);
  }
  
  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  get paginatedPedidos(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.pedidos.slice(start, end);
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
