export interface Mesa {
    id?: string;
    numero: number;          // Número de la mesa
    disponible: boolean;     // Si la mesa está disponible o no
    reserva_id?: string;    // ID de la reserva si está ocupada
  }
  