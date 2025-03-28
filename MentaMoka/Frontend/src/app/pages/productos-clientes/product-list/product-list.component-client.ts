import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../Service/product.service';
import { Product } from '../../../models/product.model';
import { CartService } from '../../../Service/cart.service'; 
import { CartItem } from '../../../models/cart-item.model';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  categories$: Observable<any[]>; // 🔹 Obtiene categorías de Firestore

  searchQuery: string = ''; // 🔍 Estado para el buscador
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = ''; // 🔹 Nuevo estado para ordenar
  hovering: string | null | undefined = null;

  selectedProduct: Product | null = null; 

  selectedMilk: string = '';
  selectedSugar: string = '';
  
  selectedSize: 'normal' | 'mediano' | 'grande' | '' = '';

  milks: string[] = [];
  sugars: string[] = [];

  constructor(private productService: ProductService, private cartService: CartService, private firestore: Firestore) {
    const categoriesRef = collection(this.firestore, 'categories');
    this.categories$ = collectionData(categoriesRef);
  }

  ngOnInit(): void {
  this.productService.getProducts().subscribe((data) => {
    this.products = data;
    this.applyFilters();
  });

  this.loadIngredients(); // Nuevo
}

loadIngredients() {
  const ingredientsRef = collection(this.firestore, 'inventory'); // ✅ nombre correcto de la colección
  collectionData(ingredientsRef, { idField: 'id' }).subscribe((ingredients: any[]) => {
    this.milks = ingredients.filter(i => i.type === 'milk').map(i => i.name);
    this.sugars = ingredients.filter(i => i.type === 'sugar').map(i => i.name);
  });
}

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      const matchesMinPrice = this.minPrice !== null ? product.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? product.price <= this.maxPrice : true;
      const matchesSearch = this.searchQuery.trim() !== '' 
        ? product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) 
        : true;

      return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesSearch;
    });

    this.applySorting(); // 🔹 Aplicamos ordenamiento después de filtrar
  }

  applySorting() {
    if (this.sortBy === 'price-asc') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'name-asc') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'name-desc') {
      this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  openModal(product: Product) {
    this.selectedProduct = product;
    this.selectedSize = ''; 
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

  addToCart() {
    if (
      this.selectedProduct &&
      this.selectedSize &&
      ['normal', 'mediano', 'grande'].includes(this.selectedSize)
    ) {
      const sizeConfig = this.selectedProduct.sizes.find(s => s.label === this.selectedSize);
      const price = sizeConfig?.price ?? this.selectedProduct.price;
  
      const item: CartItem = {
        ...this.selectedProduct,
        price,
        size: this.selectedSize as 'normal' | 'mediano' | 'grande',
        quantity: 1,
        selectedOptions: {
          milk: this.selectedMilk,
          sugar: this.selectedSugar
        }
      };
  
      this.cartService.addToCart(item);
      console.log('🛒 Producto añadido al carrito:', item);
      this.closeModal();
    } else {
      alert("Por favor, selecciona un tamaño válido.");
    }
  } 
  
  getPrecioSeleccionado(): number {
    if (!this.selectedProduct || !this.selectedSize) return 0;
  
    const size = this.selectedProduct.sizes.find(s => s.label === this.selectedSize);
    return size?.price ?? this.selectedProduct.price;
  }
  
}