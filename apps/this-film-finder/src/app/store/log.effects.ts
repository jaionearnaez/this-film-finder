import { inject, isDevMode } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, tap } from 'rxjs';

export const LogEffects = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      filter(() => isDevMode()),
      concatLatestFrom(() => store.select((s) => s)),
      tap(([action, state]) =>
        console.log('👉', action.type, JSON.parse(JSON.stringify(state)))
      )
    );
  },
  { functional: true, dispatch: false }
);
