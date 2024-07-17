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
];
