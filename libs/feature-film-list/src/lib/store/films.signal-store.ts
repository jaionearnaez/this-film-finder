import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesDataAccessService } from '@movies-data-access/service/data-access.service';
import { Movie } from '@movies-data-access/validator/validators';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

export interface FilmsState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  movies: Array<Movie>;
  pagination: any;//_J change when pagination is done
}
const filmsInitialStatus: FilmsState = {
  status: 'idle',
  message: '',
  movies: [],
  pagination: '',
};

export const FilmsSignalStore = signalStore(
  withState(filmsInitialStatus),
  withMethods((store) => {
    const moviesDataAccess = inject(MoviesDataAccessService);
    const activatedRoute = inject(ActivatedRoute);
    const router = inject(Router);
    return {
      loadMovies: rxMethod<{
        page?: number;
        limit?: number;
        search?: string;
        genre?: string;
      }>(
        pipe(
          switchMap((filters) => {
            patchState(store, { status: 'loading' });

            router.navigate([], {
              relativeTo: activatedRoute,
              queryParams: {
                ...filters,
              },
              queryParamsHandling: 'merge',
              onSameUrlNavigation: 'reload',
            });

            return moviesDataAccess.getMovies(filters).pipe(
              tapResponse({
                next: (moviesInfo) => {
                  if (moviesInfo.data) {
                    patchState(store, {
                      status: 'success',
                      movies: moviesInfo.data,
                    });
                  } else {
                    patchState(store, {
                      status: 'error',
                      movies: [],
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
      ),
    };
  }),
  withHooks({
    onInit: (store) => {
      const activatedRoute = inject(ActivatedRoute);
      const filters = activatedRoute.snapshot.queryParams;
      return store.loadMovies({ ...filters });
    },
  })
);
