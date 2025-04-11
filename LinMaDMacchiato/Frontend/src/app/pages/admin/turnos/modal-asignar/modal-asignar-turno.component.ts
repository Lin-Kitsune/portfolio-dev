import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, updateDoc, collection, getDocs } from '@angular/fire/firestore';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';
import esLocale from '@fullcalendar/core/locales/es.js';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import listPlugin from '@fullcalendar/list/index.js';

@Component({
  selector: 'app-modal-asignar-turno',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './modal-asignar-turno.component.html'
})
export class ModalAsignarTurnoComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter();
  @Output() turnoAsignado = new EventEmitter();

  firestore = inject(Firestore);
  calendarPlugins = [timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin];

  empleados: any[] = [];
  selectedEmpleadoId: string = '';
  start: string = '';
  end: string = '';
  fecha: string = '';

  showForm = false;

  calendarOptions: any = {
    plugins: this.calendarPlugins,
    initialView: 'timeGridWeek',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: (info: any) => this.onDateClick(info),
    events: [] // Se carga en ngOnInit
  };

  async ngOnInit() {
    const ref = collection(this.firestore, 'trabajadores');
    const snapshot = await getDocs(ref);
    this.empleados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const eventos = this.empleados.flatMap((emp: any) =>
      (emp.turnos || []).map((turno: any) => ({
        title: emp.name,
        start: `${turno.date}T${turno.start}`,
        end: `${turno.date}T${turno.end}`,
        color: '#A67B5B'
      }))
    );

    this.calendarOptions.events = eventos;
    await this.cargarEventos();
  }

  onDateClick(info: any) {
    this.showForm = true;
    this.fecha = info.dateStr.split('T')[0];
    this.start = info.dateStr.split('T')[1].slice(0, 5);
    this.end = '';
  }

  async cargarEventos() {
    const ref = collection(this.firestore, 'trabajadores');
    const snapshot = await getDocs(ref);
    this.empleados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
    const eventos = this.empleados.flatMap((emp: any) =>
      (emp.turnos || []).map((turno: any) => ({
        title: emp.name,
        start: `${turno.date}T${turno.start}`,
        end: `${turno.date}T${turno.end}`,
        color: this.getColorFromName(emp.name) // 🎨 Aquí aplicamos el color único
      }))
    );
  
    this.calendarOptions.events = eventos;
  }  

  async guardarTurno() {
    if (!this.selectedEmpleadoId || !this.start || !this.end) return;
  
    const ref = doc(this.firestore, 'trabajadores', this.selectedEmpleadoId);
    const snap = await getDoc(ref);
    const data = snap.data();
  
    const turnos = data && 'turnos' in data ? data['turnos'] : [];
    const duplicado = turnos.some((t: any) =>
      t.date === this.fecha && t.start === this.start && t.end === this.end
    );
  
    if (duplicado) {
      alert('⚠️ Este turno ya está asignado a este trabajador.');
      return;
    }
  
    // ✅ Guardar turno en Firestore
    turnos.push({ date: this.fecha, start: this.start, end: this.end });
    await updateDoc(ref, { turnos });
  
    // ✅ Limpiar form sin cerrar modal
    this.showForm = false;
    this.selectedEmpleadoId = '';
    this.start = this.end = '';
  
    // ✅ Volver a cargar los turnos y refrescar calendario
    await this.cargarEventos();
  
    alert('✅ Turno asignado correctamente.');
  }  

  cerrar() {
    this.showForm = false;
    this.selectedEmpleadoId = '';
    this.close.emit();
  }

  // 🎨 Generador simple de color por nombre
getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convertimos hash en color HEX
  const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, '0')}${((hash >> 16) & 0xff).toString(16).padStart(2, '0')}${((hash >> 8) & 0xff).toString(16).padStart(2, '0')}`;
  return color.length === 7 ? color : '#A67B5B'; // fallback si falla
}

}
