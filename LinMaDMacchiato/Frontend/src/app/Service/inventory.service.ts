import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable, firstValueFrom  } from 'rxjs';
import { Ingredient } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private firestore = inject(Firestore);
  private inventoryCollection = collection(this.firestore, 'inventory');

  getIngredients(): Observable<Ingredient[]> {
    return collectionData(this.inventoryCollection, { idField: 'id' }) as Observable<Ingredient[]>;
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    const ingredientsSnapshot = await firstValueFrom(this.getIngredients());
    
    return ingredientsSnapshot.map((ingredient) => ({
        id: ingredient.id,
        name: ingredient.name,
        stock: ingredient.stock ?? 0,  // 🔥 Asegurar que stock nunca sea undefined
        quantity: ingredient.quantity ?? 1, // 🔥 Asegurar que quantity no sea undefined
        unit: ingredient.unit ?? 'g',  // 🔥 Evitar que unit sea undefined
        image_url: ingredient.image_url ?? '',
        type: ingredient.type || 'other'
    }));
}
  
  async addIngredient(ingredient: Ingredient) {
    const docRef = doc(this.inventoryCollection);
    await setDoc(docRef, ingredient);
  }

  async deleteIngredient(id: string) {
    await deleteDoc(doc(this.firestore, 'inventory', id));
  }

  async getIngredientStock(ingredientId: string): Promise<number | null> {
    const docRef = doc(this.firestore, 'inventory', ingredientId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
  
    const data = docSnap.data() as { stock: number } | undefined;
    return data?.stock ?? null;
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    const docRef = doc(this.firestore, 'inventory', id);
    const docSnap = await getDoc(docRef);
  
    if (!docSnap.exists()) {
      return null;
    }
  
    return { id: docSnap.id, ...docSnap.data() } as Ingredient;
  }
  
  async updateIngredient(id: string, ingredient: Partial<Ingredient>): Promise<void> {
    const docRef = doc(this.firestore, 'inventory', id);
  
    // 🔍 Verifica exactamente qué estás mandando a Firestore
    console.log(`🔥 updateIngredient → ID: ${id}`, ingredient);
  
    await setDoc(docRef, ingredient, { merge: true });
  }  
   
}
