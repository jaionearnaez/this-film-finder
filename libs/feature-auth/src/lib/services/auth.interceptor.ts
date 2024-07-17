import type { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, take } from 'rxjs';
import { AuthFeatureState } from '../auth.state';

export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const store = inject(Store);

  return store.select(AuthFeatureState.selectToken).pipe(
    take(1),
    switchMap((token) => {
      let clonedRequest = req;
      if (token) {
        clonedRequest = clonedRequest.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      return next(clonedRequest);
    }),
  );
}
