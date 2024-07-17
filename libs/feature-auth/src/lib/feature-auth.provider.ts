import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthEffects } from './effects/auth.effects';
import { AuthFeatureState } from './auth.state';

export const authStoreProvider = [
  provideState(AuthFeatureState),
  provideEffects(AuthEffects),
];
