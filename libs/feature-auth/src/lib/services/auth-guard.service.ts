import { inject } from '@angular/core';
import type { CanMatchFn, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';
import { filter, map } from 'rxjs';
import {
  AuthActions,
  AuthFeatureState,
  AuthStatus,
  isApiInitialized,
} from '../auth.state';

export const _authGuard = (
  guardForAuthenticated?: boolean,
  currentPath = ''
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(AuthFeatureState.selectAuthGuardInfo).pipe(
    filter(
      ({ apiStatus }) => isApiInitialized(apiStatus)
      //_J add this if I decide to put in the app initializer the storage retrieval of token
      //_J && isAuthInitialized(authStatus)
    ),
    map(
      ({
        authStatus,
        redirectUrl,
      }: {
        authStatus: AuthStatus;
        redirectUrl: string;
      }) => {
        if (guardForAuthenticated === undefined) {
          return true;
        }
        if (guardForAuthenticated) {
          if (authStatus === 'token-success') {
            if (redirectUrl !== '') {
              store.dispatch(AuthActions.setRedirectUrl({ redirectUrl: '' }));
            }
            return true;
          } else {
            if (redirectUrl === '') {
              console.log('estoy aqui', currentPath);
              store.dispatch(
                AuthActions.setRedirectUrl({ redirectUrl: currentPath })
              );
            }
            return router.createUrlTree(['/login']);
          }
        } else {
          if (
            authStatus === 'no-token' ||
            authStatus === 'token-error' ||
            authStatus === 'not-initialized'
          ) {
            return true;
          } else {
            return router.createUrlTree(['/']);
          }
        }
      }
    )
  );
};

export const isAuthenticatedGuard: CanMatchFn = (): Observable<
  boolean | UrlTree
> => {
  const router = inject(Router);
  const path = router?.getCurrentNavigation()?.initialUrl.toString();

  _authGuard(true, path);
  return _authGuard(true, path);
};
export const isNotAuthenticatedGuard = (): Observable<boolean | UrlTree> => {
  return _authGuard(false);
};
