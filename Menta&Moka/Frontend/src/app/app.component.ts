import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private app = inject(FirebaseApp);

  ngOnInit() {
    console.log('🔥 Firebase App:', this.app);
  }
}