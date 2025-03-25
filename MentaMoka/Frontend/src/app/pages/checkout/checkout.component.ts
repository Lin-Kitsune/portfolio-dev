import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { getAuth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs, doc, deleteDoc } from '@angular/fire/firestore';

import { CartService } from '../../Service/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Order, OrderProduct } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  private firestore = inject(Firestore);
  private router = inject(Router);
  private cartService = inject(CartService);

  cartItems: CartItem[] = [];
  total = 0;

  deliveryMethod: 'retiro' | 'delivery' = 'retiro';
  direccion = '';
  guardarDireccion = false;
  direccionesGuardadas: string[] = [];
  mostrarModal = false;

  ngOnInit(): void {
    this.cartService.getCart().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    });

    this.cargarDireccionesGuardadas();
  }

  async cargarDireccionesGuardadas() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const direccionesRef = collection(this.firestore, `users/${user.uid}/direcciones`);
    const snapshot = await getDocs(direccionesRef);
    this.direccionesGuardadas = snapshot.docs.map(doc => doc.data()['direccion'] as string);
  }

  seleccionarDireccionGuardada(direccion: string) {
    this.direccion = direccion;
  }
  

  async confirmarPedido() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Debes iniciar sesión para confirmar tu pedido.');
      return;
    }

    if (this.deliveryMethod === 'delivery' && !this.direccion.trim()) {
      alert('Por favor, completa tu dirección para el envío.');
      return;
    }

    const productos: OrderProduct[] = this.cartItems.map((item: CartItem) => {
      const variantesLimpias: { [key: string]: string } = {};
      if (item.selectedOptions) {
        for (const key in item.selectedOptions) {
          const valor = item.selectedOptions[key];
          if (typeof valor === 'string') {
            variantesLimpias[key] = valor;
          }
        }
      }

      return {
        productId: item.id || '',
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        variants: Object.keys(variantesLimpias).length > 0 ? variantesLimpias : undefined
      };
    });

    const nuevaOrden: Order = {
      userId: user.uid,
      products: productos,
      total: this.total,
      createdAt: new Date(),
      status: 'pendiente',
      ...(this.deliveryMethod === 'delivery'
        ? { tipoEntrega: 'delivery', direccion: this.direccion }
        : { tipoEntrega: 'retiro' })
    };

    try {
      await addDoc(collection(this.firestore, 'orders'), nuevaOrden);
      await deleteDoc(doc(this.firestore, `carts/${user.uid}`));

      if (this.guardarDireccion && this.deliveryMethod === 'delivery') {
        await addDoc(collection(this.firestore, `users/${user.uid}/direcciones`), {
          direccion: this.direccion,
          fecha: new Date()
        });
      }

      this.cartService.clearCart(); // 🔁 Limpiar carrito local
      this.mostrarModal = true;
      setTimeout(() => {
        this.router.navigate(['/pago-exitoso']);
      }, 2000);
    } catch (error) {
      console.error('Error al confirmar pedido:', error);
      alert('Ocurrió un error al guardar tu orden.');
    }
  }
  onDireccionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const direccionSeleccionada = target.value;
    this.seleccionarDireccionGuardada(direccionSeleccionada);
  }
  
  
}
