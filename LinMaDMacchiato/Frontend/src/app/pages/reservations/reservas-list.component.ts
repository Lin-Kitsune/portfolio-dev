import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importar FormsModule para usar ngModel
import { ReservasService } from '../../Service/reservas.service';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../models/reservas.model';
import { Mesa } from '../../models/mesa.model';
import { MesasService } from '../../Service/mesas.service';
import { CalendarioComponent } from './calendario.component';
import { FirebaseAuthService } from '../../Service/firebase-auth.service';
import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';


@Component({
  selector: 'app-reservas-list',
  standalone: true,
  imports: [FormsModule, CommonModule, CalendarioComponent],  // Importar FormsModule para usar ngModel
  templateUrl: './reservas-list.component.html',
  styleUrls: ['./reservas-list.component.scss']
})
export class ReservasListComponent implements OnInit {

  reservas: Reserva[] = [];
  esEdicion: boolean = false;
  mesasDisponibles: number[] = [];
  reserva: Reserva = {
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
  message: string | null = null;
  isProcessing: boolean = false;
  mostrarCalendario: boolean = false;  // Control de visibilidad del calendario
  crearReservaFormVisible: boolean = false;  // Control de visibilidad del formulario de reserva

  searchQuery: string = '';  // Para almacenar la búsqueda
  filteredReservas: Reserva[] = [];  // Lista filtrada de reservas

  // Mostrar y ocultar modales de calendario y reservar
  toggleModal(type: 'calendario' | 'reserva'): void {
    if (type === 'calendario') {
      this.mostrarCalendario = !this.mostrarCalendario;
    }
    if (type === 'reserva') {
      this.crearReservaFormVisible = !this.crearReservaFormVisible;
      
      // Obtener mesas disponibles cada vez que se abre el formulario
      if (this.reserva.date && this.reserva.time) {
        this.obtenerMesasDisponibles(this.reserva.date, this.reserva.time); // Aquí pasamos date y time
      }
    }
  }  

constructor(
  private reservasService: ReservasService,
  private mesasService: MesasService,  // Inyección del servicio de mesas
  private authService: FirebaseAuthService
) {}

ngOnInit(): void {
  const userId: string | null = localStorage.getItem('userId'); // Declaramos correctamente el tipo de userId
  if (userId) {
    this.obtenerReservas(userId);  // Llamamos a obtenerReservas con el userId desde localStorage
  } else {
    this.message = 'No estás autenticado.';
  }
}

  // Obtener todas las reservas
obtenerReservas(userId: string): void {
  if (!userId) {
    this.message = 'Usuario no autenticado';
    return;
  }

  // Llamar al servicio de reservas para obtener las reservas del usuario
  this.reservasService.obtenerReservas(userId).subscribe((reservas: Reserva[]) => {
    this.reservas = reservas;  // Asignar las reservas a la variable de clase
  });
}
  
  applyFilters(): void {
    this.filteredReservas = this.reservas.filter(reserva => 
      reserva.date.includes(this.searchQuery) || 
      reserva.time.includes(this.searchQuery) || 
      reserva.guests.toString().includes(this.searchQuery)
    );
  }

  // Función para cerrar el modal
  cerrarModal(): void {
    this.crearReservaFormVisible = false; // Esto oculta el modal
  }

  getMesasLibres(mesasOcupadas: number[]): number[] {
    const totalMesas = 10;  // Ejemplo: 10 mesas disponibles
    const mesasLibres = [];
    for (let i = 1; i <= totalMesas; i++) {
      if (!mesasOcupadas.includes(i)) {
        mesasLibres.push(i);
      }
    }
    return mesasLibres;
  }

  // Lógica para obtener mesas disponibles
  obtenerMesasDisponibles(date: string, time: string): void {
    this.mesasService.obtenerMesas().subscribe(
      (mesas: Mesa[]) => {
        // Filtramos las mesas disponibles y asignamos solo los números de las mesas
        this.mesasDisponibles = mesas
          .filter(mesa => mesa.disponible)
          .map(mesa => mesa.numero); // Ahora es un array de números
      },
      error => {
        console.error('Error al obtener mesas', error);
      }
    );
  }

  // Confirmar reserva
  confirmarReserva(id: string): void {
    const userId = this.authService.getCurrentUserId(); // Obtener el ID del usuario autenticado
    if (!userId) {
      this.message = 'Usuario no autenticado';
      return;
    }
  
    this.reservasService.confirmarReserva(id).then(() => {
      this.message = 'Reserva confirmada con éxito';
      this.obtenerReservas(userId); // Pasamos el userId a obtenerReservas
    }).catch(error => {
      this.message = 'Error al confirmar la reserva: ' + error.message;
    });
  }
  

  // Cancelar reserva
  cancelarReserva(id: string): void {
    const userId = this.authService.getCurrentUserId(); // Obtener el ID del usuario autenticado
    if (!userId) {
      this.message = 'Usuario no autenticado';
      return;
    }
  
    this.reservasService.cancelarReserva(id).then(() => {
      this.message = 'Reserva cancelada con éxito';
      this.obtenerReservas(userId); // Pasamos el userId a obtenerReservas
    }).catch(error => {
      this.message = 'Error al cancelar la reserva: ' + error.message;
    });
  }
  

  // Reagendar reserva
  reagendarReserva(reserva: Reserva): void {
    this.reserva = { ...reserva };
    this.abrirFormularioReserva(true); // Modo edición
  }
  
  

  // Crear una nueva reserva
  crearReserva(): void {
    this.isProcessing = true;
  
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.message = 'Usuario no autenticado';
      this.isProcessing = false;
      return;
    }
  
    this.reserva.user_id = userId;
  
    if (this.reserva.id) {
      // 🔁 Si tiene ID, es una actualización
      this.reservasService.actualizarReserva(this.reserva.id, this.reserva).then(() => {
        this.message = 'Reserva actualizada exitosamente';
        this.isProcessing = false;
        this.obtenerReservas(userId);
        this.crearReservaFormVisible = false;
      }).catch(error => {
        this.message = 'Error al actualizar la reserva: ' + error.message;
        this.isProcessing = false;
      });
    } else {
      // 🆕 Si no tiene ID, es nueva
      this.reservasService.crearReserva(this.reserva).then(() => {
        this.message = 'Reserva creada exitosamente';
        this.isProcessing = false;
        this.obtenerReservas(userId);
        this.crearReservaFormVisible = false;
      }).catch(error => {
        this.message = 'Error creando la reserva: ' + error.message;
        this.isProcessing = false;
      });
    }
  }
  
   

