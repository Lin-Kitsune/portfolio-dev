import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { CartService } from './Service/cart.service';
import { Product } from '../app/models/product.model';
import { CartItem } from './models/cart-item.model';
import { WebpayService } from './Service/webpay.service';  // Lo dejamos para cuando integres WebPay

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private app = inject(FirebaseApp);
  private auth = getAuth();
  isLoggedIn: boolean = false;

  isCartOpen = false;
  isSearchOpen = false;
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  cartTotal = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private webpayService: WebpayService // Lo mantendremos preparado para el futuro
  ) {}

  ngOnInit() {
    console.log('🔥 Firebase App:', this.app);

    onAuthStateChanged(this.auth, (user) => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.loadCart();
      } else {
        this.cartItems = [];
        this.cartItemCount = 0;
        this.cartTotal = 0;
      }
    });
  }

  logout() {
    signOut(this.auth).then(() => {
      this.isLoggedIn = false;
      this.router.navigate(['/inicio']);
    });
  }

  loadCart() {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
      this.cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    });
  }

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }

  increaseQuantity(item: CartItem) {
    this.cartService.addToCart(item, item.size, item.selectedOptions ?? {});
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.updateCartInFirestore();
    } else {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item.id!, item.size, item.selectedOptions ?? {});
  }

  clearCart() {
    this.cartService.clearCart();
  }

  toggleSearch(open: boolean) {
    this.isSearchOpen = open;
  }

  // ✅ Redirigir al resumen de pago (checkout)
  pay() {
    const user = this.auth.currentUser;

    if (!user) {
      alert('Debes iniciar sesión para pagar.');
      return;
    }

    if (this.cartItems.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    this.isCartOpen = false;
    this.router.navigate(['/checkout']);
  }

  get esPantallaCocina() {
    return this.router.url.includes('pantalla-cocina');
  }
}
