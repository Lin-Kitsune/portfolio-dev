import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model'; // 👈 Modelo correcto aquí
import { ProductService } from '../../Service/product.service';
import { InventoryService } from '../../Service/inventory.service';
import { CategoryService, Category } from '../../Service/category.service'; // 🔥 Servicio de categorías
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ingredient } from '../../models/inventory.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NgSelectModule, FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
    ingredients: [],
    sizes: [],
    created_at: new Date().toISOString()
  };
    
  productId: string | null = null;
  availableIngredients: Ingredient[] = [];
  selectedIngredient: string | null = null;
  selectedQuantity: number = 1;

  // 🔥 Agregamos soporte para categorías
  categories: Category[] = [];
  newCategory: string = '';

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id'); 
    if (this.productId) {
      this.loadProduct(this.productId);
    }

    // 🔥 Cargar ingredientes disponibles en inventario
    this.inventoryService.getIngredients().subscribe({
      next: (ingredients) => {
        this.availableIngredients = ingredients.map(i => ({
          ...i,
          label: `${i.name} (Stock: ${i.stock})`
        }));
      },
      error: (err) => {
        console.error("Error cargando ingredientes:", err);
      }
    });    

    // 🔥 Cargar categorías desde Firestore
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error("Error cargando categorías:", err);
      }
    });
  }

  async loadProduct(id: string) {
    const productData = await this.productService.getProductById(id);
    if (productData) {
      this.product = productData;
    } else {
      alert('❌ Producto no encontrado');
      this.router.navigate(['/admin/products']);
    }
  }

  /**
   * ➕ Agrega un ingrediente seleccionado al producto
   */
  addIngredient() {
    if (!this.selectedIngredient || this.selectedQuantity <= 0) return;

    const ingredient = this.availableIngredients.find(i => i.id === this.selectedIngredient);
    if (!ingredient) {
      alert("⚠️ Ingrediente seleccionado no válido.");
      return;
    }

    const existingIngredient = this.product.ingredients.find(i => i.id === ingredient.id);

    if (existingIngredient) {
      existingIngredient.quantity += this.selectedQuantity;
    } else {
      this.product.ingredients.push({
        id: ingredient.id,
        name: ingredient.name,
        quantity: this.selectedQuantity,
        unit: ingredient.unit,  // 🔥 Ahora incluye unidad
      });
    }

    this.selectedIngredient = null;
    this.selectedQuantity = 1;
  }

  /**
   * ➕ Agrega una nueva categoría a Firestore y la muestra en el select
   */
  async addCategory() {
    if (this.newCategory.trim()) {
      await this.categoryService.addCategory(this.newCategory);
      this.newCategory = ''; // 🔥 Limpiar el campo después de agregar
    }
  }

  /**
   * ❌ Elimina un ingrediente de la lista
   */
  removeIngredient(ingredientId: string) {
    this.product.ingredients = this.product.ingredients.filter(i => i.id !== ingredientId);
  }

  /**
   * 💾 Guarda o actualiza el producto
   */
  async saveProduct() {
    if (this.product.ingredients.length === 0) {
      alert("⚠️ Un producto debe tener al menos un ingrediente.");
      return;
    }

    if (this.productId) {
      await this.productService.updateProduct(this.productId, this.product);
      alert('✅ Producto actualizado con éxito');
    } else {
      await this.productService.addProduct(this.product);
      alert('✅ Producto agregado con éxito');
    }
    this.router.navigate(['/admin/products']);
  }
}
