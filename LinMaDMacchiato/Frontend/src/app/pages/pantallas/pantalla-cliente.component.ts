import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/order.model';
import { OrderService } from '../../Service/order.service';

@Component({
  selector: 'app-pantalla-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantalla-cliente.component.html',
  styleUrls: ['./pantalla-cliente.component.scss']
})
export class PantallaClienteComponent implements OnInit, OnDestroy {
  pedidosListo: Order[] = [];
  pedidosPreparacion: Order[] = [];
  private idsConSonido: Set<string> = new Set();
  private sub: any;

  constructor(private orderService: OrderService) {}
  bloqueoSonido = true;

  ngOnInit(): void {
    document.addEventListener('click', () => {
        const test = new Audio('assets/sounds/listo-sonido.mp3');
        test.volume = 0;
        test.play().then(() => console.log('✅ Sonido habilitado'));
    }, { once: true });
  
    this.sub = this.orderService.obtenerPedidosTiempoReal().subscribe(pedidos => {
      const pedidosEnPreparacion = pedidos.filter(p => p.status === 'en preparacion');
      const pedidosListos = pedidos.filter(p => p.status === 'listo');
  
      pedidosListos.forEach(p => {
        if (!this.idsConSonido.has(p.id!)) {
          const audio = new Audio('assets/sounds/listo-sonido.mp3');
          audio.volume = 1;
          audio.play().then(() => {
            console.log(`🔊 Sonido reproducido para pedido #${p.numero}`);
          }).catch(err => {
            console.warn('⚠️ Error al reproducir sonido:', err);
          });
          this.idsConSonido.add(p.id!);
          this.resaltados.add(p.id!); // 🔥 activa animación

           // 🔄 borra la animación después de 2.5s
           setTimeout(() => this.resaltados.delete(p.id!), 2500);
        }
      });
  
      this.pedidosListo = pedidosListos;
      this.pedidosPreparacion = pedidosEnPreparacion;
    });
  }  

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }

  marcarEntregado(id: string) {
    this.orderService.cambiarEstadoPedido(id, 'entregado');
    this.idsConSonido.delete(id);
  }

  private habilitarSonidoAutoplay = () => {
    const testAudio = new Audio('assets/sounds/listo-sonido.mp3');
    testAudio.play().catch(() => {});
  }
  
  activarSonido() {
    const testAudio = new Audio('assets/sounds/listo-sonido.mp3');
    testAudio.volume = 0;
    testAudio.play().then(() => {
      console.log('✅ Sonido desbloqueado');
      this.bloqueoSonido = false;
    }).catch(err => {
      console.warn('❌ No se pudo desbloquear el sonido:', err);
    });
  }

  resaltados: Set<string> = new Set();

}
