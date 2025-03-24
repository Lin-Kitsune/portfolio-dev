import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
  where
} from '@angular/fire/firestore';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, user } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.scss']
})
export class SugerenciasComponent {
  estrellas = [1, 2, 3, 4, 5];
  estrellasSeleccionadas = 0;
  comentario = '';
  correo = '';
  permitePublicar = false;

  sugerencias: any[] = [];
  ultimaSugerencia: any = null;
  mostrarVerMas = false;
  cargando = false;

  editandoId: string | null = null;

  firestore = inject(Firestore);
  auth = inject(Auth);

  ngOnInit() {
    this.obtenerCorreoYMostrarSugerencias();
  }

  async obtenerCorreoYMostrarSugerencias() {
    try {
      const usuario = await firstValueFrom(user(this.auth));
      if (usuario?.email) {
        this.correo = usuario.email;
        this.cargarSugerencias(true);
      } else {
        alert('Debes estar autenticado para usar esta sección.');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      alert('Hubo un problema al identificar al usuario.');
    }
  }

  seleccionarEstrella(valor: number) {
    this.estrellasSeleccionadas = valor;
  }

  async enviarSugerencia() {
    if (!this.comentario || this.estrellasSeleccionadas === 0 || !this.correo) {
      alert('Por favor completa la puntuación, comentario y asegúrate de estar autenticado.');
      return;
    }

    const data = {
      estrellas: this.estrellasSeleccionadas,
      comentario: this.comentario,
      correo: this.correo.trim().toLowerCase(),
      permitePublicar: this.permitePublicar,
      fecha: new Date()
    };

    try {
      if (this.editandoId) {
        const docRef = doc(this.firestore, 'suggestions', this.editandoId);
        await updateDoc(docRef, data);
        this.editandoId = null;
        alert('Sugerencia actualizada con éxito.');
      } else {
        await addDoc(collection(this.firestore, 'suggestions'), data);
        alert('¡Gracias por tu sugerencia!');
      }

      this.limpiarFormulario();
      this.cargarSugerencias(true);
    } catch (error) {
      console.error('Error al guardar sugerencia:', error);
      alert('Ocurrió un error al enviar la sugerencia.');
    }
  }

  limpiarFormulario() {
    this.comentario = '';
    this.estrellasSeleccionadas = 0;
    this.permitePublicar = false;
    this.editandoId = null;
  }

  async cargarSugerencias(reset: boolean = false) {
    if (this.cargando || !this.correo) return;
    this.cargando = true;

    const sugerenciasRef = collection(this.firestore, 'suggestions');
    let q = query(
      sugerenciasRef,
      where('correo', '==', this.correo.trim().toLowerCase()),
      orderBy('fecha', 'desc'),
      limit(5)
    );

    if (!reset && this.ultimaSugerencia) {
      q = query(
        sugerenciasRef,
        where('correo', '==', this.correo.trim().toLowerCase()),
        orderBy('fecha', 'desc'),
        startAfter(this.ultimaSugerencia.fecha),
        limit(5)
      );
    }

    try {
      const snapshot = await getDocs(q);
      const nuevas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (reset) {
        this.sugerencias = nuevas;
      } else {
        this.sugerencias = [...this.sugerencias, ...nuevas];
      }

      this.ultimaSugerencia = nuevas.length > 0 ? nuevas[nuevas.length - 1] : null;
      this.mostrarVerMas = nuevas.length === 5;
    } catch (error) {
      console.error('Error al cargar sugerencias:', error);
      alert('Ocurrió un error al cargar las sugerencias.');
    } finally {
      this.cargando = false;
    }
  }

  cargarMas() {
    this.cargarSugerencias();
  }

  editarSugerencia(sugerencia: any) {
    this.editandoId = sugerencia.id;
    this.comentario = sugerencia.comentario;
    this.estrellasSeleccionadas = sugerencia.estrellas;
    this.permitePublicar = sugerencia.permitePublicar;
  }

  async eliminarSugerencia(id: string) {
    const confirmacion = confirm('¿Estás seguro de que quieres eliminar esta sugerencia?');
    if (!confirmacion) return;

    try {
      await deleteDoc(doc(this.firestore, 'suggestions', id));
      alert('Sugerencia eliminada.');
      this.cargarSugerencias(true);
    } catch (error) {
      console.error('Error al eliminar sugerencia:', error);
      alert('No se pudo eliminar la sugerencia.');
    }
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.limpiarFormulario();
  }
}
