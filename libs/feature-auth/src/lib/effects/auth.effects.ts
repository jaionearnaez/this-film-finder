import { inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { Router } from '@angular/router';

import { MoviesDataAccessService } from '@movies-data-access/service/data-access.service';
import { Store } from '@ngrx/store';

import { selectUrl } from '@this-film-finder/feature-router/selectors/router.selectors';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { AllowedThemes, AuthActions, AuthFeatureState } from '../auth.state';
import {
  SessionStorageService,
  StorageService,
} from '../services/storage.service';

export class AuthEffects {
  actions$ = inject(Actions);
  router = inject(Router);
  store = inject(Store);
  #moviesDataAccess = inject(MoviesDataAccessService);

  persistentStorage = inject(StorageService);
  volatileStorage = inject(SessionStorageService);

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

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.autoLogin),
      switchMap(async () => {
        const volatileToken = await this.volatileStorage.getItem<string>(
          'CURRENT_TOKEN'
        );
        const volatileTheme = await this.volatileStorage.getItem<string>(
          'CURRENT_THEME'
        );
        if (volatileToken) {
          return {
            token: volatileToken,
            rememberMe: false,
            theme: volatileTheme,
          };
        }

        const persistentToken = await this.persistentStorage.getItem<string>(
          'CURRENT_TOKEN'
        );
        const persistentTheme = await this.persistentStorage.getItem<string>(
          'CURRENT_THEME'
        );
        if (persistentToken) {
          return {
            token: persistentToken,
            rememberMe: true,
            theme: persistentTheme,
          };
        }
        return { token: null, rememberMe: false, theme: null };
      }),
      catchError(() => {
        return of({ token: null, rememberMe: false, theme: null });
      }),
      map(({ token, rememberMe, theme }) =>
        token
          ? AuthActions.autoLoginWithToken({
              token,
              rememberMe,
              theme: (theme as AllowedThemes) ?? 'egg',
            })
          : AuthActions.autoLoginFailed()
      )
    );
  });

  storeTokenOnLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.getTokenSuccess),
        tap(async ({ token, rememberMe, theme }) => {
          const storage = rememberMe
            ? this.persistentStorage
            : this.volatileStorage;
          await storage.setItem('CURRENT_TOKEN', token);
          await storage.setItem('CURRENT_THEME', theme);
        })
      ),
    { dispatch: false }
  );

  getToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ rememberMe, theme }) => {
        return this.#moviesDataAccess.getToken().pipe(
          map(({ token }) => {
            return AuthActions.getTokenSuccess({
              token,
              rememberMe,
              theme,
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

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(async () => {
          await Promise.all([
            this.persistentStorage.removeItem('CURRENT_TOKEN'),
            this.volatileStorage.removeItem('CURRENT_TOKEN'),
            this.persistentStorage.removeItem('CURRENT_THEME'),
            this.volatileStorage.removeItem('CURRENT_THEME'),
          ]);
        })
      ),
    { dispatch: false }
  );

  logoutRememberCurrentNav$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      concatLatestFrom(() => this.store.select(selectUrl)),
      map(([, redirectUrl]) => AuthActions.setRedirectUrl({ redirectUrl }))
    )
  );

  logoutNav$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
