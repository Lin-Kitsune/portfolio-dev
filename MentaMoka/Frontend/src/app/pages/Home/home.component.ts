import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true, // ← Para standalone components
  imports: [CommonModule], // ← Importar CommonModule aquí
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  currentIndex = 0;
  images = [
    { 
      image: 'https://traveler.marriott.com/es/wp-content/uploads/sites/2/2024/09/GI-1180768785-Friends-Coffee-Shop-1920x1080.jpg', 
      title: 'Un espacio acogedor', 
      subtitle: 'Para compartir con amigos', 
      buttonText: 'Ver Menú'
    },
    { 
      image: 'https://coycoacademia.com/wp-content/uploads/2021/04/cursos-de-barista-en-Cali-2.jpg', 
      title: 'El mejor café', 
      subtitle: 'Disfruta de nuestra selección premium',
      buttonText: 'Explorar'  
    },
    { 
      image: 'https://preview.redd.it/a30hhynzs7h81.jpg?auto=webp&s=17b3ade7de975c1d41eccb2a6865add52bc546a1', 
      title: 'Ambiente único', 
      subtitle: 'Un lugar para disfrutar cada momento',
      buttonText: 'Descubrir' 
    }
  ];

  prevSlide() {
    this.currentIndex = (this.currentIndex === 0) ? this.images.length - 1 : this.currentIndex - 1;
  }
  
  nextSlide() {
    this.currentIndex = (this.currentIndex === this.images.length - 1) ? 0 : this.currentIndex + 1;
  }
  
  goToSlide(index: number) {
    this.currentIndex = index;
  }
  
  
}