  handleNewReservation(reserva: Reserva): void {
    const userId = this.authService.getCurrentUserId(); // Obtener el ID del usuario autenticado
    if (!userId) {
      this.message = 'Usuario no autenticado';
      return;
    }
    
    console.log('Nueva reserva o reserva actualizada:', reserva);
    this.obtenerReservas(userId);  // Pasamos el userId a obtenerReservas
  }

  ordenSeleccionado: 'recientes' = 'recientes';

ordenarReservas(): void {
  if (this.ordenSeleccionado === 'recientes') {
    this.reservas.sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());
  } else {
    this.reservas.sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());
  }
}

abrirFormularioReserva(esEdicion: boolean = false): void {
  this.esEdicion = esEdicion;
  this.crearReservaFormVisible = true;
  this.mostrarCalendario = false;

  if (this.reserva.date && this.reserva.time) {
    this.obtenerMesasDisponibles(this.reserva.date, this.reserva.time);
  }
}
  

eliminarReserva(id: string): void {
  const userId = this.authService.getCurrentUserId();
  if (!userId) {
    this.message = 'Usuario no autenticado';
    return;
  }

  if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
    this.reservasService.eliminarReserva(id).then(() => {
      this.message = 'Reserva eliminada correctamente';
      this.obtenerReservas(userId);
    }).catch(error => {
      this.message = 'Error al eliminar la reserva: ' + error.message;
    });
  }
}


}
