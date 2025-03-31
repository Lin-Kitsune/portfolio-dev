import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  collectionData,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) {}

  // ✅ Guardar nuevo usuario
  saveUser(userData: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${userData.uid}`);
    return setDoc(userRef, userData);
  }

  // ✅ Obtener datos de un usuario por su UID
  async getUserById(uid: string): Promise<any> {
    const userRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) {
      throw new Error('Usuario no encontrado');
    }
    return snapshot.data();
  }

  // ✅ Actualizar los datos del usuario
  async updateUser(uid: string, data: any): Promise<void> {
    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, data);
  }

  // ✅ Obtener productos
  getProducts(): Observable<any[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' });
  }

  // ✅ Obtener inventario
  getInventory(): Observable<any[]> {
    const inventoryRef = collection(this.firestore, 'inventory');
    return collectionData(inventoryRef, { idField: 'id' });
  }

  // ✅ Obtener trabajadores
  getWorkers(): Observable<any[]> {
    const workersRef = collection(this.firestore, 'trabajadores');
    return collectionData(workersRef, { idField: 'id' });
  }

  // ✅ Obtener administradores
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

  // ✅ Obtener pedidos por ID de usuario
  async getPedidosByUserId(userId: string): Promise<any[]> {
    const ref = collection(this.firestore, 'orders');
    const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  // Obtener todos los pedidos desde firebase :D
  async getAllPedidos(): Promise<any[]> {
    const ref = collection(this.firestore, 'orders');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

// 🔍 Obtener pedidos filtrados por tipo de entrega y fecha
  async getPedidosFiltrados(tipoEntrega: string, desde: Date): Promise<any[]> {
    const ref = collection(this.firestore, 'orders');
    const condiciones = [
      where('createdAt', '>=', desde),
      orderBy('createdAt', 'desc')
    ];

    if (tipoEntrega !== 'general') {
      condiciones.unshift(where('tipoEntrega', '==', tipoEntrega));
    }

    const q = query(ref, ...condiciones);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
