import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../Service/product.service';
import { CartService } from '../../../Service/cart.service'; // ✅ Importamos el servicio del carrito

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];

  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  customizableOnly: boolean = false;
  discountOnly: boolean = false;
  
  hovering: string | null | undefined = null; // ✅ Se mantiene la estructura

  constructor(private productService: ProductService, private cartService: CartService) {} // ✅ Inyectamos el servicio del carrito

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

  // ✅ Agregar producto al carrito
  addToCart(product: Product) {
    this.cartService.addToCart(product);
    console.log('🛒 Producto añadido al carrito:', product);
  }
}
