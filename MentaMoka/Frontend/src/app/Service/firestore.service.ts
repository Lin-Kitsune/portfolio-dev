import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, collection, collectionData  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  saveUser(userData: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${userData.uid}`);
    return setDoc(userRef, userData);
  }

  // ✅ Nueva función para obtener los productos desde Firestore
  getProducts(): Observable<any[]> {
    const productsRef = collection(this.firestore, 'products'); // Reemplaza 'products' con el nombre de tu colección en Firestore
    return collectionData(productsRef, { idField: 'id' }); // Devuelve los productos con su ID
  }

    // ✅ Obtener inventario
    getInventory(): Observable<any[]> {
      const inventoryRef = collection(this.firestore, 'inventory'); // Asegúrate de que 'inventory' es el nombre correcto de la colección
      return collectionData(inventoryRef, { idField: 'id' });
    }

     // Obtener trabajadores
  getWorkers(): Observable<any[]> {
    const workersRef = collection(this.firestore, 'trabajadores');
    return collectionData(workersRef, { idField: 'id' });
  }

  // Obtener administradores
  getAdmins(): Observable<any[]> {
    const adminsRef = collection(this.firestore, 'administradores');
    return collectionData(adminsRef, { idField: 'id' });
  }

  // ✅ Obtener todas las reservas
getAllReservas(): Observable<any[]> {
  const reservasRef = collection(this.firestore, 'reservations');
  return collectionData(reservasRef, { idField: 'id' });
}

// ✅ Actualizar estado de una reserva
updateReservaStatus(id: string, newStatus: string): Promise<void> {
  const reservaRef = doc(this.firestore, `reservations/${id}`);
  return setDoc(reservaRef, { status: newStatus }, { merge: true });
}


}
