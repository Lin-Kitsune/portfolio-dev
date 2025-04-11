import { CommonModule } from '@angular/common';
import { MenuClientComponent } from './menu-client.component'; 
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-menu-wrapper',
  standalone: true,
  imports: [CommonModule, MenuClientComponent], 
  templateUrl: './menu-wrapper.component.html',
  styleUrls: ['./menu-wrapper.component.scss']
})
export class MenuWrapperComponent implements AfterViewInit{
  @ViewChild('menuContent') menuContent!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // Ya tienes acceso al contenedor
  }

  scrollToTop(): void {
    const panel = document.querySelector('.right-panel');
    if (panel) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

