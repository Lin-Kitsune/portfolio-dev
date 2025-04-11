import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../models/product.model';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-client.component.html',
  styleUrls: ['./menu-client.component.scss'],
})
export class MenuClientComponent implements OnInit {
  products: Product[] = [];
  categories$: Observable<any[]>;
  categoriasConProductos: { nombre: string, productos: Product[] }[] = [];
  selectedCategory: string | null = null;

  constructor(private productService: ProductService, private firestore: Firestore) {
    const categoriesRef = collection(this.firestore, 'categories');
    this.categories$ = collectionData(categoriesRef, { idField: 'id' });
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;

      this.categories$?.subscribe((categorias: any[]) => {
        this.categoriasConProductos = categorias
          .map((cat: any) => ({
            nombre: cat.name,
            productos: this.products.filter(p => p.category === cat.name),
          }))
          .filter((cat: { nombre: string; productos: Product[] }) => cat.productos.length > 0);
      });
    });
  }

  selectCategory(nombre: string) {
    this.selectedCategory = this.selectedCategory === nombre ? null : nombre;
  }  

  filterByCategory(category: string) {
    this.selectedCategory = category;
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }

  isActive(category: string): boolean {
    return this.selectedCategory === category;
  }
}
