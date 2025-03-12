import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../Service/product.service';
import { Product } from '../../../models/product.model';
import { CartService } from '../../../Service/cart.service'; // ✅ Importamos el servicio del carrito

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component-client.html',
  styleUrls: ['./product-list.component-client.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  customizableOnly: boolean = false;
  discountOnly: boolean = false;
  hovering: string | null | undefined = null;

  selectedProduct: Product | null = null; // ✅ Guarda el producto seleccionado
  selectedSize: string = ''; // ✅ Guarda el tamaño seleccionado

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      const matchesMinPrice = this.minPrice !== null ? product.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? product.price <= this.maxPrice : true;
      const matchesCustomizable = this.customizableOnly ? product.customizable : true;
      const matchesDiscount = this.discountOnly ? product.discount > 0 : true;

      return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesCustomizable && matchesDiscount;
    });
  }

// ✅ Ajustamos la animación para hacerla más rápida (150ms en lugar de 200ms)
openModal(product: Product) {
  this.selectedProduct = product;
  this.selectedSize = ''; // Reiniciamos la selección
  setTimeout(() => {
      document.querySelector('.scale-95')?.classList.remove('scale-95', 'opacity-0');
  }, 10);
}

closeModal() {
  const modalElement = document.querySelector('.scale-100');
  if (modalElement) {
      modalElement.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
          this.selectedProduct = null;
          this.selectedSize = '';
      }, 150);
  } else {
      this.selectedProduct = null;
      this.selectedSize = '';
  }
}

  // ✅ Agregar al carrito con tamaño seleccionado
  addToCart() {
    if (this.selectedProduct && this.selectedSize) {
      const productToAdd = { ...this.selectedProduct, size: this.selectedSize };
      this.cartService.addToCart(productToAdd, this.selectedSize);
      console.log('🛒 Producto añadido al carrito:', productToAdd);
      this.closeModal();
    } else {
      alert("Por favor, selecciona un tamaño.");
    }
  }
}