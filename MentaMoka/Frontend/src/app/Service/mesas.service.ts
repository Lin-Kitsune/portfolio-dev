import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, collectionData, updateDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root'
})
export class MesasService {

  constructor(private firestore: Firestore) {}

  // Crear una mesa
  crearMesa(mesa: Mesa): Promise<void> {
    const mesasRef = collection(this.firestore, 'mesas');
    const mesaRef = doc(mesasRef, `mesa${mesa.numero}`); // Usamos el número de la mesa como ID
    return setDoc(mesaRef, mesa);
  }

  // Obtener todas las mesas
    obtenerMesas(): Observable<Mesa[]> {
        const mesasRef = collection(this.firestore, 'mesas');
        return collectionData(mesasRef, { idField: 'id' }) as Observable<Mesa[]>;  // Devuelve un observable de mesas
    }

  // Obtener una mesa específica por su número
  obtenerMesaPorNumero(numero: number): Observable<Mesa | undefined> {
    const mesasRef = collection(this.firestore, 'mesas');
    const q = query(mesasRef, where('numero', '==', numero)); // Consultar por número de mesa
    return new Observable(observer => {
      getDocs(q).then(querySnapshot => {
        const mesas: Mesa[] = [];
        querySnapshot.forEach(doc => {
          // Obtenemos los datos del documento con el id correctamente
          const mesaData = doc.data() as Mesa;
          mesaData.id = doc.id;  // Asignamos el ID del documento
          mesas.push(mesaData);  // Almacenamos la mesa
        });
        // Si encontramos mesas, devolvemos la primera, sino undefined
        observer.next(mesas.length > 0 ? mesas[0] : undefined);
        observer.complete();
      }).catch(error => {
        observer.error('Error obteniendo mesa: ' + error);
      });
    });
  }

  // Actualizar el estado de una mesa (si está ocupada o disponible)
  actualizarEstadoMesa(mesaId: string, disponible: boolean, reservaId: string | null): Promise<void> {
    const mesaRef = doc(this.firestore, 'mesas', mesaId);
    return updateDoc(mesaRef, {
      disponible: disponible,
      reserva_id: reservaId || null
    });
  }
}
