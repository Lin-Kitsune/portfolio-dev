import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, collectionData, updateDoc, addDoc, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reservas.model';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(
    private firestore: Firestore,
    private authService: FirebaseAuthService  
  ) {}

  // Crear una nueva reserva (usando un ID automático generado por Firestore)
  crearReserva(reserva: Reserva): Promise<void> {
    const reservasRef = collection(this.firestore, 'reservations');
    const reservaRef = doc(reservasRef);  // Esto genera un nuevo ID automáticamente
  
    // Asegúrate de que el usuario esté autenticado antes de proceder
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      // Si el usuario no está autenticado, puedes manejar este caso, por ejemplo, lanzando un error
      return Promise.reject('Usuario no autenticado');
    }
  
    reserva.user_id = userId; // Asignamos el user_id del usuario autenticado
  
    return setDoc(reservaRef, reserva);  // Establecer los datos de la reserva
  }    
  
  // Obtener todas las reservas
  obtenerReservas(userId: string): Observable<Reserva[]> {
    const reservasRef = collection(this.firestore, 'reservations');
    const q = query(reservasRef, where('user_id', '==', userId));  // Filtrar por user_id
    return collectionData(q, { idField: 'id' }) as Observable<Reserva[]>;
  }

  // Confirmar una reserva
  confirmarReserva(id: string): Promise<void> {
    const reservaRef = doc(this.firestore, 'reservations', id);  // Referencia al documento de la reserva
    return updateDoc(reservaRef, { status: 'confirmada' });  // Actualizar el estado de la reserva
  }

  // Cancelar una reserva
  cancelarReserva(id: string): Promise<void> {
    const reservaRef = doc(this.firestore, 'reservations', id);
    return updateDoc(reservaRef, { status: 'cancelada' });
  }

  // Reagendar una reserva
  reagendarReserva(reserva: Reserva): Promise<void> {
    if (!reserva.id) {
      throw new Error('ID de la reserva es necesario para actualizar.');
    }

    return updateDoc(doc(this.firestore, 'reservations', reserva.id), {
      date: reserva.date,
      time: reserva.time,
      guests: reserva.guests,
      special_request: reserva.special_request,
      table_number: reserva.table_number,
      status: reserva.status, // Se podría agregar cualquier otro campo si es necesario
    });
  }

  // Obtener mesas disponibles para una fecha y hora específica
  getMesasDisponibles(date: string, time: string): Observable<Reserva[]> {
    const reservasRef = collection(this.firestore, 'reservations');
    const q = query(reservasRef, where('date', '==', date), where('time', '==', time));
    return collectionData(q, { idField: 'id' }) as Observable<Reserva[]>;
  }
}
