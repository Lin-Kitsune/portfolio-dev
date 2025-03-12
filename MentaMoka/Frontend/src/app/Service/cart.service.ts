import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem extends Product {
  size: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private cart: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private userId: string | null = null;

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userId = user.uid;
        this.loadCart();
      } else {
        this.userId = null;
        this.cart = [];
        this.cartSubject.next(this.cart);
      }
    });
  }

  getCart() {
    return this.cartSubject.asObservable();
  }

  private async loadCart() {
    if (!this.userId) return;
    const cartRef = doc(this.firestore, `carts/${this.userId}`);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      this.cart = cartSnap.data()?.['items'] || [];
      this.cartSubject.next(this.cart);
    } else {
      this.cart = [];
      this.cartSubject.next(this.cart);
    }
  }

  async addToCart(product: Product, size: string) {
    if (!this.userId) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }
  
    console.log("🛒 Agregando al carrito:", this.userId, product, size);
    
    const index = this.cart.findIndex(item => item.id === product.id && item.size === size);
  
    if (index !== -1) {
      this.cart[index].quantity += 1;
    } else {
      this.cart.push({ ...product, size, quantity: 1 });
    }
  
    await this.updateCartInFirestore();
  }
  

  async removeFromCart(productId: string | undefined, size: string | undefined) {
    if (!this.userId || !productId || !size) return;

    this.cart = this.cart.filter(item => !(item.id === productId && item.size === size));
    await this.updateCartInFirestore();
  }

  async clearCart() {
    if (!this.userId) return;

    this.cart = [];
    await this.updateCartInFirestore();
  }

  public async updateCartInFirestore() {
    if (!this.userId) return;
  
    const cartRef = doc(this.firestore, `carts/${this.userId}`);
  
    try {
      await setDoc(cartRef, { items: [...this.cart] }, { merge: true }); // 🔹 Fuerza a guardar correctamente
      this.cartSubject.next(this.cart);
    } catch (error) {
      console.error("🔥 Error al actualizar el carrito en Firestore:", error);
    }
  }
  
}
