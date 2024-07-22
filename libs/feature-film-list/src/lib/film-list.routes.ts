import type { Route } from '@angular/router';

export const featureFilmListRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./containers/film-list.component').then(
            (m) => m.FilmListComponent
          ),
        data: {
          menu: {
            title: 'Films',
          },
        },
      },
      {
        path: 'film',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
