import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes'; // Importa las rutas con su nombre original 'appRoutes'

// Inicia la aplicación, proporcionando HttpClient y Router globalmente
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),  // Proporciona Router con 'appRoutes'
    ...appConfig.providers  // Mantén la configuración de appConfig
  ]
})
  .catch((err) => console.error(err));
