import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-modal-crear-trabajador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-crear-trabajador.component.html',
})
export class ModalCrearTrabajadorComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter();
  @Output() trabajadorCreado = new EventEmitter();

  name = '';
  email = '';
  turnos: { date: string, start: string, end: string }[] = [];

  private firestore = inject(Firestore);

  agregarTurno() {
    this.turnos.push({ date: '', start: '', end: '' });
  }

  async guardar() {
    const duplicados = this.turnos.some((nuevo, i, arr) =>
      arr.findIndex(t =>
        t.date === nuevo.date &&
        t.start === nuevo.start &&
        t.end === nuevo.end
      ) !== i
    );
  
    if (duplicados) {
      alert('⚠️ No puedes agregar turnos duplicados para el mismo trabajador.');
      return;
    }
  
    // continúa el guardado si no hay duplicados
    const userData = {
      name: this.name,
      email: this.email,
      turnos: this.turnos,
      role: 'trabajador',
      createdAt: new Date().toISOString()
    };
  
    const ref = collection(this.firestore, 'trabajadores');
    const docRef = doc(ref);
    await setDoc(docRef, userData);
  
    alert('✅ Trabajador creado correctamente');
    this.trabajadorCreado.emit();
    this.cerrar();
  }  

  cerrar() {
    this.name = '';
    this.email = '';
    this.turnos = [];
    this.close.emit();
  }
}
