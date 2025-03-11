import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Product[] = []; // Lista de productos en el carrito
  private cartSubject = new BehaviorSubject<Product[]>([]); // Estado reactivo del carrito

  constructor() {}

  // Obtener el carrito como observable
  getCart() {
    return this.cartSubject.asObservable();
  }

  // Agregar un producto al carrito
  addToCart(product: Product) {
    this.cart.push(product);
    this.cartSubject.next(this.cart); // Notificar cambios
  }

  // Eliminar un producto del carrito
  removeFromCart(productId: string) {
    this.cart = this.cart.filter(p => p.id !== productId);
    this.cartSubject.next(this.cart); // Notificar cambios
  }

  // Vaciar el carrito
  clearCart() {
    this.cart = [];
    this.cartSubject.next(this.cart); // Notificar cambios
  }
}
