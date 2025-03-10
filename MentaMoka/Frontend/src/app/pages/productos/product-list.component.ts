import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';  
import { ProductService } from '../../Service/product.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  
  products$: Observable<Product[]>| undefined;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products$ = this.productService.getProducts();
    this.products$.subscribe(products => {
      console.log('Productos cargados desde Firestore:', products);
    });
  }

  async deleteProduct(id: string) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await this.productService.deleteProduct(id);
      alert('✅ Producto eliminado');
    }
  }
}
