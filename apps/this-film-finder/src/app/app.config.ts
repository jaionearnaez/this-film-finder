import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  RouteReuseStrategy,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withRouterConfig,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { MOVIES_API_BASE_URL } from '@movies-data-access/service/data-access.service';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore, Store } from '@ngrx/store';
import {
  AuthActions,
  AuthFeatureState,
} from '@this-film-finder/feature-auth/auth.state';
import { authStoreProvider } from '@this-film-finder/feature-auth/feature-auth.provider';
import { AuthInterceptor } from '@this-film-finder/feature-auth/services/auth.interceptor';
import { filter, take } from 'rxjs';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import * as LogEffects from './store/log.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withEnabledBlockingInitialNavigation(),
      withComponentInputBinding(),
      withRouterConfig({
        onSameUrlNavigation: 'reload',
        paramsInheritanceStrategy: 'always',
        canceledNavigationResolution: 'replace',
      })
    ),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
    provideAnimationsAsync(),
    provideIonicAngular({
      mode: 'md',
    }),
    provideStore({ router: routerReducer }),
    provideRouterStore(),
    provideEffects(LogEffects),
    ...authStoreProvider,

    environment.providers,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MOVIES_API_BASE_URL, useValue: environment.moviesApiBaseUrl },

    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store) => {
        return () => {
          store.dispatch(AuthActions.healthcheck());
          return store.select(AuthFeatureState.selectIsApiInitialized).pipe(
            filter((ready) => !!ready),
            take(1)
          );
        };
      },
      deps: [Store],
      multi: true,
    },
  ],
};
