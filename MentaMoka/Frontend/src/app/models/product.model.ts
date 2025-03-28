export interface ProductIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'units' | 'g' | 'ml';
}

export interface ProductSizeConfig {
  label: 'normal' | 'mediano' | 'grande';
  price: number;
  multiplier: number; // Multiplica las cantidades de ingredientes
}

export interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number; // 👉 puedes seguir mostrándolo como "precio base" o el de tamaño normal
  stock?: number;
  image_url: string;
  customizable: boolean;
  discount: number;
  options: {
    milk: string[];
    sugar: string[];
  };
  ingredients: ProductIngredient[];
  created_at: string;

  // 🆕 Nuevo campo para manejar precios y cantidades según tamaño
  sizes: ProductSizeConfig[];
}
