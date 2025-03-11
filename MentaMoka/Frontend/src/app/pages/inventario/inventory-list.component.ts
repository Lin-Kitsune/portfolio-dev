import { Component, inject, OnInit } from '@angular/core';
import { InventoryService } from '../../Service/inventory.service';
import { Ingredient } from '../../models/inventory.model'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent implements OnInit {

  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  ingredients: Ingredient[] = []; // ✅ Ahora sí está bien definido

  async ngOnInit() {
    this.inventoryService.getIngredients().subscribe(data => {
      this.ingredients = data;
    });
  }

  goToAddIngredient() {
    this.router.navigate(['/admin/inventory/create']);
  }

  goToEditIngredient(id: string | undefined) {
    if (!id) {
      alert('⚠️ Error: El ingrediente no tiene un ID válido.');
      return;
    }
    this.router.navigate([`/admin/inventory/edit/${id}`]);
  }

    async deleteIngredient(id: string | undefined) {
    if (!id) {
        alert('⚠️ Error: No se puede eliminar un ingrediente sin ID.');
        return;
        }

        if (confirm('¿Seguro que deseas eliminar este ingrediente?')) {
            await this.inventoryService.deleteIngredient(id);
            alert('✅ Ingrediente eliminado');
        }
    }
}
