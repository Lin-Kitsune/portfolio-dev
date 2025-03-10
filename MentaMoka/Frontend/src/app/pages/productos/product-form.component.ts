import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../Service/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {

  private productService = inject(ProductService);
  private router = inject(Router);

  product: Product = {
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    image_url: '',
    customizable: false,
    discount: 0,
    options: {
      milk: [],
      sugar: []
    },
    created_at: new Date().toISOString()
  };

  async saveProduct() {
    await this.productService.addProduct(this.product);
    alert('✅ Producto agregado con éxito');
    this.router.navigate(['/admin/products']);
  }
}
