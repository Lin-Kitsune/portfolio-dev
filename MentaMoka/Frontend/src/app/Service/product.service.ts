import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, addDoc, doc, updateDoc, deleteDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  customizable: boolean;
  discount: number;
  options?: {
    milk?: string[];
    sugar?: string[];
  };
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'products');

  constructor() {}

  // ✅ Corrección: Convertir `productsCollection` en una `query()`
  getProducts(): Observable<Product[]> {
    const productsQuery = query(this.productsCollection); // 🔥 Firestore necesita una `Query`
    return collectionData(productsQuery, { idField: 'id' }) as Observable<Product[]>;
  }

  async addProduct(product: Product): Promise<void> {
    await addDoc(this.productsCollection, { ...product, created_at: new Date().toISOString() });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productDoc = doc(this.firestore, 'products', id);
    await updateDoc(productDoc, { ...product });
  }

  async deleteProduct(id: string): Promise<void> {
    const productDoc = doc(this.firestore, 'products', id);
    await deleteDoc(productDoc);
  }
}

