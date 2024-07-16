import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';
import {MOVIES_API_BASE_URL} from '@movies-data-access/service/data-access.service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    provideIonicAngular({
      mode: 'md',
    }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MOVIES_API_BASE_URL, useValue: environment.moviesApiBaseUrl },

  ],
};
