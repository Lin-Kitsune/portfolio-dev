// src/app/models/cart-item.model.ts

import { Product } from './product.model';

export interface CartItem extends Product {
  size: string;
  quantity: number;
  selectedOptions: {
    milk?: string;
    sugar?: string;
    [key: string]: string | undefined;
  };
}
