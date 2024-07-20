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
import { Store } from '@ngrx/store';
import { selectQueryParams } from '@this-film-finder/feature-router/selectors/router.selectors';
import { pipe, switchMap, tap } from 'rxjs';

export interface FilmsState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  movies: Array<Movie>;
  numberOfPages: number | null; //_J change when pagination is done
}
export interface Filters {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
}
const filmsInitialStatus: FilmsState = {
  status: 'idle',
  message: '',
  movies: [],
  numberOfPages: null,
};

export const FilmsSignalStore = signalStore(
  withState(filmsInitialStatus),
  withMethods((store) => {
    const moviesDataAccess = inject(MoviesDataAccessService);
    const activatedRoute = inject(ActivatedRoute);
    const router = inject(Router);
    const globalStore = inject(Store);
    const currentQueryParams = globalStore.selectSignal(selectQueryParams);

    const navigateNewFilters = (filters: Filters) => {
        router.navigate([], {
          relativeTo: activatedRoute,
          queryParams: {
            ...filters,
          },
          queryParamsHandling: 'merge',
          onSameUrlNavigation: 'reload',
        });
    };

    const loadMovies = rxMethod<{
        page?: number;
        limit?: number;
        search?: string;
        genre?: string;
      }>(
        pipe(
          switchMap((filters) => {
            patchState(store, { status: 'loading' });
          navigateNewFilters(filters);
          return moviesDataAccess
            .getMovies({
                ...filters,
            })
            .pipe(
              tapResponse({
                next: (moviesInfo) => {
                  if (moviesInfo.data) {
                    patchState(store, {
                      status: 'success',
                      movies: moviesInfo.data,
                      numberOfPages: moviesInfo.totalPages,
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
    );

    const setNewPage = rxMethod<{
      page: number;
    }>(
      pipe(
        tap(({ page }) => {
          patchState(store, { status: 'loading' });
          loadMovies({
            ...currentQueryParams(),
            page: page ?? undefined,
          });
        })
      )
    );

    const setNewLimit = rxMethod<{
      limit: number;
    }>(
      pipe(
        tap(({ limit }) => {
          patchState(store, { status: 'loading' });

          loadMovies({
            ...currentQueryParams(),
            limit: limit ?? undefined,
            page: undefined,
          });
        })
      )
    );

    const setNewFilters = rxMethod<{
      search: string | undefined;
      genre: string | undefined;
    }>(
      pipe(
        tap(({ search, genre }) => {
          patchState(store, { status: 'loading' });
          loadMovies({
            ...currentQueryParams(),
            page: undefined,
            search,
            genre: genre ?? undefined,
          });
        })
      )
    );

    const clearFilters = rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { status: 'loading' });
          loadMovies({});
        })
      )
    );

    return { loadMovies, setNewPage, setNewLimit, setNewFilters,
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
