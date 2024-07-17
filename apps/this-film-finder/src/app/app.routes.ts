import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    title: 'This Film Finder: login',
    pathMatch: 'full',
    loadComponent: () =>
      import(
        '@this-film-finder/feature-login/components/login.component'
      ).then((m) => m.LoginComponent),
    data: {
      showSideMenu: true,
      showHeader: true,
      showFooter: true,
      menu: {
        title: 'Login',
      },
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
      showSideMenu: false,
      showHeader: true,
      showFooter: true,
      menu: {
        title: 'API not contentful',
      },
    },
  },
];
