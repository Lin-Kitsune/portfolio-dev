export interface Product {
    id?: string;  // Opcional, ya que Firestore genera el ID automáticamente
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    customizable: boolean;
    discount?: number;  // Opcional, por si algunos productos no tienen descuento
    created_at: string; // Almacenado como ISO string en Firestore
    options?: {
      milk?: string[];  // Opciones de leche (Entera, Descremada, etc.)
      sugar?: string[]; // Opciones de azúcar (Stevia, Rubia, Blanca)
    };
  }
  