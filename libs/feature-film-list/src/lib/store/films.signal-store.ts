import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesDataAccessService } from '@movies-data-access/service/data-access.service';
import {
  Movie,
  MoviesByGenre,
  MoviesResponse,
} from '@movies-data-access/validator/validators';
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
import {
  catchError,
  expand,
  map,
  Observable,
  of,
  pipe,
  reduce,
  switchMap,
  tap,
} from 'rxjs';

export interface FilmsState {
  status: 'idle' | 'loading' | 'success' | 'error';
  filterStatus: 'idle' | 'loading' | 'success' | 'error';
  totalFilmsStatus: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  films: Array<Movie>;
  numberOfPages: number | null;
  numberOfFilms: number | null;
  genresForFiltering: Array<{ id: string; title: string; count: number }>;
}
export interface Filters {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
}
const filtersInitialStatus = {
  page: null,
  limit: null,
  search: null,
  genre: null,
};
const filmsInitialStatus: FilmsState = {
  status: 'idle',
  filterStatus: 'idle',
  totalFilmsStatus: 'idle',
  message: '',
  films: [],
  numberOfPages: null,
  numberOfFilms: null,
  genresForFiltering: [],
};

export const FilmsSignalStore = signalStore(
  withState(filmsInitialStatus),
  withMethods((store) => {
    const moviesDataAccess = inject(MoviesDataAccessService);
    const activatedRoute = inject(ActivatedRoute);
    const router = inject(Router);
    const globalStore = inject(Store);
    const currentQueryParams = globalStore.selectSignal(selectQueryParams);

    const initializeStore = () => {
      loadFilms({
        ...currentQueryParams(),
      });
      loadGenres();
    };

    const navigateNewFilters = (filters: Filters) => {
      if (Object.keys(filters).length) {
        router.navigate([], {
          relativeTo: activatedRoute,
          queryParams: {
            ...filters,
          },
          queryParamsHandling: 'merge',
          onSameUrlNavigation: 'reload',
        });
      } else {
        router.navigate([], {
          relativeTo: activatedRoute,
          queryParams: filtersInitialStatus,
          queryParamsHandling: 'merge',
          onSameUrlNavigation: 'reload',
        });
      }
    };

    const loadFilms = rxMethod<{
      page?: number;
      limit?: number;
      search?: string;
      genre?: string;
    }>(
      pipe(
        switchMap((filters) => {
          patchState(store, { status: 'loading' });
          navigateNewFilters(filters);
          setNumberOfFilteredFilms(filters);
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
                      films: moviesInfo.data,
                      numberOfPages: moviesInfo.totalPages,
                    });
                  } else {
                    patchState(store, {
                      status: 'error',
                      films: [],
                      message: 'No films available',
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

    const fetchAllFilmsByGenre = (
      limit: number
    ): Observable<{ id: string; title: string; count: number }[]> => {
      let currentPage = 1;
      return moviesDataAccess
        .getMoviesByGender({ page: currentPage, limit })
        .pipe(
          expand((response: MoviesByGenre) => {
            if (currentPage < response.totalPages) {
              currentPage++;
              return moviesDataAccess.getMoviesByGender({
                page: currentPage,
                limit,
              });
            } else {
              return of();
            }
          }),
          reduce(
            (
              acc: Array<{ id: string; title: string; count: number }>[],
              response: MoviesByGenre
            ) => {
              const genres: Array<{
                id: string;
                title: string;
                count: number;
              }> = [];
              if (response) {
                for (let i = 0; i < response.data.length; i++) {
                  genres.push({
                    id: response.data[i].id,
                    title: response.data[i].title,
                    count: response.data[i].movies.length,
                  });
                }
                acc.push(genres);
              }
              return acc;
            },
            []
          ),
          switchMap(
            (
              allResponses: Array<{
                id: string;
                title: string;
                count: number;
              }>[]
            ) => {
              const flattenedFilms = allResponses.flatMap(
                (response) => response
              );
              return of(flattenedFilms);
            }
          ),
          catchError((error) => {
            return of(error);
          })
        );
    };

    const loadGenres = rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { filterStatus: 'loading' });
          return fetchAllFilmsByGenre(25).pipe(
            tapResponse({
              next: (genres) => {
                if (genres.length > 0) {
                  patchState(store, {
                    filterStatus: 'success',
                    genresForFiltering: genres,
                  });
                } else {
                  patchState(store, {
                    filterStatus: 'error',
                    genresForFiltering: [],
                    message: 'No genres available',
                  });
                }
              },
              error: (error) => {
                console.error(error);
                patchState(store, {
                  status: 'error',
                  genresForFiltering: [],
                  message: 'No genres available',
                });
              },
            })
          );
        })
      )
    );

    const fetchFilteredNumberOfFilms = ({
      page,
      limit,
      search,
      genre,
    }: {
      page?: number;
      limit?: number;
      search?: string;
      genre?: string;
    }): Observable<number> => {
      return moviesDataAccess
        .getMovies({ page: 1, limit: 1, search, genre })
        .pipe(
          map((response: MoviesResponse) => {
            return response.totalPages
          }),

          catchError((error) => {
            return of(error);
          })
        );
    };

    const setNumberOfFilteredFilms = rxMethod<{
      page?: number;
      limit?: number;
      search?: string;
      genre?: string;
    }>(
      pipe(
        switchMap((filters) => {
          patchState(store, { totalFilmsStatus: 'loading' });
          return fetchFilteredNumberOfFilms(filters).pipe(
            tapResponse({
              next: (numberOfMovies) => {
                console.log(numberOfMovies);
                patchState(store, {
                  totalFilmsStatus: 'success',
                  numberOfFilms: numberOfMovies,
                });
              },
              error: (error) => {
                console.error(error);
                patchState(store, {
                  totalFilmsStatus: 'error',
                  numberOfFilms: 0,
                  message: 'No available count of films',
                });
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
          loadFilms({
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

          loadFilms({
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
          loadFilms({
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
          loadFilms({});
        })
      )
    );

    return {
      loadFilms,
      setNewPage,
      setNewLimit,
      setNewFilters,
      clearFilters,
      initializeStore,
    };
  }),
  withHooks({
    onInit: (store) => {
      return store.initializeStore();
    },
  })
);
