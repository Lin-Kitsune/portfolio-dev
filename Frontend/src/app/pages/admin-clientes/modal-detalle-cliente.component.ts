import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-detalle-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalle-cliente.component.html',
})
export class ModalDetalleClienteComponent {
  @Input() cliente: any;
  @Output() cerrar = new EventEmitter<void>();
}
