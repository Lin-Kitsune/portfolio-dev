// product-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';  
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../models/product.model'

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]>;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts();
  }

  ngOnInit() {
    this.products$.subscribe({
      next: (products) => console.log('🔥 Productos cargados:', products),
      error: (err) => console.error('❌ Error cargando productos:', err),
    });
  }

  async deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await this.productService.deleteProduct(id);
      alert('✅ Producto eliminado');
    }
  }
}

