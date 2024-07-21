import { Route } from '@angular/router';
import {
  isAuthenticatedGuard,
  isNotAuthenticatedGuard,
} from '@this-film-finder/feature-auth/services/auth-guard.service';

import { isApiNotContentful } from '@this-film-finder/feature-auth/services/contentful-guard.service';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'This Film Finder: login',
    canMatch: [isNotAuthenticatedGuard],
    pathMatch: 'full',
    loadComponent: () =>
      import('@this-film-finder/feature-login/components/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      showHeader: false,
      title: 'Login',
    },
  },
  {
    path: 'api-not-contentful',
    title: 'This Film Finder: API not contentful',
    canMatch: [isApiNotContentful],
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/api-not-contenful.component').then(
        (m) => m.ApiNotContenfulComponent
      ),
    data: {
      showHeader: false,
      title: 'API not contentful',
    },
  },
  {
    path: 'films',
    title: 'This Film Finder: film finder',
    canMatch: [isAuthenticatedGuard],
    loadChildren: () =>
      import('@this-film-finder/feature-film-list/film-list.routes').then(
        ({ featureFilmListRoutes }) => {
          return featureFilmListRoutes;
        }
      ),
    data: {
      showHeader: true,
      title: 'Films',
    },
  },
];
