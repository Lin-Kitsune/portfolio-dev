import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../Service/inventory.service';
import { Ingredient } from '../../models/inventory.model';  
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inventory-form.component.html'
})
export class InventoryFormComponent implements OnInit {

  private inventoryService = inject(InventoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ingredient: Ingredient = {
    name: '',
    quantity: 0,
    unit: 'units', // ahora TypeScript lo reconoce como válido
    stock: 0,
    image_url: '', 
  } as Ingredient;  
  
  ingredientId: string | null = null;

  ngOnInit() {
    this.ingredientId = this.route.snapshot.paramMap.get('id');
    if (this.ingredientId) {
      this.loadIngredient(this.ingredientId);
    }
  }

  async loadIngredient(id: string) {
    const ingredientData = await this.inventoryService.getIngredientById(id);
    if (ingredientData) {
      this.ingredient = ingredientData;
    } else {
      alert('❌ Ingrediente no encontrado');
      this.router.navigate(['/admin/inventory']);
    }
  }

  async saveIngredient() {
    if (this.ingredient.stock === undefined) {
      this.ingredient.stock = 0;  // establece a 0 si no se indicó
    }
  
    if (this.ingredientId) {
      await this.inventoryService.updateIngredient(this.ingredientId, this.ingredient);
      alert('✅ Ingrediente actualizado con éxito');
    } else {
      await this.inventoryService.addIngredient(this.ingredient);
      alert('✅ Ingrediente agregado con éxito');
    }
    this.router.navigate(['/admin/inventory']);
  }  
}
