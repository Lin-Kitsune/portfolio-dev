import { Product, ProductIngredient } from './product.model';

export interface CartItem extends Product {
  size?: 'normal' | 'mediano' | 'grande';
  quantity: number;
  selectedOptions: {
    milk?: string;
    sugar?: string;
    [key: string]: string | undefined;
  };
}
