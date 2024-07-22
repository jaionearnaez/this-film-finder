import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AuthFeatureState } from './auth.state';
import { AuthEffects } from './effects/auth.effects';

export const authStoreProvider = [
  provideState(AuthFeatureState),
  provideEffects(AuthEffects),
];
