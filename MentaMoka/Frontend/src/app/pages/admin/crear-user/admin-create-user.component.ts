import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-create-user.component.html',
})
export class AdminCreateUserComponent {

  tipo: 'trabajador' | 'administrador' = 'trabajador';
  name = '';
  email = '';
  turnos: { date: string, start: string, end: string }[] = [];

  private firestore = inject(Firestore);

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] || 'trabajador';
    });
  }

  agregarTurno() {
    this.turnos.push({ date: '', start: '', end: '' });
  }

  async guardar() {
    const userData = {
        name: this.name,
        email: this.email,
        turnos: this.tipo === 'trabajador' ? this.turnos : [],
        role: this.tipo,
        createdAt: new Date().toISOString()
    };

    const collectionName = this.tipo === 'trabajador' ? 'trabajadores' : 'administradores';
    const collectionRef = collection(this.firestore, collectionName);
    const nuevoDocRef = doc(collectionRef);  // crea un ID automático

    await setDoc(nuevoDocRef, userData);

    alert(`✅ ${this.tipo === 'trabajador' ? 'Trabajador' : 'Administrador'} creado correctamente en Firestore`);
    this.router.navigate(['/admin']);
    }
}
