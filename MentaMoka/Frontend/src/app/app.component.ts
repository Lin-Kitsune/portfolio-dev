import { Component, inject, OnInit } from '@angular/core';
import {  ElementRef, HostListener,  Renderer2, ViewChild  } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { CartService } from './Service/cart.service';
import { Product } from '../app/models/product.model';
import { CartItem } from './models/cart-item.model';
import { WebpayService } from './Service/webpay.service';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  private app = inject(FirebaseApp);
  private auth = getAuth();
  private firestore = inject(Firestore);

  isLoggedIn: boolean = false;
  isCartOpen = false;
  isSearchOpen = false;
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  cartTotal = 0;
  currentRoute: string = '';
  menuAbierto = false;

  // 🔎 Buscador
  searchTerm: string = '';
  searchResults: Product[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private webpayService: WebpayService,
    private eRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  @ViewChild('searchContainer', { static: false }) searchRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isSearchOpen && this.searchRef && !this.searchRef.nativeElement.contains(event.target)) {
      this.isSearchOpen = false;
    }
  }
  
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
    this.cartService.addToCart(item);
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
    this.cartService.removeFromCart(item.id!, item.size ?? '', item.selectedOptions ?? {});
  }

  clearCart() {
    this.cartService.clearCart();
  }

  toggleSearch(open: boolean) {
    this.isSearchOpen = open;
  }

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
    return this.router.url.includes('pantalla-cocina') || this.router.url.includes('pantalla-cliente');
  }

  // 🔎 Buscar en tiempo real desde Firestore
  async onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.searchResults = [];
      return;
    }

    const productosRef = collection(this.firestore, 'products');
    const snapshot = await getDocs(productosRef);

    this.searchResults = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Product))
      .filter(p => p.name?.toLowerCase().includes(term))
      .slice(0, 5); // máximo 5 resultados
  }

  // 🔎 Ir a página de productos al presionar Enter
  goToSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/productos-clientes'], { queryParams: { buscar: this.searchTerm } });
      this.resetSearch();
    }
  }

  // 🔎 Ir al hacer clic en sugerencia
  selectProduct(product: Product) {
    this.router.navigate(['/productos-clientes'], { queryParams: { buscar: product.name } });
    this.resetSearch();
  }

  // 🔄 Reset de campo buscador
  resetSearch() {
    this.toggleSearch(false);
    this.searchTerm = '';
    this.searchResults = [];
  }
}
