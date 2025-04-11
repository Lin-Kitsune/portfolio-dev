import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-suggestions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-suggestions.component.html',
  styleUrls: ['./admin-suggestions.component.scss']
})
export class AdminSuggestionsComponent {
  firestore = inject(Firestore);

  sugerencias: any[] = [];
  estrellas = [1, 2, 3, 4, 5];
  cargando = false;

  ngOnInit() {
    this.cargarSugerencias();
  }

  async cargarSugerencias() {
    this.cargando = true;
    const sugerenciasRef = collection(this.firestore, 'suggestions');
    const q = query(sugerenciasRef, orderBy('fecha', 'desc'));

    try {
      const snapshot = await getDocs(q);
      this.sugerencias = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          respuestaAdminTemporal: data['respuestaAdmin'] || '',
          editandoRespuesta: false
        };
      });
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
      alert('No se pudieron cargar las sugerencias.');
    } finally {
      this.cargando = false;
    }
  }

  async eliminarSugerencia(id: string) {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta sugerencia?');
    if (!confirmacion) return;

    try {
      await deleteDoc(doc(this.firestore, 'suggestions', id));
      this.sugerencias = this.sugerencias.filter(s => s.id !== id);
      alert('Sugerencia eliminada.');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar la sugerencia.');
    }
  }

  async togglePublicar(sugerencia: any) {
    const nuevaVisibilidad = !sugerencia.permitePublicar;

    try {
      const docRef = doc(this.firestore, 'suggestions', sugerencia.id);
      await updateDoc(docRef, { permitePublicar: nuevaVisibilidad });
      sugerencia.permitePublicar = nuevaVisibilidad;
    } catch (error) {
      console.error('Error al actualizar visibilidad:', error);
      alert('No se pudo cambiar la visibilidad.');
    }
  }

  habilitarEdicionRespuesta(sugerencia: any) {
    sugerencia.editandoRespuesta = true;
  }

  async eliminarRespuesta(sugerencia: any) {
    const confirmar = confirm('¿Eliminar la respuesta enviada al usuario?');
    if (!confirmar) return;

    try {
      const docRef = doc(this.firestore, 'suggestions', sugerencia.id);
      await updateDoc(docRef, { respuestaAdmin: '' });
      sugerencia.respuestaAdmin = '';
      sugerencia.respuestaAdminTemporal = '';
      sugerencia.editandoRespuesta = false;
      alert('Respuesta eliminada.');
    } catch (error) {
      console.error('Error al eliminar respuesta:', error);
      alert('No se pudo eliminar la respuesta.');
    }
  }

  async responder(sugerencia: any) {
    try {
      const docRef = doc(this.firestore, 'suggestions', sugerencia.id);
      await updateDoc(docRef, {
        respuestaAdmin: sugerencia.respuestaAdminTemporal
      });
      sugerencia.respuestaAdmin = sugerencia.respuestaAdminTemporal;
      sugerencia.editandoRespuesta = false;
      alert('Respuesta enviada al usuario ✅');
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
      alert('No se pudo enviar la respuesta.');
    }
  }
}
