import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, addDoc, doc, updateDoc, deleteDoc, getDoc, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { InventoryService } from './inventory.service';
import { Product } from '../models/product.model';  // 🔥 Importa desde aquí siempre
import { Ingredient } from '../models/inventory.model'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private firestore = inject(Firestore);
  private inventoryService = inject(InventoryService);

  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products'); 
    return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  // 🆕 Método para cargar productos y calcular stock de inmediato
  async getProductsWithStock(): Promise<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    const snapshot = await getDocs(productsCollection);
    const productos: Product[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as Product;
      const product: Product = {
        ...data,
        id: docSnap.id,
        stock: await this.calculateProductStock(data)  // 👈 Agrega stock calculado
      };
      productos.push(product);
    }

    return productos;
  }

  async addProduct(product: Product): Promise<void> {
    const productsCollection = collection(this.firestore, 'products');
  
    // Si no trae sizes, los generamos automáticamente a partir del precio base
    if (!product.sizes || product.sizes.length === 0) {
      product.sizes = [
        { label: 'normal', price: product.price, multiplier: 1 },
        { label: 'mediano', price: product.price * 1.25, multiplier: 1.25 },
        { label: 'grande', price: product.price * 1.5, multiplier: 1.5 }
      ];
    }
  
    await addDoc(productsCollection, {
      ...product,
      created_at: new Date().toISOString()
    });
  }  

async updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const productDoc = doc(this.firestore, 'products', id);
  await updateDoc(productDoc, { ...product });

  // 🔥 Descontar ingredientes del inventario si se actualizan
  // await this.updateIngredientStockAfterSale(product as Product);
}


  async deleteProduct(id: string): Promise<void> {
    const productDoc = doc(this.firestore, 'products', id); 
    await deleteDoc(productDoc);
  }

  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(this.firestore, 'products', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const product = docSnap.data() as Product;
    product.stock = await this.calculateProductStock(product);
    return product;
  }
 /**
   * Calcula cuántas unidades del producto pueden hacerse con los ingredientes disponibles.
   */
 private async calculateProductStock(product: Product): Promise<number> {
  if (!product.ingredients || product.ingredients.length === 0) {
      console.warn(`⚠️ Producto "${product.name}" no tiene ingredientes.`);
      return 0;
  }

  try {
      // 🔥 Obtener ingredientes desde Firestore
      const inventory: Ingredient[] = await this.inventoryService.getAllIngredients();

      if (!inventory || inventory.length === 0) {
          console.warn('⚠️ No hay ingredientes en el inventario.');
          return 0;
      }

      // 🔥 Calcular cuántas unidades del producto pueden hacerse con los ingredientes disponibles
      const ingredientStocks = product.ingredients.map((productIngredient) => {
          const inventoryIngredient = inventory.find((inv) => inv.id === productIngredient.id);

          if (!inventoryIngredient) {
              console.warn(`⚠️ Ingrediente "${productIngredient.name}" no encontrado en inventario.`);
              return 0;
          }

          // ✅ Verificar unidades de medida y evitar errores
          if (inventoryIngredient.unit !== productIngredient.unit) {
              console.warn(`⚠️ Unidad de medida diferente para "${productIngredient.name}"`);
              return 0;
          }

          // ✅ Verificar stock y calcular el número de productos que se pueden hacer
          const stockDisponible = inventoryIngredient.stock ?? 0;
          const cantidadRequerida = productIngredient.quantity ?? 1;

          return Math.floor(stockDisponible / cantidadRequerida);
      });

      return Math.min(...ingredientStocks); // El mínimo define cuántos productos se pueden hacer
  } catch (error) {
      console.error('❌ Error calculando stock del producto:', error);
      return 0;
  }
}

async updateIngredientStockAfterSale(product: Product): Promise<void> {
  try {
      for (const productIngredient of product.ingredients) {
          const ingredient = await this.inventoryService.getIngredientById(productIngredient.id);

          if (!ingredient || ingredient.stock < productIngredient.quantity) {
              console.warn(`⚠️ No hay suficiente "${productIngredient.name}" en inventario.`);
              continue;
          }

          // 🔥 Restar la cantidad usada del stock del inventario
          const newStock = ingredient.stock - productIngredient.quantity;
          await this.inventoryService.updateIngredient(productIngredient.id, { stock: newStock });
      }
  } catch (error) {
      console.error('❌ Error actualizando stock después de venta:', error);
  }
}

getProductoConIngredientes(productId: string) {
  const productoRef = doc(this.firestore, 'products', productId);
  return getDoc(productoRef).then(doc => doc.data());
}

getUltimasNovedades(): Promise<Product[]> {
  const productosRef = collection(this.firestore, 'products');
  const q = query(productosRef, orderBy('created_at', 'desc'), limit(5));

  return getDocs(q).then(snapshot => {
    return snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as Product;
    });
  });
}

}