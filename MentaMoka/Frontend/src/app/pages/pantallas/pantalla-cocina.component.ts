import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, EstadoPedidoExtendido } from '../../models/order.model';
import { ProductIngredient } from '../../models/product.model';
import { OrderService } from '../../Service/order.service';
import { Timestamp } from '@angular/fire/firestore';
import { ProductService } from '../../Service/product.service';

@Component({
  selector: 'app-pantalla-cocina',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantalla-cocina.component.html',
  styleUrls: ['./pantalla-cocina.component.scss']
})
export class PantallaCocinaComponent implements OnInit, OnDestroy {
  pedidos: Order[] = [];
  expandedPedidoId: string | null = null;
  expandedProductos: { [key: string]: boolean } = {};
  ingredientesMap: { [key: string]: any[] } = {}; 
  intervalId: any; 

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.orderService.obtenerPedidosTiempoReal().subscribe(async data => {
      const pedidosFiltrados = data
        .filter(p => ['pagado', 'en preparacion', 'listo'].includes(p.status))
        .sort((a, b) => a.numero! - b.numero!);

      this.pedidos = pedidosFiltrados;

      // Precargar ingredientes
      for (const pedido of pedidosFiltrados) {
        for (const producto of pedido.products) {
          if (!this.ingredientesMap[producto.productId]) {
            const productoCompleto = await this.productService.getProductoConIngredientes(producto.productId);
            if ((productoCompleto as any)?.ingredients) {
              this.ingredientesMap[producto.productId] = (productoCompleto as any).ingredients;
            }            
          }
        }
      }
    });

    this.intervalId = setInterval(() => {
      this.pedidos = [...this.pedidos];
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  calcularTiempo(fecha: any): string {
    const ahora = new Date().getTime();
    const creado = fecha.toDate ? fecha.toDate().getTime() : fecha.getTime();
    const diff = Math.floor((ahora - creado) / 1000);
    const minutos = Math.floor(diff / 60);
    const segundos = diff % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  getColorByTime(fecha: any): string {
    const ahora = new Date().getTime();
    const creado = fecha.toDate ? fecha.toDate().getTime() : fecha.getTime();
    const minutos = Math.floor((ahora - creado) / 1000 / 60);

    if (minutos < 10) return 'bg-green-100 border-green-400';
    if (minutos < 20) return 'bg-yellow-100 border-yellow-400';
    return 'bg-red-100 border-red-400';
  }

  avanzarEstado(pedido: Order) {
    const flujo: any[] = ['pagado', 'en preparacion', 'listo'];
    const index = flujo.indexOf(pedido.status);
    if (index >= 0 && index < flujo.length - 1) {
      this.orderService.cambiarEstadoPedido(pedido.id!, flujo[index + 1]);
    }
  }

  getTextoBoton(status: string): string {
    switch (status) {
      case 'pagado': return 'Preparar todo';
      case 'en preparacion': return 'Terminar todo';
      case 'listo': return 'Confirmar';
      default: return 'Acción';
    }
  }

  toggleExpand(pedidoId: string, productId: string) {
    const key = `${pedidoId}_${productId}`;
    this.expandedProductos[key] = !this.expandedProductos[key];
  }

isExpanded(pedidoId: string, productId: string): boolean {
  return this.esProductoExpandido(pedidoId, productId);
}

  
  esProductoExpandido(pedidoId: string, productId: string): boolean {
    return !!this.expandedProductos[`${pedidoId}_${productId}`];
  }

  getColorByTimeClass(fecha: any): string {
    const ahora = new Date().getTime();
    const creado = fecha.toDate ? fecha.toDate().getTime() : fecha.getTime();
    const minutos = Math.floor((ahora - creado) / 1000 / 60);
  
    if (minutos < 10) return 'bg-[#76CA95] border-b-4 border-green-500';
    if (minutos < 20) return 'bg-[#FF9A33] border-b-4 border-yellow-500';
    return 'bg-[#861C22] border-b-4 border-[#6f1503]'; // rojo burdeo fuerte
  }
}
