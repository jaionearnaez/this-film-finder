import { inject } from '@angular/core';
import { MoviesDataAccessService } from '@movies-data-access/service/data-access.service';
import { MovieDetail } from '@movies-data-access/validator/validators';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

export interface FilmsState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  film: MovieDetail | undefined;
}

const filmDetailInitialStatus: FilmsState = {
  status: 'idle',
  message: '',
  film: undefined,
};

export const FilmDetailSignalStore = signalStore(
  withState(filmDetailInitialStatus),
  withMethods((store) => {
    const moviesDataAccess = inject(MoviesDataAccessService);

    const loadMovie = rxMethod<{ id: string }>(
      pipe(
        switchMap(({ id }) => {
          patchState(store, { status: 'loading' });
          return moviesDataAccess.getMovieDetail({ id }).pipe(
            tapResponse({
              next: (movieDetails) => {
                if (movieDetails) {
                  patchState(store, {
                    status: 'success',
                    film: movieDetails,
                  });
                } else {
                  patchState(store, {
                    status: 'error',
                    film: undefined,
                    message: 'No movies available',
                  });
                }
              },
              error: (error) => {
                console.error(error);
                patchState(store, { status: 'error' });
              },
            })
          );
        })
      )
    );

    return { loadMovie };
  })
);
