export interface Ingredient {
  id: string;
  name: string;
  stock: number;
  quantity: number;
  unit: 'ml' | 'g' | 'units';
  image_url?: string; // 🔥 Opcional pero recomendado
  type: 'milk' | 'sugar' | 'other'; 
}
