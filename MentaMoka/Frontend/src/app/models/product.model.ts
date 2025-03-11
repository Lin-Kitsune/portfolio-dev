export interface ProductIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: 'units' | 'g' | 'ml'; 
}

export interface Product {
  id?: string; // 🔥 AÑADIR ESTA LÍNEA
  name: string;
  category: string;
  description: string;
  price: number;
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
}
