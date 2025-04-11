import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Category {
  id?: string;
  name: string;
  image_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private firestore = inject(Firestore);
  private categoryCollection = collection(this.firestore, 'categories');

  // Obtener categorías como un Observable
  getCategories(): Observable<Category[]> {
    return collectionData(this.categoryCollection, { idField: 'id' }) as Observable<Category[]>;
  }

  // Agregar una nueva categoría a Firestore
  async addCategory(name: string, image_url?: string): Promise<void> {
    await addDoc(this.categoryCollection, { name, image_url });
  }  
}
