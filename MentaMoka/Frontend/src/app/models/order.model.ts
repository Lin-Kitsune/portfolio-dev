export type EstadoPedidoExtendido = 'pendiente' | 'pagado' | 'cancelado' | 'en_preparacion' | 'listo' | 'entregado';
export type TipoPedido = 'tienda' | 'delivery';

export interface Order {
  id?: string;
  userId: string;
  products: OrderProduct[];
  total: number;
  createdAt: Date;

  // Estado del flujo general de pago + preparación
  status: EstadoPedidoExtendido;

  // NUEVOS CAMPOS para flujo interno y pantalla de pedidos
  numero?: number; // Número de orden visible en pantalla fast-food
  tipo?: TipoPedido;

  paymentMethod?: string;

  // Datos solo si es delivery
  datosEntrega?: {
    nombre: string;
    direccion: string;
    telefono: string;
    referencia?: string;
  };

  // Datos solo si es en tienda
  mesa?: string;
}

export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;

  // Soporte para variantes/personalizaciones
  variants?: {
    [key: string]: string;
  };
}