import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Asegúrate de que FormsModule esté importado si usas ngModel
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../Service/reservas.service';
import { Reserva } from '../../models/reservas.model';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
})
export class CalendarioComponent {

  @Input() reserva: Reserva = {
    id: '',
    user_id: '',
    date: '',
    time: '',
    guests: 2,
    payment_status: 'pendiente',
    special_request: '',
    status: 'pendiente',
    table_number: 1,
    created_at: new Date().toISOString(),
  };

  @Output() newReservation = new EventEmitter<Reserva>();  // Emite la nueva reserva cuando se crea

  mesasDisponibles: number[] = [];
  isProcessing: boolean = false;
  message: string | null = null;
  mostrarCalendario: boolean = false;

  constructor(private reservasService: ReservasService) {}

  // Función para cerrar el modal
  cerrarModal(): void { // Esto oculta el modal de creación de reserva
    this.mostrarCalendario = false;        // Esto oculta el modal del calendario
  }

  // Cambiar la fecha de la reserva
  onDateChange(event: any): void {
    this.reserva.date = event.target.value;  // Actualizar la propiedad 'date' de la reserva
    this.mostrarMesasDisponibles();  // Actualizar las mesas disponibles para la fecha seleccionada
  }

  // Obtener las mesas disponibles
  mostrarMesasDisponibles(): void {
    const date = this.reserva.date;
    const time = this.reserva.time;
    this.reservasService.getMesasDisponibles(date, time).subscribe(reservas => {
      const mesasOcupadas = reservas.map(r => r.table_number);
      this.mesasDisponibles = this.getMesasLibres(mesasOcupadas);
    });
  }

  // Calcular las mesas libres
  getMesasLibres(mesasOcupadas: number[]): number[] {
    const totalMesas = 10; // Ejemplo: 10 mesas disponibles
    const mesasLibres = [];
    for (let i = 1; i <= totalMesas; i++) {
      if (!mesasOcupadas.includes(i)) {
        mesasLibres.push(i);
      }
    }
    return mesasLibres;
  }

  // Crear o reagendar la reserva
  crearReserva(): void {
    this.isProcessing = true;

    if (this.reserva.id) {
      // Si hay un ID, es una actualización de reserva (reagendar)
      this.reservasService.reagendarReserva(this.reserva).then(() => {
        this.message = 'Reserva actualizada exitosamente';
        this.isProcessing = false;
      }).catch(error => {
        this.message = 'Error al actualizar la reserva: ' + error.message;
        this.isProcessing = false;
      });
    } else {
      // Crear una nueva reserva
      this.reservasService.crearReserva(this.reserva).then(() => {
        this.message = 'Reserva creada exitosamente';
        this.isProcessing = false;
        this.newReservation.emit(this.reserva);  // Emitir la nueva reserva hacia el componente padre
      }).catch(error => {
        this.message = 'Error creando la reserva: ' + error.message;
        this.isProcessing = false;
      });
    }
  }
}
