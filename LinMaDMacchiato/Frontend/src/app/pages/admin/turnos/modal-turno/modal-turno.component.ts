import { Component, Input, Output, EventEmitter, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-modal-turno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-turno.component.html',
})
export class ModalTurnoComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() userId!: string;
  @Input() modo: 'editar' | 'crear' = 'crear';
  @Input() turnoIndex?: number;
  @Input() fechaBase: string = '';
  @Input() horaBase: string = '';

  @Output() cerrar = new EventEmitter();
  @Output() turnoModificado = new EventEmitter();

  date = '';
  start = '';
  end = '';

  private firestore = inject(Firestore);

  async ngOnChanges() {
    if (this.isOpen && this.modo === 'editar' && this.userId && this.turnoIndex !== undefined) {
      const ref = doc(this.firestore, 'trabajadores', this.userId);
      const snap = await getDoc(ref);
      const user: any = snap.data();
      const turno = user.turnos?.[this.turnoIndex];

      if (turno) {
        this.date = turno.date;
        this.start = turno.start;
        this.end = turno.end;
      }
    } else if (this.isOpen && this.modo === 'crear') {
      this.date = this.fechaBase;
      this.start = this.horaBase;
      this.end = ''; // por definir por el usuario
    }
  }

  async guardarTurno() {
    const ref = doc(this.firestore, 'trabajadores', this.userId);
    const snap = await getDoc(ref);
    const user: any = snap.data();

    if (this.modo === 'editar' && this.turnoIndex !== undefined) {
      user.turnos[this.turnoIndex] = { date: this.date, start: this.start, end: this.end };
    } else {
      user.turnos = user.turnos || [];
      user.turnos.push({ date: this.date, start: this.start, end: this.end });
    }

    await updateDoc(ref, { turnos: user.turnos });

    this.turnoModificado.emit();
    this.cerrar.emit();
  }

  async eliminarTurno() {
    const confirmDelete = confirm('¿Eliminar este turno?');
    if (!confirmDelete) return;

    const ref = doc(this.firestore, 'trabajadores', this.userId);
    const snap = await getDoc(ref);
    const user: any = snap.data();

    user.turnos.splice(this.turnoIndex!, 1);
    await updateDoc(ref, { turnos: user.turnos });

    this.turnoModificado.emit();
    this.cerrar.emit();
  }
}
