import { Component, Input, OnChanges } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid/index.js';
import timeGridPlugin from '@fullcalendar/timegrid/index.js';
import esLocale from '@fullcalendar/core/locales/es.js';
import interactionPlugin from '@fullcalendar/interaction/index.js';

import { ModalTurnoComponent } from '../modal-turno/modal-turno.component';


@Component({
  selector: 'app-modal-calendario',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ModalTurnoComponent],
  templateUrl: './modal-calendario.component.html',
})
export class ModalCalendarioComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() nombre = '';
  @Input() turnos: any[] = [];
  @Input() selectedUserId!: string;
  
  calendarPlugins = [dayGridPlugin, timeGridPlugin];
  calendarEvents: any[] = [];
  turnoEditModalOpen = false;
  selectedTurnoIndex!: number;

  turnoNuevoModalOpen = false;
  nuevoTurnoFecha = '';
  nuevoTurnoHora = '';

    turnoModalOpen = false;
    modoModal: 'crear' | 'editar' = 'crear';
    turnoIndex!: number;
    fechaBase = '';
    horaBase = '';

    calendarOptions: any = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin ],
        initialView: 'timeGridWeek',
        locale: esLocale,
        height: 500,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [],
        eventClick: this.onEventClick.bind(this), 
        dateClick: this.onDateClick.bind(this)    
      };      

      private firestore = inject(Firestore);
  
  ngOnChanges() {
    if (this.isOpen && this.turnos?.length > 0) {
      this.calendarOptions.events = this.turnos.map(turno => ({
        title: `${this.nombre}`,
        start: `${turno.date}T${turno.start}`,
        end: `${turno.date}T${turno.end}`,
        color: '#A67B5B',
      }));
    }
  }  

  close() {
    this.isOpen = false;
  }

  onEventClick(info: any) {
    const fecha = info.event.startStr.split('T')[0];
    const hora = info.event.startStr.split('T')[1].slice(0, 5);
  
    const index = this.turnos.findIndex(t => t.date === fecha && t.start === hora);
    if (index !== -1) {
      this.turnoIndex = index;
      this.modoModal = 'editar';
      this.turnoModalOpen = true;
    }
  }

async refrescarTurnos() {
    if (!this.selectedUserId) return;
  
    const ref = doc(this.firestore, 'trabajadores', this.selectedUserId);
    const snap = await getDoc(ref);
    const user: any = snap.data();
  
    this.turnos = user.turnos || [];
  
    this.calendarOptions.events = this.turnos.map((t: any) => ({
      title: this.nombre,
      start: `${t.date}T${t.start}`,
      end: `${t.date}T${t.end}`,
      color: '#A67B5B',
    }));
  }

  onDateClick(info: any) {
    console.log('📅 dateClick detectado:', info); // 👈 prueba visual
  
    const [fecha, hora] = info.dateStr.split('T');
    this.fechaBase = fecha;
    this.horaBase = hora?.slice(0, 5) || '08:00';
    this.modoModal = 'crear';
    this.turnoModalOpen = true;
  }
  
}
