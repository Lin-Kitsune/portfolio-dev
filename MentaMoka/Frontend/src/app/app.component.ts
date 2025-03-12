import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { CartService } from './Service/cart.service';
import { CartItem } from './Service/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private app = inject(FirebaseApp);
  isLoggedIn: boolean = false;
  private auth = getAuth();
  
  isCartOpen = false;
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  cartTotal = 0;

  constructor(private router: Router, private cartService: CartService) {}

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
    this.cartService.addToCart(item, item.size);
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
    if (item.id && item.size) {
      this.cartService.removeFromCart(item.id, item.size);
    }
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
