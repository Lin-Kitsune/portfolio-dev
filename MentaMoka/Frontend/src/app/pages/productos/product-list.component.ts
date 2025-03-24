import { Component, inject, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';  
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../models/product.model'

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit {

  private productService = inject(ProductService);
  private router = inject(Router);

  products: Product[] = [];
  filteredProducts: Product[] = [];

  searchText: string = '';
  selectedCategory: string = '';
  sortOrder: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 5;

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  availableCategories: string[] = [];

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.availableCategories = [...new Set(products.map(p => p.category))];
        this.applyFilters();
      },
      error: (err) => console.error('❌ Error cargando productos:', err),
    });
  }

  applyFilters(): void {
    const filtered = this.products
      .filter(product =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.selectedCategory ? product.category === this.selectedCategory : true)
      )
      .sort((a, b) => {
        if (this.sortOrder === 'asc') return (a.stock ?? 0) - (b.stock ?? 0);
        if (this.sortOrder === 'desc') return (b.stock ?? 0) - (a.stock ?? 0);        
        return 0;
      });

    this.currentPage = 1;
    this.filteredProducts = filtered;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredProducts = this.filteredProducts.slice(start, end);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  goToEdit(id: string): void {
    this.router.navigate(['/admin/products/edit', id]);
  }

  async deleteProduct(id: string): Promise<void> {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await this.productService.deleteProduct(id);
      alert('✅ Producto eliminado');
      this.products = this.products.filter(p => p.id !== id);
      this.applyFilters();
    }
  }
}
