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

    estados: string[] = ['pagado', 'en preparacion', 'listo', 'entregado'];
    selectedTipo: string = '';
    selectedEstado: string = '';
    pedidosFiltrados: Order[] = [];

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
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      const coincideTipo = this.selectedTipo ? pedido.tipoEntrega === this.selectedTipo : true;
      const coincideEstado = this.selectedEstado ? pedido.status === this.selectedEstado : true;
      return coincideTipo && coincideEstado;
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
  
}
