import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth } from '@angular/fire/auth';
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { onAuthStateChanged } from '@angular/fire/auth'; 
import {
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';

import { CartService } from '../../Service/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { Order, OrderProduct } from '../../models/order.model';
import { ProductService } from '../../Service/product.service';

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
  private productService = inject(ProductService);

  cartItems: CartItem[] = [];
  total = 0;

  deliveryMethod: 'retiro' | 'delivery' = 'retiro';
  direccion = '';
  guardarDireccion = false;
  direccionesGuardadas: string[] = [];
  mostrarModal = false;
  paymentMethod: 'WebPay' | 'Transbank' | 'Efectivo' = 'WebPay';
  telefono: string = '';
  mesa = ''; 

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
  
    // ✅ Validar datos requeridos si es delivery
    if (this.deliveryMethod === 'delivery' && (!this.direccion.trim() || !this.telefono.trim())) {
      alert('Por favor, completa tu dirección y teléfono.');
      return;
    }
  
    // 🛒 Preparar productos para la orden
    const productos: OrderProduct[] = this.cartItems.map((item: CartItem, i) => {
      const variantesLimpias: { [key: string]: string } = {};
      
      if (item.selectedOptions && typeof item.selectedOptions === 'object') {
        for (const key in item.selectedOptions) {
          const valor = item.selectedOptions[key];
          if (typeof valor === 'string') {
            variantesLimpias[key] = valor;
          }
        }
      }
    
      const productoLimpio: OrderProduct = {
        productId: item.id ?? `producto_sin_id_${i}`,
        name: item.name ?? 'Producto sin nombre',
        quantity: item.quantity ?? 1,
        price: item.price ?? 0
      };
    
      if (Object.keys(variantesLimpias).length > 0) {
        productoLimpio.variants = variantesLimpias;
      }
    
      return productoLimpio;
    });    
  
    // 🔢 Obtener número de orden consecutivo
    const ordersRef = collection(this.firestore, 'orders');
    const ultimaOrdenSnap = await getDocs(query(ordersRef, orderBy('numero', 'desc'), limit(1)));
    const ultimoNumero = ultimaOrdenSnap.docs.length > 0
      ? (ultimaOrdenSnap.docs[0].data()['numero'] || 0)
      : 0;
    const nuevoNumero = ultimoNumero + 1;
  
    // 📦 Armar el objeto orden
    const nuevaOrden: Order = {
      userId: user.uid,
      products: productos,
      total: this.total,
      createdAt: serverTimestamp() as any,
      status: 'pendiente',
      numero: nuevoNumero,
      paymentMethod: this.paymentMethod,
      tipoEntrega: this.deliveryMethod === 'delivery' ? 'delivery' : 'tienda',
      ...(this.deliveryMethod === 'delivery'
        ? {
            datosEntrega: {
              nombre: user.displayName || 'Cliente',
              direccion: this.direccion,
              telefono: this.telefono || 'N/A'
            }
          }
        : {
            mesa: this.mesa || 'sin asignar'
          })
    };
      
    // ❌ Limpiar campos innecesarios para evitar errores
    if (this.deliveryMethod === 'delivery') {
      delete (nuevaOrden as any).mesa;
    } else {
      delete (nuevaOrden as any).datosEntrega;
    }
  
    // 🐞 Mostrar en consola para depurar
    console.log('📝 Orden que se va a guardar:', JSON.stringify(nuevaOrden, null, 2));
    console.log('📦 Tipo de cada campo importante:', {
      numero: typeof nuevaOrden.numero,
      paymentMethod: typeof nuevaOrden.paymentMethod,
      total: typeof nuevaOrden.total,
      tipoEntrega: typeof nuevaOrden.tipoEntrega,
      datosEntrega: typeof (nuevaOrden as any).datosEntrega,
      mesa: typeof (nuevaOrden as any).mesa
    });

    // ✅ Limpieza de campos undefined
    Object.keys(nuevaOrden).forEach((key) => {
      const value = (nuevaOrden as any)[key];
      if (value === undefined) {
        delete (nuevaOrden as any)[key];
      }
    });

    productos.forEach((prod, i) => {
      Object.entries(prod).forEach(([k, v]) => {
        if (v === undefined) {
          console.warn(`⚠️ Producto #${i} tiene ${k} undefined`);
        }
      });
    });
  
    try {
      await addDoc(collection(this.firestore, 'orders'), nuevaOrden);
      await deleteDoc(doc(this.firestore, `carts/${user.uid}`));

      // ✅ Descontar ingredientes del stock según lo comprado
      for (const item of this.cartItems) {
        if (!item.ingredients || item.ingredients.length === 0) continue;
      
        const ingredientesMultiplicados = item.ingredients.map(ing => ({
          ...ing,
          quantity: ing.quantity * item.quantity
        }));

        console.log(`🧾 Descontando stock de ${item.name}`, ingredientesMultiplicados);
      
        await this.productService.updateIngredientStockAfterSale({
          ...item,
          ingredients: ingredientesMultiplicados
        });
      }      
  
      // 💾 Guardar dirección si corresponde
      if (this.guardarDireccion && this.deliveryMethod === 'delivery') {
        await addDoc(collection(this.firestore, `users/${user.uid}/direcciones`), {
          direccion: this.direccion,
          fecha: new Date()
        });
      }
  
      // ✅ Limpiar carrito y mostrar modal
      this.cartService.clearCart();
      this.mostrarModal = true;
      setTimeout(() => {
        this.router.navigate(['/pago-exitoso']);
      }, 2000);
    } catch (error) {
      console.error('❌ Error al confirmar pedido:', error);
      alert('Ocurrió un error al guardar tu orden.');
    }
  }
  
  
  onDireccionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const direccionSeleccionada = target.value;
    this.seleccionarDireccionGuardada(direccionSeleccionada);
  }

  formatearTelefono() {
    let soloNumeros = this.telefono.replace(/\D/g, '');
    if (soloNumeros.startsWith('56')) soloNumeros = soloNumeros.substring(2);
    if (soloNumeros.startsWith('9')) soloNumeros = soloNumeros.substring(1);
  
    const parte1 = soloNumeros.substring(0, 4);
    const parte2 = soloNumeros.substring(4, 8);
    this.telefono = `+56 9 ${parte1}${parte2 ? ' ' + parte2 : ''}`.trim();
  }  

  isPedidoInvalido(): boolean {
    if (this.deliveryMethod === 'delivery') {
      return !this.direccion.trim() || !this.telefono.trim() || !this.paymentMethod;
    }
    return !this.paymentMethod;
  }
  
}