import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'This Film Finder: login',
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
