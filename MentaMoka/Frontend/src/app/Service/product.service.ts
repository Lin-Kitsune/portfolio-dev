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

  constructor() {} 

  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products'); // ✅ Se obtiene la colección correctamente
    const productsQuery = query(productsCollection); // ✅ Convertimos la colección en una consulta válida
    return collectionData(productsQuery, { idField: 'id' }) as Observable<Product[]>; // ✅ Se usa correctamente
  }

  async addProduct(product: Product): Promise<void> {
    const productsCollection = collection(this.firestore, 'products'); // ✅ Se obtiene la colección en el momento de la inserción
    await addDoc(productsCollection, { ...product, created_at: new Date().toISOString() });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const productDoc = doc(this.firestore, 'products', id); // ✅ Se obtiene la referencia del documento correctamente
    await updateDoc(productDoc, { ...product });
  }

  async deleteProduct(id: string): Promise<void> {
    const productDoc = doc(this.firestore, 'products', id); // ✅ Se obtiene la referencia del documento correctamente
    await deleteDoc(productDoc);
  }
}

