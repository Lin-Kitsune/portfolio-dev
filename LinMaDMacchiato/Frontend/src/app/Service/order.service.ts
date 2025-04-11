import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  collectionData,
  updateDoc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Order, EstadoPedidoExtendido, TipoPedido } from '../models/order.model';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private collectionName = 'orders';

  constructor(
    private firestore: Firestore,
    private authService: FirebaseAuthService
  ) {}

  // Crear un nuevo pedido con ID automático
  async crearPedido(order: Order): Promise<void> {
    const ordersRef = collection(this.firestore, this.collectionName);
    const orderRef = doc(ordersRef); // genera nuevo ID

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return Promise.reject('Usuario no autenticado');
    }

    order.userId = userId;
    order.createdAt = serverTimestamp() as any;
    order.status = 'pendiente';   // estado inicial

    return setDoc(orderRef, order);
  }

  // Obtener todos los pedidos en tiempo real (ordenados por fecha)
  obtenerPedidosTiempoReal(): Observable<Order[]> {
    const pedidosRef = collection(this.firestore, 'orders');
    const q = query(pedidosRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }  

  // Obtener pedidos por tipo (tienda / delivery)
  obtenerPedidosPorTipo(tipo: TipoPedido): Observable<Order[]> {
    const ordersRef = collection(this.firestore, this.collectionName);
    const q = query(ordersRef, where('tipo', '==', tipo), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  // Cambiar estado del pedido (en preparación, listo, entregado, etc.)
  cambiarEstadoPedido(id: string, nuevoEstado: EstadoPedidoExtendido): Promise<void> {
    const pedidoRef = doc(this.firestore, this.collectionName, id);
    return updateDoc(pedidoRef, { status: nuevoEstado });
  }

  // Obtener pedidos por usuario
  obtenerPedidosPorUsuario(userId: string): Observable<Order[]> {
    const ordersRef = collection(this.firestore, this.collectionName);
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }
}
