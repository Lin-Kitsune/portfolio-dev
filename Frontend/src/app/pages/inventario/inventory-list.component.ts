import { Component, inject, OnInit } from '@angular/core';
import { InventoryService } from '../../Service/inventory.service';
import { Ingredient } from '../../models/inventory.model'; 
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-list.component.html'
})
export class InventoryListComponent implements OnInit {

  private inventoryService = inject(InventoryService);
  private router = inject(Router);

  ingredients: Ingredient[] = []; 
  filteredIngredients: Ingredient[] = [];
  
  searchText: string = '';
  selectedType = '';
  sortOrder = ''; // 'asc' o 'desc'
  selectedUnit: string = '';

  // Control de páginas
  currentPage = 1;
  itemsPerPage = 5;

  async ngOnInit() {
    this.inventoryService.getIngredients().subscribe(data => {
      this.ingredients = data;
      this.filteredIngredients = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredIngredients = this.ingredients
      .filter(ingredient =>
        ingredient.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
        (this.selectedType ? ingredient.type === this.selectedType : true) &&
        (this.selectedUnit ? ingredient.unit === this.selectedUnit : true)
      )
      .sort((a, b) => {
        if (this.sortOrder === 'asc') return a.stock - b.stock;
        if (this.sortOrder === 'desc') return b.stock - a.stock;
        return 0;
      });
  
    this.currentPage = 1; // ← 🔥 resetear a la primera página después de filtrar
  }  
  
  filterIngredients() {
    const query = this.searchText.trim().toLowerCase();
    this.filteredIngredients = this.ingredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(query)
    );
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

    get totalPages(): number {
      return Math.ceil(this.filteredIngredients.length / this.itemsPerPage);
    }
    
    get totalPagesArray(): number[] {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    
    get paginatedIngredients() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredIngredients.slice(start, end);
    }
    
    goToPage(page: number) {
      this.currentPage = page;
    }
    
    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
    
    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
}
