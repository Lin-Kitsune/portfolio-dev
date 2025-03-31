import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// import
import { ModalCalendarioComponent } from './../turnos/calendario/modal-calendario.component';
import { ModalCrearTrabajadorComponent } from './../turnos/crear-trabajador/modal-crear-trabajador.component';
import { ModalAsignarTurnoComponent } from './../turnos/modal-asignar/modal-asignar-turno.component';

@Component({
  selector: 'app-admin-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalCalendarioComponent, ModalCrearTrabajadorComponent, ModalAsignarTurnoComponent  ],
  templateUrl: './admin-turnos.component.html',
})
export class AdminTurnosComponent implements OnInit {
  private firestore = inject(Firestore);
  private router = inject(Router);

  trabajadores: any[] = [];
  filteredUsers: any[] = [];
  visibleUsers: any[] = [];

  searchText = '';
  searchEmail = '';
  selectedDate = '';
  sortOrder = '';

  // 🔄 Paginación
  currentPage = 1;
  pageSize = 5;

  //Calendario
  selectedUser: any = null;
  selectedUserId: string = '';
  modalOpen = false;

  //Crear trabajdor
  modalCrearOpen = false;

  // Asignar turnos
  modalAsignarOpen = false;

  get totalPages() {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  async ngOnInit() {
    const snapshot = await getDocs(collection(this.firestore, 'trabajadores'));
    this.trabajadores = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    this.applyFilters();
    this.cargarTrabajadores();
  }

  applyFilters() {
    let users = [...this.trabajadores];

    if (this.searchText.trim()) {
      users = users.filter(user =>
        user.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.searchEmail.trim()) {
      users = users.filter(user =>
        user.email.toLowerCase().includes(this.searchEmail.toLowerCase())
      );
    }

    if (this.selectedDate) {
      users = users.filter(user =>
        user.turnos?.some((t: any) => t.date === this.selectedDate)
      );
    }

    if (this.sortOrder === 'asc') {
      users.sort((a, b) => this.getFirstTurnoDate(a) > this.getFirstTurnoDate(b) ? 1 : -1);
    } else if (this.sortOrder === 'desc') {
      users.sort((a, b) => this.getFirstTurnoDate(a) < this.getFirstTurnoDate(b) ? 1 : -1);
    }

    this.filteredUsers = users;
    this.currentPage = 1;
    this.updateVisibleUsers();
  }

  getFirstTurnoDate(user: any): string {
    return user.turnos?.[0]?.date || '';
  }

  updateVisibleUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.visibleUsers = this.filteredUsers.slice(start, end);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisibleUsers();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateVisibleUsers();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateVisibleUsers();
  }

  editarTurnos(user: any) {
    this.router.navigate(['/admin-create-user'], {
      queryParams: { tipo: 'trabajador', editId: user.id }
    });
  }

  async eliminarUsuario(userId: string) {
    if (confirm('¿Estás seguro de eliminar este trabajador?')) {
      await deleteDoc(doc(this.firestore, 'trabajadores', userId));
      this.trabajadores = this.trabajadores.filter(user => user.id !== userId);
      this.applyFilters();
    }
  }

  verCalendario(user: any) {
    this.selectedUser = user;
    this.selectedUserId = user.id; 
    this.modalOpen = true;
  }

  cargarTrabajadores() {
    const colRef = collection(this.firestore, 'trabajadores');
    getDocs(colRef).then((snapshot) => {
      this.trabajadores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
  }

  abrirModalCrear() {
    this.modalCrearOpen = true;
  }
  
  cerrarModalCrear() {
    this.modalCrearOpen = false;
  }
  
  actualizarLista() {
    this.cargarTrabajadores();
  }

  abrirAsignadorTurnos() {
    this.modalAsignarOpen = true;
  }
  
  cerrarModalAsignar() {
    this.modalAsignarOpen = false;
  }
  
}
