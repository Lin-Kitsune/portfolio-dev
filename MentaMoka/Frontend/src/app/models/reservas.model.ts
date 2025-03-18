export interface Reserva {
    id: string;
    user_id: string;
    date: string;
    time: string;
    guests: number;
    payment_status: 'pagado' | 'pendiente';
    special_request: string;
    status: 'pendiente' | 'confirmada' | 'cancelada';
    table_number: number;
    created_at: string;
  }
  