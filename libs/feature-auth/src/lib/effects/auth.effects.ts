import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Router } from '@angular/router';

import { MoviesDataAccessService } from '@movies-data-access/service/data-access.service';
import { Store } from '@ngrx/store';

import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthActions, AuthFeatureState } from '../auth.state';

export class AuthEffects {
  actions$ = inject(Actions);
  router = inject(Router);
  store = inject(Store);
  #moviesDataAccess = inject(MoviesDataAccessService);
  healthcheck$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.healthcheck),
      exhaustMap(() => {
        return this.#moviesDataAccess.healthcheck().pipe(
          map(({ contentful }) => {
            if (contentful) {
              return AuthActions.healthcheckSuccess();
            } else {
              return AuthActions.healthcheckFailure({ error: 'API not ready' });
            }
          }),
          catchError(({ error }) => {
            return of(
              AuthActions.healthcheckFailure({
                error: error?.error?.message ? error?.error?.message : error,
              })
            );
          })
        );
      })
    );
  });

  healthcheckFailureNav$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.healthcheckFailure),
        tap(() => {
          this.router.navigate(['/api-not-contentful']);
        })
      ),
    { dispatch: false }
  );

  getToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.getToken, AuthActions.login),
      exhaustMap(() => {
        return this.#moviesDataAccess.getToken().pipe(
          map(({ token }) => {
            return AuthActions.getTokenSuccess({
              token,
            });
          }),
          catchError(({ error }) => {
            return of(
              AuthActions.getTokenFailure({
                error: error?.error?.message
                  ? error.error.message
                  : 'Something went wrong',
              })
            );
          })
        );
      })
    );
  });

  getTokenSuccessNav$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.getTokenSuccess),
        concatLatestFrom(() =>
          this.store.select(AuthFeatureState.selectRedirectUrl)
        ),
        tap(([, url]) => {
          if (url) {
            const redirectUrl = this.router.parseUrl(url);
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.router.navigate(['/films']);
          }
        })
      ),
    { dispatch: false }
  );
}
