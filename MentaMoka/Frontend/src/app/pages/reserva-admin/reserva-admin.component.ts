import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../Service/firestore.service';
import { Reserva } from '../../models/reservas.model';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-reserva-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './reserva-admin.component.html',
})
export class ReservaAdminComponent implements OnInit {
  reservas: Reserva[] = [];
  filteredReservas: Reserva[] = [];

  searchQuery: string = '';
  selectedStatus: string = '';
  sortOrder: 'recientes' | 'antiguas' | '' = '';

  constructor(
    private firestoreService: FirestoreService,
    private firestore: Firestore 
  ) {}  

  ngOnInit() {
    this.firestoreService.getAllReservas().subscribe(async (reservas) => {
      const reservasConCorreo = await Promise.all(
        reservas.map(async (reserva) => {
          const userDoc = doc(this.firestore, `users/${reserva.user_id}`);
          const userSnap = await getDoc(userDoc);
          const email = userSnap.exists() ? userSnap.data()['email'] : 'Desconocido';
          return { ...reserva, email }; // ✅ agrega el campo a cada reserva
        })
      );
  
      this.reservas = reservasConCorreo;
      this.filteredReservas = [...this.reservas];
    });
  }  

  applyFilters(): void {
    this.filteredReservas = this.reservas
      .filter(r =>
        (!this.searchQuery || r.table_number.toString().includes(this.searchQuery) || r.date.includes(this.searchQuery)) &&
        (!this.selectedStatus || r.status === this.selectedStatus)
      )
      .sort((a, b) => {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        if (this.sortOrder === 'recientes') return bTime - aTime;
        if (this.sortOrder === 'antiguas') return aTime - bTime;
        return 0;
      });
  }

  cambiarEstado(reserva: Reserva, nuevoEstado: 'pendiente' | 'confirmada' | 'cancelada') {
    this.firestoreService.updateReservaStatus(reserva.id, nuevoEstado).then(() => {
      reserva.status = nuevoEstado;
    });
  }
}
