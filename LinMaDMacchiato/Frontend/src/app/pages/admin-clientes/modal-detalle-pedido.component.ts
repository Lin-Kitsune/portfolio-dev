import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-detalle-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle-pedido.component.html',
})
export class ModalDetallePedidoComponent {
  @Input() pedido: any;
  @Input() cliente: any;
  @Output() cerrar = new EventEmitter<void>();

  objectKeys = Object.keys;
}
