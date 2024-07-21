import { inject } from '@angular/core';
import { Router, type CanMatchFn, type UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import type { Observable } from 'rxjs';
import { filter, map } from 'rxjs';
import { APIStatus, AuthFeatureState, isApiInitialized } from '../auth.state';

export const _contentfulGuard = (
  guardForContentful?: boolean): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);


  return store.select(AuthFeatureState.selectAuthGuardInfo).pipe(
    filter(({ apiStatus }) => isApiInitialized(apiStatus)),
    map(({ apiStatus }: { apiStatus: APIStatus }) => {
      if (guardForContentful === undefined) {
        return true;
      }
      if (guardForContentful) {
        if(apiStatus === 'not-contentful'){
          return router.createUrlTree(['/api-not-contentful']);
        }else{
          return true
        }
      } else {
        if(apiStatus === 'contentful'){
          return router.createUrlTree(['/login']);
        }else{
          return true
        }
      }
    })
  );
};

export const isApiContentful: CanMatchFn = (): Observable<
  boolean | UrlTree
> => {
  return _contentfulGuard(true);
};

export const isApiNotContentful: CanMatchFn = (): Observable<
  boolean | UrlTree
> => {
  return _contentfulGuard(false);
};

